import React, { useState } from 'react';
import {
  IconButton,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Breakpoint,
} from '@mui/material';
import {
  RadialSpeedDial,
  SpeedDialAction,
  TransitionConfig,
} from '@jc/ui-components';

interface ResponsiveAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isResolved?: boolean;
}

interface SpeedDialResponsiveProps {
  actions: ResponsiveAction[];
  direction?: 'row' | 'column';
  spacing?: number;
  // RadialSpeedDial props
  arcStartDegree?: number;
  arcEndDegree?: number;
  itemSize?: number;
  radiusMultiplier?: number;
  staggerDelay?: number;
  transitionConfig?: TransitionConfig;
  breakpoint?: number | Breakpoint;
}

const SpeedDialResponsive: React.FC<SpeedDialResponsiveProps> = ({
  actions,
  direction = 'row',
  spacing = 1,
  arcStartDegree = 180,
  arcEndDegree = 270,
  itemSize = 40,
  radiusMultiplier = 1.8,
  staggerDelay = 50,
  breakpoint = 'sm',
  transitionConfig = {
    start: { opacity: 0, scale: 0 },
    end: { opacity: 1, scale: 1 },
  },
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(breakpoint));
  const [speedDialOpen, setSpeedDialOpen] = useState<boolean>(false);

  const handleSpeedDialClose = (): void => {
    setSpeedDialOpen(false);
  };

  const handleSpeedDialToggle = (): void => {
    setSpeedDialOpen(!speedDialOpen);
  };

  if (!isMobile) {
    // Desktop/tablet layout - horizontal or vertical stack
    return (
      <Stack direction={direction} spacing={spacing}>
        {actions.map(({ key, icon, label, onClick, isActive, isResolved }) => (
          <Tooltip key={key} title={label}>
            <IconButton
              onClick={onClick}
              size="small"
              sx={{
                width: itemSize,
                height: itemSize,
                border: '2px solid',
                borderColor: isResolved
                  ? alpha(theme.palette.warning.main, 0.5)
                  : isActive
                  ? theme.palette.primary.main
                  : theme.palette.divider,
                bgcolor: isActive
                  ? alpha(theme.palette.primary.main, 0.1)
                  : 'transparent',
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                transition: theme.transitions.create(
                  ['background-color', 'border-color', 'color'],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                '&:hover': {
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.action.hover, 0.04),
                },
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    );
  }

  // Mobile layout - radial SpeedDial
  const speedDialActions: SpeedDialAction[] = actions.map(
    ({ key, icon, label, onClick, isActive, isResolved }) => ({
      key,
      icon,
      tooltip: label,
      onClick,
      isActive,
      isResolved,
    })
  );

  return (
    <RadialSpeedDial
      isOpen={speedDialOpen}
      onToggle={handleSpeedDialToggle}
      onClose={handleSpeedDialClose}
      actions={speedDialActions}
      arcStartDegree={arcStartDegree}
      arcEndDegree={arcEndDegree}
      itemSize={itemSize}
      radiusMultiplier={radiusMultiplier}
      staggerDelay={staggerDelay}
      transitionConfig={transitionConfig}
    />
  );
};

export { SpeedDialResponsive };
export type { ResponsiveAction, SpeedDialResponsiveProps };
