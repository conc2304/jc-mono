import {
  Box,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  styled,
  alpha,
  useTheme,
} from '@mui/material';
import {
  SunIcon as LightMode,
  MoonStarIcon as DarkMode,
  MonitorCogIcon as SettingsBrightness,
} from 'lucide-react';
import { ColorMode } from '../../types';

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

interface ModeSwitcherButtonGroupProps {
  mode: ColorMode;
  resolvedMode: 'light' | 'dark';
  systemMode: 'light' | 'dark';
  onModeChange?: (mode: ColorMode) => void;
  compact?: boolean;
  showText?: boolean;
}

export const ModeSwitcherButtonGroup = ({
  compact,
  onModeChange,
  mode,
  resolvedMode,
  systemMode,
  showText = true,
}: ModeSwitcherButtonGroupProps) => {
  const theme = useTheme();

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

  if (compact) {
    return (
      <Stack direction="row" spacing={0.5}>
        {modeButtons.map(
          ({ mode: btnMode, icon, label, component: ButtonComponent }) => (
            <Tooltip key={btnMode} title={`${label} mode`}>
              <ButtonComponent
                size="small"
                onClick={() => onModeChange && onModeChange(btnMode)}
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
                onClick={() => onModeChange && onModeChange(btnMode)}
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
        Current: {resolvedMode.toUpperCase()}
        {mode === 'system' && `(${systemMode?.toUpperCase()})`}
      </Typography>
    </Box>
  );
};
