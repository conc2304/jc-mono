import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { ColorInput, hexToRgb, rgbToHsv } from '@jc/utils';
import { AugmentedButton, AugmentedIconButton, ColorSwatch } from '../../atoms';
import { CustomColorModal } from '../custom-color-modal/CustomColorModal';

interface ColorSwatchPickerProps {
  colors?: string[];
  onColorChange?: (color: string) => void;
  savedColors: string[];
  setSavedColors: (colors: string[]) => void;
}

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  colors = [],
  onColorChange,
  savedColors,
  setSavedColors,
}) => {
  const theme = useTheme();
  const [activeColor, setActiveColor] = useState<string>(
    colors[0] || '#000000'
  );
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
    setActiveColor(color);
    if (onColorChange) onColorChange(color);
  };

  const handleRemoveSavedColor = (colorToRemove: string): void => {
    setSavedColors(savedColors.filter((c) => c !== colorToRemove));
  };

  // Calculate RGB and HSV values from the active color
  const colorValues = useMemo(() => {
    const rgb = hexToRgb(activeColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    return { rgb, hsv };
  }, [activeColor]);

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

      {/* Active Color Display */}
      <Paper
        data-augmented-ui="border tr-clip tl-clip"
        sx={(theme) => ({
          mt: 2,
          p: 2,
          backgroundColor: 'background.default',
          '--aug-border-all': '2px',
          '--aug-border-bg': theme.palette.info.main,
          '--aug-tr': theme.spacing(1),
          '--aug-tl': theme.spacing(1),
        })}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 1 }}
        >
          Active Color
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            data-augmented-ui="border tr-clip tl-clip br-clip bl-clip"
            sx={{
              width: 64,
              height: 64,
              '--aug-tl': theme.spacing(1),
              '--aug-tr': theme.spacing(1),
              '--aug-bl': theme.spacing(1),
              '--aug-br': theme.spacing(1),
              '--aug-border-all': '2px',
              '--aug-border-bg': theme.palette.info.main,
              // border: `2px solid ${theme.palette.action.active}`,
              backgroundColor: activeColor,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.5,
              justifyContent: 'space-between',
              flexGrow: 1,
              flexShrink: 0,
            }}
          >
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              <b>HEX:</b> {activeColor.toUpperCase()}
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              <b>RGB</b>: {colorValues.rgb.r}, {colorValues.rgb.g},{' '}
              {colorValues.rgb.b}
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              <b>HSV</b>: {colorValues.hsv.h}°, {colorValues.hsv.s}%,{' '}
              {colorValues.hsv.v}%
            </Typography>
          </Box>
        </Box>
      </Paper>

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
