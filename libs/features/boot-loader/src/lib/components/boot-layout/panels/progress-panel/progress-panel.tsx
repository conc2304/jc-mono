// components/ProgressPanel.tsx
import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { DiagonalLines, ProgressBar } from '@jc/ui-components';
import { AugmentedPanel } from '../../atoms/augmented-panel';

interface ProgressPanelProps {
  progress: { current: number; message: string };
  isComplete: boolean;
  progressMessages: { start: string; end: string };
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
  progress,
  isComplete,
  progressMessages,
}) => {
  const theme = useTheme();

  return (
    <AugmentedPanel
      augmentType="progress"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flex: 1,
        height: '100%',
      }}
    >
      <DiagonalLines
        lineThickness={25}
        spacing={65}
        width="100%"
        height="80px"
        direction="diagonal-alt"
        color={theme.palette.action.focus}
      />
      <Box
        sx={{
          position: 'absolute',
          height: '101%',
          width: '101%',
          top: -1,
          left: -1,
          opacity: 0.8,
          zIndex: 0,
          mixBlendMode: 'darken',
        }}
      >
        <ProgressBar
          progress={progress.current}
          height="100%"
          width="100%"
          textColor={theme.palette.background.paper}
          color={theme.palette.primary.main}
          glowColor={theme.palette.getInvertedMode('primary')}
          backgroundColor={alpha(theme.palette.background.paper, 0.8)}
          borderColor={theme.palette.action.focus}
          label={
            isComplete && progress.current === 100
              ? progressMessages.end
              : progressMessages.start
          }
          progressFillColor={`linear-gradient(90deg,
            ${alpha(theme.palette.getInvertedMode('primary'), 0.1)} 0%,
            ${alpha(theme.palette.primary.main, 0.6)} 50%,
            ${alpha(theme.palette.getInvertedMode('primary', true), 0.4)} 100%
          )`}
        />
      </Box>
    </AugmentedPanel>
  );
};
