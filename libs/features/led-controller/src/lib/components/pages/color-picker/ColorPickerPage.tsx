import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

import { ColorSwatchPicker, ColorGradientEditor } from '@jc/ui-components';

interface ColorPickerPageProps {
  onUpdate: (color: string) => void;
}

export const ColorPickerPage = ({ onUpdate }: ColorPickerPageProps) => {
  const defaultColors = [
    '#f0f0f0',
    '#ff0000ff',
    '#ffbf00ff',
    '#fbff00ff',
    '#00ff00ff',
    '#6ff7f5ff',
    '#0000ffff',
    '#ff00ffff',
  ];

  const [savedColors, setSavedColors] = useState<string[]>([]);

  const handleColorChange = (color: string) => {
    console.log('Selected color:', color);
    onUpdate(color);
  };

  const handleAddSavedColor = (colors: string[]) => {
    setSavedColors(colors);
    // TODO - Persist the save colors
  };

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'scroll',
        bg: 'background.paper',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Solid Color Picker
        </Typography>
        <ColorSwatchPicker
          colors={defaultColors}
          savedColors={savedColors}
          setSavedColors={handleAddSavedColor}
          onColorChange={handleColorChange}
        />
        <ColorGradientEditor />
      </Container>
    </Box>
  );
};
