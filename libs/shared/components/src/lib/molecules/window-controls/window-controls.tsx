import { Box } from '@mui/material';
import { Maximize2, Minimize2, X } from 'lucide-react';

import { AugmentedIconButton, AugmentedIconButtonProps } from '../../atoms';
import { useWindowActions } from '../../context';

type WindowControlProps = {
  id: string;
};

export const WindowControls = ({ id }: WindowControlProps) => {
  const { minimizeWindow, maximizeWindow, closeWindow } = useWindowActions();
  const buttonProps: AugmentedIconButtonProps = {
    size: 'small',
    shape: 'buttonRight',
    disableRipple: true,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: (theme) => theme.mixins.window.titleBar.height,
      }}
    >
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
        <Maximize2 />
      </AugmentedIconButton>
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
