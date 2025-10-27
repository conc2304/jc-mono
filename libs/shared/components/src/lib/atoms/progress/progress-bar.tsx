import { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

export const ProgressBar = ({
  progress = 0,
  indeterminate = false,
  width = '100%',
  height = '100%',
  textColor = '#00ff88',
  color = '#00ff88',
  glowColor = '#00ffff',
  backgroundColor = 'rgba(0, 0, 0, 0.8)',
  borderColor = '#00ff88',
  progressFillColor = '#00ff8850',
  showPercentage = true,
  showLabel = true,
  label = 'PROCESSING',
  energyLines = true,
  pulseEffect = true,
  gridPattern = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const animationRef = useRef<number>(null);

  // Update progress ref when prop changes
  useEffect(() => {
    progressRef.current = Math.max(0, Math.min(100, progress));
  }, [progress]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Animation loop for indeterminate and pulse effects
    const animate = () => {
      const currentProgress = indeterminate
        ? (Math.sin(Date.now() * 0.003) + 1) * 50 // Smooth oscillation 0-100%
        : progressRef.current;

      // Update progress fill
      const progressFill: HTMLElement | null =
        container.querySelector('.progress-fill');
      if (progressFill) {
        progressFill.style.width = `${currentProgress}%`;

        // Dynamic glow intensity
        const glowIntensity = currentProgress / 100;
        progressFill.style.boxShadow = `
          0 0 ${10 + glowIntensity * 20}px ${glowColor},
          inset 0 0 ${8 + glowIntensity * 12}px rgba(255, 255, 255, ${
          glowIntensity * 0.2
        })
        `;
      }

      // Update border glow
      const mainContainer: HTMLElement | null =
        container.querySelector('.main-container');
      if (mainContainer && pulseEffect) {
        const glowIntensity = currentProgress / 100;
        const pulseGlow = Math.sin(Date.now() * 0.004) * 0.3 + 0.7;
        mainContainer.style.boxShadow = `
          0 0 ${5 + glowIntensity * 15 * pulseGlow}px ${color},
          inset 0 0 ${3 + glowIntensity * 8}px rgba(0, 255, 136, ${
          glowIntensity * 0.1
        })
        `;
      }

      // Update energy lines
      if (energyLines) {
        const lines: NodeListOf<HTMLElement> =
          container.querySelectorAll('.energy-line');
        lines.forEach((line, index) => {
          const delay = index * 0.3;
          const flow = Math.sin(Date.now() * 0.005 + delay) * 0.5 + 0.5;
          line.style.opacity = (0.2 + flow * 0.6).toString();
          line.style.transform = `translateX(${flow * 100 - 50}%)`;
        });
      }

      if (indeterminate || pulseEffect || energyLines) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [indeterminate, pulseEffect, energyLines, color, glowColor]);

  // Update static progress when not indeterminate
  useEffect(() => {
    if (!indeterminate && containerRef.current) {
      const progressFill: HTMLElement | null =
        containerRef.current.querySelector('.progress-fill');
      if (progressFill) {
        progressFill.style.width = `${progress}%`;

        const glowIntensity = progress / 100;
        progressFill.style.boxShadow = `
          0 0 ${10 + glowIntensity * 20}px ${glowColor},
          inset 0 0 ${8 + glowIntensity * 12}px rgba(255, 255, 255, ${
          glowIntensity * 0.2
        })
        `;
      }
    }
  }, [progress, indeterminate, glowColor]);

  return (
    <Box
      className={`flat-scifi-progress ${className}`}
      sx={{ width: width, height: height }}
      ref={containerRef}
    >
      <Box
        className="main-container"
        sx={{
          width: width,
          height: height,
          background: backgroundColor,
          border: `2px solid ${borderColor}`,
          // borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.05s ease-out',
        }}
      >
        {/* Grid Pattern Background */}
        {gridPattern && (
          <Box
            className="grid-pattern"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(${color}22 1px, transparent 1px),
                linear-gradient(90deg, ${color}22 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.3,
            }}
          />
        )}

        {/* Energy Lines */}
        {energyLines && (
          <>
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                className="energy-line"
                style={{
                  top: `${25 + i * 25}%`,
                }}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                  left: 0,
                  opacity: 0.3,
                  transition: 'all 0.3s ease-out',
                }}
              />
            ))}
          </>
        )}

        {/* Progress Fill */}
        <Box
          className="progress-fill"
          style={{
            width: `${indeterminate ? 50 : progress}%`,
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            opacity: 0.75,
            background: progressFillColor,
            boxShadow: `0 0 20px ${glowColor}`,
            transition: indeterminate ? 'none' : 'width 0.3s ease-out',
          }}
        />

        {/* Corner Decorations */}
        <Box
          className="corner-decoration top-left"
          sx={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '12px',
            height: '12px',
            border: `1px solid ${color}`,
            borderBottom: 'none',
            borderRight: 'none',
            opacity: 0.6,
          }}
        />
        <Box
          className="corner-decoration top-right"
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '12px',
            height: '12px',
            border: `1px solid ${color}`,
            borderBottom: 'none',
            borderLeft: 'none',
            opacity: 0.6,
          }}
        />
        <Box
          className="corner-decoration bottom-left"
          sx={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            width: '12px',
            height: '12px',
            border: `1px solid ${color}`,
            borderTop: 'none',
            borderRight: 'none',
            opacity: 0.6,
          }}
        />
        <Box
          className="corner-decoration bottom-right"
          sx={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '12px',
            height: '12px',
            border: `1px solid ${color}`,
            borderTop: 'none',
            borderLeft: 'none',
            opacity: 0.6,
          }}
        />

        {/* Label */}
        {showLabel && (
          <Typography
            className="progress-label"
            variant="monospace"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '16px',
              transform: 'translateY(-50%)',
              color: color,
              textShadow: `0 0 300px ${textColor}`,
              opacity: 0.9,
              zIndex: 10,
              textTransform: 'uppercase',
            }}
          >
            {indeterminate ? 'LOADING...' : label}
          </Typography>
        )}

        {/* Percentage */}
        {showPercentage && (
          <Typography
            variant="monospace"
            className="progress-percentage"
            sx={{
              position: 'absolute',
              top: '50%',
              right: '32px',
              transform: 'translateY(-50%)',
              color: color,
              textShadow: `0 0 8px ${color}`,
              zIndex: 10,
              textTransform: 'uppercase',
            }}
          >
            {indeterminate ? '...' : `${Math.round(progress)}%`}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
