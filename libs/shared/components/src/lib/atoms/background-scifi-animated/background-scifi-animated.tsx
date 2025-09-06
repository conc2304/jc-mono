import React, { useState, useEffect } from 'react';
import { Box, styled, keyframes } from '@mui/material';

// Type definitions
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface Scanline {
  id: number;
  startY: number;
}

interface DataStreamType {
  id: number;
  x: number;
  chars: string[];
}

interface SciFiBackgroundProps {
  enableParticles?: boolean;
  enableDataStreams?: boolean;
  enableScanlines?: boolean;
  enableGrid?: boolean;
  enableGradient?: boolean;
}

interface ParticleComponentProps {
  particle: Particle;
}

interface ScanlineComponentProps {
  startY: number;
}

interface DataStreamComponentProps {
  stream: DataStreamType;
}

interface StreamCharProps {
  index: number;
}

// Grid Pattern Component - Subtle background grid
const CyberGrid: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        width: '100%',
        height: '100%',
        color: 'info.main',
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.1,
          color: 'inherit',
        }}
      >
        <defs>
          <pattern
            id="cyber-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-grid)" />
      </svg>
    </Box>
  );
};

// Gradient Overlay Component - Subtle radial gradient
const GradientOverlay: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(
            ellipse at center,
            rgba(6, 182, 212, 0.03) 0%,
            rgba(15, 23, 42, 0.1) 50%,
            rgba(2, 6, 23, 0.2) 100%
          )
        `,
      }}
    />
  );
};

// Floating animation for particles
const floatParticle = keyframes`
  0% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-5px);
  }
  75% {
    transform: translateY(-30px) translateX(15px);
  }
  100% {
    transform: translateY(-40px) translateX(0px);
  }
`;

// Styled particle component
const ParticleComponent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'particle',
})<ParticleComponentProps>(({ particle, theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  backgroundColor: theme.palette.getInvertedMode('info', true),
  left: `${particle.x}%`,
  top: `${particle.y}%`,
  width: `${particle.size}px`,
  height: `${particle.size}px`,
  opacity: particle.opacity,
  animation: `${floatParticle} ${particle.duration}s infinite linear`,
  animationDelay: `${particle.delay}s`,
}));

// Floating Particles Component - Animated dots for depth
const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = (): void => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (Math.random() < 0.25 ? 20 : 5) + 1, // 25 percent chance of larger particles
          opacity: Math.random() * 0.4 + 0.1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 3,
      }}
    >
      {particles.map((particle: Particle) => (
        <ParticleComponent key={particle.id} particle={particle} />
      ))}
    </Box>
  );
};

// Scanline animation
const scanlineMove = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Styled scanline component
const ScanlineComponent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'startY',
})<ScanlineComponentProps>(({ startY, theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '1px',
  background: `linear-gradient(to right, transparent, ${theme.palette.getInvertedMode(
    'info'
  )}, transparent)`,
  opacity: 0.6,
  top: startY,
  animation: `${scanlineMove} 3s ease-in-out forwards`,
}));

// Scanline Effect Component - Sweeping horizontal lines
const ScanlineEffect: React.FC = () => {
  const [scanlines, setScanlines] = useState<Scanline[]>([]);

  useEffect(() => {
    const createScanline = (): void => {
      const id: number = Date.now() + Math.random();
      const startY: number = Math.random() * window.innerHeight;

      setScanlines((prev: Scanline[]) => [...prev, { id, startY }]);

      // Remove scanline after animation
      setTimeout(() => {
        setScanlines((prev: Scanline[]) =>
          prev.filter((line: Scanline) => line.id !== id)
        );
      }, 3000);
    };

    // Create scanlines periodically
    const interval: NodeJS.Timeout = setInterval(createScanline, 8000);

    // Create initial scanline
    const initialTimeout: NodeJS.Timeout = setTimeout(createScanline, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 5,
      }}
    >
      {scanlines.map((scanline: Scanline) => (
        <ScanlineComponent key={scanline.id} startY={scanline.startY} />
      ))}
    </Box>
  );
};

// Stream falling animation
const streamFall = keyframes`
  to {
    transform: translateY(calc(100vh + 100px));
  }
`;

// Styled stream component
const DataStreamComponent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'stream',
})<DataStreamComponentProps>(({ stream, theme }) => ({
  position: 'absolute',
  fontSize: '12px',
  color: theme.palette.info.main,
  opacity: 0.2,
  fontFamily: 'monospace',
  left: `${stream.x}%`,
  top: '-100px',
  animation: `${streamFall} 6s linear forwards`,
}));

// Styled stream character
const StreamChar = styled(Box)<StreamCharProps>(({ index }) => ({
  animationDelay: `${index * 0.1}s`,
  opacity: 1 - index * 0.1,
}));

// Data Stream Effect Component - Flowing code-like elements
const DataStreams: React.FC = () => {
  const [streams, setStreams] = useState<DataStreamType[]>([]);

  useEffect(() => {
    const characters: string = '01アイウエオカキクケコサシスセソ';

    const createStream = (): void => {
      const id: number = Date.now() + Math.random();
      const x: number = Math.random() * 100;
      const chars: string[] = Array.from(
        { length: 10 },
        () => characters[Math.floor(Math.random() * characters.length)]
      );

      setStreams((prev: DataStreamType[]) => [...prev, { id, x, chars }]);

      setTimeout(() => {
        setStreams((prev: DataStreamType[]) =>
          prev.filter((stream: DataStreamType) => stream.id !== id)
        );
      }, 6000);
    };

    const interval: NodeJS.Timeout = setInterval(createStream, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 4,
      }}
    >
      {streams.map((stream: DataStreamType) => (
        <DataStreamComponent key={stream.id} stream={stream}>
          {stream.chars.map((char: string, index: number) => (
            <StreamChar key={index} index={index}>
              {char}
            </StreamChar>
          ))}
        </DataStreamComponent>
      ))}
    </Box>
  );
};

// Combined Background Component
const SciFiBackground: React.FC<SciFiBackgroundProps> = ({
  enableParticles = true,
  enableDataStreams = true,
  enableScanlines = true,
  enableGrid = true,
  enableGradient = true,
}) => {
  return (
    <>
      {enableGrid && <CyberGrid />}
      {enableGradient && <GradientOverlay />}
      {enableParticles && <FloatingParticles />}
      {enableDataStreams && <DataStreams />}
      {enableScanlines && <ScanlineEffect />}
    </>
  );
};

export {
  SciFiBackground,
  CyberGrid,
  GradientOverlay,
  FloatingParticles,
  DataStreams,
  ScanlineEffect,
};
export type { SciFiBackgroundProps, Particle, Scanline, DataStreamType };
