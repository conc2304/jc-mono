import { Box } from '@mui/material';
import { useRef, useEffect } from 'react';
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

export const TorusFieldProgress = ({
  progress = 0, // 0-100
  showControls = false,
  title = 'QUANTUM FIELD',
  subtitle = 'INITIALIZATION',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const torusRingsRef = useRef<SceneElements[]>([]);
  const particlesRef = useRef<Particle3JS[]>([]);
  const energyBeamRef = useRef<THREE.Group>(null);
  const animationRef = useRef<number>(null);

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
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 10, 50);
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
    renderer.setClearColor(0x000000);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Clear arrays
    torusRingsRef.current = [];
    particlesRef.current = [];

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 100);
    pointLight1.position.set(0, 15, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 50);
    pointLight2.position.set(0, -15, 0);
    scene.add(pointLight2);

    // Create torus field structure
    const createTorusField = () => {
      // Main torus rings (horizontal)
      const ringCount = 12;
      for (let i = 0; i < ringCount; i++) {
        const radius = 3 + i * 0.8;
        const tubeRadius = 0.02;

        const torusGeometry = new THREE.TorusGeometry(
          radius,
          tubeRadius,
          8,
          64
        );
        const torusMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
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
          color: 0x00ffff,
          transparent: true,
          opacity: 0.3,
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = {
          type: 'verticalLine',
          angle,
          baseOpacity: 0.3,
          index: i + ringCount,
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
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const coreBeam = new THREE.Mesh(coreGeometry, coreMaterial);
      coreBeam.userData = { baseOpacity: 0.8 };
      beamGroup.add(coreBeam);

      // Outer glow layers
      for (let i = 0; i < 3; i++) {
        const glowGeometry = new THREE.CylinderGeometry(
          0.2 + i * 0.1,
          0.2 + i * 0.1,
          20,
          8
        );
        const baseOpacity = 0.2 / (i + 1);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.5 + i * 0.1, 1, 0.5),
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

      for (let i = 0; i < particleCount; i++) {
        // Distribute particles in a torus-like field
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 15;
        const height = (Math.random() - 0.5) * 15;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        // Color variation
        const color = new THREE.Color();
        color.setHSL(0.5 + Math.random() * 0.2, 1, 0.5 + Math.random() * 0.5);
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
  }, [mountRef]); // Only run once on mount

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
            element.material.color.setHSL(0.3, 1, 0.7);
            element.material.opacity *= 1.5;
          } else {
            element.material.color.setHSL(0.5, 0.8, 0.4);
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
            element.material.color.setHSL(0.3, 1, 0.8);
            element.scale.setScalar(
              1 + Math.sin(time * 4 + element.userData.index * 0.3) * 0.1
            );
          } else {
            element.material.color.setHSL(0.5, 0.8, 0.5);
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
