import { Box } from '@mui/material';
import { useRef, useEffect, useMemo, memo, useState, useCallback } from 'react';
import * as THREE from 'three';

type SceneElements =
  | THREE.Mesh<
      THREE.TorusGeometry,
      THREE.MeshBasicMaterial,
      THREE.Object3DEventMap
    >
  | THREE.Line<
      THREE.BufferGeometry<
        THREE.NormalBufferAttributes,
        THREE.BufferGeometryEventMap
      >,
      THREE.LineBasicMaterial,
      THREE.Object3DEventMap
    >;

type Particle3JS = THREE.Points<
  THREE.BufferGeometry<
    THREE.NormalBufferAttributes,
    THREE.BufferGeometryEventMap
  >,
  THREE.PointsMaterial,
  THREE.Object3DEventMap
>;

// Universal color type - accepts any common color format
type ColorValue =
  | string
  | number
  | THREE.Color
  | { r: number; g: number; b: number };

interface ColorScheme {
  backgroundColor?: ColorValue;
  beamColor?: ColorValue;
  torusColor?: ColorValue;
  particleColor?: ColorValue;
  verticalLineColor?: ColorValue;
}

interface TorusFieldProgressProps {
  progress?: number; // 0-100
  showControls?: boolean;
  title?: string;
  subtitle?: string;
  colors?: ColorScheme;
}

interface MouseInteraction {
  normalized: THREE.Vector2; // -1 to 1 range
  world3D: THREE.Vector3; // Projected 3D world position
  isDown: boolean;
  clickIntensity: number; // 0-1, fades over time
  distanceFromCenter: number; // 0-1
}

/**
 * Universal color converter that handles multiple input formats
 * and returns a THREE.Color instance
 */
const convertToThreeColor = (color: ColorValue): THREE.Color => {
  if (color instanceof THREE.Color) {
    return color.clone();
  }

  if (typeof color === 'number') {
    return new THREE.Color(color);
  }

  if (typeof color === 'string') {
    // Handle various string formats
    const trimmed = color.trim();

    // Hex without # prefix
    if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(trimmed)) {
      return new THREE.Color(`#${trimmed}`);
    }

    // All other string formats (hex with #, rgb, hsl, color names)
    return new THREE.Color(trimmed);
  }

  if (
    typeof color === 'object' &&
    'r' in color &&
    'g' in color &&
    'b' in color
  ) {
    // Handle RGB objects - detect if values are 0-1 or 0-255 range
    const { r, g, b } = color;
    if (r <= 1 && g <= 1 && b <= 1) {
      // 0-1 range
      return new THREE.Color(r, g, b);
    } else {
      // 0-255 range
      return new THREE.Color(r / 255, g / 255, b / 255);
    }
  }

  // Fallback to white if conversion fails
  console.warn('Invalid color format, defaulting to white:', color);
  return new THREE.Color(0xffffff);
};

/**
 * Creates color variations for different states (activated, dimmed, bright)
 */
const createColorVariations = (baseColor: THREE.Color) => {
  const brightColor = baseColor.clone().multiplyScalar(1.5);
  // Manually clamp RGB values to [0, 1] range
  brightColor.r = Math.min(1, brightColor.r);
  brightColor.g = Math.min(1, brightColor.g);
  brightColor.b = Math.min(1, brightColor.b);

  return {
    base: baseColor.clone(),
    bright: brightColor,
    dim: baseColor.clone().multiplyScalar(0.3),
    glow: baseColor.clone().multiplyScalar(0.8),
  };
};

