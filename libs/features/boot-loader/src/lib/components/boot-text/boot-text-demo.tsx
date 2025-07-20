'use client';
import { GlitchText } from '@jc/ui-components';
import { BootText } from './boot-text';
import { useCallback, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { BootMessage } from '../../types';

// Example boot messages with hidden message hover functionality
const bootMessages: BootMessage[] = [
  'Initializing system...',
  ['Loading kernel modules...', 'Injecting backdoor...'],
  'Starting network services...',
  ['Mounting file systems...', 'Accessing classified data...'],
  'Starting user services...',
  ['System boot complete.', 'Welcome, Agent Smith.'],
  '',
  'Welcome to Terminal OS v2.1.0',
  ['Type "help" for available commands.', 'Type "hack" to begin infiltration.'],
];

const scrambleCharacterSet =
  '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Example usage component with progress tracking
export const BootTextExample = () => {
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    message: '',
  });
  const [isComplete, setIsComplete] = useState(false);

  const handleProgress = useCallback(
    (current: number, total: number, message: string) => {
      setProgress({ current, total, message });
    },
    []
  );

  const handleBootComplete = useCallback(() => {
    setIsComplete(true);
    console.log('Boot sequence complete!');
  }, []);

  return (
    <Box
      style={{
        padding: '40px',
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ margin: '0 auto', textAlign: 'center' }}>
        <GlitchText variant="h6" sx={{ textAlign: 'center', margin: ' auto' }}>
          CLYZBY_OS V.0.1
        </GlitchText>
      </Box>
      <BootText
        bootMessages={bootMessages}
        typeSpeed={1.8}
        lineDelay={1.2}
        cursorChar="█"
        scrambleChars={12}
        scrambleDuration={0.6}
        charDelay={0.05}
        scrambleCharSet={scrambleCharacterSet}
        hoverScrambleChars={8}
        hoverScrambleDuration={0.5}
        onProgress={handleProgress}
        onComplete={handleBootComplete}
      />

      <Box
        sx={{
          textAlign: 'center',
          // marginBottom: '20px',
          fontFamily: '"JetBrains Mono", monospace',
          color: '#00ff41',
          my: 2.5,
        }}
      >
        <Typography variant="body2">
          Progress: {progress.current}/{progress.total}
          {progress.message && ` - ${progress.message}`}
        </Typography>
        <Box
          sx={{
            width: '300px',
            height: '4px',
            backgroundColor: '#333',
            margin: '10px auto',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${
                progress.total > 0
                  ? (progress.current / progress.total) * 100
                  : 0
              }%`,
              height: '100%',
              backgroundColor: '#00ff41',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
        {isComplete && (
          <Typography
            variant="body2"
            sx={{ color: '#ffff00', marginTop: '10px' }}
          >
            ✓ Boot Complete!
          </Typography>
        )}
      </Box>
    </Box>
  );
};
