import { Box } from '@mui/material';
import { useRef, useEffect, useMemo, memo } from 'react';
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

/**
 * Universal color converter that handles multiple input formats
 * and returns a THREE.Color instance
 *
 * Supported formats:
 * - Hex strings: "#ff0000", "#f00", "ff0000", "f00"
 * - RGB strings: "rgb(255, 0, 0)", "rgba(255, 0, 0, 1)"
 * - HSL strings: "hsl(0, 100%, 50%)"
 * - CSS color names: "red", "blue", "green"
 * - Hex numbers: 0xff0000
 * - RGB objects: { r: 1, g: 0, b: 0 } (0-1 range) or { r: 255, g: 0, b: 0 } (0-255 range)
 * - THREE.Color instances: passed through
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
  progress = 0, // 0-100
  colors = {},
}: TorusFieldProgressProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const torusRingsRef = useRef<SceneElements[]>([]);
  const particlesRef = useRef<Particle3JS[]>([]);
  const energyBeamRef = useRef<THREE.Group>(null);
  const animationRef = useRef<number>(null);

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

      // Vertical connecting lines
      const verticalLineCount = 32;
      for (let i = 0; i < verticalLineCount; i++) {
        const angle = (i / verticalLineCount) * Math.PI * 2;
        const radius = 8;

        const points = [];
        for (let j = 0; j < 20; j++) {
          const y = (j - 10) * 0.6;
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

    // Create particle field
    const createParticleField = () => {
      const particleCount = 1000;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const originalColors = new Float32Array(particleCount * 3);

      const baseParticleColor = processedColors.particle.base;

      for (let i = 0; i < particleCount; i++) {
        // Distribute particles in a torus-like field
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 15;
        const height = (Math.random() - 0.5) * 15;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

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
      particles.userData = { originalColors, baseOpacity: 0.7 };
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [processedColors]); // React to color changes

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

  // Animation loop with progress updates
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      const totalElements = torusRingsRef.current.length;
      const progressThreshold = normalizedProgress * totalElements;

      // Animate torus rings based on progress
      torusRingsRef.current.forEach((element, index) => {
        const isActivated = index < progressThreshold;
        const activationIntensity = isActivated ? 1 : 0.3;

        if (element.userData.type === 'verticalLine') {
          // Animate vertical lines
          const intensity =
            Math.sin(time * 2 + element.userData.angle * 2) * 0.5 + 0.5;
          element.material.opacity =
            element.userData.baseOpacity *
            (0.3 + intensity * 0.7) *
            activationIntensity;

          if (isActivated) {
            element.material.color.copy(element.userData.brightColor);
            element.material.opacity *= 1.5;
          } else {
            element.material.color.copy(element.userData.dimColor);
          }
        } else if (element.userData.type === 'torus') {
          // Animate horizontal torus rings
          element.rotation.z = time * 0.5 + element.userData.index * 0.2;

          // Pulsing effect
          const pulseIntensity =
            Math.sin(time * 3 + element.userData.index * 0.5) * 0.3 + 0.7;
          element.material.opacity =
            element.userData.baseOpacity * pulseIntensity * activationIntensity;

          // Floating motion
          element.position.y =
            element.userData.originalY +
            Math.sin(time * 2 + element.userData.index * 0.8) * 0.2;

          if (isActivated) {
            element.material.color.copy(element.userData.brightColor);
            element.scale.setScalar(
              1 + Math.sin(time * 4 + element.userData.index * 0.3) * 0.1
            );
          } else {
            element.material.color.copy(element.userData.dimColor);
            element.scale.setScalar(1);
          }
        }
      });

      // Animate energy beam based on progress
      if (energyBeamRef.current) {
        energyBeamRef.current.rotation.y = time * 0.8;
        energyBeamRef.current.children.forEach((beam) => {
          const scaleY =
            0.3 + normalizedProgress * 0.7 + Math.sin(time * 4) * 0.1;
          beam.scale.y = scaleY;
          if (beam instanceof THREE.Mesh) {
            beam.material.opacity =
              beam.userData.baseOpacity * (0.2 + normalizedProgress * 0.8);
          }
        });
      }

      // Animate particles based on progress
      particlesRef.current.forEach((particles) => {
        particles.rotation.y = time * 0.1;

        const positions = particles.geometry.attributes.position.array;
        const colors = particles.geometry.attributes.color.array;
        const originalColors = particles.userData.originalColors;

        for (let i = 0; i < positions.length; i += 3) {
          // Swirling motion
          const angle = time * 0.5 + i * 0.01;
          const radius = Math.sqrt(
            positions[i] * positions[i] + positions[i + 2] * positions[i + 2]
          );

          positions[i] = Math.cos(angle) * radius;
          positions[i + 2] = Math.sin(angle) * radius;

          // Vertical oscillation
          positions[i + 1] += Math.sin(time * 2 + i * 0.02) * 0.01;

          // Color intensity based on progress
          const baseIntensity = 0.3 + normalizedProgress * 0.7;
          const pulseIntensity = Math.sin(time * 3 + i * 0.1) * 0.2;
          const finalIntensity = baseIntensity + pulseIntensity;

          colors[i] = Math.min(1, originalColors[i] * finalIntensity);
          colors[i + 1] = Math.min(1, originalColors[i + 1] * finalIntensity);
          colors[i + 2] = Math.min(1, originalColors[i + 2] * finalIntensity);
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
        particles.material.opacity =
          particles.userData.baseOpacity * (0.2 + normalizedProgress * 0.8);
      });

      // Camera orbital motion
      const cameraRadius = 20;
      if (cameraRef.current) {
        cameraRef.current.position.x = Math.cos(time * 0.1) * cameraRadius;
        cameraRef.current.position.z = Math.sin(time * 0.1) * cameraRadius;
        cameraRef.current.position.y = 8 + Math.sin(time * 0.15) * 3;
        cameraRef.current.lookAt(0, 0, 0);
      }

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
      }}
    >
      <Box ref={mountRef} sx={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

TorusFieldProgress.displayName = 'TorusFieldProgress';

export const TorusFieldProgressMemo = memo(TorusFieldProgress);
