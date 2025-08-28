// components/BootTextPanel.tsx
import React from 'react';
import { useTheme } from '@mui/material';
import { AugmentedPanel } from '../../atoms/augmented-panel';
import { BootText } from '../../../boot-text';
import { BootMessage } from '../../../../types';

interface BootTextPanelProps {
  bootMessages: BootMessage[];
  scrambleCharacterSet: string;
  onProgress: (
    percentComplete: number,
    currentMessage: string,
    messageIndex: number,
    charIndex: number
  ) => void;
  onComplete: () => void;
  textWrapMode?: 'ellipsis' | 'wrap';
  flex?: number;
}

export const BootTextPanel: React.FC<BootTextPanelProps> = ({
  bootMessages,
  scrambleCharacterSet,
  onProgress,
  onComplete,
  textWrapMode,
  flex,
}) => {
  const theme = useTheme();

  return (
    <AugmentedPanel
      augmentType="envelope"
      sx={{
        flex: flex || 1,
        minHeight: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BootText
        bootMessages={bootMessages}
        typeSpeed={1.8}
        lineDelay={1.2}
        cursorChar="█"
        scrambleChars={12}
        textColor={theme.palette.primary[theme.palette.getInvertedMode()]}
        scrambleDuration={0.6}
        charDelay={0.05}
        scrambleCharSet={scrambleCharacterSet}
        hoverScrambleChars={8}
        hoverScrambleDuration={0.5}
        onProgress={onProgress}
        onComplete={onComplete}
        textWrapMode={textWrapMode}
        flex={1}
      />
    </AugmentedPanel>
  );
};
