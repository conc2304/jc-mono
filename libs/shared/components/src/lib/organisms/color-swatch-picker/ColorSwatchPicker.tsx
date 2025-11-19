import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { ColorInput } from '@jc/utils';
import { AugmentedButton, AugmentedIconButton, ColorSwatch } from '../../atoms';
import { CustomColorModal } from '../custom-color-modal/CustomColorModal';

interface ColorSwatchPickerProps {
  colors?: string[];
  onColorChange?: (color: string) => void;
  savedColors: string[];
  setSavedColors: (colors: string[]) => void;
  activeColor?: string;
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

  const handleColorSelect = (color: string): void => {
    if (onColorChange) onColorChange(color);
  };

  const handleRemoveSavedColor = (colorToRemove: string): void => {
    setSavedColors(savedColors.filter((c) => c !== colorToRemove));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 672, mx: 'auto', p: 2 }}>
      {/* Saved Colors Section */}
      {savedColors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Saved Colors
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {savedColors.map((color: string, index: number) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  '&:hover .remove-btn': { opacity: 1 },
                }}
              >
                <ColorSwatch
                  key={color + index}
                  color={color}
                  onColorSelect={() => handleColorSelect(color)}
                  isActive={activeColor === color}
                />

                <AugmentedIconButton
                  className="remove-btn"
                  size="small"
                  onClick={() => handleRemoveSavedColor(color)}
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: theme.palette.error.dark,
                    },
                  }}
                >
                  ×
                </AugmentedIconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Color Swatches */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {/* Custom Color Button */}
        <AugmentedButton
          onClick={() => setIsModalOpen(true)}
          color="secondary"
          variant="outlined"
          sx={{
            minWidth: 64,
            width: 64,
            height: 64,
            p: 0,
          }}
        >
          <AddIcon sx={{ color: theme.palette.text.secondary, fontSize: 32 }} />
        </AugmentedButton>

        {/* Color Swatches */}
        {colors.map((color: string, index: number) => (
          <ColorSwatch
            onColorSelect={handleColorSelect}
            color={color}
            isActive={color === activeColor}
            key={color + index}
          />
        ))}
      </Box>

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
