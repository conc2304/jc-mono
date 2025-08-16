import { Box, Stack, Typography, useTheme, keyframes } from '@mui/material';
import { DiagonalLines } from './diagonal-box';
import { HomeFilled, HomeOutlined } from '@mui/icons-material';
import { ensureContrast } from '@jc/utils';
import { useState } from 'react';

// Keyframe animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-2px) rotate(0.5deg); }
  50% { transform: translateY(-4px) rotate(0deg); }
  75% { transform: translateY(-2px) rotate(-0.5deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.2); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const chevronPulse = keyframes`
  0%, 100% { opacity: 0.8; transform: scaleX(1); }
  50% { opacity: 1; transform: scaleX(1.05); }
`;

const textGlow = keyframes`
  0%, 100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
  50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.6); }
`;

const diagonalShift = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
`;

export const NavigationButtons = () => {
  const theme = useTheme();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <Box
      className="NavigationButtons-404"
      sx={{
        height: '100%',
        width: '100%',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Box
        sx={(theme) => ({
          height: '100%',
          width: '100%',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}FF, ${theme.palette.secondary.main}00)`,
          border: '1px solid',
          borderRadius: '4px',
          backdropFilter: 'blur(1px)',
          boxShadow: theme.shadows[8],
          transform: isClicked ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: `${floatAnimation} 6s ease-in-out infinite, ${pulseGlow} 4s ease-in-out infinite`,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            backdropFilter: 'blur(8px)',
            boxShadow: `${theme.shadows[16]}, 0 0 50px rgba(255, 255, 255, 0.1)`,
            transform: isClicked ? 'scale(0.98)' : 'scale(1.02)',
            '& .shimmer-overlay': {
              opacity: 1,
              animation: `${shimmer} 2s ease-in-out infinite`,
            },
            '& .home-icon': {
              transform: 'scale(1.1) rotate(5deg)',
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))',
            },
            '& .chevron-bars': {
              animation: `${chevronPulse} 1s ease-in-out infinite`,
            },
            '& .home-text': {
              animation: `${textGlow} 2s ease-in-out infinite`,
            },
            '& .diagonal-lines': {
              animation: `${diagonalShift} 3s ease-in-out infinite`,
            },
          },
          p: '2rem',
          display: 'flex',
          justifyContent: 'space-around',
          gap: 2,
          '&:active': {
            transform: 'scale(0.95)',
            transition: 'transform 0.1s ease-out',
          },
        })}
      >
        {/* Shimmer overlay effect */}
        <Box
          className="shimmer-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            opacity: 0,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/048/504/413/small_2x/vintage-dark-grunge-background-with-scratches-and-dust-photo.jpg')`,
            backgroundBlendMode: 'screen',
            opacity: 0.25,
            top: 0,
            zIndex: -1,
          }}
        />

        <Box
          sx={(theme) => ({
            aspectRatio: '1 / 1',
            maxHeight: '100%',
            maxWidth: '100%',
            borderRadius: '50%',
            background: `linear-gradient(-135deg, ${theme.palette.primary.main}00, ${theme.palette.secondary.main}00)`,
            border: '1px solid #ffffff50',
            backdropFilter: 'blur(4px)',
            boxShadow: theme.shadows[1],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '-2px',
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
              zIndex: -1,
              animation: `${pulseGlow} 3s ease-in-out infinite`,
            },
          })}
        >
          <HomeFilled
            className="home-icon"
            color="secondary"
            sx={{
              fontSize: '10.5rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))',
            }}
          />
        </Box>

        {/* RIGHT BUTTON SIDE */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0.5,
            position: 'relative',
            flexGrow: 1,
            width: '250px',
          }}
        >
          {/* LEFT CHEVRON BACKGROUND */}
          <Stack width="10%" direction="column" gap={0.5}>
            {Array(12)
              .fill(1)
              .map((_, i, arr) => (
                <Box
                  key={i}
                  className="chevron-bars"
                  sx={(theme) => ({
                    background: ensureContrast(
                      theme.palette.text.primary,
                      theme.palette.getInvertedMode('secondary'),
                      3
                    ).color,
                    flexGrow: 0.5 + Math.sin(i) * 0.25,
                    border: '1px solid',
                    borderColor: theme.palette.getInvertedMode('secondary'),
                    width: '100%',
                    transition: 'all 0.3s ease',
                    animationDelay: `${i * 0.05}s`,
                  })}
                />
              ))}
          </Stack>

          <Box
            sx={{
              position: 'relative',
              height: '100%',
              width: '100%',
            }}
          >
            <Box
              className="diagonal-lines"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'absolute',
                height: '100%',
                width: '100%',
                transition: 'transform 0.3s ease',
              }}
            >
              <DiagonalLines
                lineThickness={10}
                spacing={20}
                direction="diagonal-alt"
                width="45%"
                height="100%"
                color={theme.palette.getInvertedMode('secondary')}
                opacity={0.8}
              />
              <DiagonalLines
                lineThickness={10}
                spacing={20}
                direction="diagonal"
                width="45%"
                height="100%"
                color={theme.palette.getInvertedMode('secondary')}
                opacity={0.8}
              />
            </Box>

            {/* HOME TEXT with layered effect */}
            {[0, 1].map((j) => {
              return 'HOME'.split('').map((char, i, arr) => (
                <Typography
                  key={`${j}-${i}`}
                  className="home-text"
                  sx={(theme) => ({
                    fontFamily: `Saiba${j === 1 ? ' Outline' : ''}`,
                    lineHeight: '2.5rem',
                    fontSize: '5rem',
                    position: 'absolute',
                    top: `${i * 20}%`,
                    left: i % 2 === 0 ? '28%' : '73%',
                    transform: 'translate(-50%, 50%)',
                    fontWeight: 'bold',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${i * 0.1}s`,
                    color:
                      j === 1
                        ? ensureContrast(
                            theme.palette.text.primary,
                            theme.palette.getInvertedMode('secondary'),
                            3
                          ).color
                        : ensureContrast(
                            theme.palette.getInvertedMode('secondary'),
                            ensureContrast(
                              theme.palette.text.primary,
                              theme.palette.getInvertedMode('secondary'),
                              3
                            ).color,
                            3
                          ),
                  })}
                >
                  {char}
                </Typography>
              ));
            })}
          </Box>

          {/* RIGHT CHEVRON BACKGROUND */}
          <Stack width="10%" direction="column">
            {Array(10)
              .fill(1)
              .map((_, i, arr) => (
                <Box
                  key={i}
                  className="chevron-bars"
                  sx={(theme) => ({
                    background: ensureContrast(
                      theme.palette.text.primary,
                      theme.palette.getInvertedMode('secondary'),
                      3
                    ).color,
                    flexGrow: Math.tan(i) + 5.5,
                    border: '1px solid',
                    borderColor: theme.palette.getInvertedMode('secondary'),
                    width: '100%',
                    mt: i % 3 === 1 ? 0.5 : 0.25,
                    transition: 'all 0.3s ease',
                    animationDelay: `${i * 0.07}s`,
                  })}
                />
              ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
