import { Box } from '@mui/material';
import { Maximize2, Minimize2, X } from 'lucide-react';

import { AugmentedIconButton, AugmentedIconButtonProps } from '../../atoms';

type WindowControlProps = {
  id: string;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
};

export const WindowControls = ({
  id,
  minimizeWindow,
  maximizeWindow,
  closeWindow,
}: WindowControlProps) => {
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
        height: (theme) => theme.mixins.window.titlebar.height,
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
