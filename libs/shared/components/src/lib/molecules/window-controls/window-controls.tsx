import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Maximize2, Minimize2, X } from 'lucide-react';

import { AugmentedIconButton, AugmentedIconButtonProps } from '../../atoms';
import { useWindowActions } from '../../context';

type WindowControlProps = {
  id: string;
  isActive: boolean;
};

export const WindowControls = ({ id, isActive }: WindowControlProps) => {
  const { minimizeWindow, maximizeWindow, closeWindow } = useWindowActions();
  // Responsive breakpoints
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
        opacity: isActive ? 1 : 0.6,
      })}
    >
      {!isXs && (
        <>
          <AugmentedIconButton
            {...buttonProps}
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
          >
            <Minimize2 />
          </AugmentedIconButton>
          <AugmentedIconButton
            {...buttonProps}
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
          >
            <Maximize2 fontWeight={800} fontSize={'2rem'} strokeWidth={4} />
          </AugmentedIconButton>
        </>
      )}
      <AugmentedIconButton
        {...buttonProps}
        color="error"
        onClick={(e) => {
          e.stopPropagation();
          closeWindow(id);
        }}
      >
        <X />
      </AugmentedIconButton>
    </Box>
  );
};
