import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  Typography,
  SelectChangeEvent,
  SimplePaletteColorOptions,
} from '@mui/material';
import {
  PaletteIcon,
  SunIcon as LightMode,
  MoonStarIcon as DarkMode,
  MonitorCogIcon as SettingsBrightness,
} from 'lucide-react';

import { useColorMode } from './color-mode-context';
import { EnhancedThemeOption, ColorMode } from '../types';

interface EnhancedThemeSwitcherProps {
  themes: EnhancedThemeOption[];
  selectedThemeId: string;
  onThemeChange: (themeId: string, theme: EnhancedThemeOption) => void;
  showModeToggle?: boolean;
  compact?: boolean;
  width?: string | number;
}

export const EnhancedThemeSwitcher: React.FC<EnhancedThemeSwitcherProps> = ({
  themes,
  selectedThemeId,
  onThemeChange,
  showModeToggle = true,
  compact = false,
  width = 250,
}) => {
  const { mode, setMode, resolvedMode, systemMode } = useColorMode();

  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    const themeId = event.target.value;
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      onThemeChange(themeId, theme);
    }
  };

  const handleModeChange = (newMode: ColorMode) => {
    setMode(newMode);
  };

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  const getPreviewColors = (theme: EnhancedThemeOption) => {
    const palette =
      resolvedMode === 'dark' ? theme.darkPalette : theme.lightPalette;
    return [
      (palette.primary as SimplePaletteColorOptions)?.main || '#000',
      (palette.secondary as SimplePaletteColorOptions)?.main || '#000',
      (palette.error as SimplePaletteColorOptions)?.main || '#000',
      (palette.success as SimplePaletteColorOptions)?.main || '#000',
    ];
  };

  const renderModeToggle = () => {
    if (!showModeToggle) return null;

    const modeButtons = [
      { mode: 'light' as ColorMode, icon: <LightMode />, label: 'Light' },
      {
        mode: 'system' as ColorMode,
        icon: <SettingsBrightness />,
        label: 'System',
      },
      { mode: 'dark' as ColorMode, icon: <DarkMode />, label: 'Dark' },
    ];
    if (compact) {
      return (
        <div>
          <Box sx={{ display: 'flex' }}>
            {modeButtons.map(({ mode: btnMode, icon, label }) => (
              <Tooltip key={btnMode} title={`${label} mode`}>
                <IconButton
                  size="small"
                  onClick={() => handleModeChange(btnMode)}
                  color={mode === btnMode ? 'primary' : 'default'}
                  sx={{
                    borderRadius: 1,
                    ...(mode === btnMode && {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    }),
                  }}
                >
                  {icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </div>
      );
    }

    return (
      <Paper sx={{ p: 1, backgroundColor: 'background.paper' }}>
        <Typography variant="caption" display="block" gutterBottom>
          Color Mode
        </Typography>
        <Stack direction="row" spacing={1}>
          {modeButtons.map(({ mode: btnMode, icon, label }) => (
            <Tooltip key={btnMode} title={`${label} mode`}>
              <IconButton
                size="small"
                onClick={() => handleModeChange(btnMode)}
                color={mode === btnMode ? 'primary' : 'default'}
                sx={{
                  borderRadius: 1,
                  ...(mode === btnMode && {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  }),
                }}
              >
                {icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: 'block' }}
        >
          Current: {resolvedMode} {mode === 'system' && `(${systemMode})`}
        </Typography>
      </Paper>
    );
  };

  // Filter themes based on mode support
  const availableThemes = themes.filter((theme) => {
    if (resolvedMode === 'dark') return theme.supportsDark !== false;
    if (resolvedMode === 'light') return theme.supportsLight !== false;
    return true;
  });

  if (compact) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={selectedThemeId}
            onChange={handleThemeChange}
            displayEmpty
          >
            {availableThemes.map((theme) => (
              <MenuItem key={theme.id} value={theme.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 0.25 }}>
                    {getPreviewColors(theme).map((color, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2">{theme.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {renderModeToggle()}
      </Stack>
    );
  }

  return (
    <Box sx={{ width }}>
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon style={{ fontSize: '1rem' }} />
              Theme
            </Box>
          </InputLabel>
          <Select
            value={selectedThemeId}
            onChange={handleThemeChange}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon style={{ fontSize: '1rem' }} />
                Theme
              </Box>
            }
          >
            {availableThemes.map((theme) => (
              <MenuItem key={theme.id} value={theme.id}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {theme.name}
                    </Typography>
                    {theme.description && (
                      <Typography variant="caption" color="text.secondary">
                        {theme.description}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                    {getPreviewColors(theme).map((color, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {renderModeToggle()}

        {selectedTheme && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={resolvedMode}
              color="primary"
              variant="outlined"
            />
            <Chip
              size="small"
              label={selectedTheme.category}
              variant="outlined"
            />
            {!selectedTheme.supportsLight && resolvedMode === 'light' && (
              <Chip
                size="small"
                label="Dark only"
                color="warning"
                variant="outlined"
              />
            )}
            {!selectedTheme.supportsDark && resolvedMode === 'dark' && (
              <Chip
                size="small"
                label="Light only"
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
};
