'use client';
import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Container,
  styled,
  keyframes,
} from '@mui/material';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { GlitchText } from '@jc/ui-components';

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

// Keyframe animations
const scanlines = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
`;

const gridPulse = keyframes`
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
`;

// Styled components
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000 70%)',
  color: '#00ff88',
  fontFamily: '"JetBrains Mono", monospace',
  overflow: 'hidden',
  position: 'relative',
}));

const ScanlinesOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: 'linear-gradient(transparent 50%, rgba(0, 255, 136, 0.03) 50%)',
  backgroundSize: '100% 4px',
  animation: `${scanlines} 0.1s linear infinite`,
});

const GridBackground = styled(Box)({
  position: 'absolute',
  inset: 0,
  opacity: 0.2,
  backgroundImage: `
    linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
  `,
  backgroundSize: '50px 50px',
  animation: `${gridPulse} 4s ease-in-out infinite`,
});

const MainTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Orbitron", sans-serif',
  fontSize: '4rem',
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#00ff88',
  marginBottom: theme.spacing(2),
  '@media (max-width: 768px)': {
    fontSize: '2.5rem',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  color: '#00ff66',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  opacity: 0,
  transform: 'translateY(16px)',
}));

const BootTextContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(0, 255, 136, 0.3)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backdropFilter: 'blur(4px)',
  minHeight: '400px',
  fontFamily: '"JetBrains Mono", monospace',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  opacity: 0,
  marginBottom: theme.spacing(3),
}));

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#1a1a1a',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(to right, #00ff88, #00ffff)',
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
  },
}));

const FinalStatus = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  opacity: 0,
  transform: 'scale(0.95)',
}));

const StatusBox = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  border: '1px solid #00ff88',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2, 4),
  backgroundColor: 'rgba(0, 255, 136, 0.1)',
}));

const BootLine = styled(Box)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  margin: '4px 0',
  color: '#00ff88',
  fontFamily: '"JetBrains Mono", monospace',
  '&:last-child': {
    color: '#00ffff',
    fontWeight: 'bold',
    fontSize: '1.1em',
  },
});

interface CyberpunkBootSequenceProps {}

export const CyberpunkBootSequence: React.FC<
  CyberpunkBootSequenceProps
> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bootTextRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bootMessages: [string,string][] = [
      '> INITIALIZING QUANTUM CORE...',
      '> LOADING NEURAL PATHWAYS...',
      '> DECRYPTING MEMORY BANKS...',
      '> ESTABLISHING SECURE PROTOCOLS...',
      '> SYNCHRONIZING TEMPORAL MATRICES...',
      '> ACTIVATING DEFENSE SYSTEMS...',
      '> CALIBRATING SENSORY ARRAYS...',
      '> LOADING USER INTERFACE...',
      '> AUTHENTICATION VERIFIED...',
      '> SYSTEM FULLY OPERATIONAL...',
      '',
      'WELCOME TO THE NEXUS',
      'ACCESS GRANTED',
    ];

    const initAnimations = (): void => {
      // Create timeline
      const tl = gsap.timeline();






      // Boot text animation
      tl.to(
        bootTextRef.current,
        {
          opacity: 1,
          duration: 0.3,
        },
        '+=0.5'
      );

      // Animate each boot message
      let currentIndex = 0;
      const animateBootText = (): void => {
        if (currentIndex < bootMessages.length) {
          const message = bootMessages[currentIndex];

          if (message === '') {
            // Empty line pause
            setTimeout(() => {
              currentIndex++;
              animateBootText();
            }, 300);
            return;
          }

          // Create new line element
          const line = document.createElement('div');
          line.className = 'boot-line';
          line.textContent = message;
          line.style.whiteSpace = 'nowrap';
          line.style.overflow = 'hidden';
          line.style.margin = '4px 0';
          line.style.color = '#00ff88';
          line.style.fontFamily = '"JetBrains Mono", monospace';

          if (bootTextRef.current) {
            bootTextRef.current.appendChild(line);
          }

          // Typing animation
          gsap.fromTo(
            line,
            {
              width: 0,
              opacity: 0,
            },
            {
              width: 'auto',
              opacity: 1,
              duration: message.length * 0.02 + 0.3,
              ease: 'none',
              onComplete: () => {
                // Random glitch chance
                if (Math.random() < 0.3) {
                  createGlitchEffect(line);
                }

                setTimeout(() => {
                  currentIndex++;
                  animateBootText();
                }, 100);
              },
            }
          );

      };

      // Start boot sequence after initial animations
      setTimeout(animateBootText, 2000);



      // Random text glitches on existing text
      setInterval(() => {
        const allLines = bootTextRef.current?.querySelectorAll('.boot-line');
        if (allLines && allLines.length > 0 && Math.random() < 0.2) {
          const randomLine = allLines[
            Math.floor(Math.random() * allLines.length)
          ] as HTMLElement;
          createGlitchEffect(randomLine);
        }
      }, 2000);
    };

    const createGlitchEffect = (element: HTMLElement): void => {
      const originalText = element.textContent || '';
      const words = originalText.split(' ');

      // Pick random word(s) to glitch
      const glitchIndices: number[] = [];
      for (let i = 0; i < words.length; i++) {
        if (Math.random() < 0.4) {
          glitchIndices.push(i);
        }
      }

      if (glitchIndices.length === 0) return;

      const glitchChars = '█▓▒░▀▄▌▐│┤┐└┴┬├─┼╔╗╚╝║═╬◄►▲▼';
      const alienFonts = ['Wingdings', 'Webdings', 'Symbol'];

      glitchIndices.forEach((index) => {
        const originalWord = words[index];

        // Create glitch sequence
        const glitchFrames: Array<{ text: string; font: string }> = [];

        // Frame 1: Random characters
        let glitchedWord = '';
        for (let i = 0; i < originalWord.length; i++) {
          glitchedWord +=
            glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        glitchFrames.push({ text: glitchedWord, font: 'JetBrains Mono' });

        // Frame 2: Alien font
        glitchFrames.push({
          text: originalWord,
          font: alienFonts[Math.floor(Math.random() * alienFonts.length)],
        });

        // Frame 3: More random chars
        glitchedWord = '';
        for (let i = 0; i < originalWord.length; i++) {
          glitchedWord +=
            glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        glitchFrames.push({ text: glitchedWord, font: 'JetBrains Mono' });

        // Animate glitch sequence
        let frameIndex = 0;
        const glitchInterval = setInterval(() => {
          if (frameIndex < glitchFrames.length) {
            const frame = glitchFrames[frameIndex];
            words[index] = frame.text;
            element.textContent = words.join(' ');
            element.style.fontFamily = frame.font;

            // Add color glitch
            if (frameIndex === 1) {
              element.style.color = '#ff0080';
              element.style.textShadow = '2px 0 #00ffff, -2px 0 #ff0080';
            }

            frameIndex++;
          } else {
            // Restore original
            words[index] = originalWord;
            element.textContent = words.join(' ');
            element.style.fontFamily = '"JetBrains Mono", monospace';
            element.style.color = '#00ff88';
            element.style.textShadow = 'none';
            clearInterval(glitchInterval);
          }
        }, 80);
      });
    };

    initAnimations();
  }, []);

  return (
    <MainContainer ref={containerRef}>
      {/* Scanlines */}
      <ScanlinesOverlay />

      {/* Grid background */}
      <GridBackground />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Main Title */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            {/* <MainTitle ref={titleRef} variant="h1"> */}
            <GlitchText>NEXUS OS</GlitchText>
            {/* </MainTitle> */}
          </Box>

          {/* Subtitle */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Subtitle ref={subtitleRef}>
              Quantum Neural Interface v3.7.2
            </Subtitle>
          </Box>

          {/* Boot Text Container */}
          <BootTextContainer ref={bootTextRef} elevation={0}>
            {/* Boot messages will be added here dynamically */}
          </BootTextContainer>

          {/* Progress Bar */}
          <ProgressContainer ref={progressRef}>
            <CustomLinearProgress variant="determinate" value={0} />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: '#00ff66',
                mt: 1,
              }}
            >
              SYSTEM INITIALIZATION
            </Typography>
          </ProgressContainer>

          {/* Final Status */}
          <FinalStatus ref={statusRef}>
            <StatusBox>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: '#00ff88',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                ACCESS GRANTED
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#00ff66',
                  mt: 0.5,
                }}
              >
                Welcome to your portfolio
              </Typography>
            </StatusBox>
          </FinalStatus>
        </Container>
      </Box>
    </MainContainer>
  );
};
