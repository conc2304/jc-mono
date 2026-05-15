import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export interface ToolButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  size?: 'small' | 'medium';
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  label,
  onClick,
  active = false,
  disabled = false,
  children,
  size = 'small',
}) => (
  <Tooltip title={label} placement="bottom">
    <span>
      <IconButton
        size={size}
        onClick={onClick}
        disabled={disabled}
        sx={{
          borderRadius: 1,
          transition: 'background-color 120ms, color 120ms',
          ...(active
            ? {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              }
            : {
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
              }),
        }}
      >
        {children}
      </IconButton>
    </span>
  </Tooltip>
);
