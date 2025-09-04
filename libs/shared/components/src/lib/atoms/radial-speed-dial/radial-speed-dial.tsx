import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Backdrop,
} from '@mui/material';
import { Close, Brightness4 } from '@mui/icons-material';

// Types and Interfaces
interface TransitionConfig {
  start: {
    opacity: number;
    scale: number;
  };
  end: {
    opacity: number;
    scale: number;
  };
}

interface SpeedDialAction {
  key: string;
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  isActive?: boolean;
  isResolved?: boolean;
}

interface RadialSpeedDialProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  actions: SpeedDialAction[];
  arcStartDegree?: number;
  arcEndDegree?: number;
  itemSize?: number;
  radiusMultiplier?: number;
  mainButtonSize?: number;
  animationDuration?: number;
  staggerDelay?: number;
  transitionConfig?: TransitionConfig;
}

interface ArcPosition {
  x: number;
  y: number;
}

const RadialSpeedDial: React.FC<RadialSpeedDialProps> = ({
  isOpen,
  onToggle,
  onClose,
  actions = [],
  arcStartDegree = 225,
  arcEndDegree = 315,
  itemSize = 40,
  radiusMultiplier = 1.8,
  mainButtonSize = 56,
  animationDuration = 300,
  staggerDelay = 50,
  transitionConfig = {
    start: { opacity: 0, scale: 0 },
    end: { opacity: 1, scale: 1 },
  },
}) => {
  const theme = useTheme();

  const calculateArcPositions = (): ArcPosition[] => {
    const itemCount = actions.length;
    if (itemCount === 0) return [];

    const radius = itemSize * radiusMultiplier;

    // Convert degrees to radians
    const startRad = (arcStartDegree * Math.PI) / 180;
    const endRad = (arcEndDegree * Math.PI) / 180;

    // Handle crossing 0/360 degree boundary
    let angleRange: number;
    if (arcEndDegree < arcStartDegree) {
      angleRange = ((360 - arcStartDegree + arcEndDegree) * Math.PI) / 180;
    } else {
      angleRange = endRad - startRad;
    }

    const angleStep = itemCount > 1 ? angleRange / (itemCount - 1) : 0;

    return actions.map((_, index) => {
      let currentAngle = startRad + angleStep * index;

      // Handle angle wrapping for boundary crossing
      if (arcEndDegree < arcStartDegree && currentAngle > Math.PI) {
        currentAngle -= 2 * Math.PI;
      }

      // Calculate position (0 degrees = North, clockwise)
      const x = radius * Math.sin(currentAngle);
      const y = -radius * Math.cos(currentAngle);

      return { x, y };
    });
  };

  const arcPositions = calculateArcPositions();

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      {/* Backdrop */}
      <Backdrop
        open={isOpen}
        onClick={onClose}
        sx={{
          backgroundColor: alpha(theme.palette.common.black, 0.3),
          zIndex: theme.zIndex.modal - 1,
        }}
      />

      {/* Action Buttons */}
      {actions.map((action, index) => {
        const position = arcPositions[index];
        if (!position) return null;

        const delay = isOpen
          ? index * staggerDelay
          : (actions.length - 1 - index) * Math.max(staggerDelay / 2, 10);

        const currentTransition = isOpen
          ? transitionConfig.end
          : transitionConfig.start;

        return (
          <Tooltip key={action.key} title={action.tooltip} placement="top">
            <IconButton
              onClick={() => {
                action.onClick();
                onClose();
              }}
              size="small"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: itemSize,
                height: itemSize,
                zIndex: theme.zIndex.modal,
                transform: isOpen
                  ? `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${currentTransition.scale})`
                  : `translate(-50%, -50%) translate(0px, 0px) scale(${currentTransition.scale})`,
                opacity: currentTransition.opacity,
                transition: theme.transitions.create(['transform', 'opacity'], {
                  duration: animationDuration,
                  easing: theme.transitions.easing.easeInOut,
                  delay: delay,
                }),
                bgcolor: action.isActive
                  ? alpha(theme.palette.getInvertedMode('primary'), 0.7)
                  : theme.palette.background.paper,
                border: `2px solid ${
                  action.isResolved
                    ? theme.palette.warning.main
                    : action.isActive
                    ? theme.palette.primary.main
                    : theme.palette.divider
                }`,
                color: action.isActive
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  bgcolor: action.isActive
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.action.hover, 0.08),
                  transform: isOpen
                    ? `translate(-50%, -50%) translate(${position.x}px, ${
                        position.y
                      }px) scale(${Math.min(
                        currentTransition.scale * 1.1,
                        1.2
                      )})`
                    : `translate(-50%, -50%) translate(0px, 0px) scale(${currentTransition.scale})`,
                },
              }}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        );
      })}

      {/* Main Button */}
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'relative',
          width: mainButtonSize,
          height: mainButtonSize,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          zIndex: theme.zIndex.modal + 1,
          boxShadow: theme.shadows[6],
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: theme.transitions.create(
            ['transform', 'background-color', '--aug-tl', '--aug-br'],
            {
              duration: animationDuration,
              easing: theme.transitions.easing.easeInOut,
            }
          ),
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
            boxShadow: theme.shadows[8],
          },

          '--aug-tl': isOpen ? '0.75rem' : '0rem',
          '--aug-br': isOpen ? '0.75rem' : '0rem',
          // transition: '--ag-tl 200ms ease-in',
        }}
        data-augmented-ui="tl-clip br-clip"
      >
        {isOpen ? <Close /> : <Brightness4 />}
      </IconButton>
    </Box>
  );
};

export { RadialSpeedDial };
export type { RadialSpeedDialProps, TransitionConfig, SpeedDialAction };
