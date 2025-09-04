import React, { ReactNode, useState } from 'react';
import { useTheme, useMediaQuery, Breakpoint } from '@mui/material';
import {
  AugmentedButtonGroup,
  AugmentedButtonGroupProps,
  ButtonGroupItem,
  RadialSpeedDial,
  RadialSpeedDialProps,
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

interface SpeedDialSlotProps {
  speedDial?: Partial<RadialSpeedDialProps>;
  buttonGroup?: Partial<AugmentedButtonGroupProps>;
}

interface SpeedDialResponsiveProps {
  actions: ResponsiveAction[];
  direction?: 'row' | 'column';
  spacing?: number;
  // RadialSpeedDial props (can be overridden by slotProps.speedDial)
  arcStartDegree?: number;
  arcEndDegree?: number;
  itemSize?: number;
  radiusMultiplier?: number;
  staggerDelay?: number;
  transitionConfig?: TransitionConfig;
  breakpoint?: number | Breakpoint;
  // Slot props for customizing individual components
  slotProps?: SpeedDialSlotProps;
  // AugmentedButtonGroup props (can be overridden by slotProps.buttonGroup)
  upperClip?: string;
  lowerClip?: string;
  activeColor?: string;
  padding?: string;
  mainIcon?: ReactNode;
  openIcon?: ReactNode;
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
  slotProps,
  upperClip = '8px',
  lowerClip = '8px',
  activeColor = 'primary.main',
  padding = '12px',
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

  // Transform ResponsiveAction[] to ButtonGroupItem[]
  const buttonGroupItems: ButtonGroupItem[] = actions.map(
    ({ key, icon, label, onClick, isActive, isResolved }) => ({
      key,
      icon,
      label,
      onClick,
      isActive,
      isResolved,
    })
  );

  if (!isMobile) {
    // Desktop/tablet layout - use AugmentedButtonGroup
    const buttonGroupProps: AugmentedButtonGroupProps = {
      items: buttonGroupItems,
      direction,
      spacing,
      upperClip,
      lowerClip,
      activeColor,
      padding,
      // itemSize,
      // Override with slotProps.buttonGroup if provided
      ...slotProps?.buttonGroup,
    };

    return <AugmentedButtonGroup {...buttonGroupProps} />;
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

  // Merge default speedDial props with slotProps.speedDial
  const speedDialProps = {
    arcStartDegree,
    arcEndDegree,
    itemSize,
    radiusMultiplier,
    staggerDelay,
    transitionConfig,
    ...slotProps?.speedDial,
  };

  return (
    <RadialSpeedDial
      isOpen={speedDialOpen}
      onToggle={handleSpeedDialToggle}
      onClose={handleSpeedDialClose}
      actions={speedDialActions}
      {...speedDialProps}
    />
  );
};

export { SpeedDialResponsive, RadialSpeedDial };
export type {
  ResponsiveAction,
  SpeedDialResponsiveProps,
  SpeedDialSlotProps,
  TransitionConfig,
  SpeedDialAction,
};
