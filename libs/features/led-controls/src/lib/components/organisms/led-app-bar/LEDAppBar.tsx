import { AugmentedButton, AugmentedIconButton } from '@jc/ui-components';
import { Close, HomeFilled, Palette } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { MinimalThemeSwitcher } from '@jc/theme-components';

import { useState } from 'react';

export const LEDAppBar = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('sm'));

  const appBarBtnSize = isXs
    ? 'small'
    : isSm
    ? 'medium'
    : isMd
    ? 'large'
    : 'large';

  const appBarBtnColor = theme.palette.getHighestContrastColor(
    theme.palette.getInvertedMode('secondary', true),
    ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const,
    theme
  ).colorKey;

  return (
    <AppBar
      enableColorOnDark
      position="static"
      color="secondary"
      sx={{
        backgroundColor: 'unset',
        color: 'unset',
      }}
    >
      <Toolbar
        variant={'dense'}
        data-augmented-ui="border inlay"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          '--aug-border-all': '0px',
          '--aug-border-bottom': '2px',
          '--aug-border-opacity': 0.5,
          '--aug-inlay-all': '5px',
          '--aug-bl': theme.spacing(1),
        }}
      >
        <Box>
          {/* Route Home */}
          <Tooltip title="Home">
            <AugmentedButton
              href="/home"
              color={appBarBtnColor}
              variant={appBarBtnSize === 'large' ? 'outlined' : 'text'}
              size={appBarBtnSize}
              shape="gamingButtonR"
            >
              <HomeFilled />
            </AugmentedButton>
          </Tooltip>
        </Box>
        <Typography
          variant="h1"
          fontWeight="bold"
          textAlign="center"
          fontSize={['0.75rem', '1.25rem', '1.75rem', '2.25rem', '2.65rem']}
          lineHeight="1.5"
        >
          LED Controller
        </Typography>

        {/* Theme Selector Dialog Opener */}
        <Box color={appBarBtnColor}>
          <Tooltip title="Theme Selector">
            <AugmentedButton
              onClick={() => setIsModalOpen(!isModalOpen)}
              color={appBarBtnColor}
              variant={appBarBtnSize === 'large' ? 'outlined' : 'text'}
              size={appBarBtnSize}
              shape="gamingButtonL"
              sx={{}}
            >
              <Palette color="inherit" />
            </AugmentedButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Theme Switcher Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="theme-selector-modal-title"
        aria-describedby="theme-selector-modal-description"
        fullWidth
      >
        <DialogTitle
          id="theme-selector-modal-title"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            pt: 2,
          }}
        >
          Select App Theme
        </DialogTitle>

        <AugmentedIconButton
          size="large"
          color="primary"
          shape="buttonRounded"
          onClick={() => setIsModalOpen(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.primary',
          }}
        >
          <Close />
        </AugmentedIconButton>
        <DialogContent>
          <MinimalThemeSwitcher />
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};
