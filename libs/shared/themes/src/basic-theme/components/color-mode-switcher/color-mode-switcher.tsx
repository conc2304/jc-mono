import { DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { alpha, Stack } from '@mui/system';
import { useColorMode } from '../../context';

export const ColorModeSwitcher = () => {
  const { mode, setMode, resolvedMode } = useColorMode();

  const upperClip = '0.25rem';
  const lowerClip = '1rem';

  const colorModes = [
    {
      mode: 'light' as const,
      icon: <LightMode fontSize="small" />,
      label: 'Light',
    },
    {
      mode: 'system' as const,
      icon: <SettingsBrightness fontSize="small" />,
      label: 'System',
    },
    {
      mode: 'dark' as const,
      icon: <DarkMode fontSize="small" />,
      label: 'Dark',
    },
  ];

  const augData = [
    {
      attr: 'bl-clip tl-clip border',
      style: {
        '--aug-border-all': '1px',
        '--aug-tl': upperClip,
        '--aug-bl': lowerClip,
      },
    },
    {
      attr: 'none',
      style: {},
    },
    {
      attr: 'br-clip tr-clip border',
      style: {
        '--aug-border-all': '1px',
        '--aug-tr': upperClip,
        '--aug-br': lowerClip,
      },
    },
  ];

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
  };
  return (
    <Stack
      direction="row"
      spacing={0}
      data-augmented-ui="bl-clip br-clip tr-clip tl-clip border"
      sx={(theme) => ({
        '--aug-tr': upperClip,
        '--aug-tl': upperClip,
        '--aug-br': lowerClip,
        '--aug-bl': lowerClip,
        '--aug-border-all': '1px',
        '--aug-border-bg': theme.palette.action.focus,
        '&:hover': {
          '--aug-border-bg': theme.palette.action.hover,
        },
        p: '1px',

        bgcolor: alpha(theme.palette.background.paper, 0.5),
        backdropFilter: 'blur(4px)',
      })}
    >
      {colorModes.map(({ mode: modeValue, icon, label }, i) => (
        <Tooltip key={modeValue} title={`${label} mode`}>
          <IconButton
            data-augmented-ui={augData[i].attr}
            onClick={() => handleModeChange(modeValue)}
            sx={(theme) => ({
              ...augData[i].style,
              '--aug-border-bg':
                resolvedMode === modeValue
                  ? alpha(theme.palette.warning.main, 0.5)
                  : 'transparent',
              padding: '12px',
              color:
                mode === modeValue
                  ? theme.palette.warning.main
                  : theme.palette.text.secondary,
              transition: 'all 0.3s ease',

              backgroundColor:
                mode === modeValue
                  ? alpha(theme.palette.warning.main, 0.075)
                  : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                borderColor: theme.palette.warning.main,
                transform: 'scale(1.05)',
              },
            })}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
};
