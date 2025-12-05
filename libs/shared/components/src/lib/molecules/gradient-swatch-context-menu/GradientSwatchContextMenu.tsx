import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { Gradient } from '../../organisms/color-gradient-editor/types';

export interface GradientSwatchAction {
  icon: React.ReactElement;
  name: string;
  onClick: () => void;
}

interface GradientSwatchContextMenuProps {
  gradient: Gradient;
  isDefaultGradient: boolean;
  onEdit: (gradient: Gradient) => void;
  onDelete?: (gradientId: string) => void;
  onDuplicate?: (gradient: Gradient) => void;
  position: { x: number; y: number };
  onClose: () => void;
}

export const GradientSwatchContextMenu: React.FC<
  GradientSwatchContextMenuProps
> = ({
  gradient,
  isDefaultGradient,
  onEdit,
  onDelete,
  onDuplicate,
  position,
  onClose,
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const actions: GradientSwatchAction[] = [
    {
      icon: <EditIcon />,
      name: isDefaultGradient ? 'Edit' : 'Edit',
      onClick: () => {
        onEdit(gradient);
        handleClose();
      },
    },
  ];

  if (onDuplicate) {
    actions.push({
      icon: <CopyIcon />,
      name: 'Duplicate',
      onClick: () => {
        onDuplicate(gradient);
        handleClose();
      },
    });
  }

  if (!isDefaultGradient && onDelete) {
    actions.push({
      icon: <DeleteIcon />,
      name: 'Delete',
      onClick: () => {
        onDelete(gradient.id);
        handleClose();
      },
    });
  }

  return (
    <SpeedDial
      ariaLabel="Gradient actions"
      sx={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        '& .MuiSpeedDial-fab': {
          width: 0,
          height: 0,
          minHeight: 0,
          visibility: 'hidden',
        },
      }}
      open={open}
      onClose={handleClose}
      direction="down"
      FabProps={{
        size: 'small',
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          slotProps={{ tooltip: { title: action.name, open: true } }}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};
