import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, Stack, keyframes } from '@mui/material';
import { SkipNext, SkipPrevious, PowerSettingsNew } from '@mui/icons-material';

// Color configuration interface
interface ColorConfig {
  primary: string; // Main accent color (cyan by default)
  secondary: string; // Secondary accent color (pink/red by default)
  background: string; // Main background gradient
  border: string; // Border colors
  text: string; // Primary text color
  textSecondary: string; // Secondary text color
  screenOff: string; // Color when screen is off
  buttonDisabled: string; // Disabled button color
}

// Default color configuration
const DEFAULT_COLORS: ColorConfig = {
  primary: '#00ffff',
  secondary: '#ff0060',
  background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)',
  border: '#333',
  text: '#00ffff',
  textSecondary: '#ff0060',
  screenOff: '#333',
  buttonDisabled: '#333',
};

// Keyframe animations factory
const createAnimations = (colors: ColorConfig) => {
  const scanlineAnimation = keyframes`
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  `;

  const staticNoise = keyframes`
    0%, 100% { opacity: 0.05; }
    50% { opacity: 0.15; }
  `;

  const crtFlicker = keyframes`
    0%, 100% { opacity: 1; }
    98% { opacity: 1; }
    99% { opacity: 0.98; }
  `;

  const glowPulse = keyframes`
    0%, 100% { box-shadow: 0 0 20px ${colors.primary}40, inset 0 0 20px ${colors.primary}20; }
    50% { box-shadow: 0 0 40px ${colors.primary}60, inset 0 0 30px ${colors.primary}30; }
  `;

  const buttonGlow = keyframes`
    0%, 100% { box-shadow: 0 0 10px ${colors.secondary}40; }
    50% { box-shadow: 0 0 20px ${colors.secondary}60; }
  `;

  const channelTransition = keyframes`
    0% { transform: scaleY(1); opacity: 1; }
    50% { transform: scaleY(0.1); opacity: 0.8; }
    100% { transform: scaleY(1); opacity: 1; }
  `;

  const powerTransition = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.1, 0.01); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  `;

  return {
    scanlineAnimation,
    staticNoise,
    crtFlicker,
    glowPulse,
    buttonGlow,
    channelTransition,
    powerTransition,
  };
};

interface RetroVideoPanelProps {
  gifs: string[];
  transitionImage?: string;
  transitionTime?: number; // in milliseconds
  width?: string | number;
  height?: string | number;
  title?: string;
  colorConfig?: Partial<ColorConfig>;
}

export const RetroVideoPanel: React.FC<RetroVideoPanelProps> = ({
  gifs = [],
  transitionImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0ibm9pc2UiPjxmZVR1cmJ1bGVuY2UgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSI0IiByZXN1bHQ9Im5vaXNlIiBzZWVkPSIxIi8+PGZlQ29sb3JNYXRyaXggaW49Im5vaXNlIiB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMDAwIi8+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzAwZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Q0hBTk5FTCBTV0lUQ0hJTkc8L3RleHQ+PC9zdmc+',
  transitionTime = 800,
  width = '600px',
  height = '400px',
  title,
  colorConfig = {},
}) => {
  // Merge provided colors with defaults
  const colors: ColorConfig = { ...DEFAULT_COLORS, ...colorConfig };

  // Create animations with current color scheme
  const animations = createAnimations(colors);

  const [currentChannel, setCurrentChannel] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [isPowerTransitioning, setIsPowerTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const powerTimeoutRef = useRef<NodeJS.Timeout>();

  const switchChannel = (direction: 'next' | 'prev') => {
    if (gifs.length === 0 || isTransitioning || isPowerTransitioning) return;

    setIsTransitioning(true);

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Set new channel after transition
    transitionTimeoutRef.current = setTimeout(() => {
      const newChannel =
        direction === 'next'
          ? (currentChannel + 1) % gifs.length
          : currentChannel === 0
          ? gifs.length - 1
          : currentChannel - 1;

      setCurrentChannel(newChannel);
      setIsTransitioning(false);
    }, transitionTime);
  };

  const togglePower = () => {
    if (isPowerTransitioning) return;

    setIsPowerTransitioning(true);

    // Clear any existing timeout
    if (powerTimeoutRef.current) {
      clearTimeout(powerTimeoutRef.current);
    }

    if (isPoweredOn) {
      // Powering off: show transition first, then turn off
      powerTimeoutRef.current = setTimeout(() => {
        setIsPoweredOn(false);
        setIsPowerTransitioning(false);
      }, transitionTime);
    } else {
      // Powering on: turn on immediately and show transition
      setIsPoweredOn(true);
      powerTimeoutRef.current = setTimeout(() => {
        setIsPowerTransitioning(false);
      }, transitionTime * 2);
    }
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (powerTimeoutRef.current) {
        clearTimeout(powerTimeoutRef.current);
      }
    };
  }, []);

  // Determine what to display
  const getDisplayImage = () => {
    if (!isPoweredOn) return null;
    if (isPowerTransitioning || isTransitioning) return transitionImage;
    return gifs[currentChannel];
  };

  const displayImage = getDisplayImage();

  return (
    <Stack
      data-augmented-ui="both tr-clip"
      sx={{
        '--aug-border-all': '3px',
        '--aug-border-bg': colors.border,
        '--aug-inlay-bg': colors.background,
        '--aug-inlay-opacity': 0.9,

        width,
        height,
        // background: 'black',
        // border: `3px solid ${colors.border}`,
        padding: '20px',
        position: 'relative',
        fontFamily: '"Courier New", monospace',
        animation: `${animations.glowPulse} 4s ease-in-out infinite`,
        // '&::before': {
        //   content: '""',
        //   position: 'absolute',
        //   inset: '10px',
        //   border: `2px solid ${colors.primary}`,
        //   opacity: 0.6,
        // },
      }}
    >
      {/* Header */}
      {title && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            pb: 1,
            borderBottom: `1px solid ${colors.primary}60`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.text,
              fontFamily: '"Courier New", monospace',
              fontWeight: 'bold',
              textShadow: `0 0 10px ${colors.text}`,
              letterSpacing: '2px',
            }}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Typography
              variant="caption"
              sx={{
                color: colors.textSecondary,
                fontFamily: '"Courier New", monospace',
                textShadow: `0 0 5px ${colors.textSecondary}`,
              }}
            >
              CH: {String(currentChannel + 1).padStart(2, '0')}
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Main Display */}
      <Box
        className="MainDisplay--container"
        data-augmented-ui="both tr-clip"
        sx={{
          '--aug-border-all': '2px',
          '--aug-border-bg': colors.border,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: colors.screenOff,
            border: `2px solid ${colors.border}`,

            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            animation: `${animations.crtFlicker} 0.15s ease-in-out infinite`,
          }}
        >
          {/* CRT Screen Effect */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%)',
              backgroundSize: '100% 4px',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Scanline Animation */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${colors.primary}80, transparent)`,
              animation: `${animations.scanlineAnimation} 3s linear infinite`,
              zIndex: 4,
            }}
          />

          {/* Static Noise Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
              animation: `${animations.staticNoise} 0.1s linear infinite`,
              zIndex: 2,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              background: `linear-gradient(45deg, ${colors.primary}, black)`,
              mixBlendMode: 'color',
              opacity: 0.75,
              inset: 0,
              zIndex: 2,
            }}
          />

          {/* Video/Image Content */}
          {isPoweredOn && displayImage ? (
            <Box
              component="img"
              src={displayImage}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                filter:
                  'brightness(0.9) contrast(1.1) saturate(1.2) grayscale(1)',
                animation:
                  isPowerTransitioning || isTransitioning
                    ? `${
                        isPowerTransitioning
                          ? animations.powerTransition
                          : animations.channelTransition
                      } ${transitionTime}ms ease-in-out`
                    : 'none',
                zIndex: 1,
              }}
              onError={(e) => {
                console.error('Failed to load image:', displayImage);
              }}
            />
          ) : isPoweredOn ? (
            <Typography
              sx={{
                color: colors.screenOff,
                fontSize: '2rem',
                fontFamily: '"Courier New", monospace',
                textAlign: 'center',
              }}
            >
              NO SIGNAL
            </Typography>
          ) : (
            <Typography
              sx={{
                color: colors.screenOff,
                fontSize: '2rem',
                fontFamily: '"Courier New", monospace',
                textAlign: 'center',
              }}
            >
              ◼
            </Typography>
          )}

          {/* Power Off Overlay */}
          {!isPoweredOn && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: colors.screenOff,
                zIndex: 5,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Control Panel */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          pt: 1,
          borderTop: `1px solid ${colors.primary}60`,
        }}
      >
        {/* Navigation Controls */}
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => switchChannel('prev')}
            disabled={!isPoweredOn || isTransitioning || isPowerTransitioning}
            size="small"
            sx={{
              color: colors.secondary,
              border: `1px solid ${colors.secondary}`,
              animation: `${animations.buttonGlow} 2s ease-in-out infinite`,
              '&:hover': {
                background: `${colors.secondary}20`,
                boxShadow: `0 0 15px ${colors.secondary}`,
              },
              '&:disabled': {
                color: colors.buttonDisabled,
                borderColor: colors.buttonDisabled,
                animation: 'none',
              },
            }}
          >
            <SkipPrevious />
          </IconButton>

          <IconButton
            onClick={() => switchChannel('next')}
            disabled={!isPoweredOn || isTransitioning || isPowerTransitioning}
            size="small"
            sx={{
              color: colors.secondary,
              border: `1px solid ${colors.secondary}`,
              animation: `${animations.buttonGlow} 2s ease-in-out infinite 0.5s`,
              '&:hover': {
                background: `${colors.secondary}20`,
                boxShadow: `0 0 15px ${colors.secondary}`,
              },
              '&:disabled': {
                color: colors.buttonDisabled,
                borderColor: colors.buttonDisabled,
                animation: 'none',
              },
            }}
          >
            <SkipNext />
          </IconButton>
        </Stack>

        {/* Power and Settings */}
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={togglePower}
            disabled={isPowerTransitioning}
            sx={{
              color: isPoweredOn ? colors.primary : colors.buttonDisabled,
              border: `1px solid ${
                isPoweredOn ? colors.primary : colors.buttonDisabled
              }`,
              '&:hover': {
                background: isPoweredOn
                  ? `${colors.primary}20`
                  : `${colors.buttonDisabled}20`,
                boxShadow: `0 0 15px ${
                  isPoweredOn ? colors.primary : colors.buttonDisabled
                }`,
              },
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            <PowerSettingsNew />
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );
};
