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
  Stack,
  Typography,
  SelectChangeEvent,
  SimplePaletteColorOptions,
  styled,
  alpha,
  useTheme,
} from '@mui/material';
import {
  PaletteIcon,
  SunIcon as LightMode,
  MoonStarIcon as DarkMode,
  MonitorCogIcon as SettingsBrightness,
  Settings,
  Monitor,
} from 'lucide-react';

import { useColorMode } from '../context/color-mode-context';
import { EnhancedThemeOption, ColorMode } from '../types';

// Styled components with theme-aware brutalist sci-fi aesthetic
const MainPanel = styled(Box)(({ theme }) => ({
  borderRadius: 0,
  position: 'relative',
  overflow: 'hidden',
  fontFamily: 'monospace',
}));

const SectionDivider = styled(Box)(({ theme }) => ({
  height: '1px',
  background: alpha(theme.palette.primary.main, 0.3),
  margin: 0,
}));

const CyberFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.main,
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-root': {
    // border: `2px solid ${theme.palette.divider}`,
    borderRadius: 0,
    backgroundColor: 'transparent',
    fontFamily: 'monospace',
    fontSize: '12px',
    color: theme.palette.text.primary,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
      borderWidth: '1px',
    },
  },
  '& .MuiSelect-icon': {
    color: theme.palette.primary.main,
  },
}));

const CyberMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontFamily: 'monospace',
  fontSize: '12px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
    },
  },
}));

const ModeButton = styled(IconButton)<{ isActive?: boolean }>(
  ({ theme, isActive = false }) => ({
    border: `2px solid ${
      isActive ? theme.palette.warning.main : theme.palette.divider
    }`,
    backgroundColor: isActive
      ? alpha(theme.palette.warning.main, 0.2)
      : 'transparent',
    color: isActive ? theme.palette.warning.main : theme.palette.text.secondary,
    borderRadius: 0,
    padding: '8px',
    boxShadow: isActive
      ? `0 0 10px ${alpha(theme.palette.warning.main, 0.3)}`
      : 'none',
    '&:hover': {
      backgroundColor: isActive
        ? alpha(theme.palette.warning.main, 0.3)
        : alpha(theme.palette.warning.main, 0.1),
      borderColor: isActive
        ? theme.palette.warning.main
        : alpha(theme.palette.warning.main, 0.5),
      color: isActive
        ? theme.palette.warning.main
        : alpha(theme.palette.warning.main, 0.7),
    },
  })
);

const DarkModeButton = styled(IconButton)<{ isActive?: boolean }>(
  ({ theme, isActive = false }) => ({
    border: `2px solid ${
      isActive ? theme.palette.secondary.light : theme.palette.divider
    }`,
    backgroundColor: isActive
      ? alpha(theme.palette.secondary.main, 0.2)
      : 'transparent',
    color: isActive
      ? theme.palette.secondary.light
      : theme.palette.text.secondary,
    borderRadius: 0,
    padding: '8px',
    boxShadow: isActive
      ? `0 0 10px ${alpha(theme.palette.secondary.main, 0.3)}`
      : 'none',
    '&:hover': {
      backgroundColor: isActive
        ? alpha(theme.palette.secondary.main, 0.3)
        : alpha(theme.palette.secondary.main, 0.1),
      borderColor: isActive
        ? theme.palette.secondary.main
        : alpha(theme.palette.secondary.main, 0.5),
      color: isActive
        ? theme.palette.secondary.main
        : alpha(theme.palette.secondary.main, 0.7),
    },
  })
);

const SystemModeButton = styled(IconButton)<{ isActive?: boolean }>(
  ({ theme, isActive = false }) => ({
    border: `2px solid ${
      isActive ? theme.palette.info.main : theme.palette.divider
    }`,
    backgroundColor: isActive
      ? alpha(theme.palette.info.main, 0.2)
      : 'transparent',
    color: isActive ? theme.palette.info.main : theme.palette.text.secondary,
    borderRadius: 0,
    padding: '8px',
    boxShadow: isActive
      ? `0 0 10px ${alpha(theme.palette.info.main, 0.3)}`
      : 'none',
    '&:hover': {
      backgroundColor: isActive
        ? alpha(theme.palette.info.main, 0.3)
        : alpha(theme.palette.info.main, 0.1),
      borderColor: isActive
        ? theme.palette.info.main
        : alpha(theme.palette.info.main, 0.5),
      color: isActive
        ? theme.palette.info.main
        : alpha(theme.palette.info.main, 0.7),
    },
  })
);

const CyberChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: 0,
  fontFamily: 'monospace',
  fontSize: '10px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  '&.MuiChip-colorPrimary': {
    backgroundColor: alpha(theme.palette.warning.main, 0.2),
    color: theme.palette.warning.main,
    borderColor: theme.palette.warning.main,
  },
  '&.MuiChip-colorWarning': {
    backgroundColor: alpha(theme.palette.error.main, 0.2),
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}));

const StatusIndicator = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  animation: 'pulse 2s infinite',
  animationDelay: `${delay}s`,
}));

const ColorSwatch = styled(Box)<{ color: string }>(({ color, theme }) => ({
  width: '12px',
  height: '12px',
  backgroundColor: color,
  border: `1px solid ${theme.palette.divider}`,
  display: 'inline-block',
}));

export interface EnhancedThemeSwitcherProps {
  themes: EnhancedThemeOption[];
  selectedThemeId: string;
  onThemeChange: (themeId: string, theme: EnhancedThemeOption) => void;
  showModeToggle?: boolean;
  compact?: boolean;
  compactToggle?: boolean;
  compactMenu?: boolean;
}

export const EnhancedThemeSwitcher: React.FC<EnhancedThemeSwitcherProps> = ({
  themes,
  selectedThemeId,
  onThemeChange,
  showModeToggle = true,
  compact = false,
  compactToggle = false,
  compactMenu = false,
}) => {
  const theme = useTheme();
  const { mode, setMode, resolvedMode, systemMode } = useColorMode();

  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    const themeId = event.target.value;
    const selectedTheme = themes.find((t) => t.id === themeId);
    if (selectedTheme) {
      onThemeChange(themeId, selectedTheme);
    }
  };

  const handleModeChange = (newMode: ColorMode) => {
    setMode(newMode);
  };

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  const getPreviewColors = (themeOption: EnhancedThemeOption) => {
    const palette =
      resolvedMode === 'dark'
        ? themeOption.darkPalette
        : themeOption.lightPalette;
    return [
      (palette.primary as SimplePaletteColorOptions)?.main ||
        theme.palette.primary.main,
      (palette.secondary as SimplePaletteColorOptions)?.main ||
        theme.palette.secondary.main,
      (palette.warning as SimplePaletteColorOptions)?.main ||
        theme.palette.warning.main,
      (palette.error as SimplePaletteColorOptions)?.main ||
        theme.palette.error.main,
      (palette.success as SimplePaletteColorOptions)?.main ||
        theme.palette.success.main,
      (palette.info as SimplePaletteColorOptions)?.main ||
        theme.palette.info.main,
    ];
  };

  const renderModeToggle = () => {
    if (!showModeToggle) return null;

    const modeButtons = [
      {
        mode: 'light' as ColorMode,
        icon: <LightMode size={16} />,
        label: 'Light',
        component: ModeButton,
      },
      {
        mode: 'system' as ColorMode,
        icon: <SettingsBrightness size={16} />,
        label: 'System',
        component: SystemModeButton,
      },
      {
        mode: 'dark' as ColorMode,
        icon: <DarkMode size={16} />,
        label: 'Dark',
        component: DarkModeButton,
      },
    ];

    if (compactToggle) {
      return (
        <Stack direction="row" spacing={0.5}>
          {modeButtons.map(
            ({ mode: btnMode, icon, label, component: ButtonComponent }) => (
              <Tooltip key={btnMode} title={`${label} mode`}>
                <ButtonComponent
                  size="small"
                  onClick={() => handleModeChange(btnMode)}
                  isActive={mode === btnMode ? true : undefined}
                >
                  {icon}
                </ButtonComponent>
              </Tooltip>
            )
          )}
        </Stack>
      );
    }

    return (
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontSize: '10px',
            color: theme.palette.primary.main,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            mb: 1,
            display: 'block',
          }}
        >
          Color Mode
        </Typography>
        <Stack direction="row" spacing={1}>
          {modeButtons.map(
            ({ mode: btnMode, icon, label, component: ButtonComponent }) => (
              <Tooltip key={btnMode} title={`${label} mode`}>
                <ButtonComponent
                  size="small"
                  onClick={() => handleModeChange(btnMode)}
                  isActive={mode === btnMode ? true : undefined}
                >
                  {icon}
                </ButtonComponent>
              </Tooltip>
            )
          )}
        </Stack>
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            display: 'block',
            fontFamily: 'monospace',
            fontSize: '10px',
            color: theme.palette.text.secondary,
          }}
        >
          Current: {mode === 'system' && ` [SYSTEM] `}
          {resolvedMode.toUpperCase()}
        </Typography>
      </Box>
    );
  };

  // Filter themes based on mode support
  const availableThemes = themes.filter((themeOption) => {
    if (resolvedMode === 'dark') return themeOption.supportsDark !== false;
    if (resolvedMode === 'light') return themeOption.supportsLight !== false;
    return true;
  });

  if (compactMenu) {
    return (
      <Box sx={{ position: 'relative' }}>
        <MainPanel sx={{ p: 2 }}>
          <Stack
            // direction="row"
            spacing={2}
            alignItems="center"
            sx={{ position: 'relative', zIndex: 2 }}
          >
            {renderModeToggle()}

            <CyberFormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={selectedThemeId}
                onChange={handleThemeChange}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                      border: `2px solid ${theme.palette.primary.main}`,
                      borderRadius: 0,
                      boxShadow: `0 0 20px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                    },
                  },
                }}
              >
                {availableThemes.map((themeOption) => (
                  <CyberMenuItem key={themeOption.id} value={themeOption.id}>
                    <Box
                      className="ThemePicker-Compact--MenuItem"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                      }}
                    >
                      <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
                        {getPreviewColors(themeOption).map((color, index) => (
                          <ColorSwatch key={index} color={color} />
                        ))}
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', fontSize: '12px' }}
                      >
                        {themeOption.name}
                      </Typography>
                    </Box>
                  </CyberMenuItem>
                ))}
              </Select>
            </CyberFormControl>
          </Stack>
        </MainPanel>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 600,
      }}
    >
      <MainPanel>
        {/* Header */}
        <Box sx={{ p: 2, position: 'relative', zIndex: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1,
                  border: `1px solid ${theme.palette.primary.main}`,
                }}
              >
                <Settings size={20} color={theme.palette.primary.main} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: theme.palette.primary.main,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  THEME_SELECT
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    color: theme.palette.success.main,
                  }}
                >
                  {selectedTheme?.name || 'SELECT_THEME'}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PaletteIcon size={16} color={theme.palette.secondary.main} />
              <Stack direction="row" spacing={0.5}>
                <StatusIndicator
                  sx={{ backgroundColor: theme.palette.success.main }}
                />
                <StatusIndicator
                  sx={{ backgroundColor: theme.palette.warning.main }}
                  delay={0.5}
                />
                <StatusIndicator
                  sx={{ backgroundColor: theme.palette.error.main }}
                  delay={1}
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <SectionDivider />

        {/* Theme Selection */}
        <Box sx={{ p: 2, position: 'relative', zIndex: 2 }}>
          <CyberFormControl fullWidth>
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon size={16} />
                Themes
              </Box>
            </InputLabel>
            <Select
              value={selectedThemeId}
              onChange={handleThemeChange}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon size={16} />
                  Theme
                </Box>
              }
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 0,
                    boxShadow: `0 0 20px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                  },
                },
              }}
            >
              {availableThemes.map((themeOption) => (
                <CyberMenuItem key={themeOption.id} value={themeOption.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          color: theme.palette.success.main,
                        }}
                      >
                        {themeOption.name}
                      </Typography>
                      {themeOption.description && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontFamily: 'monospace',
                            fontSize: '10px',
                          }}
                        >
                          {themeOption.description}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={0.5} sx={{ ml: 2 }}>
                      {getPreviewColors(themeOption).map((color, index) => (
                        <ColorSwatch key={index} color={color} />
                      ))}
                    </Stack>
                  </Box>
                </CyberMenuItem>
              ))}
            </Select>
          </CyberFormControl>
        </Box>

        <SectionDivider />

        {/* Mode Toggle */}
        <Box sx={{ p: 2, position: 'relative', zIndex: 2 }}>
          {renderModeToggle()}
        </Box>

        <SectionDivider />

        {/* Footer */}
        <Box
          sx={{
            p: 1.5,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: theme.palette.text.secondary,
              }}
            >
              {availableThemes.length} {resolvedMode.toUpperCase()}_THEMES
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Monitor size={12} color={theme.palette.text.secondary} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: theme.palette.text.secondary,
                }}
              >
                ENHANCED_MODE
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </MainPanel>

      {/* Global styles for animations */}
      <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  );
};
