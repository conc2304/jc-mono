// components/BootTextPanel.tsx
import React from 'react';
import { useTheme, alpha } from '@mui/material';
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
  textWrapMode = 'wrap',
  flex = 1,
}) => {
  const theme = useTheme();

  return (
    <AugmentedPanel
      augmentType="envelope"
      sx={{
        // Key changes: use proper flex shorthand and ensure container constraints
        flex: `${flex} 1 0`, // flex-grow: flex, flex-shrink: 1, flex-basis: 0
        minHeight: 0, // Critical: allows flex item to shrink
        height: '100%', // Fill the parent container
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.background.paper, 0.6),
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
        flex={1} // Fill available space within the panel
        minHeight={0} // Allow shrinking
        autoScroll={true} // Enable internal scrolling
      />
    </AugmentedPanel>
  );
};
