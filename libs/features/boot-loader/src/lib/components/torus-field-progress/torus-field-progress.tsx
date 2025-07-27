import { Box, Typography } from '@mui/material';
import { useRef, useEffect, useMemo, memo, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  convertToThreeColor,
  createColorVariations,
  getDefaultColors,
} from '../utils';
import {
  ColorScheme,
  MouseInteraction,
  Particle3JS,
  SceneElements,
} from './types';

interface TorusFieldProgressProps {
  progress?: number; // 0-100
  colors?: ColorScheme;
  progressMessage?: string;
}

export const TorusFieldProgress = ({
  progress: initialProgress = 0, // 0-100
  progressMessage,
  colors = {},
}: TorusFieldProgressProps) => {
  const [progress, setProgress] = useState(initialProgress);
  const [mouseDistance, setMouseDistance] = useState(0);
  const [clickIntensity, setClickIntensity] = useState(0);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const torusRingsRef = useRef<SceneElements[]>([]);
  const particlesRef = useRef<Particle3JS[]>([]);
  const energyBeamRef = useRef<THREE.Group>(null);
  const animationRef = useRef<number>(null);

  // Mouse interaction state
  const mouseRef = useRef<MouseInteraction>({
    normalized: new THREE.Vector2(0, 0),
    world3D: new THREE.Vector3(0, 0, 0),
    isDown: false,
    clickIntensity: 0,
    distanceFromCenter: 0,
  });

  // Raycaster for 3D mouse projection
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mousePlaneRef = useRef<THREE.Plane>(
    new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  );

  // Determine theme mode and merge with defaults
  const themeMode = colors.themeMode || 'dark';
  const defaultColors = getDefaultColors(themeMode);

  // Convert all colors to THREE.Color instances and create variations
  const processedColors = useMemo(() => {
    const merged = { ...defaultColors, ...colors };
    return {
      background: convertToThreeColor(merged.backgroundColor!),
      beam: createColorVariations(
        convertToThreeColor(merged.beamColor!),
        themeMode
      ),
      torus: createColorVariations(
        convertToThreeColor(merged.torusColor!),
        themeMode
      ),
      particle: createColorVariations(
        convertToThreeColor(merged.particleColor!),
        themeMode
      ),
      verticalLine: createColorVariations(
        convertToThreeColor(merged.verticalLineColor!),
        themeMode
      ),
      themeMode,
    };
  }, [colors, themeMode, defaultColors]);

  // Convert 0-100 to 0-1
  const normalizedProgress = Math.max(0, Math.min(100, progress)) / 100;

  // Mouse event handlers
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!mountRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.normalized.set(x, y);
    mouseRef.current.distanceFromCenter = Math.min(
      1,
      mouseRef.current.normalized.length()
    );

    // Project mouse to 3D world space
    if (cameraRef.current) {
      raycasterRef.current.setFromCamera(
        mouseRef.current.normalized,
        cameraRef.current
      );
      const intersection = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(
        mousePlaneRef.current,
        intersection
      );
      mouseRef.current.world3D.copy(intersection);
    }
  }, []);

  const clickBoostValue = 2;

  const handleMouseDown = useCallback((event: MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.clickIntensity = 1.0;

    // Progress boost on click
    setProgress((prev) => Math.min(100, prev + clickBoostValue));
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  // Update progress when initialProgress prop changes
  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  useEffect(
    () => {
      if (!mountRef.current) return;

      // Clear previous content
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = processedColors.background.clone();
      scene.fog = new THREE.Fog(processedColors.background, 10, 50);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      renderer.setClearColor(processedColors.background);
      rendererRef.current = renderer;
      mountRef.current.appendChild(renderer.domElement);

      // Add mouse event listeners
      const canvas = renderer.domElement;
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);

      // Clear arrays
      torusRingsRef.current = [];
      particlesRef.current = [];

      // Lighting - adjusted based on theme mode
      const isLight = themeMode === 'light';
      const ambientIntensity = isLight ? 0.4 : 0.2;
      const pointLightIntensity = isLight ? 1.5 : 2;

      const ambientLight = new THREE.AmbientLight(
        processedColors.torus.dim.getHex(),
        ambientIntensity
      );
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(
        processedColors.torus.base.getHex(),
        pointLightIntensity,
        100
      );
      pointLight1.position.set(0, 15, 0);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(
        processedColors.beam.base.getHex(),
        pointLightIntensity * 0.5,
        50
      );
      pointLight2.position.set(0, -15, 0);
      scene.add(pointLight2);

      // Create torus field structure
      const createTorusField = () => {
        // Main torus rings (horizontal)
        const ringCount = 12;
        for (let i = 0; i < ringCount; i++) {
          const radius = 3 + i * 0.8;
          const tubeRadius = 0.075;

          const torusGeometry = new THREE.TorusGeometry(
            radius,
            tubeRadius,
            8,
            64
          );

          // Adjust base opacity based on theme
          const baseOpacity = isLight ? 0.4 - i * 0.02 : 0.6 - i * 0.03;

          const torusMaterial = new THREE.MeshBasicMaterial({
            color: processedColors.torus.base.clone(),
            transparent: true,
            opacity: baseOpacity,
            wireframe: false,
          });

          const torus = new THREE.Mesh(torusGeometry, torusMaterial);
          torus.rotation.x = Math.PI / 2;
          torus.position.y = (i - ringCount / 2) * 0.5;

          torus.userData = {
            originalY: torus.position.y,
            originalScale: new THREE.Vector3(1, 1, 1),
            index: i,
            radius: radius,
            baseOpacity,
            type: 'torus',
            baseColor: processedColors.torus.base.clone(),
            brightColor: processedColors.torus.bright.clone(),
            dimColor: processedColors.torus.dim.clone(),
          };

          scene.add(torus);
          torusRingsRef.current.push(torus);
        }

        // Vertical connecting lines with more segments for warping
        const verticalLineCount = 32;
        for (let i = 0; i < verticalLineCount; i++) {
          const angle = (i / verticalLineCount) * Math.PI * 2;
          const radius = 8;

          const points = [];
          const segmentCount = 40; // More segments for smoother warping
          for (let j = 0; j < segmentCount; j++) {
            const y = (j / (segmentCount - 1) - 0.5) * 12;
            const currentRadius = radius * (1 - Math.abs(y) * 0.02);
            points.push(
              new THREE.Vector3(
                Math.cos(angle) * currentRadius,
                y,
                Math.sin(angle) * currentRadius
              )
            );
          }

          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

          // Adjust line opacity based on theme
          const lineOpacity = isLight ? 0.2 : 0.3;

          const lineMaterial = new THREE.LineBasicMaterial({
            color: processedColors.verticalLine.base.clone(),
            transparent: true,
            opacity: lineOpacity,
          });

          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.userData = {
            type: 'verticalLine',
            angle,
            baseOpacity: lineOpacity,
            index: i + ringCount,
            baseColor: processedColors.verticalLine.base.clone(),
            brightColor: processedColors.verticalLine.bright.clone(),
            dimColor: processedColors.verticalLine.dim.clone(),
            originalPoints: points.map((p) => p.clone()),
          };
          scene.add(line);
          torusRingsRef.current.push(line);
        }
      };

      // Create energy beam (central column)
      const createEnergyBeam = () => {
        const beamGroup = new THREE.Group();

        // Core beam - adjust opacity based on theme
        const coreOpacity = isLight ? 0.6 : 0.8;
        const coreGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
        const coreMaterial = new THREE.MeshBasicMaterial({
          color: processedColors.beam.base.clone(),
          transparent: true,
          opacity: coreOpacity,
          blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
        });
        const coreBeam = new THREE.Mesh(coreGeometry, coreMaterial);
        coreBeam.userData = {
          baseOpacity: coreOpacity,
          baseColor: processedColors.beam.base.clone(),
        };
        beamGroup.add(coreBeam);

        // Outer glow layers - derived from beam color with theme-appropriate blending
        for (let i = 0; i < 3; i++) {
          const glowGeometry = new THREE.CylinderGeometry(
            0.2 + i * 0.1,
            0.2 + i * 0.1,
            20,
            8
          );

          // Adjust glow opacity based on theme
          const baseOpacity = isLight ? 0.1 / (i + 1) : 0.2 / (i + 1);
          const glowColor = processedColors.beam.glow.clone();
          // Slight variation for each layer
          glowColor.multiplyScalar(1 - i * 0.1);

          const glowMaterial = new THREE.MeshBasicMaterial({
            color: glowColor,
            transparent: true,
            opacity: baseOpacity,
            blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
          });
          const glowBeam = new THREE.Mesh(glowGeometry, glowMaterial);
          glowBeam.userData = { baseOpacity };
          beamGroup.add(glowBeam);
        }

        scene.add(beamGroup);
        energyBeamRef.current = beamGroup;
      };

      // Create particle field with theme-appropriate settings
      const createParticleField = () => {
        const particleCount = 1500;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const originalColors = new Float32Array(particleCount * 3);
        const originalPositions = new Float32Array(particleCount * 3);

        const baseParticleColor = processedColors.particle.base;

        for (let i = 0; i < particleCount; i++) {
          // Distribute particles in a torus-like field
          const angle = Math.random() * Math.PI * 2;
          const radius = 2 + Math.random() * 15;
          const height = (Math.random() - 0.5) * 15;

          const x = Math.cos(angle) * radius;
          const y = height;
          const z = Math.sin(angle) * radius;

          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          // Store original positions
          originalPositions[i * 3] = x;
          originalPositions[i * 3 + 1] = y;
          originalPositions[i * 3 + 2] = z;

          // Color variation - adjust based on theme
          const color = baseParticleColor.clone();
          const variation = isLight
            ? 0.8 + Math.random() * 0.2
            : 0.7 + Math.random() * 0.3;
          color.multiplyScalar(variation);

          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;

          // Store original colors
          originalColors[i * 3] = color.r;
          originalColors[i * 3 + 1] = color.g;
          originalColors[i * 3 + 2] = color.b;

          sizes[i] = Math.random() * 2 + 1;
        }

        particleGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );
        particleGeometry.setAttribute(
          'color',
          new THREE.BufferAttribute(colors, 3)
        );
        particleGeometry.setAttribute(
          'size',
          new THREE.BufferAttribute(sizes, 1)
        );

        // Adjust particle material based on theme
        const particleOpacity = isLight ? 0.5 : 0.7;
        const particleMaterial = new THREE.PointsMaterial({
          size: 0.1,
          transparent: true,
          opacity: particleOpacity,
          vertexColors: true,
          blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.userData = {
          originalColors,
          originalPositions,
          baseOpacity: particleOpacity,
        };
        scene.add(particles);
        particlesRef.current.push(particles);
      };

      // Initialize all elements
      createTorusField();
      createEnergyBeam();
      createParticleField();

      camera.position.set(0, 8, 20);
      camera.lookAt(0, 0, 0);

      // Handle resize
      const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect =
          mountRef.current?.clientWidth / mountRef.current?.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          mountRef.current?.clientWidth,
          mountRef.current?.clientHeight
        );
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    },
    // Only run scene setup once
    []
  );

  useEffect(() => {
    // Update existing elements when colors change
    if (sceneRef.current) {
      sceneRef.current.background = processedColors.background.clone();
      sceneRef.current.fog = new THREE.Fog(processedColors.background, 10, 50);
    }

    if (rendererRef.current) {
      rendererRef.current.setClearColor(processedColors.background);
    }

    // Update all torus elements
    torusRingsRef.current.forEach((element) => {
      if (element.userData.type === 'torus') {
        element.material.color.copy(processedColors.torus.base);
        element.userData.baseColor = processedColors.torus.base.clone();
        element.userData.brightColor = processedColors.torus.bright.clone();
        element.userData.dimColor = processedColors.torus.dim.clone();
      } else if (element.userData.type === 'verticalLine') {
        element.material.color.copy(processedColors.verticalLine.base);
        element.userData.baseColor = processedColors.verticalLine.base.clone();
        element.userData.brightColor =
          processedColors.verticalLine.bright.clone();
        element.userData.dimColor = processedColors.verticalLine.dim.clone();
      }
    });

    // Update energy beam
    if (energyBeamRef.current) {
      energyBeamRef.current.children.forEach((beam, index) => {
        if (beam instanceof THREE.Mesh) {
          if (index === 0) {
            // Core beam
            beam.material.color.copy(processedColors.beam.base);
            beam.userData.baseColor = processedColors.beam.base.clone();
          } else {
            // Glow layers
            const glowColor = processedColors.beam.glow.clone();
            glowColor.multiplyScalar(1 - (index - 1) * 0.1);
            beam.material.color.copy(glowColor);
          }
        }
      });
    }
  }, [processedColors]);

  // Main animation loop with theme-aware effects
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      const totalElements = torusRingsRef.current.length;
      const progressThreshold = normalizedProgress * totalElements;
      const mouse = mouseRef.current;
      const isLight = themeMode === 'light';

      // Decay click intensity
      mouse.clickIntensity = Math.max(0, mouse.clickIntensity - 0.02);

      // Update UI state with current mouse metrics (throttled for performance)
      if (Math.floor(time * 10) % 2 === 0) {
        // Update every ~200ms
        setMouseDistance(Math.round(mouse.distanceFromCenter * 100));
        setClickIntensity(Math.round(mouse.clickIntensity * 100));
      }

      // Camera control based on mouse movement
      if (cameraRef.current) {
        const baseRadius = 20;
        const mouseCameraInfluence = 0.3;
        const autoRotation = time * 0.1;
        const mouseInfluence = mouse.normalized
          .clone()
          .multiplyScalar(mouseCameraInfluence);

        cameraRef.current.position.x =
          Math.cos(autoRotation + mouseInfluence.x) *
          (baseRadius + mouse.distanceFromCenter * 5);
        cameraRef.current.position.z =
          Math.sin(autoRotation + mouseInfluence.x) *
          (baseRadius + mouse.distanceFromCenter * 5);
        cameraRef.current.position.y =
          8 + Math.sin(time * 0.15) * 3 + mouseInfluence.y * 10;

        // Look-at target influenced by mouse
        const lookAtTarget = new THREE.Vector3(
          mouseInfluence.x * 5,
          mouseInfluence.y * 5,
          0
        );
        cameraRef.current.lookAt(lookAtTarget);
      }

      // Color shifting based on mouse position - adjusted for theme
      const hueShift = mouse.normalized.x * 0.1 + mouse.normalized.y * 0.05;
      const colorIntensityMultiplier = isLight ? 0.3 : 0.5; // Subtler effects in light mode
      const colorIntensity =
        1 +
        mouse.distanceFromCenter * colorIntensityMultiplier +
        mouse.clickIntensity * colorIntensityMultiplier;

      // Animate torus rings with theme-aware mouse interactions
      torusRingsRef.current.forEach((element, index) => {
        const isActivated = index < progressThreshold;
        const baseActivationIntensity = isActivated ? 1 : isLight ? 0.5 : 0.3;

        if (element.userData.type === 'verticalLine') {
          // Vertical line warping based on mouse position
          const positions = element.geometry.attributes.position;
          const originalPoints = element.userData.originalPoints;

          for (let i = 0; i < originalPoints.length; i++) {
            const originalPoint = originalPoints[i];
            const distance = originalPoint.distanceTo(mouse.world3D);
            const warpInfluence = Math.max(0, 1 - distance / 15); // Influence radius
            const warpStrength = warpInfluence * (2 + mouse.clickIntensity * 3);

            // Direction from original point to mouse
            const direction = new THREE.Vector3()
              .subVectors(mouse.world3D, originalPoint)
              .normalize()
              .multiplyScalar(warpStrength * (isLight ? 0.3 : 0.5)); // Subtler warping in light mode

            const newPosition = originalPoint.clone().add(direction);
            positions.array[i * 3] = newPosition.x;
            positions.array[i * 3 + 1] = newPosition.y;
            positions.array[i * 3 + 2] = newPosition.z;
          }
          positions.needsUpdate = true;

          // Animate vertical lines with proximity effects
          const intensity =
            Math.sin(time * 2 + element.userData.angle * 2) * 0.5 + 0.5;
          const lineDistance = Math.abs(
            element.userData.angle -
              Math.atan2(mouse.world3D.z, mouse.world3D.x)
          );
          const proximityBoost =
            Math.max(0, 1 - lineDistance / Math.PI) *
            mouse.distanceFromCenter *
            (isLight ? 1.5 : 2); // Adjusted proximity boost for theme

          const finalIntensity =
            baseActivationIntensity * (0.3 + intensity * 0.7 + proximityBoost);
          element.material.opacity =
            element.userData.baseOpacity * finalIntensity;

          // Color and brightness based on mouse proximity - theme aware
          if (proximityBoost > 0.3) {
            const targetColor = isLight
              ? element.userData.baseColor
              : element.userData.brightColor;
            element.material.color
              .copy(targetColor)
              .multiplyScalar(colorIntensity);
          } else if (isActivated) {
            const targetColor = isLight
              ? element.userData.baseColor
              : element.userData.brightColor;
            element.material.color.copy(targetColor);
          } else {
            element.material.color.copy(element.userData.dimColor);
          }
        } else if (element.userData.type === 'torus') {
          // Torus ring scaling and effects based on mouse proximity
          const ringWorldPos = new THREE.Vector3();
          element.getWorldPosition(ringWorldPos);
          const distanceToMouse = ringWorldPos.distanceTo(mouse.world3D);
          const proximityInfluence = Math.max(0, 1 - distanceToMouse / 12);

          // Enhanced rotation
          element.rotation.z =
            time * 0.5 +
            element.userData.index * 0.2 +
            mouse.normalized.x * 0.3;

          // Pulsing effect with mouse influence - theme aware
          const pulseIntensity =
            Math.sin(time * 3 + element.userData.index * 0.5) * 0.3 + 0.7;
          const mouseBoost =
            proximityInfluence *
            (1 + mouse.clickIntensity * (isLight ? 1.5 : 2));
          element.material.opacity =
            element.userData.baseOpacity *
            pulseIntensity *
            (baseActivationIntensity + mouseBoost);

          // Floating motion with mouse influence
          element.position.y =
            element.userData.originalY +
            Math.sin(time * 2 + element.userData.index * 0.8) * 0.2 +
            mouse.normalized.y * proximityInfluence * 2;

          // Scaling based on mouse proximity - adjusted for theme
          const scaleMultiplier =
            1 +
            proximityInfluence *
              (0.3 + mouse.clickIntensity * (isLight ? 0.3 : 0.5));
          element.scale
            .copy(element.userData.originalScale)
            .multiplyScalar(
              scaleMultiplier +
                Math.sin(time * 4 + element.userData.index * 0.3) * 0.05
            );

          // Color effects - theme aware
          if (proximityInfluence > 0.2) {
            const targetColor = isLight
              ? element.userData.baseColor
              : element.userData.brightColor;
            element.material.color
              .copy(targetColor)
              .multiplyScalar(colorIntensity);
          } else if (isActivated) {
            const targetColor = isLight
              ? element.userData.baseColor
              : element.userData.brightColor;
            element.material.color.copy(targetColor);
          } else {
            element.material.color.copy(element.userData.dimColor);
          }
        }
      });

      // Energy beam interactions - theme aware
      if (energyBeamRef.current) {
        const beamTilt = mouse.normalized.clone().multiplyScalar(0.3);
        energyBeamRef.current.rotation.y = time * 0.8 + beamTilt.x;
        energyBeamRef.current.rotation.x = beamTilt.y;

        energyBeamRef.current.children.forEach((beam, index) => {
          const scaleY =
            0.3 +
            normalizedProgress * 0.7 +
            Math.sin(time * 4) * 0.1 +
            mouse.distanceFromCenter * (isLight ? 0.2 : 0.3) +
            mouse.clickIntensity * (isLight ? 0.3 : 0.5);

          const scaleXZ =
            1 +
            mouse.distanceFromCenter * (isLight ? 0.15 : 0.2) +
            mouse.clickIntensity * (isLight ? 0.2 : 0.3);
          beam.scale.set(scaleXZ, scaleY, scaleXZ);

          if (beam instanceof THREE.Mesh) {
            const opacityMultiplier = isLight ? 0.8 : 1.0;
            beam.material.opacity =
              beam.userData.baseOpacity *
              opacityMultiplier *
              (0.2 +
                normalizedProgress * 0.8 +
                mouse.distanceFromCenter * (isLight ? 0.2 : 0.3));
          }
        });
      }

      // Particle attraction and swirling motion - theme aware
      particlesRef.current.forEach((particles) => {
        particles.rotation.y = time * 0.1;

        const positions = particles.geometry.attributes.position.array;
        const colors = particles.geometry.attributes.color.array;
        const sizes = particles.geometry.attributes.size.array;
        const originalColors = particles.userData.originalColors;
        const originalPositions = particles.userData.originalPositions;

        for (let i = 0; i < positions.length; i += 3) {
          const particlePos = new THREE.Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          );
          const originalPos = new THREE.Vector3(
            originalPositions[i],
            originalPositions[i + 1],
            originalPositions[i + 2]
          );

          // Mouse attraction - adjusted for theme
          const distanceToMouse = particlePos.distanceTo(mouse.world3D);
          const attractionForce = Math.max(0, 1 - distanceToMouse / 10);
          const attractionStrength =
            mouse.distanceFromCenter * (isLight ? 0.08 : 0.1) +
            mouse.clickIntensity * (isLight ? 0.2 : 0.3);

          if (attractionForce > 0) {
            const direction = new THREE.Vector3()
              .subVectors(mouse.world3D, particlePos)
              .normalize()
              .multiplyScalar(attractionStrength * attractionForce);

            particlePos.add(direction);
          }

          // Swirling motion around original position
          const angle = time * 0.5 + i * 0.01;
          const radius = Math.sqrt(
            originalPos.x * originalPos.x + originalPos.z * originalPos.z
          );

          const swirledX = Math.cos(angle) * radius;
          const swirledZ = Math.sin(angle) * radius;

          // Blend between swirled position and mouse-attracted position
          const blendFactor = 0.7 + attractionForce * 0.3;
          positions[i] =
            originalPos.x * (1 - blendFactor) +
            (swirledX + (particlePos.x - originalPos.x)) * blendFactor;
          positions[i + 2] =
            originalPos.z * (1 - blendFactor) +
            (swirledZ + (particlePos.z - originalPos.z)) * blendFactor;

          // Vertical oscillation with mouse influence
          positions[i + 1] =
            originalPos.y +
            Math.sin(time * 2 + i * 0.02) * 0.3 +
            mouse.normalized.y * attractionForce * 2;

          // Color intensity based on progress and mouse influence - theme aware
          const baseIntensity =
            (isLight ? 0.5 : 0.3) + normalizedProgress * 0.7;
          const pulseIntensity = Math.sin(time * 3 + i * 0.1) * 0.2;
          const mouseColorBoost =
            attractionForce * (1 + mouse.clickIntensity * (isLight ? 1.5 : 2));
          const finalIntensity =
            (baseIntensity + pulseIntensity) * (1 + mouseColorBoost);

          // Apply hue shifting near mouse - subtler in light mode
          let r = originalColors[i];
          let g = originalColors[i + 1];
          let b = originalColors[i + 2];

          if (attractionForce > 0.1) {
            // Shift towards complementary colors when near mouse
            const shiftAmount =
              attractionForce * hueShift * (isLight ? 0.5 : 1.0);
            r = Math.min(1, r * (1 + shiftAmount));
            g = Math.min(1, g * (1 - shiftAmount * 0.5));
            b = Math.min(1, b * (1 + shiftAmount * 0.3));
          }

          // Apply theme-appropriate intensity
          const themeIntensityMultiplier = isLight ? 0.8 : 1.0;
          colors[i] = Math.min(
            1,
            r * finalIntensity * colorIntensity * themeIntensityMultiplier
          );
          colors[i + 1] = Math.min(
            1,
            g * finalIntensity * colorIntensity * themeIntensityMultiplier
          );
          colors[i + 2] = Math.min(
            1,
            b * finalIntensity * colorIntensity * themeIntensityMultiplier
          );

          // Size variation based on mouse proximity - adjusted for theme
          const baseSizeIndex = Math.floor(i / 3);
          const baseSize = 1 + Math.random() * 2;
          const sizeMultiplier =
            1 +
            attractionForce *
              (0.5 + mouse.clickIntensity * (isLight ? 0.7 : 1.0));
          sizes[baseSizeIndex] = baseSize * sizeMultiplier;
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
        particles.geometry.attributes.size.needsUpdate = true;

        // Overall particle opacity - theme aware
        const particleOpacityMultiplier = isLight ? 0.7 : 1.0;
        particles.material.opacity =
          particles.userData.baseOpacity *
          particleOpacityMultiplier *
          (0.2 +
            normalizedProgress * 0.8 +
            mouse.distanceFromCenter * (isLight ? 0.15 : 0.2));
      });

      // Field distortion effect - create ripple waves from mouse position (theme aware)
      if (mouse.clickIntensity > 0) {
        const rippleTime = (1 - mouse.clickIntensity) * 5; // Ripple spreads over time
        const rippleRadius = rippleTime * 8;
        const rippleIntensityMultiplier = isLight ? 0.7 : 1.0; // Subtler ripples in light mode

        // Apply ripple effect to all scene elements
        torusRingsRef.current.forEach((element) => {
          if (element.userData.type === 'torus') {
            const elementPos = new THREE.Vector3();
            element.getWorldPosition(elementPos);
            const distanceFromRipple = Math.abs(
              elementPos.distanceTo(mouse.world3D) - rippleRadius
            );

            if (distanceFromRipple < 2) {
              const rippleIntensity = (2 - distanceFromRipple) / 2;
              const rippleScale =
                1 +
                rippleIntensity *
                  mouse.clickIntensity *
                  0.3 *
                  rippleIntensityMultiplier;
              element.scale.multiplyScalar(rippleScale);
              element.material.opacity *=
                1 +
                rippleIntensity *
                  mouse.clickIntensity *
                  rippleIntensityMultiplier;
            }
          }
        });
      }

      // Render the scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [normalizedProgress, themeMode]); // Re-run when progress or theme changes

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Box
        ref={mountRef}
        sx={{
          width: '100%',
          height: '100%',
          '&:hover': {
            cursor: 'crosshair',
          },
        }}
      />

      {/* Progress indicator */}
      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          color: 'primary.main',
        }}
      >
        {progressMessage !== undefined
          ? progressMessage
          : 'INITIALIZING BOOT SEQUENCE'}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          color: 'primary.main',
        }}
      >
        Progress: {isNaN(Math.round(progress)) ? 0 : Math.round(progress)}%
        <br />
        Click to boost (+{clickBoostValue}%)
        <br />
        Theme: {themeMode}
      </Typography>

      {/* Mouse interaction indicator */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          color: 'primary.main',
        }}
      >
        Mouse Distance: <strong>{mouseDistance}%</strong>
        <br />
        Click Intensity: <strong>{clickIntensity}%</strong>
      </Typography>
    </Box>
  );
};

TorusFieldProgress.displayName = 'TorusFieldProgress';

export const TorusFieldProgressMemo = memo(TorusFieldProgress);
