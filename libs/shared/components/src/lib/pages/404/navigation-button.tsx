import { Box, Stack, Typography, useTheme } from '@mui/material';
import { DiagonalLines } from './diagonal-box';
import { HomeFilled } from '@mui/icons-material';
import { width } from '@mui/system';
import { Bold } from 'lucide-react';
import { ensureContrast } from '@jc/utils';

export const NavigationButtons = () => {
  const theme = useTheme();
  return (
    <Box
      className="NavigationButtons-404"
      sx={{
        height: '100%',
        width: '100%',
        cursor: 'pointer',
      }}
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
          transform: 'scale(1)',
          transition: 'all 0.3s ease-in',
          '&:hover': {
            backdropFilter: 'blur(5px)',
            boxShadow: theme.shadows[16],
            transform: 'scale(1.01)',
          },
          p: '2rem',
          display: 'flex',
          justifyContent: 'space-around',
          gap: 2,
        })}
      >
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
          })}
        >
          <HomeFilled
            color="secondary"
            sx={{
              fontSize: '10.5rem',
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
          }}
        >
          {/* CHEVRON BACKGROUND */}

          <Stack width="10%" direction="column" gap={0.5}>
            {Array(12)
              .fill(1)
              .map((_, i, arr) => (
                <Box
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
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'absolute',
                height: '100%',
                width: '100%',
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
            {'HOME'.split('').map((char, i, arr) => (
              <Typography
                variant="h2"
                fontSize={'5rem'}
                sx={(theme) => ({
                  position: 'absolute',
                  top: `${i * 20}%`,
                  left: i % 2 === 0 ? '28%' : '73%',
                  transform: 'translate(-50%, -10%)',
                  fontWeight: 'bold',
                  color: ensureContrast(
                    theme.palette.text.primary,
                    theme.palette.getInvertedMode('secondary'),
                    3
                  ).color,
                })}
              >
                {char}
              </Typography>
            ))}
          </Box>
          <Stack width="10%" direction="column">
            {Array(10)
              .fill(1)
              .map((_, i, arr) => (
                <Box
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
                  })}
                />
              ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
