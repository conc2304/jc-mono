import { LedControllerDashboard } from '@jc/led-controls';
import { MinimalThemeSwitcher } from '@jc/theme-components';
import { AugmentedButton, AugmentedIconButton } from '@jc/ui-components';
import { hexToRgb } from '@jc/utils';
import { Close, HomeFilled, Palette as PaletteIcon } from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Box,
  Dialog,
  DialogTitle,
  getContrastRatio,
  Link,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

const LedController = () => {
  const tdServerApi = 'https://192.168.4.44:9980';
  const apiPath = '/api/v1';

  const theme = useTheme();
  const params = new URLSearchParams({
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    background: theme.palette.background.paper,
    text: theme.palette.text.primary,
    referer_url: window.location.href,
  });
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
  const [showWarning, setShowWarning] = useState<boolean>(false);

  // Check LED controller status on load
  useEffect(() => {
    const checkStatus = async () => {
      // setShowWarning(false);
      try {
        const response = await fetch(`${tdServerApi}${apiPath}/status`);
        if (!response.ok) {
          setShowWarning(true);
        }
      } catch (error) {
        setShowWarning(true);
      }
    };

    checkStatus();

    // double check on page refocus
    window.addEventListener('focus', checkStatus);
    return () => {
      window.removeEventListener('focus', checkStatus);
    };
  }, [tdServerApi]);

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

    console.log({ response });

    if (!response.ok) {
      setShowWarning(true);
    }
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

    if (!response.ok) {
      setShowWarning(true);
    }
  };

  const appBarBtnColor =
    // Find the semantic color that has sufficient contrast with the app bar background
    [
      ...([
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error',
      ] as const),
    ].sort((a, b) => {
      const paletteA = theme.palette[a as keyof typeof theme.palette];
      const paletteB = theme.palette[b as keyof typeof theme.palette];

      const contrastA =
        typeof paletteA === 'object' && 'main' in paletteA
          ? getContrastRatio(
              paletteA.main,
              theme.palette.getInvertedMode('secondary', true)
            )
          : 0;
      const contrastB =
        typeof paletteB === 'object' && 'main' in paletteB
          ? getContrastRatio(
              paletteB.main,
              theme.palette.getInvertedMode('secondary', true)
            )
          : 0;
      return contrastB - contrastA;
    })[0];

  return (
    <>
      {/* App Bar / Title Bar */}
      <AppBar
        enableColorOnDark
        position="static"
        color="secondary"
        sx={{
          backgroundColor: 'unset',
          color: 'unset',
          // borderBottom: '1px solid',
          // borderBottomColor: alpha(theme.palette.primary.main, 0.5),
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
                <PaletteIcon color="inherit" />
              </AugmentedButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main */}
      <Box
        className="LedControllerPage--root"
        sx={{
          position: 'relative',
          height: '100%',
          pb: '65px',
        }}
      >
        {showWarning && (
          <Alert
            severity="warning"
            sx={{
              m: 2,
              border: '1px solid',
              borderColor: 'warning.main',
              borderRadius: 'unset',
            }}
            color="warning"
            onClose={() => setShowWarning(false)}
          >
            <Typography variant="body2">
              The LED controller only works on my personal home WiFi to control
              my personal LED lights.
              <br />
              <br />
              If on Jose's home wifi visit and approve the touchdesigner server
              url:
              <br />
              <br />
            </Typography>

            <Link
              href={`${tdServerApi}/?${params}`}
              target="_blank"
              width="100%"
              color="info"
            >
              Touchdesigner Server Access
            </Link>
          </Alert>
        )}
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
    </>
  );
};

export default LedController;
