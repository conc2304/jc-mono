import React from 'react';
import { Box, useTheme } from '@mui/material';
import { TorusFieldProgressMemo } from '../../../torus-field-progress';
import { ScanLinesOverlay } from '../../atoms';

interface TorusProgressPanelProps {
  progress?: number;
  progressMessage?: string;
  hideText?: boolean;
  showAsBackground?: boolean;
}

export const TorusProgressPanel: React.FC<TorusProgressPanelProps> = ({
  progress,
  progressMessage,
  hideText = false,
  showAsBackground = false,
}) => {
  const theme = useTheme();

  const colors = {
    backgroundColor: theme.palette.background.paper,
    beamColor: theme.palette.getInvertedMode('info'),
    torusColor: theme.palette.primary.main,
    particleColor: theme.palette.getInvertedMode('info'),
    verticalLineColor: theme.palette.warning.main,
    themeMode: theme.palette.mode,
  };

  if (showAsBackground) {
    return (
      <Box
        sx={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: 0,
          zIndex: 0,
          opacity: 0.25,
        }}
      >
        <TorusFieldProgressMemo
          hideText
          colors={colors}
          progress={progress}
          progressMessage={progressMessage}
        />
        <ScanLinesOverlay className="ScanLinesOverlay--component" />
      </Box>
    );
  }

  return (
    <>
      <TorusFieldProgressMemo
        progress={progress}
        progressMessage={progressMessage}
        hideText={hideText}
        colors={colors}
      />
      <ScanLinesOverlay className="ScanLinesOverlay--component" />
    </>
  );
};

export default TorusProgressPanel;
