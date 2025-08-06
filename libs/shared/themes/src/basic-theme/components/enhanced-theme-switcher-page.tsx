import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Alert,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  useTheme,
  styled,
  alpha,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Monitor as MonitorIcon,
  LightMode,
  DarkMode,
  SettingsBrightness,
  // Zap,
  Visibility,
  Save,
  RestartAlt,
  PlayArrow,
  Download,
  Upload,
  Delete as DeleteIcon,
  FlashOn,
} from '@mui/icons-material';
import { useColorMode } from '../context/color-mode-context';
import { useEnhancedTheme } from '../context';
import { EnhancedThemeOption } from '../types';

// Styled Components with Cyberpunk Aesthetic
const CyberPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: 0,
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  overflow: 'hidden',
}));

const CyberCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: 0,
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const CyberButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  border: `2px solid ${theme.palette.primary.main}`,
  fontFamily: 'monospace',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  padding: '12px 24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
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
    padding: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
      borderColor: theme.palette.warning.main,
      transform: 'scale(1.05)',
    },
  })
);

const CyberTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.main,
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  '& .MuiOutlinedInput-root': {
    fontFamily: 'monospace',
    fontSize: '12px',
    borderRadius: 0,
    '& fieldset': {
      borderColor: theme.palette.divider,
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
}));

const CyberSelect = styled(Select)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: '12px',
  borderRadius: 0,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
    borderWidth: '2px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
  },
}));

const CyberTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontWeight: 'bold',
  letterSpacing: '2px',
  textTransform: 'uppercase',
}));

const StatusIndicator = styled(Box)<{ color: string }>(({ color }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: color,
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
}));

