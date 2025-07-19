'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const TorusFieldLoading = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const torusRingsRef = useRef([]);
  const particlesRef = useRef([]);
  const energyBeamRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const cameraTargetRef = useRef({ x: 0, y: 0, z: 0 });
  const fieldDistortionRef = useRef({ intensity: 0, rippleTime: 0 });
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
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
        line.userData = { type: 'verticalLine', angle, baseOpacity: 0.3 };
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
      beamGroup.add(coreBeam);

      // Outer glow layers
      for (let i = 0; i < 3; i++) {
        const glowGeometry = new THREE.CylinderGeometry(
          0.2 + i * 0.1,
          0.2 + i * 0.1,
          20,
          8
        );
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.5 + i * 0.1, 1, 0.5),
          transparent: true,
          opacity: 0.2 / (i + 1),
          blending: THREE.AdditiveBlending,
        });
        const glowBeam = new THREE.Mesh(glowGeometry, glowMaterial);
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
      scene.add(particles);
      particlesRef.current.push(particles);
    };

    // Initialize all elements
    createTorusField();
    createEnergyBeam();
    createParticleField();

    camera.position.set(0, 8, 20);
    camera.lookAt(0, 0, 0);

    // Mouse interaction setup
    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;

      // Normalize to -1 to 1 range
      mouseRef.current.normalizedX = (mouseRef.current.x / rect.width) * 2 - 1;
      mouseRef.current.normalizedY = -(
        (mouseRef.current.y / rect.height) * 2 -
        1
      );

      // Update camera target for smooth following
      cameraTargetRef.current.x = mouseRef.current.normalizedX * 3;
      cameraTargetRef.current.y = mouseRef.current.normalizedY * 2;

      // Create field distortion effect
      fieldDistortionRef.current.intensity = Math.sqrt(
        mouseRef.current.normalizedX * mouseRef.current.normalizedX +
          mouseRef.current.normalizedY * mouseRef.current.normalizedY
      );
      fieldDistortionRef.current.rippleTime = Date.now() * 0.001;
    };

    const handleMouseClick = () => {
      // Create energy pulse on click
      fieldDistortionRef.current.intensity = 2;
      fieldDistortionRef.current.rippleTime = Date.now() * 0.001;

      // Boost progress slightly on click
      setProgress((prev) => Math.min(1, prev + 0.1));
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleMouseClick);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      const mouse = mouseRef.current;
      const fieldDistortion = fieldDistortionRef.current;

      // Animate torus rings with mouse interaction
      torusRingsRef.current.forEach((ring, index) => {
        if (ring.userData.type === 'verticalLine') {
          // Animate vertical lines with mouse influence
          const distanceFromMouse = Math.abs(
            ring.userData.angle -
              Math.atan2(mouse.normalizedY, mouse.normalizedX)
          );
          const mouseInfluence =
            Math.max(0, 1 - distanceFromMouse * 0.5) *
            fieldDistortion.intensity;

          const intensity =
            Math.sin(time * 2 + ring.userData.angle * 2) * 0.5 + 0.5;
          ring.material.opacity =
            ring.userData.baseOpacity *
            (0.3 + intensity * 0.7 + mouseInfluence * 0.5);

          // Mouse distortion effect
          const positions = ring.geometry.attributes.position.array;
          for (let i = 0; i < positions.length; i += 3) {
            const originalY = (i / 3 - 10) * 0.6;
            const distortionAmount =
              mouseInfluence * Math.sin(time * 5 + i * 0.1) * 0.3;
            positions[i + 1] = originalY + distortionAmount;
          }
          ring.geometry.attributes.position.needsUpdate = true;

          // Progress-based activation
          const progressLine = progress * torusRingsRef.current.length;
          if (index < progressLine) {
            ring.material.color.setHSL(
              0.3 + mouseInfluence * 0.2,
              1,
              0.7 + mouseInfluence * 0.3
            );
            ring.material.opacity *= 1.5;
          } else {
            ring.material.color.setHSL(0.5, 0.8, 0.4);
          }
        } else {
          // Animate horizontal torus rings with mouse interaction
          const mouseDistanceFromCenter = Math.sqrt(
            mouse.normalizedX * mouse.normalizedX +
              mouse.normalizedY * mouse.normalizedY
          );
          const mouseInfluence =
            Math.max(0, 1 - mouseDistanceFromCenter) *
            fieldDistortion.intensity;

          ring.rotation.z = time * 0.5 + index * 0.2 + mouseInfluence * 2;

          // Mouse-influenced pulsing
          const pulseIntensity =
            Math.sin(time * 3 + index * 0.5) * 0.3 + 0.7 + mouseInfluence * 0.4;
          ring.material.opacity = ring.userData.baseOpacity * pulseIntensity;

          // Mouse-influenced floating motion
          const floatOffset = Math.sin(time * 2 + index * 0.8) * 0.2;
          const mouseOffset = mouse.normalizedY * mouseInfluence * 0.5;
          ring.position.y = ring.userData.originalY + floatOffset + mouseOffset;

          // Mouse-influenced scaling
          const mouseScale = 1 + mouseInfluence * 0.2;
          ring.scale.setScalar(mouseScale);

          // Progress-based color change with mouse influence
          const progressRing = (progress * torusRingsRef.current.length) / 2;
          if (index < progressRing) {
            const hue = 0.3 + mouseInfluence * 0.3;
            ring.material.color.setHSL(hue, 1, 0.8 + mouseInfluence * 0.2);
            ring.scale.setScalar(
              mouseScale * (1 + Math.sin(time * 4 + index * 0.3) * 0.1)
            );
          } else {
            ring.material.color.setHSL(0.5, 0.8, 0.5);
          }
        }
      });

      // Animate energy beam with mouse interaction
      if (energyBeamRef.current) {
        const mouseDistance = Math.sqrt(
          mouse.normalizedX * mouse.normalizedX +
            mouse.normalizedY * mouse.normalizedY
        );
        const beamInfluence = fieldDistortion.intensity;

        energyBeamRef.current.rotation.y = time * 0.8 + beamInfluence * 0.5;
        energyBeamRef.current.rotation.x = mouse.normalizedY * 0.1;
        energyBeamRef.current.rotation.z = mouse.normalizedX * 0.1;

        energyBeamRef.current.children.forEach((beam, index) => {
          const scaleY =
            0.5 +
            progress * 0.5 +
            Math.sin(time * 4 + index) * 0.1 +
            beamInfluence * 0.3;
          const scaleXZ =
            1 +
            beamInfluence * 0.5 +
            Math.sin(time * 6 + index * 2) * beamInfluence * 0.2;

          beam.scale.y = scaleY;
          beam.scale.x = scaleXZ;
          beam.scale.z = scaleXZ;

          const baseOpacity = beam.material.opacity * (0.5 + progress * 0.5);
          beam.material.opacity = baseOpacity + beamInfluence * 0.4;

          // Color shifting based on mouse position
          if (index === 0) {
            // Core beam
            const hue = 0.6 + mouse.normalizedX * 0.2;
            beam.material.color.setHSL(hue, 1, 1);
          }
        });
      }

      // Animate particles with mouse interaction
      particlesRef.current.forEach((particles) => {
        const baseRotation = time * 0.1;
        const mouseRotation = mouse.normalizedX * 0.5;
        particles.rotation.y = baseRotation + mouseRotation;

        const positions = particles.geometry.attributes.position.array;
        const colors = particles.geometry.attributes.color.array;
        const sizes = particles.geometry.attributes.size.array;

        for (let i = 0; i < positions.length; i += 3) {
          // Mouse-influenced swirling motion
          const angle = time * 0.5 + i * 0.01 + mouse.normalizedX * 0.3;
          const radius = Math.sqrt(
            positions[i] * positions[i] + positions[i + 2] * positions[i + 2]
          );

          // Add mouse distortion to particle positions
          const particleDistance = Math.sqrt(
            (positions[i] - mouse.normalizedX * 10) *
              (positions[i] - mouse.normalizedX * 10) +
              (positions[i + 1] - mouse.normalizedY * 10) *
                (positions[i + 1] - mouse.normalizedY * 10)
          );
          const mouseParticleInfluence =
            Math.max(0, 1 - particleDistance * 0.1) * fieldDistortion.intensity;

          positions[i] =
            Math.cos(angle) * radius +
            mouseParticleInfluence * Math.sin(time * 3 + i) * 0.5;
          positions[i + 2] =
            Math.sin(angle) * radius +
            mouseParticleInfluence * Math.cos(time * 3 + i) * 0.5;

          // Vertical oscillation with mouse influence
          positions[i + 1] +=
            Math.sin(time * 2 + i * 0.02) * 0.01 +
            mouseParticleInfluence * 0.02;

          // Color pulsing based on progress and mouse interaction
          const colorIntensity =
            0.3 +
            progress * 0.7 +
            Math.sin(time * 3 + i * 0.1) * 0.2 +
            mouseParticleInfluence * 0.5;
          colors[i] = Math.min(1, colors[i] * colorIntensity);
          colors[i + 1] = Math.min(1, colors[i + 1] * colorIntensity);
          colors[i + 2] = Math.min(1, colors[i + 2] * colorIntensity);

          // Size variation based on mouse interaction
          const baseSizeIndex = Math.floor(i / 3);
          sizes[baseSizeIndex] =
            (1 + mouseParticleInfluence * 2) *
            (1 + Math.sin(time * 4 + i * 0.05) * 0.3);
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
        particles.geometry.attributes.size.needsUpdate = true;
        particles.material.opacity =
          0.4 + progress * 0.6 + fieldDistortion.intensity * 0.3;
      });

      // Camera movement with mouse interaction and smooth orbital motion
      const cameraRadius = 20 + fieldDistortion.intensity * 5;
      const baseX = Math.cos(time * 0.1) * cameraRadius;
      const baseZ = Math.sin(time * 0.1) * cameraRadius;
      const baseY = 8 + Math.sin(time * 0.15) * 3;

      // Smooth interpolation towards mouse-influenced position
      const targetX = baseX + cameraTargetRef.current.x;
      const targetY = baseY + cameraTargetRef.current.y;
      const targetZ = baseZ;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;

      // Look at center with slight mouse offset
      const lookAtX = mouse.normalizedX * 2;
      const lookAtY = mouse.normalizedY * 1;
      camera.lookAt(lookAtX, lookAtY, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('click', handleMouseClick);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [progress]);

  // Auto progress simulation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 0.008;
          if (next >= 1) {
            setIsLoading(false);
            return 1;
          }
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const resetProgress = () => {
    setProgress(0);
    setIsLoading(true);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 text-cyan-400 font-mono">
          <div className="text-xs opacity-60">QUANTUM FIELD</div>
          <div className="text-xs opacity-60">INITIALIZATION</div>
          <div className="text-xs opacity-40 mt-2">MOUSE: FIELD DISTORTION</div>
          <div className="text-xs opacity-40">CLICK: ENERGY PULSE</div>
        </div>

        <div className="absolute top-4 right-4 text-cyan-400 font-mono text-right">
          <div className="text-xs opacity-60">TORUS MATRIX</div>
          <div className="text-xs opacity-60">v2.847</div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-center text-cyan-400 font-mono mb-4">
            <div className="text-lg mb-2">
              {isLoading ? 'LOADING...' : 'COMPLETE'}
            </div>
            <div className="text-2xl font-bold">
              {Math.round(progress * 100)}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-white transition-all duration-75 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Side decorations */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-mono text-xs opacity-40">
          <div className="rotate-90 origin-center">NONLOCAL PRESENCE</div>
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-mono text-xs opacity-40">
          <div className="rotate-90 origin-center">NEW REEL</div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={resetProgress}
          className="px-6 py-2 bg-cyan-400 bg-opacity-20 border border-cyan-400 rounded font-mono text-cyan-400 hover:bg-opacity-30 transition-all"
        >
          RESTART SEQUENCE
        </button>
      </div>
    </div>
  );
};
