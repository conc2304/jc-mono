import { Box, useTheme } from '@mui/material';
import { DiagonalLines } from './diagonal-box';
import { HomeFilled } from '@mui/icons-material';

export const NavigationButtons = () => {
  const theme = useTheme();
  return (
    <Box
      className="NavigationButtons-404"
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={(theme) => ({
          height: '100%',
          width: '100%',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}FF, ${theme.palette.secondary.main}00)`,
          border: '1px solid',
          borderColor: 'red',
          backdropFilter: 'blur(1px)',
          boxShadow: theme.shadows[8],
          transform: 'scale(1)',
          transition: 'all 0.3s ease-in',
          '&:hover': {
            backdropFilter: 'blur(5px)',
            boxShadow: theme.shadows[16],
            transform: 'scale(1.01)',
          },
          p: '5%',
          display: 'flex',
          justifyContent: 'space-around',
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
      </Box>
    </Box>
  );
};
