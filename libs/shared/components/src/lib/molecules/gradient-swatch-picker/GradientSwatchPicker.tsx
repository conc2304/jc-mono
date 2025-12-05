import { Box, IconButton } from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import {
  Gradient,
  ColorStop,
} from '../../organisms/color-gradient-editor/types';
import { SwatchItem, SwatchPicker } from '../../organisms/swatch-picker';
import { AugmentedButton } from '../../atoms';
import { GradientSwatchContextMenu } from '../gradient-swatch-context-menu';

interface GradientSwatchPickerProps {
  gradients: Gradient[];
  savedGradients: Gradient[];
  selectedGradient: Gradient | null;
  onGradientSelect: (gradient: Gradient) => void;
  onRemoveSavedGradient: (gradientId: string) => void;
  onOpenCustomEditor: () => void;
  onEditGradient?: (gradient: Gradient) => void;
  onDuplicateGradient?: (gradient: Gradient) => void;
}

// Generate CSS gradient string from stops
const generateGradientCSS = (stops: ColorStop[]): string => {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const gradientString = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');
  return `linear-gradient(to right, ${gradientString})`;
};

export const GradientSwatchPicker = ({
  gradients,
  savedGradients,
  selectedGradient,
  onGradientSelect,
  onRemoveSavedGradient,
  onOpenCustomEditor,
  onEditGradient,
  onDuplicateGradient,
}: GradientSwatchPickerProps) => {
  const theme = useTheme();
  const [contextMenu, setContextMenu] = useState<{
    gradient: Gradient;
    position: { x: number; y: number };
  } | null>(null);

  // Convert gradients to SwatchItem format and mark them as default gradients
  const gradientItems: SwatchItem<Gradient>[] = gradients.map((gradient) => ({
    id: gradient.id,
    value: { ...gradient, isDefault: true },
    display: generateGradientCSS(gradient.stops),
    isGradient: true,
  }));

  const savedGradientItems: SwatchItem<Gradient>[] = savedGradients.map(
    (gradient) => ({
      id: gradient.id,
      value: gradient,
      display: generateGradientCSS(gradient.stops),
      isGradient: true,
    })
  );

  const activeGradientItem: SwatchItem<Gradient> | null = selectedGradient
    ? {
        id: selectedGradient.id,
        value: selectedGradient,
        display: generateGradientCSS(selectedGradient.stops),
        isGradient: true,
      }
    : null;

  const handleGradientSelect = (item: SwatchItem<Gradient>): void => {
    onGradientSelect(item.value);
  };

  const handleContextMenu = (e: React.MouseEvent, gradient: Gradient): void => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      gradient,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const closeContextMenu = (): void => {
    setContextMenu(null);
  };

  const handleEdit = (gradient: Gradient): void => {
    if (onEditGradient) {
      onEditGradient(gradient);
    }
  };

  const handleDuplicate = (gradient: Gradient): void => {
    if (onDuplicateGradient) {
      onDuplicateGradient(gradient);
    }
  };

  const customButton = (
    <AugmentedButton
      onClick={onOpenCustomEditor}
      color="primary"
      variant="outlined"
      sx={{
        width: 140,
        height: 64,
        p: 0,
      }}
    >
      <AddIcon sx={{ color: theme.palette.text.secondary, fontSize: 32 }} />
    </AugmentedButton>
  );

  // Enhanced gradient items with action buttons
  const enhancedGradientItems = gradientItems.map((item) => ({
    ...item,
    customActions: (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleContextMenu(e, item.value);
        }}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          width: 24,
          height: 24,
          opacity: 0,
          transition: 'opacity 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
        className="action-btn" // maps to display on hover from parent component
      >
        <MoreVertIcon sx={{ fontSize: 16 }} />
      </IconButton>
    ),
  }));

  const enhancedSavedGradientItems = savedGradientItems.map((item) => ({
    ...item,
    customActions: (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleContextMenu(e, item.value);
        }}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          width: 24,
          height: 24,
          opacity: 0,
          transition: 'opacity 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
        className="action-btn"
      >
        <MoreVertIcon sx={{ fontSize: 16 }} />
      </IconButton>
    ),
  }));

  return (
    <Box sx={{ mb: 3 }}>
      <SwatchPicker
        title="Gradient Colors"
        items={enhancedGradientItems}
        savedItems={enhancedSavedGradientItems}
        savedItemsTitle="Saved Gradients"
        activeItem={activeGradientItem}
        onItemSelect={handleGradientSelect}
        onRemoveSavedItem={onRemoveSavedGradient}
        customButton={customButton}
        size="large"
        gridColumns={{ xs: 2, sm: 3, md: 4, lg: 9 }}
      />
      {contextMenu && (
        <GradientSwatchContextMenu
          gradient={contextMenu.gradient}
          isDefaultGradient={contextMenu.gradient.isDefault === true}
          onEdit={handleEdit}
          onDelete={onRemoveSavedGradient}
          onDuplicate={onDuplicateGradient ? handleDuplicate : undefined}
          position={contextMenu.position}
          onClose={closeContextMenu}
        />
      )}
    </Box>
  );
};
