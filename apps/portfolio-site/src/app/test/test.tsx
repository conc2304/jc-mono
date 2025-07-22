'use client';
// First, install GSAP in your project:
// npm install gsap

import React, { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';

// Register the plugin
gsap.registerPlugin(Physics2DPlugin, useGSAP);

const ProjectileLauncher = () => {
  const containerRef = useRef(null);
  const launcherRef = useRef(null);
  const [launchCount, setLaunchCount] = useState(0);
  const [power, setPower] = useState(50);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(980);
  const [stats, setStats] = useState('Click launcher to fire!');

  const { contextSafe } = useGSAP({ scope: containerRef });

  const createProjectile = useCallback(() => {
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    projectile.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background: linear-gradient(45deg, #feca57, #ff9ff3);
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      z-index: 10;
      left: 80px;
      top: ${window.innerHeight - 80}px;
    `;

    containerRef.current.appendChild(projectile);
    return projectile;
  }, []);

  const createTrail = useCallback((x, y) => {
    const trail = document.createElement('div');
    trail.className = 'trail';
    trail.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: rgba(254, 202, 87, 0.6);
      border-radius: 50%;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
    `;

    containerRef.current.appendChild(trail);

    gsap.to(trail, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      onComplete: () => trail.remove(),
    });
  }, []);

  const createImpactEffect = useCallback((x, y) => {
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: #ff6b6b;
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
      `;

      containerRef.current.appendChild(particle);

      const particleAngle = (i / 8) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;

      gsap.to(particle, {
        x: Math.cos(particleAngle) * distance,
        y: Math.sin(particleAngle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      });
    }
  }, []);

  const launchProjectile = contextSafe(() => {
    const newLaunchCount = launchCount + 1;
    setLaunchCount(newLaunchCount);

    const projectile = createProjectile();

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;

    // Calculate initial velocity components
    const velocity = power * 15;
    const velocityX = velocity * Math.cos(angleRad);
    const velocityY = -velocity * Math.sin(angleRad);

    // Calculate theoretical stats
    const maxDistance =
      (velocity * velocity * Math.sin(2 * angleRad)) / gravity;
    const flightTime = (2 * velocity * Math.sin(angleRad)) / gravity;

    // Update stats
    setStats(`
      Launch #${newLaunchCount}
      Power: ${power}
      Angle: ${angle}°
      Gravity: ${gravity}
      Initial Velocity: ${velocity.toFixed(1)}
      Predicted Distance: ${maxDistance.toFixed(1)}px
      Predicted Flight Time: ${flightTime.toFixed(2)}s
    `);

    // Create trail effect
    let trailInterval = setInterval(() => {
      const rect = projectile.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      createTrail(
        rect.left - containerRect.left + 10,
        rect.top - containerRect.top + 10
      );
    }, 50);

    // Animate with Physics2D plugin
    gsap.to(projectile, {
      duration: 10,
      physics2D: {
        velocity: velocityX,
        velocityY: velocityY,
        gravity: gravity,
      },
      onUpdate: function () {
        const rect = projectile.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        if (
          rect.top > window.innerHeight - 30 ||
          rect.left > window.innerWidth ||
          rect.left < -50
        ) {
          this.kill();
          clearInterval(trailInterval);

          if (rect.top > window.innerHeight - 30) {
            createImpactEffect(
              rect.left - containerRect.left,
              window.innerHeight - containerRect.top - 30
            );
          }

          gsap.to(projectile, {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            onComplete: () => projectile.remove(),
          });
        }
      },
    });

    // Launcher recoil effect
    gsap.to(launcherRef.current, {
      rotation: -15,
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    });
  });

  // Initial launcher animation
  useGSAP(
    () => {
      gsap.from(launcherRef.current, {
        scale: 0,
        rotation: 360,
        duration: 1,
        ease: 'back.out(1.7)',
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Ground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30px',
          background: 'linear-gradient(to top, #2d5016, #4a7c1e)',
        }}
      />

      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255,255,255,0.9)',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Launch Power: {power}
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={power}
            onChange={(e) => setPower(parseInt(e.target.value))}
            style={{ width: '150px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Launch Angle: {angle}°
          </label>
          <input
            type="range"
            min="10"
            max="80"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            style={{ width: '150px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            Gravity: {gravity}
          </label>
          <input
            type="range"
            min="200"
            max="1500"
            value={gravity}
            onChange={(e) => setGravity(parseInt(e.target.value))}
            style={{ width: '150px' }}
          />
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255,255,255,0.9)',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          minWidth: '200px',
          whiteSpace: 'pre-line',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Launch Stats</h3>
        <div>{stats}</div>
      </div>

      {/* Launcher */}
      <div
        ref={launcherRef}
        onClick={launchProjectile}
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          transition: 'transform 0.1s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px',
          textAlign: 'center',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.target.style.transform = 'scale(1.1)')}
      >
        🚀
        <br />
        LAUNCH
      </div>
    </div>
  );
};

export default ProjectileLauncher;
