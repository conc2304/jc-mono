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
  hasMinimize?: boolean;
};

export const WindowControls = ({
  id,
  bgColor,
  hasMinimize = false,
  windowMaximized,
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
          >
            {!hasMinimize && windowMaximized ? (
              <Minimize2 fontWeight={800} fontSize={'2rem'} strokeWidth={4} />
            ) : (
              <Maximize2 fontWeight={800} fontSize={'2rem'} strokeWidth={4} />
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
        >
          <X />
        </AugmentedIconButton>
      </Box>
    </Box>
  );
};
