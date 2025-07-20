'use client';
import { alignItems, Box, flexDirection, justifyContent } from '@mui/system';
import { BootText } from '../boot-text';
import { useCallback, useState } from 'react';
import { GlitchText } from '@jc/ui-components';
import { Typography } from '@mui/material';
import { BootMessage } from '../../types';
import { TorusFieldProgress } from '../torus-field-progress';

const scrambleCharacterSet =
  '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

interface BootUpSequenceProps {
  bootMessages: BootMessage[];
}

export const BootUpSequence = ({ bootMessages }: BootUpSequenceProps) => {
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
    <Box className="BootUpSequence--root">
      <Box
        style={{
          // padding: '40px',
          // backgroundColor: '#1a1a1a',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Box sx={{ margin: '0 auto', textAlign: 'center', fontSize: '10rem' }}>
          <GlitchText
            variant="h6"
            sx={{ textAlign: 'center', margin: ' auto', fontSize: '200px' }}
          >
            CLYZBY_OS V.0.1
          </GlitchText>
        </Box>
        <Box sx={{ minWidth: '400px' }}>
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
        </Box>

        {/* BOOT PROGRESS */}
        {/* // TODO - Replace Progress Bar */}
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
            <Box
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
        {/*  */}
        {/*  */}

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        >
          <TorusFieldProgress
            progress={(progress.current / progress.total) * 100}
            title="QUANTUM FIELD"
            subtitle="INITIALIZATION"
          />
        </Box>
      </Box>
    </Box>
  );
};
