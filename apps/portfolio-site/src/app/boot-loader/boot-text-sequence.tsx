'use client';
import React, { memo, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { Typography, Box } from '@mui/material';

// Register plugins
gsap.registerPlugin(useGSAP, TextPlugin);

interface BootTextProps {
  bootMessages: string[];
  className?: string;
  autoStart?: boolean;
  typeSpeed?: number;
  lineDelay?: number;
  cursorChar?: string;
  onComplete?: () => void;
  onProgress?: (current: number, total: number, message: string) => void;
}

const BootTextInner: React.FC<BootTextProps> = ({
  bootMessages,
  className = '',
  autoStart = true,
  typeSpeed = 2,
  lineDelay = 0.5,
  cursorChar = '_',
  onComplete,
  onProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<number>(0);

  // Store callbacks in refs to avoid dependency issues
  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  // Update refs when callbacks change
  onCompleteRef.current = onComplete;
  onProgressRef.current = onProgress;

  useGSAP(
    () => {
      if (!autoStart || !containerRef.current || bootMessages.length === 0)
        return;

      const container = containerRef.current;

      // Clear container and reset
      container.innerHTML = '';
      currentLineRef.current = 0;

      // Create the display elements
      const textElement = document.createElement('div');
      textElement.className = 'boot-text';
      textElement.style.display = 'inline';

      const cursorElement = document.createElement('span');
      cursorElement.className = 'boot-cursor';
      cursorElement.textContent = cursorChar;
      cursorElement.style.marginLeft = '2px';

      const lineContainer = document.createElement('div');
      lineContainer.style.fontFamily = '"JetBrains Mono", monospace';
      lineContainer.style.color = '#00ff41';
      lineContainer.style.fontSize = '14px';
      lineContainer.style.lineHeight = '1.6';
      lineContainer.style.whiteSpace = 'pre-wrap';

      lineContainer.appendChild(textElement);
      lineContainer.appendChild(cursorElement);
      container.appendChild(lineContainer);

      // Cursor animation
      let cursor = gsap
        .to('.boot-cursor', {
          opacity: 0,
          ease: 'power2.inOut',
          repeat: -1,
          duration: 0.8,
        })
        .pause();

      // Text animation timeline
      let textTimeline = gsap
        .timeline({
          autoRemoveChildren: true,
          onComplete: () => {
            cursor.pause();
            gsap.set('.boot-cursor', { opacity: 0 });
            onCompleteRef.current?.();
          },
        })
        .pause();

      // Function to update text (adapted from CodePen)
      function updateText(
        inputText: string,
        lineIndex: number,
        currentMessage: string,
        isLast: boolean = false
      ) {
        if (cursor.paused()) {
          cursor.play();
        }
        if (textTimeline.paused()) {
          textTimeline.play();
        }

        textTimeline.add(
          gsap
            .timeline()
            .to('.boot-text', {
              duration: typeSpeed,
              text: {
                value: inputText,
                rtl: false, // LTR instead of RTL
              },
              ease: 'none',
              onComplete: () => {
                // Notify progress after each line completes
                onProgressRef.current?.(
                  lineIndex + 1,
                  bootMessages.length,
                  currentMessage
                );

                if (isLast) {
                  cursor.pause();
                  gsap.set('.boot-cursor', { opacity: 0 });
                }
              },
            })
            .set({}, {}, `+=${lineDelay}`) // Add delay between lines
        );
      }

      // Build text progressively with each message on a new line
      let accumulatedText = '';
      bootMessages.forEach((message, index) => {
        if (index > 0) {
          accumulatedText += '<br />'; // Use \n instead of <br /> for proper text rendering
        }
        accumulatedText += message;
        const isLast = index === bootMessages.length - 1;
        updateText(accumulatedText, index, message, isLast);
      });
    },
    {
      scope: containerRef,
      dependencies: [bootMessages, autoStart, typeSpeed, lineDelay, cursorChar],
    }
  );

  return (
    <Box
      ref={containerRef}
      className={`boot-text-container ${className}`}
      sx={{
        fontFamily: '"JetBrains Mono", monospace',
        backgroundColor: '#0a0a0a',
        color: '#00ff41',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #333',
        minHeight: '200px',
        fontSize: '14px',
        lineHeight: 1.4,
        overflow: 'hidden',
        position: 'relative',

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(ellipse at center, rgba(0,255,65,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        },

        // Terminal-like styling
        boxShadow: 'inset 0 0 20px rgba(0,255,65,0.1)',
      }}
    >
      {/* Content will be dynamically generated */}
    </Box>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const BootText = memo(BootTextInner);

const bootMessages = [
  'Initializing system...',
  'Loading kernel modules...',
  'Starting network services...',
  'Mounting file systems...',
  'Starting user services...',
  'System boot complete.',
  '',
  'Welcome to Terminal OS v2.1.0',
  'Type "help" for available commands.',
];

// Example usage component with progress tracking
export const BootTextExample: React.FC = () => {
  const [progress, setProgress] = React.useState({
    current: 0,
    total: 0,
    message: '',
  });
  const [isComplete, setIsComplete] = React.useState(false);

  // Use useCallback to prevent function recreation on every render
  const handleProgress = useCallback(
    (current: number, total: number, message: string) => {
      setProgress({ current, total, message });
      console.log(`Progress: ${current}/${total} - "${message}"`);
    },
    []
  );

  const handleBootComplete = useCallback(() => {
    setIsComplete(true);
    console.log('Boot sequence complete!');
  }, []);

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#00ff41',
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        Boot Sequence Demo
      </Typography>

      {/* Progress Display */}
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: '"JetBrains Mono", monospace',
          color: '#00ff41',
        }}
      >
        <Typography variant="body2">
          Progress: {progress.current}/{progress.total}
          {progress.message && ` - ${progress.message}`}
        </Typography>
        <div
          style={{
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
        </div>
        {isComplete && (
          <Typography
            variant="body2"
            sx={{ color: '#ffff00', marginTop: '10px' }}
          >
            ✓ Boot Complete!
          </Typography>
        )}
      </Box>

      <BootText
        bootMessages={bootMessages}
        typeSpeed={1.5}
        lineDelay={0.5}
        cursorChar="█"
        onProgress={handleProgress}
        onComplete={handleBootComplete}
      />
    </div>
  );
};
