{/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Matrix overlay effects */}
        {isMatrixMode && (
          <>
            <div
              className="absolute inset-0 bg-green-500 opacity-5 animate-pulse"
              style={{
                background: `radial-gradient(circle, rgba(0,255,0,0.1) 0%, rgba(0,0,0,0.8) 100%)`,
                animation: 'pulse 0.5s ease-in-out infinite alternate'
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"
                 style={{
                   backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)`,
                   animation: 'scan 2s linear infinite'
                 }}
            />
          </>
        )}

        {/* Corner decorations */}
        <div className={`absolute top-4 left-4 font-mono transition-colors duration-500 ${
          isMatrixMode ? 'text-green-400' : 'text-cyan-400'
        }`}>
          <div className="text-xs opacity-60">{isMatrixMode ? 'MATRIX ACCESS' : title}</div>
          <div className="text-xs opacity-60">{isMatrixMode ? 'PROTOCOL' : subtitle}</div>
        </div>

        <div className={`absolute top-4 right-4 font-mono text-right transition-colors duration-500 ${
          isMatrixMode ? 'text-green-400' : 'text-cyan-400'
        }`}>
          <div className="text-xs opacity-60">{isMatrixMode ? 'NEO-MATRIX' : 'TORUS MATRIX'}</div>
          <div className="text-xs opacity-60">{isMatrixMode ? 'v1.999' : 'v2.847'}</div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className={`text-center font-mono mb-4 transition-colors duration-500 ${
            isMatrixMode ? 'text-green-400' : 'text-cyan-400'
          }`}>
            <div className="text-lg mb-2">
              {getStatusText()}
            </div>
            <div className="text-2xl font-bold">
              {isMatrixMode ? Math.round(matrixProgress) : Math.round(normalizedProgress * 100)}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-out ${
                isMatrixMode
                  ? 'bg-gradient-to-r from-green-400 to-lime-300'
                  : normalizedProgress >= 1
                    ? 'bg-gradient-to-r from-green-400 to-cyan-400'
                    : 'bg-gradient-to-r from-cyan-400 to-white'
              }`}
              style={{
                width: `${isMatrixMode ? matrixProgress : normalizedProgress * 100}%`,
                boxShadow: isMatrixMode ? '0 0 10px rgba(0,255,0,0.5)' : 'none'
              }}
            />
          </div>
        </div>

        {/* Side decorations */}
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 font-mono text-xs opacity-40 transition-colors duration-500 ${
          isMatrixMode ? 'text-green-400' : 'text-cyan-400'
        }`}>
          <div className="rotate-90 origin-center">{isMatrixMode ? 'REALITY SHIFT' : 'QUANTUM FIELD'}</div>
        </div>

        <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 font-mono text-xs opacity-40 transition-colors duration-500 ${
          isMatrixMode ? 'text-green-400' : 'text-cyan-400'
        }`}>
          <div className="rotate-90 origin-center">{isMatrixMode ? 'DECODE' : 'ACTIVE'}</div>
        </div>

        {/* Matrix code overlay */}
        {isMatrixMode && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-green-400 font-mono text-xs opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `matrix-glitch ${1 + Math.random() * 2}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {['WAKE UP', 'FOLLOW', 'THE WHITE', 'RABBIT', '01010', 'ZION', 'RED PILL', 'CHOICE'][Math.floor(Math.random() * 8)]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes matrix-glitch {
            0%, 100% { opacity: 0; transform: translateY(0px); }
            50% { opacity: 0.8; transform: translateY(-20px); }
          }
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
        `
      }} />
        import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TorusFieldProgress = ({
  progress = 0, // 0-100
  showControls = false,
  title = "QUANTUM FIELD",
  subtitle = "INITIALIZATION",
  onComplete = null, // Callback when sequence completes
  onClose = null // Callback when matrix sequence finishes
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const torusRingsRef = useRef([]);
  const particlesRef = useRef([]);
  const energyBeamRef = useRef(null);
  const animationRef = useRef(null);
  const matrixRainRef = useRef([]);
  const [isMatrixMode, setIsMatrixMode] = React.useState(false);
  const [matrixProgress, setMatrixProgress] = React.useState(0);
  const [hasTriggeredComplete, setHasTriggeredComplete] = React.useState(false);

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

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
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
        const radius = 3 + (i * 0.8);
        const tubeRadius = 0.02;

        const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, 8, 64);
        const torusMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.6 - (i * 0.03),
          wireframe: false
        });

        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.rotation.x = Math.PI / 2;
        torus.position.y = (i - ringCount / 2) * 0.5;

        torus.userData = {
          originalY: torus.position.y,
          index: i,
          radius: radius,
          baseOpacity: 0.6 - (i * 0.03),
          type: 'torus'
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
          points.push(new THREE.Vector3(
            Math.cos(angle) * currentRadius,
            y,
            Math.sin(angle) * currentRadius
          ));
        }

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.3
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = {
          type: 'verticalLine',
          angle,
          baseOpacity: 0.3,
          index: i + ringCount
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
        blending: THREE.AdditiveBlending
      });
      const coreBeam = new THREE.Mesh(coreGeometry, coreMaterial);
      coreBeam.userData = { baseOpacity: 0.8 };
      beamGroup.add(coreBeam);

      // Outer glow layers
      for (let i = 0; i < 3; i++) {
        const glowGeometry = new THREE.CylinderGeometry(0.2 + i * 0.1, 0.2 + i * 0.1, 20, 8);
        const baseOpacity = 0.2 / (i + 1);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.5 + i * 0.1, 1, 0.5),
          transparent: true,
          opacity: baseOpacity,
          blending: THREE.AdditiveBlending
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

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.7,
        vertexColors: true,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particles.userData = { originalColors, baseOpacity: 0.7 };
      scene.add(particles);
      particlesRef.current.push(particles);
    };

    // Create matrix rain effect
    const createMatrixRain = () => {
      const columns = 80;
      const matrixGroup = new THREE.Group();

      for (let i = 0; i < columns; i++) {
        const dropCount = 20;
        const drops = [];

        for (let j = 0; j < dropCount; j++) {
          // Create text sprites for matrix characters
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = 32;
          canvas.height = 32;

          // Random matrix character
          const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
          const char = chars[Math.floor(Math.random() * chars.length)];

          context.fillStyle = 'rgba(0, 255, 0, 0.8)';
          context.font = 'bold 20px monospace';
          context.textAlign = 'center';
          context.fillText(char, 16, 24);

          const texture = new THREE.CanvasTexture(canvas);
          const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: Math.random() * 0.8 + 0.2
          });

          const sprite = new THREE.Sprite(material);
          sprite.scale.set(0.5, 0.5, 1);

          // Position in column
          const x = (i - columns / 2) * 0.5;
          const y = Math.random() * 30 - 15;
          const z = Math.random() * 10 - 5;

          sprite.position.set(x, y, z);
          sprite.userData = {
            column: i,
            dropIndex: j,
            fallSpeed: Math.random() * 0.2 + 0.1,
            opacity: material.opacity,
            originalY: y
          };

          drops.push(sprite);
          matrixGroup.add(sprite);
        }
        matrixRainRef.current.push(drops);
      }

      matrixGroup.visible = false;
      scene.add(matrixGroup);
      return matrixGroup;
    };

    camera.position.set(0, 8, 20);
    camera.lookAt(0, 0, 0);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
  // Trigger matrix sequence when progress reaches 100%
  useEffect(() => {
    if (normalizedProgress >= 1 && !hasTriggeredComplete && !isMatrixMode) {
      setHasTriggeredComplete(true);
      if (onComplete) {
        onComplete();
      }

      // Start matrix sequence after a brief delay
      setTimeout(() => {
        setIsMatrixMode(true);
        startMatrixSequence();
      }, 1000);
    }
  }, [normalizedProgress, hasTriggeredComplete, isMatrixMode, onComplete]);

  const startMatrixSequence = () => {
    // Matrix sequence progression
    const matrixInterval = setInterval(() => {
      setMatrixProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(matrixInterval);
          // Call onClose after matrix sequence
          setTimeout(() => {
            if (onClose) {
              onClose();
            }
          }, 500);
          return 100;
        }
        return next;
      });
    }, 50);
  };

  // Animation loop with progress updates
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      const totalElements = torusRingsRef.current.length;
      const progressThreshold = normalizedProgress * totalElements;

      if (isMatrixMode) {
        // Matrix sequence animations
        const matrixNormalized = matrixProgress / 100;

        // Fade out torus field
        torusRingsRef.current.forEach((element) => {
          const fadeOut = 1 - matrixNormalized * 0.8;
          element.material.opacity *= fadeOut;

          // Glitch effect
          if (Math.random() < 0.1) {
            element.position.x += (Math.random() - 0.5) * 0.2;
            element.position.z += (Math.random() - 0.5) * 0.2;
          }
        });

        // Energy beam explosion effect
        if (energyBeamRef.current) {
          const explosionScale = 1 + matrixNormalized * 5;
          energyBeamRef.current.scale.setScalar(explosionScale);
          energyBeamRef.current.children.forEach((beam) => {
            beam.material.opacity = (1 - matrixNormalized) * 0.5;
          });
        }

        // Particle chaos
        particlesRef.current.forEach(particles => {
          const positions = particles.geometry.attributes.position.array;
          const colors = particles.geometry.attributes.color.array;

          for (let i = 0; i < positions.length; i += 3) {
            // Chaotic movement
            positions[i] += (Math.random() - 0.5) * matrixNormalized * 0.5;
            positions[i + 1] += (Math.random() - 0.5) * matrixNormalized * 0.5;
            positions[i + 2] += (Math.random() - 0.5) * matrixNormalized * 0.5;

            // Color shift to green
            colors[i] = Math.max(0, colors[i] - matrixNormalized * 0.5); // Less red
            colors[i + 1] = Math.min(1, colors[i + 1] + matrixNormalized * 0.3); // More green
            colors[i + 2] = Math.max(0, colors[i + 2] - matrixNormalized * 0.5); // Less blue
          }

          particles.geometry.attributes.position.needsUpdate = true;
          particles.geometry.attributes.color.needsUpdate = true;
        });

        // Show and animate matrix rain
        const matrixGroup = sceneRef.current.children.find(child => child.children.some(c => c.userData.column !== undefined));
        if (matrixGroup) {
          matrixGroup.visible = true;

          matrixRainRef.current.forEach((column, columnIndex) => {
            column.forEach((drop, dropIndex) => {
              // Falling animation
              drop.position.y -= drop.userData.fallSpeed;

              // Reset at top when falls below
              if (drop.position.y < -20) {
                drop.position.y = 15;
                drop.position.x = (columnIndex - 40) * 0.5 + (Math.random() - 0.5) * 0.2;
              }

              // Fade based on matrix progress
              const fadeIn = Math.min(1, matrixNormalized * 3);
              drop.material.opacity = drop.userData.opacity * fadeIn;

              // Random character changes
              if (Math.random() < 0.05) {
                const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
                const char = chars[Math.floor(Math.random() * chars.length)];

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 32;
                canvas.height = 32;
                context.fillStyle = `rgba(0, 255, 0, ${0.5 + Math.random() * 0.5})`;
                context.font = 'bold 20px monospace';
                context.textAlign = 'center';
                context.fillText(char, 16, 24);

                drop.material.map = new THREE.CanvasTexture(canvas);
                drop.material.needsUpdate = true;
              }
            });
          });
        }

        // Camera distortion effect
        cameraRef.current.position.x += Math.sin(time * 10) * matrixNormalized * 0.5;
        cameraRef.current.position.y += Math.sin(time * 8) * matrixNormalized * 0.3;
        cameraRef.current.lookAt(
          Math.sin(time * 5) * matrixNormalized * 2,
          Math.cos(time * 7) * matrixNormalized * 1,
          0
        );

        // Scene color shift to green
        const greenTint = matrixNormalized * 0.3;
        sceneRef.current.background = new THREE.Color(0, greenTint, 0);

      } else {
        // Normal torus field animations
        torusRingsRef.current.forEach((element, index) => {
          const isActivated = index < progressThreshold;
          const activationIntensity = isActivated ? 1 : 0.3;

          if (element.userData.type === 'verticalLine') {
            // Animate vertical lines
            const intensity = Math.sin(time * 2 + element.userData.angle * 2) * 0.5 + 0.5;
            element.material.opacity = element.userData.baseOpacity * (0.3 + intensity * 0.7) * activationIntensity;

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
            const pulseIntensity = Math.sin(time * 3 + element.userData.index * 0.5) * 0.3 + 0.7;
            element.material.opacity = element.userData.baseOpacity * pulseIntensity * activationIntensity;

            // Floating motion
            element.position.y = element.userData.originalY + Math.sin(time * 2 + element.userData.index * 0.8) * 0.2;

            if (isActivated) {
              element.material.color.setHSL(0.3, 1, 0.8);
              element.scale.setScalar(1 + Math.sin(time * 4 + element.userData.index * 0.3) * 0.1);
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
            const scaleY = 0.3 + normalizedProgress * 0.7 + Math.sin(time * 4) * 0.1;
            beam.scale.y = scaleY;
            beam.material.opacity = beam.userData.baseOpacity * (0.2 + normalizedProgress * 0.8);
          });
        }

        // Animate particles based on progress
        particlesRef.current.forEach(particles => {
          particles.rotation.y = time * 0.1;

          const positions = particles.geometry.attributes.position.array;
          const colors = particles.geometry.attributes.color.array;
          const originalColors = particles.userData.originalColors;

          for (let i = 0; i < positions.length; i += 3) {
            // Swirling motion
            const angle = time * 0.5 + i * 0.01;
            const radius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);

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
          particles.material.opacity = particles.userData.baseOpacity * (0.2 + normalizedProgress * 0.8);
        });

        // Camera orbital motion
        const cameraRadius = 20;
        cameraRef.current.position.x = Math.cos(time * 0.1) * cameraRadius;
        cameraRef.current.position.z = Math.sin(time * 0.1) * cameraRadius;
        cameraRef.current.position.y = 8 + Math.sin(time * 0.15) * 3;
        cameraRef.current.lookAt(0, 0, 0);
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [normalizedProgress, isMatrixMode, matrixProgress]); // Re-run when progress changes

  const getStatusText = () => {
    if (isMatrixMode) {
      if (matrixProgress >= 90) return 'ENTERING...';
      if (matrixProgress >= 50) return 'DECODING...';
      return 'ACCESSING MATRIX...';
    }
    if (normalizedProgress >= 1) return 'COMPLETE';
    if (normalizedProgress >= 0.8) return 'FINALIZING...';
    if (normalizedProgress >= 0.5) return 'PROCESSING...';
    if (normalizedProgress > 0) return 'LOADING...';
    return 'STANDBY';
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 text-cyan-400 font-mono">
          <div className="text-xs opacity-60">{title}</div>
          <div className="text-xs opacity-60">{subtitle}</div>
        </div>

        <div className="absolute top-4 right-4 text-cyan-400 font-mono text-right">
          <div className="text-xs opacity-60">TORUS MATRIX</div>
          <div className="text-xs opacity-60">v2.847</div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-center text-cyan-400 font-mono mb-4">
            <div className="text-lg mb-2">
              {getStatusText()}
            </div>
            <div className="text-2xl font-bold">
              {Math.round(normalizedProgress * 100)}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-out ${
                normalizedProgress >= 1
                  ? 'bg-gradient-to-r from-green-400 to-cyan-400'
                  : 'bg-gradient-to-r from-cyan-400 to-white'
              }`}
              style={{ width: `${normalizedProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Side decorations */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-mono text-xs opacity-40">
          <div className="rotate-90 origin-center">QUANTUM FIELD</div>
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-mono text-xs opacity-40">
          <div className="rotate-90 origin-center">ACTIVE</div>
        </div>
      </div>
    </div>
  );
};

// Demo component showing how to use the progress component
const TorusProgressDemo = () => {
  const [progress, setProgress] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [showComponent, setShowComponent] = React.useState(true);

  React.useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            setIsRunning(false);
            return 100;
          }
          return next;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const startProgress = () => {
    setProgress(0);
    setIsRunning(true);
    setShowComponent(true);
  };

  const resetProgress = () => {
    setProgress(0);
    setIsRunning(false);
    setShowComponent(true);
  };

  const handleComplete = () => {
    console.log('Progress completed! Starting matrix sequence...');
  };

  const handleClose = () => {
    console.log('Matrix sequence completed! You have entered the matrix.');
    // Simulate closing/hiding the component
    setTimeout(() => {
      setShowComponent(false);
      alert('Welcome to the Matrix! 🔴💊');
    }, 1000);
  };

  if (!showComponent) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-green-400 font-mono">
        <div className="text-center">
          <div className="text-4xl mb-4">WELCOME TO THE MATRIX</div>
          <div className="text-lg mb-8">Reality is now optional</div>
          <button
            onClick={() => setShowComponent(true)}
            className="px-6 py-3 bg-green-500 bg-opacity-20 border border-green-400 rounded font-mono text-green-400 hover:bg-opacity-30 transition-all"
          >
            RETURN TO SIMULATION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <TorusFieldProgress
        progress={progress}
        title="QUANTUM FIELD"
        subtitle="INITIALIZATION"
        onComplete={handleComplete}
        onClose={handleClose}
      />

      {/* Demo Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto flex gap-4">
        <button
          onClick={startProgress}
          disabled={isRunning}
          className="px-4 py-2 bg-cyan-400 bg-opacity-20 border border-cyan-400 rounded font-mono text-cyan-400 hover:bg-opacity-30 transition-all disabled:opacity-50"
        >
          START
        </button>
        <button
          onClick={resetProgress}
          className="px-4 py-2 bg-gray-600 bg-opacity-20 border border-gray-400 rounded font-mono text-gray-400 hover:bg-opacity-30 transition-all"
        >
          RESET
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => {
            setProgress(parseInt(e.target.value));
            setIsRunning(false);
          }}
          className="w-32"
        />
        <span className="text-cyan-400 font-mono text-sm self-center">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default TorusProgressDemo;