export const TorusFieldProgress = ({
  progress: initialProgress = 0, // 0-100
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

  // Default colors using various formats to demonstrate flexibility
  const defaultColors: ColorScheme = {
    backgroundColor: 0x220000, // Hex number
    beamColor: '#ff0000', // Hex string
    torusColor: 'rgb(255, 0, 0)', // RGB string
    particleColor: { r: 255, g: 0, b: 0 }, // RGB object (0-255)
    verticalLineColor: 'red', // CSS color name
  };

  // Convert all colors to THREE.Color instances and create variations
  const processedColors = useMemo(() => {
    const merged = { ...defaultColors, ...colors };
    return {
      background: convertToThreeColor(merged.backgroundColor!),
      beam: createColorVariations(convertToThreeColor(merged.beamColor!)),
      torus: createColorVariations(convertToThreeColor(merged.torusColor!)),
      particle: createColorVariations(
        convertToThreeColor(merged.particleColor!)
      ),
      verticalLine: createColorVariations(
        convertToThreeColor(merged.verticalLineColor!)
      ),
    };
  }, [colors]);

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

  const handleMouseDown = useCallback((event: MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.clickIntensity = 1.0;

    // Progress boost on click
    setProgress((prev) => Math.min(100, prev + 2));
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  // Update progress when initialProgress prop changes
  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  useEffect(() => {
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

    // Lighting - derived from torus color
    const ambientLight = new THREE.AmbientLight(
      processedColors.torus.dim.getHex(),
      0.2
    );
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(
      processedColors.torus.base.getHex(),
      2,
      100
    );
    pointLight1.position.set(0, 15, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(
      processedColors.beam.base.getHex(),
      1,
      50
    );
    pointLight2.position.set(0, -15, 0);
    scene.add(pointLight2);

    // Create torus field structure
    const createTorusField = () => {
      console.log('CreateTorus Field');
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
        const torusMaterial = new THREE.MeshBasicMaterial({
          color: processedColors.torus.base.clone(),
          transparent: true,
          opacity: 0.6 - i * 0.03,
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
          baseOpacity: 0.6 - i * 0.03,
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
        const lineMaterial = new THREE.LineBasicMaterial({
          color: processedColors.verticalLine.base.clone(),
          transparent: true,
          opacity: 0.3,
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = {
          type: 'verticalLine',
          angle,
          baseOpacity: 0.3,
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

      // Core beam
      const coreGeometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 8);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: processedColors.beam.base.clone(),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const coreBeam = new THREE.Mesh(coreGeometry, coreMaterial);
      coreBeam.userData = {
        baseOpacity: 0.8,
        baseColor: processedColors.beam.base.clone(),
      };
      beamGroup.add(coreBeam);

      // Outer glow layers - derived from beam color
      for (let i = 0; i < 3; i++) {
        const glowGeometry = new THREE.CylinderGeometry(
          0.2 + i * 0.1,
          0.2 + i * 0.1,
          20,
          8
        );
        const baseOpacity = 0.2 / (i + 1);
        const glowColor = processedColors.beam.glow.clone();
        // Slight variation for each layer
        glowColor.multiplyScalar(1 - i * 0.1);

        const glowMaterial = new THREE.MeshBasicMaterial({
          color: glowColor,
          transparent: true,
          opacity: baseOpacity,
          blending: THREE.AdditiveBlending,
        });
        const glowBeam = new THREE.Mesh(glowGeometry, glowMaterial);
        glowBeam.userData = { baseOpacity };
        beamGroup.add(glowBeam);
      }

      scene.add(beamGroup);
      energyBeamRef.current = beamGroup;
    };

    // Create particle field with more particles for better interactions
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

        // Color variation - slight variations of base particle color
        const color = baseParticleColor.clone();
        const variation = 0.7 + Math.random() * 0.3;
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

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.7,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particles.userData = {
        originalColors,
        originalPositions,
        baseOpacity: 0.7,
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
  }, [processedColors, handleMouseMove, handleMouseDown, handleMouseUp]);

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

  // Main animation loop with all mouse interactions
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      const totalElements = torusRingsRef.current.length;
      const progressThreshold = normalizedProgress * totalElements;
      const mouse = mouseRef.current;

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

      // Color shifting based on mouse position
      const hueShift = mouse.normalized.x * 0.1 + mouse.normalized.y * 0.05;
      const colorIntensity =
        1 + mouse.distanceFromCenter * 0.5 + mouse.clickIntensity * 0.5;

      // Animate torus rings with mouse interactions
      torusRingsRef.current.forEach((element, index) => {
        const isActivated = index < progressThreshold;
        const baseActivationIntensity = isActivated ? 1 : 0.3;

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
              .multiplyScalar(warpStrength * 0.5);

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
            2;

          const finalIntensity =
            baseActivationIntensity * (0.3 + intensity * 0.7 + proximityBoost);
          element.material.opacity =
            element.userData.baseOpacity * finalIntensity;

          // Color and brightness based on mouse proximity
          if (proximityBoost > 0.3) {
            element.material.color
              .copy(element.userData.brightColor)
              .multiplyScalar(colorIntensity);
          } else if (isActivated) {
            element.material.color.copy(element.userData.brightColor);
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

          // Pulsing effect with mouse influence
          const pulseIntensity =
            Math.sin(time * 3 + element.userData.index * 0.5) * 0.3 + 0.7;
          const mouseBoost =
            proximityInfluence * (1 + mouse.clickIntensity * 2);
          element.material.opacity =
            element.userData.baseOpacity *
            pulseIntensity *
            (baseActivationIntensity + mouseBoost);

          // Floating motion with mouse influence
          element.position.y =
            element.userData.originalY +
            Math.sin(time * 2 + element.userData.index * 0.8) * 0.2 +
            mouse.normalized.y * proximityInfluence * 2;

          // Scaling based on mouse proximity
          const scaleMultiplier =
            1 + proximityInfluence * (0.3 + mouse.clickIntensity * 0.5);
          element.scale
            .copy(element.userData.originalScale)
            .multiplyScalar(
              scaleMultiplier +
                Math.sin(time * 4 + element.userData.index * 0.3) * 0.05
            );

          // Color effects
          if (proximityInfluence > 0.2) {
            element.material.color
              .copy(element.userData.brightColor)
              .multiplyScalar(colorIntensity);
          } else if (isActivated) {
            element.material.color.copy(element.userData.brightColor);
          } else {
            element.material.color.copy(element.userData.dimColor);
          }
        }
      });

      // Energy beam interactions
      if (energyBeamRef.current) {
        const beamTilt = mouse.normalized.clone().multiplyScalar(0.3);
        energyBeamRef.current.rotation.y = time * 0.8 + beamTilt.x;
        energyBeamRef.current.rotation.x = beamTilt.y;

        energyBeamRef.current.children.forEach((beam, index) => {
          const scaleY =
            0.3 +
            normalizedProgress * 0.7 +
            Math.sin(time * 4) * 0.1 +
            mouse.distanceFromCenter * 0.3 +
            mouse.clickIntensity * 0.5;

          const scaleXZ =
            1 + mouse.distanceFromCenter * 0.2 + mouse.clickIntensity * 0.3;
          beam.scale.set(scaleXZ, scaleY, scaleXZ);

          if (beam instanceof THREE.Mesh) {
            beam.material.opacity =
              beam.userData.baseOpacity *
              (0.2 + normalizedProgress * 0.8 + mouse.distanceFromCenter * 0.3);
          }
        });
      }

      // Particle attraction and swirling motion
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

          // Mouse attraction
          const distanceToMouse = particlePos.distanceTo(mouse.world3D);
          const attractionForce = Math.max(0, 1 - distanceToMouse / 10);
          const attractionStrength =
            mouse.distanceFromCenter * 0.1 + mouse.clickIntensity * 0.3;

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

          // Color intensity based on progress and mouse influence
          const baseIntensity = 0.3 + normalizedProgress * 0.7;
          const pulseIntensity = Math.sin(time * 3 + i * 0.1) * 0.2;
          const mouseColorBoost =
            attractionForce * (1 + mouse.clickIntensity * 2);
          const finalIntensity =
            (baseIntensity + pulseIntensity) * (1 + mouseColorBoost);

          // Apply hue shifting near mouse
          let r = originalColors[i];
          let g = originalColors[i + 1];
          let b = originalColors[i + 2];

          if (attractionForce > 0.1) {
            // Shift towards complementary colors when near mouse
            const shiftAmount = attractionForce * hueShift;
            r = Math.min(1, r * (1 + shiftAmount));
            g = Math.min(1, g * (1 - shiftAmount * 0.5));
            b = Math.min(1, b * (1 + shiftAmount * 0.3));
          }

          colors[i] = Math.min(1, r * finalIntensity * colorIntensity);
          colors[i + 1] = Math.min(1, g * finalIntensity * colorIntensity);
          colors[i + 2] = Math.min(1, b * finalIntensity * colorIntensity);

          // Size variation based on mouse proximity
          const baseSizeIndex = Math.floor(i / 3);
          const baseSize = 1 + Math.random() * 2;
          const sizeMultiplier =
            1 + attractionForce * (0.5 + mouse.clickIntensity);
          sizes[baseSizeIndex] = baseSize * sizeMultiplier;
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
        particles.geometry.attributes.size.needsUpdate = true;

        // Overall particle opacity
        particles.material.opacity =
          particles.userData.baseOpacity *
          (0.2 + normalizedProgress * 0.8 + mouse.distanceFromCenter * 0.2);
      });

      // Field distortion effect - create ripple waves from mouse position
      if (mouse.clickIntensity > 0) {
        const rippleTime = (1 - mouse.clickIntensity) * 5; // Ripple spreads over time
        const rippleRadius = rippleTime * 8;

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
                1 + rippleIntensity * mouse.clickIntensity * 0.3;
              element.scale.multiplyScalar(rippleScale);
              element.material.opacity *=
                1 + rippleIntensity * mouse.clickIntensity;
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
  }, [normalizedProgress]); // Re-run when progress changes

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
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '14px',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '8px 12px',
          borderRadius: '4px',
          backdropFilter: 'blur(10px)',
        }}
      >
        Progress: {Math.round(progress)}%
        <br />
        Click to boost (+10%)
      </Box>

      {/* Mouse interaction indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '12px',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '8px 12px',
          borderRadius: '4px',
          backdropFilter: 'blur(10px)',
          opacity: mouseDistance > 10 ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      >
        Mouse Distance: {mouseDistance}%
        <br />
        Click Intensity: {clickIntensity}%
      </Box>
    </Box>
  );
};

TorusFieldProgress.displayName = 'TorusFieldProgress';

export const TorusFieldProgressMemo = memo(TorusFieldProgress);
