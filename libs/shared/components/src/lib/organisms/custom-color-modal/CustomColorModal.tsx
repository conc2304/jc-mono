import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Grid } from '@mui/system';
import { Close as CloseIcon } from '@mui/icons-material';

import {
  ColorInput,
  hexToRgb,
  HSV,
  hsvToRgb,
  RGB,
  rgbToHex,
  rgbToHsv,
} from '@jc/utils';

interface CustomColorModalProps {
  isOpen: boolean;
  setIsModalOpen: (next: boolean) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  colorInput: ColorInput;
  setColorInput: (coloValues: ColorInput) => void;
  savedColors: string[];
  setSavedColors: (colors: string[]) => void;
  onSelectColor: (color: string) => void;
}

export const CustomColorModal = ({
  isOpen = false,
  setIsModalOpen,
  customColor,
  setCustomColor,
  setColorInput,
  colorInput,
  savedColors,
  setSavedColors,
  onSelectColor,
}: CustomColorModalProps) => {
  const handleCustomColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    const rgb = hexToRgb(newColor);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    setColorInput({ ...rgb, hex: newColor, ...hsv });
  };

  const handleRgbChange = (channel: keyof RGB, value: string): void => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb: RGB = { ...colorInput, [channel]: numValue };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const hsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
    setColorInput({ ...newRgb, hex, ...hsv });
    setCustomColor(hex);
  };

  const handleHexChange = (value: string): void => {
    const hex = value.startsWith('#') ? value : '#' + value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const rgb = hexToRgb(hex);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setColorInput({ ...rgb, hex, ...hsv });
      setCustomColor(hex);
    } else {
      setColorInput({ ...colorInput, hex: value });
    }
  };

  const handleHsvChange = (channel: keyof HSV, value: string): void => {
    let numValue = parseInt(value) || 0;
    if (channel === 'h') numValue = Math.max(0, Math.min(360, numValue));
    else numValue = Math.max(0, Math.min(100, numValue));

    const newHsv: HSV = {
      h: colorInput.h,
      s: colorInput.s,
      v: colorInput.v,
      [channel]: numValue,
    };
    const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColorInput({ ...rgb, ...newHsv, hex });
    setCustomColor(hex);
  };

  const handleSaveColor = (): void => {
    if (!savedColors.includes(customColor)) {
      setSavedColors([...savedColors, customColor]);
    }
    onSelectColor(customColor);
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsModalOpen(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          p: 3,
          maxWidth: 448,
          width: '100%',
          mx: 2,
          maxHeight: '90vh',
          overflow: 'auto',
          outline: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Custom Color
          </Typography>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Color Preview */}
        <Box
          sx={(theme) => ({
            width: '100%',
            height: 96,
            borderRadius: 1,
            border: `2px solid ${theme.palette.divider}`,
            backgroundColor: customColor,
            mb: 2,
          })}
        />

        {/* Native Color Picker */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Color Picker
          </Typography>
          <Box
            component="input"
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            sx={(theme) => ({
              width: '100%',
              height: 48,
              cursor: 'pointer',
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
            })}
          />
        </Box>

        {/* Hex Input */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            Hex
          </Typography>
          <TextField
            fullWidth
            value={colorInput.hex}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleHexChange(e.target.value)
            }
            placeholder="#000000"
            size="small"
          />
        </Box>

        {/* RGB Inputs */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            RGB
          </Typography>
          <Grid container spacing={1}>
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
                R
              </Typography>
              <TextField
                fullWidth
                type="number"
                slotProps={{
                  htmlInput: { min: 0, max: 255 },
                }}
                value={colorInput.r}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRgbChange('r', e.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
                G
              </Typography>
              <TextField
                fullWidth
                type="number"
                inputProps={{ min: 0, max: 255 }}
                value={colorInput.g}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRgbChange('g', e.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
                B
              </Typography>
              <TextField
                fullWidth
                type="number"
                inputProps={{ min: 0, max: 255 }}
                value={colorInput.b}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRgbChange('b', e.target.value)
                }
                size="small"
              />
            </Grid>
          </Grid>
        </Box>

        {/* HSV Inputs */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            HSV
          </Typography>
          <Grid container spacing={1}>
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
                H (0-360)
              </Typography>
              <TextField
                fullWidth
                type="number"
                slotProps={{
                  htmlInput: { min: 0, max: 360 },
                }}
                value={colorInput.h}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleHsvChange('h', e.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
                S (0-100)
              </Typography>
              <TextField
                fullWidth
                type="number"
                slotProps={{
                  htmlInput: { min: 0, max: 100 },
                }}
                value={colorInput.s}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleHsvChange('s', e.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
                V (0-100)
              </Typography>
              <TextField
                fullWidth
                type="number"
                slotProps={{
                  htmlInput: { min: 0, max: 100 },
                }}
                value={colorInput.v}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleHsvChange('v', e.target.value)
                }
                size="small"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button fullWidth variant="contained" onClick={handleSaveColor}>
            Save & Apply
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsModalOpen(false)}
            sx={{ px: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};
