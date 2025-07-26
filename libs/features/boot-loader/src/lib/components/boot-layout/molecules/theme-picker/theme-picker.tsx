import {
  Box,
  Collapse,
  darken,
  Dialog,
  Modal,
  PaletteOptionNames,
  Paper,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { PickerPanel } from './picker-panel';
import { useEnhancedTheme } from '@jc/themes';

const StatusBar = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StatusIndicator = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  border: `1px solid ${theme.palette.getInvertedMode('primary')}`,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

const StatusIcons = styled(Box)({
  display: 'flex',
  gap: 8,
});

const StatusIcon = styled(Box)<{}>(({ theme }) => ({
  width: 24,
  height: 24,
  border: `1px solid ${theme.palette.primary.main}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ThemePickerPanel = () => {
  const { currentTheme } = useEnhancedTheme();
  const theme = useTheme();

  const [pickerOpen, setPickerOpen] = useState(false);

  const themeColors: PaletteOptionNames[] = [
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
  ];

  return (
    <>
      <StatusBar
        onClick={() => setPickerOpen((prev) => !prev)}
        sx={(theme) => ({
          background: theme.palette.background.paper,
          transition: 'all 0.2s ease-in',
          cursor: 'pointer',
          '&:hover': {
            background: darken(theme.palette.background.paper, 0.3),
          },
        })}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <StatusIndicator />
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            THEMING INTEGRATION STATUS : {currentTheme?.name.toUpperCase()} [
            {theme.palette.mode.toUpperCase()}]
          </Typography>
        </Box>
        <StatusIcons>
          {themeColors.map((color) => (
            <StatusIcon
              sx={(theme) => ({
                '& > div': {
                  width: 8,
                  height: 8,
                  backgroundColor: theme.palette[color].main,
                },
              })}
              key={color}
            >
              <div />
            </StatusIcon>
          ))}
        </StatusIcons>
      </StatusBar>

      <Dialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'unset',
            boxShadow: 'unset',
            backgroundImage: 'unset',
          },
        }}
      >
        <Box
          data-augmented-ui="border bl-clip br-clip tl-clip tr-clip"
          sx={(theme) => ({
            p: 2,
            backgroundColor: theme.palette.background.paper,
            '&[data-augmented-ui]': {
              '--aug-bl': theme.spacing(2),
              '--aug-br': theme.spacing(2),
              '--aug-tl': theme.spacing(2),
              '--aug-tr': theme.spacing(2),

              '--aug-border-all': '2px',
              '--aug-border-bg': theme.palette.primary.main,
            },
          })}
        >
          <PickerPanel />
        </Box>
      </Dialog>
    </>
  );
};
