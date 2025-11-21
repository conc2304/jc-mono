import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { ColorInput } from '@jc/utils';
import { AugmentedButton } from '../../atoms';
import { CustomColorModal } from '../custom-color-modal/CustomColorModal';
import { SwatchPicker, SwatchItem } from '../swatch-picker';

interface ColorSwatchPickerProps {
  colors?: string[];
  onColorChange?: (color: string) => void;
  savedColors: string[];
  setSavedColors: (colors: string[]) => void;
  activeColor?: string | null;
}

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  colors = [],
  onColorChange,
  savedColors,
  setSavedColors,
  activeColor,
}) => {
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<string>('#ff0000');
  const [colorInput, setColorInput] = useState<ColorInput>({
    r: 255,
    g: 0,
    b: 0,
    hex: '#ff0000',
    h: 0,
    s: 100,
    v: 100,
  });

  // Convert colors to SwatchItem format
  const colorItems: SwatchItem<string>[] = colors.map((color) => ({
    id: color,
    value: color,
    display: color,
    isGradient: false,
  }));

  const savedColorItems: SwatchItem<string>[] = savedColors.map((color) => ({
    id: color,
    value: color,
    display: color,
    isGradient: false,
  }));

  const activeColorItem: SwatchItem<string> | null = activeColor
    ? {
        id: activeColor,
        value: activeColor,
        display: activeColor,
        isGradient: false,
      }
    : null;

  const handleColorSelect = (item: SwatchItem<string>): void => {
    if (onColorChange) onColorChange(item.value);
  };

  const handleRemoveSavedColor = (colorId: string): void => {
    setSavedColors(savedColors.filter((c) => c !== colorId));
  };

  const customButton = (
    <AugmentedButton
      onClick={() => setIsModalOpen(true)}
      color="primary"
      variant="outlined"
      sx={{
        width: 64,
        height: 64,
        p: 0,
      }}
    >
      <AddIcon sx={{ color: theme.palette.text.secondary, fontSize: 32 }} />
    </AugmentedButton>
  );

  return (
    <Box sx={{ width: '100%', mx: 'auto', p: 2 }}>
      <SwatchPicker
        title="Solid Colors"
        items={colorItems}
        savedItems={savedColorItems}
        savedItemsTitle="Saved Colors"
        activeItem={activeColorItem}
        onItemSelect={handleColorSelect}
        onRemoveSavedItem={handleRemoveSavedColor}
        customButton={customButton}
        size="medium"
        gridColumns={{ xs: 3, sm: 4, md: 6, lg: 8 }}
      />

      {/* Custom Color Modal */}
      <CustomColorModal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        customColor={customColor}
        setCustomColor={setCustomColor}
        colorInput={colorInput}
        setColorInput={setColorInput}
        savedColors={savedColors}
        setSavedColors={setSavedColors}
        onSelectColor={handleColorSelect}
      />
    </Box>
  );
};