const ColorSwatch = styled(Box)<{ color: string }>(({ color, theme }) => ({
  width: '40px',
  height: '40px',
  backgroundColor: color,
  border: `2px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: theme.palette.primary.main,
    zIndex: 1,
  },
}));

export const ThemeCustomizerPage: React.FC = () => {
  const theme = useTheme();
  const {
    themes,
    currentThemeId,
    currentTheme,
    changeTheme,
    addTheme,
    removeTheme,
    resetToDefaultThemes,
    exportThemes,
    importThemes,
    isHydrated,
  } = useEnhancedTheme();

  const { mode, setMode, resolvedMode, systemMode } = useColorMode();

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    themeId: string;
    themeName: string;
  }>({ open: false, themeId: '', themeName: '' });
  const [importDialog, setImportDialog] = useState(false);
  const [importText, setImportText] = useState('');

  // Custom theme state
  const [customColors, setCustomColors] = useState({
    primary: '#00ffff',
    secondary: '#ff00ff',
    warning: '#ffff00',
    error: '#ff0040',
    success: '#00ff40',
    info: '#4080ff',
    background: '#0a0a0a',
    paper: '#1a1a1a',
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
  });

  // Get current theme palette
  const currentPalette = currentTheme
    ? resolvedMode === 'dark'
      ? currentTheme.darkPalette
      : currentTheme.lightPalette
    : {};

  const handleColorChange = (colorKey: string, value: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorKey]: value,
    }));
  };

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
  };

  const handleThemeChange = (themeId: string) => {
    changeTheme(themeId);
    setSnackbar({
      open: true,
      message: `Theme changed to ${themes.find((t) => t.id === themeId)?.name}`,
      severity: 'success',
    });
  };

  const applyCustomTheme = () => {
    const newTheme: EnhancedThemeOption = {
      id: `custom-${Date.now()}`,
      name: 'Custom Theme',
      category: 'custom',
      description: 'Your custom creation',
      lightPalette: {
        primary: { main: customColors.primary },
        secondary: { main: customColors.secondary },
        warning: { main: customColors.warning },
        error: { main: customColors.error },
        success: { main: customColors.success },
        info: { main: customColors.info },
        background: {
          default: customColors.background,
          paper: customColors.paper,
        },
        text: {
          primary: customColors.textPrimary,
          secondary: customColors.textSecondary,
        },
      },
      darkPalette: {
        primary: { main: customColors.primary },
        secondary: { main: customColors.secondary },
        warning: { main: customColors.warning },
        error: { main: customColors.error },
        success: { main: customColors.success },
        info: { main: customColors.info },
        background: {
          default: customColors.background,
          paper: customColors.paper,
        },
        text: {
          primary: customColors.textPrimary,
          secondary: customColors.textSecondary,
        },
      },
    };

    addTheme(newTheme);
    changeTheme(newTheme.id);
    setIsCustomizing(false);
    setSnackbar({
      open: true,
      message: 'Custom theme created and applied!',
      severity: 'success',
    });
  };

  const handleExportTheme = async () => {
    try {
      const themeData = exportThemes();
      await navigator.clipboard.writeText(themeData);
      setSnackbar({
        open: true,
        message: 'Themes exported to clipboard!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to export themes',
        severity: 'error',
      });
    }
  };

  const handleImportThemes = () => {
    if (!importText.trim()) {
      setSnackbar({
        open: true,
        message: 'Please paste theme data',
        severity: 'error',
      });
      return;
    }

    const success = importThemes(importText);
    if (success) {
      setSnackbar({
        open: true,
        message: 'Themes imported successfully!',
        severity: 'success',
      });
      setImportDialog(false);
      setImportText('');
    } else {
      setSnackbar({
        open: true,
        message: 'Failed to import themes. Check the format.',
        severity: 'error',
      });
    }
  };

  const handleDeleteTheme = (themeId: string, themeName: string) => {
    setDeleteDialog({
      open: true,
      themeId,
      themeName,
    });
  };

  const confirmDeleteTheme = () => {
    removeTheme(deleteDialog.themeId);
    setDeleteDialog({ open: false, themeId: '', themeName: '' });
    setSnackbar({
      open: true,
      message: `Theme "${deleteDialog.themeName}" deleted`,
      severity: 'success',
    });
  };

  const resetCustomColors = () => {
    setCustomColors({
      primary: '#00ffff',
      secondary: '#ff00ff',
      warning: '#ffff00',
      error: '#ff0040',
      success: '#00ff40',
      info: '#4080ff',
      background: '#0a0a0a',
      paper: '#1a1a1a',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
    });
  };

  // Color Input Component
  const ColorInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
  }> = ({ label, value, onChange }) => (
    <Box sx={{ mb: 3 }}>
      <CyberTypography
        variant="caption"
        sx={{ mb: 1, display: 'block', color: 'primary.main' }}
      >
        {label}
      </CyberTypography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          component="input"
          type="color"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          sx={{
            width: 60,
            height: 40,
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 0,
            cursor: 'pointer',
            backgroundColor: value,
          }}
        />
        <CyberTextField
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ flex: 1 }}
          slotProps={{
            htmlInput: { style: { fontFamily: 'monospace', fontSize: '12px' } },
          }}
        />
      </Stack>
    </Box>
  );

  // Demo Component
  const DemoSection: React.FC = () => (
    <CyberPaper sx={{ p: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CyberTypography
          variant="h6"
          sx={{ color: customColors.primary, mb: 1 }}
        >
          THEME_PREVIEW
        </CyberTypography>
        <Typography
          variant="caption"
          sx={{ color: customColors.textSecondary }}
        >
          Live preview of your custom theme
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Buttons */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CyberTypography
            variant="subtitle2"
            sx={{ color: customColors.secondary, mb: 2 }}
          >
            Interactive Elements
          </CyberTypography>
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: customColors.primary,
                color: customColors.background,
                border: `2px solid ${customColors.primary}`,
                borderRadius: 0,
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                '&:hover': {
                  backgroundColor: customColors.primary,
                  opacity: 0.8,
                },
              }}
            >
              Primary Action
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                color: customColors.secondary,
                borderColor: customColors.secondary,
                borderWidth: '2px',
                borderRadius: 0,
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                '&:hover': { borderWidth: '2px', opacity: 0.8 },
              }}
            >
              Secondary Action
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: customColors.success,
                color: customColors.background,
                border: `2px solid ${customColors.success}`,
                borderRadius: 0,
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                '&:hover': {
                  backgroundColor: customColors.success,
                  opacity: 0.8,
                },
              }}
            >
              Success Action
            </Button>
          </Stack>
        </Grid>

        {/* Status Indicators */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CyberTypography
            variant="subtitle2"
            sx={{ color: customColors.secondary, mb: 2 }}
          >
            Status Indicators
          </CyberTypography>
          <Stack spacing={2}>
            {[
              { color: customColors.info, text: 'Information Message' },
              { color: customColors.warning, text: 'Warning Message' },
              { color: customColors.error, text: 'Error Message' },
            ].map((status, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  border: `1px solid ${status.color}`,
                  backgroundColor: `${status.color}20`,
                }}
              >
                <StatusIndicator color={status.color} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                  {status.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Color Palette Display */}
        <Grid size={{ xs: 12 }}>
          <CyberTypography
            variant="subtitle2"
            sx={{ color: customColors.secondary, mb: 2 }}
          >
            Color Palette
          </CyberTypography>
          <Grid container spacing={1}>
            {Object.entries(customColors).map(([key, color]) => (
              <Grid size={{ xs: 4, sm: 3, md: 2 }} key={key}>
                <Box sx={{ textAlign: 'center' }}>
                  <ColorSwatch
                    color={color}
                    sx={{ width: '100%', height: 60, mb: 1 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      color: customColors.textSecondary,
                    }}
                  >
                    {key}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </CyberPaper>
  );

  // Show loading state if not hydrated
  if (!isHydrated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Typography>Loading theme configuration...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        // overflowY: 'auto',
        backgroundColor: 'background.default',
        fontFamily: 'monospace',
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: `2px solid ${theme.palette.primary.main}`,
        }}
      >
        <Toolbar>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}
          >
            <Box
              sx={{
                p: 1.5,
                border: `2px solid ${theme.palette.primary.main}`,
                backgroundColor: 'transparent',
              }}
            >
              <SettingsIcon sx={{ color: 'primary.main', fontSize: 24 }} />
            </Box>
            <Box>
              <CyberTypography variant="h6" sx={{ color: 'primary.main' }}>
                THEME_CONTROL_CENTER
              </CyberTypography>
              <Typography
                variant="caption"
                sx={{ color: 'success.main', fontFamily: 'monospace' }}
              >
                Advanced theme management & customization
              </Typography>
            </Box>
          </Box>

          {/* Mode Toggle */}
          <Stack direction="row" spacing={1}>
            {[
              {
                mode: 'light' as const,
                icon: <LightMode />,
                label: 'Light',
              },
              {
                mode: 'system' as const,
                icon: <SettingsBrightness />,
                label: 'System',
              },
              { mode: 'dark' as const, icon: <DarkMode />, label: 'Dark' },
            ].map(({ mode: modeValue, icon, label }) => (
              <Tooltip key={modeValue} title={`${label} mode`}>
                <ModeButton
                  onClick={() => handleModeChange(modeValue)}
                  isActive={mode === modeValue}
                >
                  {icon}
                </ModeButton>
              </Tooltip>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{ py: 4, height: '100%', overflowY: 'auto' }}
      >
        <Grid container spacing={4}>
          {/* Theme Selector Panel */}
          <Grid size={{ xs: 12, xl: 4 }}>
            <Stack spacing={3}>
              {/* Theme Selector */}
              <CyberPaper>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <CyberTypography
                    variant="subtitle1"
                    sx={{ color: 'primary.main' }}
                  >
                    <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    THEME_SELECTOR
                  </CyberTypography>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {themes.map((themeOption) => (
                      <CyberCard
                        key={themeOption.id}
                        sx={{
                          cursor: 'pointer',
                          borderColor:
                            currentThemeId === themeOption.id
                              ? 'warning.main'
                              : 'divider',
                          backgroundColor:
                            currentThemeId === themeOption.id
                              ? alpha(theme.palette.warning.main, 0.1)
                              : 'transparent',
                        }}
                        onClick={() => handleThemeChange(themeOption.id)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: 'success.main',
                                  fontFamily: 'monospace',
                                  fontWeight: 'bold',
                                }}
                              >
                                {themeOption.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontFamily: 'monospace',
                                }}
                              >
                                {themeOption.description}
                              </Typography>
                            </Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Chip
                                label={themeOption.category}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 0,
                                  color: 'info.main',
                                  borderColor: 'info.main',
                                  fontFamily: 'monospace',
                                  fontSize: '10px',
                                  textTransform: 'uppercase',
                                }}
                              />
                              {themeOption.category === 'custom' && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTheme(
                                      themeOption.id,
                                      themeOption.name
                                    );
                                  }}
                                  sx={{
                                    color: 'error.main',
                                    '&:hover': {
                                      backgroundColor: alpha(
                                        theme.palette.error.main,
                                        0.1
                                      ),
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Stack>
                          </Box>

                          {/* Color Preview */}
                          <Stack direction="row" spacing={0.5} sx={{ mt: 2 }}>
                            {Object.entries(
                              resolvedMode === 'dark'
                                ? themeOption.darkPalette
                                : themeOption.lightPalette
                            )
                              .filter(([key]) =>
                                [
                                  'primary',
                                  'secondary',
                                  'warning',
                                  'error',
                                  'success',
                                  'info',
                                ].includes(key)
                              )
                              .map(([key, value]) => (
                                <Box
                                  key={key}
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: value.main,
                                    border: `1px solid ${theme.palette.divider}`,
                                  }}
                                  title={key}
                                />
                              ))}
                          </Stack>
                        </CardContent>
                      </CyberCard>
                    ))}
                  </Stack>
                </Box>
              </CyberPaper>

              {/* Quick Actions */}
              <CyberPaper sx={{ borderColor: 'secondary.main' }}>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `2px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  <CyberTypography
                    variant="subtitle1"
                    sx={{ color: 'secondary.main' }}
                  >
                    <FlashOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                    QUICK_ACTIONS
                  </CyberTypography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <CyberButton
                      fullWidth
                      variant={isCustomizing ? 'contained' : 'outlined'}
                      onClick={() => setIsCustomizing(!isCustomizing)}
                      sx={{
                        borderColor: 'warning.main',
                        color: isCustomizing
                          ? 'background.default'
                          : 'warning.main',
                        backgroundColor: isCustomizing
                          ? 'warning.main'
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: isCustomizing
                            ? 'warning.main'
                            : alpha(theme.palette.warning.main, 0.1),
                        },
                      }}
                      startIcon={<PaletteIcon />}
                    >
                      {isCustomizing ? 'Exit Customizer' : 'Create Custom'}
                    </CyberButton>

                    <CyberButton
                      fullWidth
                      variant="outlined"
                      onClick={handleExportTheme}
                      sx={{
                        borderColor: 'info.main',
                        color: 'info.main',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                        },
                      }}
                      startIcon={<Download />}
                    >
                      Export Themes
                    </CyberButton>

                    <CyberButton
                      fullWidth
                      variant="outlined"
                      onClick={() => setImportDialog(true)}
                      sx={{
                        borderColor: 'success.main',
                        color: 'success.main',
                        '&:hover': {
                          backgroundColor: alpha(
                            theme.palette.success.main,
                            0.1
                          ),
                        },
                      }}
                      startIcon={<Upload />}
                    >
                      Import Themes
                    </CyberButton>

                    <CyberButton
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        resetToDefaultThemes();
                        setSnackbar({
                          open: true,
                          message: 'Reset to default themes',
                          severity: 'info',
                        });
                      }}
                      sx={{
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                      startIcon={<RestartAlt />}
                    >
                      Reset All
                    </CyberButton>
                  </Stack>
                </Box>
              </CyberPaper>
            </Stack>
          </Grid>

          {/* Main Content Area */}
          <Grid size={{ xs: 12, xl: 8 }}>
            {isCustomizing ? (
              /* Theme Customizer */
              <Stack spacing={4}>
                <CyberPaper sx={{ borderColor: 'warning.main' }}>
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: `2px solid ${theme.palette.warning.main}`,
                    }}
                  >
                    <CyberTypography
                      variant="h6"
                      sx={{ color: 'warning.main' }}
                    >
                      <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      THEME_CUSTOMIZER
                    </CyberTypography>
                  </Box>

                  <Box sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                      {/* Core Colors */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <CyberTypography
                          variant="subtitle2"
                          sx={{
                            color: 'secondary.main',
                            mb: 3,
                            pb: 1,
                            borderBottom: `1px solid ${theme.palette.secondary.main}`,
                          }}
                        >
                          Core Colors
                        </CyberTypography>
                        <ColorInput
                          label="Primary"
                          value={customColors.primary}
                          onChange={(v) => handleColorChange('primary', v)}
                        />
                        <ColorInput
                          label="Secondary"
                          value={customColors.secondary}
                          onChange={(v) => handleColorChange('secondary', v)}
                        />
                        <ColorInput
                          label="Success"
                          value={customColors.success}
                          onChange={(v) => handleColorChange('success', v)}
                        />
                      </Grid>

                      {/* Status Colors */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <CyberTypography
                          variant="subtitle2"
                          sx={{
                            color: 'secondary.main',
                            mb: 3,
                            pb: 1,
                            borderBottom: `1px solid ${theme.palette.secondary.main}`,
                          }}
                        >
                          Status Colors
                        </CyberTypography>
                        <ColorInput
                          label="Warning"
                          value={customColors.warning}
                          onChange={(v) => handleColorChange('warning', v)}
                        />
                        <ColorInput
                          label="Error"
                          value={customColors.error}
                          onChange={(v) => handleColorChange('error', v)}
                        />
                        <ColorInput
                          label="Info"
                          value={customColors.info}
                          onChange={(v) => handleColorChange('info', v)}
                        />
                      </Grid>

                      {/* Background Colors */}
                      <Grid size={{ xs: 12 }}>
                        <CyberTypography
                          variant="subtitle2"
                          sx={{
                            color: 'secondary.main',
                            mb: 3,
                            pb: 1,
                            borderBottom: `1px solid ${theme.palette.secondary.main}`,
                          }}
                        >
                          Background & Text
                        </CyberTypography>
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <ColorInput
                              label="Background"
                              value={customColors.background}
                              onChange={(v) =>
                                handleColorChange('background', v)
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <ColorInput
                              label="Paper"
                              value={customColors.paper}
                              onChange={(v) => handleColorChange('paper', v)}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <ColorInput
                              label="Text Primary"
                              value={customColors.textPrimary}
                              onChange={(v) =>
                                handleColorChange('textPrimary', v)
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <ColorInput
                              label="Text Secondary"
                              value={customColors.textSecondary}
                              onChange={(v) =>
                                handleColorChange('textSecondary', v)
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        mt: 6,
                        pt: 4,
                        borderTop: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        <CyberButton
                          variant="contained"
                          onClick={applyCustomTheme}
                          sx={{
                            flex: 1,
                            backgroundColor: 'success.main',
                            borderColor: 'success.main',
                            color: 'background.default',
                            '&:hover': {
                              backgroundColor: 'success.main',
                              opacity: 0.8,
                            },
                          }}
                          startIcon={<Save />}
                        >
                          Apply Custom Theme
                        </CyberButton>

                        <CyberButton
                          variant="outlined"
                          onClick={resetCustomColors}
                          sx={{
                            borderColor: 'error.main',
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                            },
                          }}
                          startIcon={<RestartAlt />}
                        >
                          Reset
                        </CyberButton>
                      </Stack>
                    </Box>
                  </Box>
                </CyberPaper>

                {/* Live Preview */}
                <Box
                  sx={{
                    borderLeft: `4px solid ${theme.palette.info.main}`,
                    pl: 2,
                  }}
                >
                  <CyberTypography
                    variant="h6"
                    sx={{ color: 'info.main', mb: 2 }}
                  >
                    <Visibility sx={{ mr: 1, verticalAlign: 'middle' }} />
                    LIVE_PREVIEW
                  </CyberTypography>
                  <DemoSection />
                </Box>
              </Stack>
            ) : (
              /* Theme Details & Preview */
              <Stack spacing={4}>
                {/* Current Theme Details */}
                <CyberPaper sx={{ borderColor: 'secondary.main' }}>
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: `2px solid ${theme.palette.secondary.main}`,
                    }}
                  >
                    <CyberTypography
                      variant="h6"
                      sx={{ color: 'secondary.main' }}
                    >
                      <MonitorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      CURRENT_THEME
                    </CyberTypography>
                  </Box>

                  <Box sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                      <Grid size={{ xs: 12, lg: 8 }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              color: 'success.main',
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                            }}
                          >
                            {currentTheme?.name || 'No Theme Selected'}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontFamily: 'monospace',
                              mt: 1,
                            }}
                          >
                            {currentTheme?.description ||
                              'Please select a theme'}
                          </Typography>
                        </Box>

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ flexWrap: 'wrap', gap: 1 }}
                        >
                          <Chip
                            label={
                              currentTheme?.category?.toUpperCase() || 'NONE'
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 0,
                              color: 'info.main',
                              borderColor: 'info.main',
                              fontFamily: 'monospace',
                              fontSize: '10px',
                            }}
                          />
                          <Chip
                            label={`${resolvedMode.toUpperCase()}_MODE`}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: 0,
                              color: 'warning.main',
                              borderColor: 'warning.main',
                              fontFamily: 'monospace',
                              fontSize: '10px',
                            }}
                          />
                          {mode === 'system' && (
                            <Chip
                              label={`SYSTEM_${systemMode?.toUpperCase()}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderRadius: 0,
                                color: 'secondary.main',
                                borderColor: 'secondary.main',
                                fontFamily: 'monospace',
                                fontSize: '10px',
                              }}
                            />
                          )}
                        </Stack>
                      </Grid>

                      {/* Color Palette */}
                      <Grid size={{ xs: 12, lg: 4 }}>
                        <CyberTypography
                          variant="subtitle2"
                          sx={{ color: 'primary.main', mb: 2 }}
                        >
                          Color Palette
                        </CyberTypography>
                        {currentPalette && (
                          <Grid container spacing={1}>
                            {Object.entries(currentPalette)
                              .filter(([key]) =>
                                [
                                  'primary',
                                  'secondary',
                                  'warning',
                                  'error',
                                  'success',
                                  'info',
                                ].includes(key)
                              )
                              .map(([key, value]) => (
                                <Grid size={{ xs: 4 }} key={key}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <ColorSwatch
                                      color={value.main}
                                      sx={{ width: '100%', height: 50, mb: 1 }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontFamily: 'monospace',
                                        fontSize: '10px',
                                        textTransform: 'uppercase',
                                        color: 'text.secondary',
                                        display: 'block',
                                      }}
                                    >
                                      {key}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontFamily: 'monospace',
                                        fontSize: '9px',
                                        color: 'text.secondary',
                                        display: 'block',
                                        mt: 0.5,
                                      }}
                                    >
                                      {value.main}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </CyberPaper>

                {/* Theme Statistics */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <CyberCard
                      sx={{ borderColor: 'success.main', textAlign: 'center' }}
                    >
                      <CardContent>
                        <Typography
                          variant="h3"
                          sx={{
                            color: 'success.main',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                          }}
                        >
                          {themes.length}
                        </Typography>
                        <CyberTypography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          Available Themes
                        </CyberTypography>
                      </CardContent>
                    </CyberCard>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <CyberCard
                      sx={{ borderColor: 'warning.main', textAlign: 'center' }}
                    >
                      <CardContent>
                        <Typography
                          variant="h3"
                          sx={{
                            color: 'warning.main',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                          }}
                        >
                          {resolvedMode === 'dark' ? 'DARK' : 'LIGHT'}
                        </Typography>
                        <CyberTypography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          Current Mode
                        </CyberTypography>
                      </CardContent>
                    </CyberCard>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <CyberCard
                      sx={{ borderColor: 'info.main', textAlign: 'center' }}
                    >
                      <CardContent>
                        <Typography
                          variant="h3"
                          sx={{
                            color: 'info.main',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                          }}
                        >
                          {themes.filter((t) => t.category === 'custom').length}
                        </Typography>
                        <CyberTypography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          Custom Themes
                        </CyberTypography>
                      </CardContent>
                    </CyberCard>
                  </Grid>
                </Grid>

                {/* Component Showcase */}
                <CyberPaper sx={{ borderColor: 'info.main' }}>
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: `2px solid ${theme.palette.info.main}`,
                    }}
                  >
                    <CyberTypography variant="h6" sx={{ color: 'info.main' }}>
                      <PlayArrow sx={{ mr: 1, verticalAlign: 'middle' }} />
                      COMPONENT_SHOWCASE
                    </CyberTypography>
                  </Box>

                  <Box sx={{ p: 4 }}>
                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      sx={{
                        mb: 4,
                        '& .MuiTab-root': {
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        },
                        '& .MuiTabs-indicator': {
                          height: '3px',
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Tab label="Buttons" />
                      <Tab label="Status" />
                      <Tab label="Typography" />
                      <Tab label="Forms" />
                    </Tabs>

                    {/* Tab Content */}
                    {activeTab === 0 && (
                      <Box>
                        <CyberTypography
                          variant="subtitle2"
                          sx={{ color: 'secondary.main', mb: 3 }}
                        >
                          Button Variations
                        </CyberTypography>
                        <Grid container spacing={2}>
                          {[
                            { label: 'Primary Button', color: 'primary' },
                            { label: 'Secondary Button', color: 'secondary' },
                            { label: 'Success Button', color: 'success' },
                            { label: 'Warning Button', color: 'warning' },
                            { label: 'Error Button', color: 'error' },
                            { label: 'Info Button', color: 'info' },
                          ].map((btn, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                              <Button
                                fullWidth
                                variant="contained"
                                color={btn.color as any}
                                sx={{
                                  borderRadius: 0,
                                  fontFamily: 'monospace',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  py: 2,
                                  border: `2px solid`,
                                  borderColor: `${btn.color}.main`,
                                }}
                              >
                                {btn.label}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {activeTab === 1 && (
                      <Box>
                        <CyberTypography
                          variant="subtitle2"
                          sx={{ color: 'secondary.main', mb: 3 }}
                        >
                          Status Cards
                        </CyberTypography>
                        <Grid container spacing={2}>
                          {[
                            {
                              type: 'success',
                              title: 'System Online',
                              message: 'All systems operational',
                              color: theme.palette.success.main,
                            },
                            {
                              type: 'warning',
                              title: 'Low Resources',
                              message: 'Memory usage at 85%',
                              color: theme.palette.warning.main,
                            },
                            {
                              type: 'error',
                              title: 'Connection Failed',
                              message: 'Unable to connect to server',
                              color: theme.palette.error.main,
                            },
                            {
                              type: 'info',
                              title: 'Update Available',
                              message: 'New theme version ready',
                              color: theme.palette.info.main,
                            },
                          ].map((status, index) => (
                            <Grid size={{ xs: 12, md: 6 }} key={index}>
                              <Alert
                                severity={status.type as any}
                                sx={{
                                  borderRadius: 0,
                                  border: `2px solid ${status.color}`,
                                  backgroundColor: alpha(status.color, 0.1),
                                  '& .MuiAlert-message': {
                                    fontFamily: 'monospace',
                                  },
                                  '& .MuiAlert-icon': {
                                    fontSize: '20px',
                                  },
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: 'bold', mb: 0.5 }}
                                >
                                  {status.title}
                                </Typography>
                                <Typography variant="caption">
                                  {status.message}
                                </Typography>
                              </Alert>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {activeTab === 2 && (
                      <Box>
                        <CyberTypography
                          variant="subtitle2"
                          sx={{ color: 'secondary.main', mb: 3 }}
                        >
                          Typography Scale
                        </CyberTypography>
                        <Stack spacing={2}>
                          <Typography
                            variant="h2"
                            sx={{
                              color: 'primary.main',
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                            }}
                          >
                            H1 - Primary Heading
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{
                              color: 'secondary.main',
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                            }}
                          >
                            H2 - Secondary Heading
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              color: 'text.primary',
                              fontFamily: 'monospace',
                              fontWeight: 'semibold',
                            }}
                          >
                            H3 - Tertiary Heading
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.primary',
                              fontFamily: 'monospace',
                            }}
                          >
                            Body text with normal weight and primary color
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontFamily: 'monospace',
                            }}
                          >
                            Secondary text with smaller size and muted color
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'info.main',
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                            }}
                          >
                            Label text - uppercase and tracked
                          </Typography>
                        </Stack>
                      </Box>
                    )}

                    {activeTab === 3 && (
                      <Box>
                        <CyberTypography
                          variant="subtitle2"
                          sx={{ color: 'secondary.main', mb: 3 }}
                        >
                          Form Elements
                        </CyberTypography>
                        <Grid container spacing={4}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={3}>
                              <CyberTextField
                                fullWidth
                                label="Input Field"
                                placeholder="Enter text here..."
                                variant="outlined"
                              />
                              <FormControl fullWidth>
                                <InputLabel
                                  sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Select Dropdown
                                </InputLabel>
                                <CyberSelect
                                  label="Select Dropdown"
                                  defaultValue=""
                                >
                                  <MenuItem
                                    value="option1"
                                    sx={{ fontFamily: 'monospace' }}
                                  >
                                    Option 1
                                  </MenuItem>
                                  <MenuItem
                                    value="option2"
                                    sx={{ fontFamily: 'monospace' }}
                                  >
                                    Option 2
                                  </MenuItem>
                                  <MenuItem
                                    value="option3"
                                    sx={{ fontFamily: 'monospace' }}
                                  >
                                    Option 3
                                  </MenuItem>
                                </CyberSelect>
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={3}>
                              <CyberTextField
                                fullWidth
                                label="Textarea"
                                placeholder="Enter multiple lines..."
                                multiline
                                rows={4}
                                variant="outlined"
                              />
                              <FormControlLabel
                                control={
                                  <Switch
                                    sx={{
                                      '& .MuiSwitch-track': {
                                        borderRadius: 0,
                                      },
                                      '& .MuiSwitch-thumb': {
                                        borderRadius: 0,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography
                                    sx={{
                                      fontFamily: 'monospace',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    Toggle Switch
                                  </Typography>
                                }
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </CyberPaper>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Footer Status */}
      <Paper
        elevation={0}
        sx={{
          borderTop: `2px solid ${theme.palette.primary.main}`,
          borderRadius: 0,
          backgroundColor: 'background.paper',
          p: 3,
          mt: 6,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid size={{ xs: 12, sm: 8 }}>
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{ flexWrap: 'wrap' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StatusIndicator color={theme.palette.success.main} />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                  >
                    SYSTEM_ACTIVE
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                >
                  Theme: {currentTheme?.name?.toUpperCase() || 'NONE'} | Mode:{' '}
                  {resolvedMode.toUpperCase()}
                  {mode === 'system' && ` (${systemMode?.toUpperCase()})`}
                </Typography>
              </Stack>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 4 }}
              sx={{ textAlign: { xs: 'left', sm: 'right' } }}
            >
              <Typography
                variant="caption"
                sx={{ fontFamily: 'monospace', color: 'info.main' }}
              >
                THEME_CONTROL_v2.1.0
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{
            borderRadius: 0,
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            fontSize: '12px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Theme Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() =>
          setDeleteDialog({ open: false, themeId: '', themeName: '' })
        }
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: `2px solid ${theme.palette.error.main}`,
            fontFamily: 'monospace',
          },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'monospace' }}>
            Are you sure you want to delete "{deleteDialog.themeName}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({ open: false, themeId: '', themeName: '' })
            }
            sx={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteTheme}
            color="error"
            variant="contained"
            sx={{
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              borderRadius: 0,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Themes Dialog */}
      <Dialog
        open={importDialog}
        onClose={() => setImportDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: `2px solid ${theme.palette.info.main}`,
            fontFamily: 'monospace',
          },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
        >
          Import Themes
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'monospace', mb: 2 }}>
            Paste your exported theme data below:
          </Typography>
          <CyberTextField
            fullWidth
            multiline
            rows={10}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste theme JSON data here..."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setImportDialog(false)}
            sx={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImportThemes}
            color="primary"
            variant="contained"
            sx={{
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              borderRadius: 0,
            }}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
