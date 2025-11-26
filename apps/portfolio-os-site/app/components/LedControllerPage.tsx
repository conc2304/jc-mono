import { LedControllerDashboard } from '@jc/led-controller';
import { MinimalThemeSwitcher } from '@jc/theme-components';
import { AugmentedButton, AugmentedIconButton } from '@jc/ui-components';
import { hexToRgb } from '@jc/utils';
import { Close, HomeFilled, Palette } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Dialog,
  DialogTitle,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

const LedController = () => {
  const tdServerApi = 'https://192.168.4.44:9980';
  const apiPath = '/api/v1';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // TODO handle api calls here
  const handleSolidColorUpdate = async (color: string) => {
    console.log('LED-Controller MAKE API CALL : ', color);

    const { r, g, b } = hexToRgb(color);

    const response = await fetch(`${tdServerApi}${apiPath}/color`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ r, g, b }),
    });
  };

  const handleGradientPattenUpdate = async ({
    colorStops,
    type,
    speed,
    interpolation,
  }: {
    colorStops: Array<{ position: number; r: number; g: number; b: number }>;
    type: string;
    speed: number;
    interpolation: string;
  }) => {
    console.log(
      'LED-Controller MAKE API CALL - GRADIENT/PATTERN: ',
      colorStops,
      type,
      speed,
      interpolation
    );

    const response = await fetch(`${tdServerApi}${apiPath}/gradient-pattern`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ colorStops, type, speed, interpolation }),
    });
  };

  return (
    <Box
      className="LedControllerPage--root"
      sx={{
        position: 'relative',
        height: '100%',
        pb: '40px',
      }}
    >
      {/* App Bar / Title Bar */}
      <AppBar enableColorOnDark position="static" color="primary">
        <Toolbar
          variant={'dense'}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Box>
            {/* Route Home */}
            <Tooltip title="Home">
              <AugmentedButton
                href="/home"
                color="secondary"
                variant={appBarBtnSize === 'large' ? 'outlined' : 'text'}
                size={appBarBtnSize}
                shape="gamingButton"
                sx={{}}
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
          <Box>
            <Tooltip title="Theme Selector">
              <AugmentedButton
                onClick={() => setIsModalOpen(!isModalOpen)}
                color="secondary"
                variant={appBarBtnSize === 'large' ? 'outlined' : 'text'}
                size={appBarBtnSize}
                shape="gamingButton"
                sx={{}}
              >
                <Palette />
              </AugmentedButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <LedControllerDashboard
        onUpdateSolidColor={handleSolidColorUpdate}
        onUpdateGradientPattern={handleGradientPattenUpdate}
      />

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
            mb: 1,
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
        <MinimalThemeSwitcher />
      </Dialog>
    </Box>
  );
};

export default LedController;
