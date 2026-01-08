import {
  LEDAppBar,
  LedControllerDashboard,
  useLedStatus,
  useSetBrightness,
  useSetGradientPattern,
  useSetHueRotationSpeed,
  useSetInvert,
  useSetPower,
  useSetSolidColor,
} from '@jc/led-controls';
import { AugmentedButton, AugmentedIconButton } from '@jc/ui-components';
import { GradientPatternType, InterpolationMode } from '@jc/utils';
import { Close } from '@mui/icons-material';
import {
  Alert,
  Box,
  Dialog,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

const LedController = () => {
  const tdServerApi = 'https://192.168.4.44:9980';

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

  const [showServerModal, setShowServerModal] = useState<boolean>(false);

  // Use TanStack Query hooks
  const { data: ledStatus, isError, refetch } = useLedStatus();
  const setSolidColor = useSetSolidColor();
  const setGradientPattern = useSetGradientPattern();
  const setBrightness = useSetBrightness();
  const setInvert = useSetInvert();
  const setHueRotationSpeed = useSetHueRotationSpeed();
  const setPower = useSetPower();

  const showWarning = isError;
  const certAccepted = !isError && ledStatus?.status === 'online';
  const ledState = ledStatus?.['led-state'] || null;

  // Handle certificate acceptance via pop-up
  const handleGrantCertificateAccess = () => {
    const certWindow = window.open(
      `${tdServerApi}/?${params}`,
      'TD Certificate',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );

    // Check when window is closed and re-verify connection
    const checkWindow = setInterval(() => {
      if (certWindow?.closed) {
        clearInterval(checkWindow);
        // Give browser a moment to process the certificate acceptance
        setTimeout(async () => {
          const result = await refetch();
          if (!result.isError) {
            setShowServerModal(false);
          }
        }, 500);
      }
    }, 500);
  };

  // Handler functions using TanStack Query mutations
  const handleSolidColorUpdate = (color: string) => {
    setSolidColor.mutate(color);
  };

  const handleGradientPatternUpdate = (data: {
    colorStops: Array<{ position: number; color: string }>; // hex format
    type: GradientPatternType;
    speed: number;
    interpolation: InterpolationMode;
    period?: number;
    direction?: string;
    wave?: {
      type: string | null;
      period: number;
      amplitude: number;
    };
  }) => {
    setGradientPattern.mutate(data);
  };

  const handleBrightnessChange = (brightness: number) => {
    setBrightness.mutate(brightness);
  };

  const handleInvertChange = (invert: number) => {
    setInvert.mutate(invert);
  };

  const handleHueRotationSpeedChange = (rotationSpeed: number) => {
    setHueRotationSpeed.mutate(rotationSpeed);
  };

  const handlePowerChange = (power: boolean) => {
    setPower.mutate(power);
  };

  return (
    <>
      {/* App Bar / Title Bar */}
      <LEDAppBar />

      {/* Main */}
      <Box
        className="LedControllerPage--root"
        sx={{
          position: 'relative',
          height: '100%',
          pb: '65px',
        }}
      >
        {/* TD Server Access Warning */}
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

            <AugmentedButton
              onClick={() => setShowServerModal(true)}
              fullWidth
              color="info"
              variant="outlined"
            >
              Touchdesigner Server Access
            </AugmentedButton>
          </Alert>
        )}

        <LedControllerDashboard
          LEDState={ledState}
          onUpdatePower={handlePowerChange}
          onUpdateSolidColor={handleSolidColorUpdate}
          onUpdateGradientPattern={handleGradientPatternUpdate}
          onUpdateBrightness={handleBrightnessChange}
          onUpdateInvert={handleInvertChange}
          onUpdateHueRotationSpeed={handleHueRotationSpeedChange}
        />

        {/* TouchDesigner Server Access Dialog */}
        <Dialog
          open={showServerModal}
          onClose={() => setShowServerModal(false)}
          aria-labelledby="server-access-modal-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            id="server-access-modal-title"
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              mb: 0,
              pt: 2,
            }}
          >
            Grant Certificate Access
          </DialogTitle>

          <AugmentedIconButton
            size="large"
            color="primary"
            shape="buttonRounded"
            onClick={() => setShowServerModal(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.primary',
            }}
          >
            <Close />
          </AugmentedIconButton>

          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your browser needs to accept the self-signed certificate from
                the TouchDesigner server before the LED controls will work.
              </Typography>
              <Typography variant="body2">
                <strong>Steps:</strong>
              </Typography>
              <Typography variant="body2" component="ol" sx={{ pl: 2, mt: 1 }}>
                <li>
                  Click the button below to open the server in a new window
                </li>
                <li>
                  Click "Advanced" or "Proceed anyway" in the security warning
                </li>
                <li>Close the window when you see the server page</li>
                <li>The LED controls will now work!</li>
              </Typography>
            </Alert>

            <AugmentedButton
              onClick={handleGrantCertificateAccess}
              fullWidth
              color="primary"
              variant="contained"
              size="large"
            >
              Open Server & Accept Certificate
            </AugmentedButton>

            {certAccepted && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  ✓ Certificate accepted! You can close this dialog.
                </Typography>
              </Alert>
            )}
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

export default LedController;
