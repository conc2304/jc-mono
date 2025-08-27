import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Maximize2, Minimize2, X } from 'lucide-react';

import { AugmentedIconButton, AugmentedIconButtonProps } from '../../atoms';
import { useWindowActions } from '../../context';
import { ensureContrast } from '@jc/utils';
import { Property } from 'csstype';

type WindowControlProps = {
  id: string;
  bgColor: Property.Color;
  windowMaximized: boolean;
  windowDocked?: 'left' | 'right' | null;
  hasMinimize?: boolean;
};

export const WindowControls = ({
  id,
  bgColor,
  hasMinimize = false,
  windowMaximized,
  windowDocked = null,
}: WindowControlProps) => {
  const { minimizeWindow, maximizeWindow, closeWindow } = useWindowActions();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

  const buttonProps: AugmentedIconButtonProps = {
    size: 'small',
    shape: 'buttonRight',
    disableRipple: true,
    sx: {
      '& svg': { strokeWidth: '2px !important' },
    },
  };

  // Determine what the maximize button should show based on window state
  const getMaximizeIcon = () => {
    if (windowMaximized) {
      // If maximized, show restore icon
      return <Minimize2 fontWeight={800} fontSize={'2rem'} strokeWidth={4} />;
    } else {
      // If windowed or docked, show maximize icon
      return <Maximize2 fontWeight={800} fontSize={'2rem'} strokeWidth={4} />;
    }
  };

  // Get tooltip/aria-label for maximize button based on state
  const getMaximizeLabel = () => {
    if (windowMaximized) {
      return 'Restore window';
    } else if (windowDocked) {
      return 'Maximize window';
    } else {
      return 'Maximize window';
    }
  };

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        height: theme.mixins.window.titleBar.height,
      })}
    >
      {!isXs && (
        <Box color={ensureContrast(theme.palette.info.main, bgColor, 3).color}>
          {hasMinimize && (
            <AugmentedIconButton
              {...buttonProps}
              color="inherit"
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(id);
              }}
              aria-label="Minimize window"
            >
              <Minimize2 />
            </AugmentedIconButton>
          )}
          <AugmentedIconButton
            {...buttonProps}
            color="inherit"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            aria-label={getMaximizeLabel()}
            title={getMaximizeLabel()}
          >
            {!hasMinimize && windowMaximized ? (
              <Minimize2 fontWeight={800} fontSize={'2rem'} strokeWidth={4} />
            ) : (
              getMaximizeIcon()
            )}
          </AugmentedIconButton>
        </Box>
      )}
      <Box color={ensureContrast(theme.palette.error.main, bgColor, 3).color}>
        <AugmentedIconButton
          {...buttonProps}
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(id);
          }}
          aria-label="Close window"
        >
          <X />
        </AugmentedIconButton>
      </Box>
    </Box>
  );
};
