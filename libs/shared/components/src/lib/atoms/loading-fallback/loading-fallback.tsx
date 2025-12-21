import { Box, Typography, useTheme } from '@mui/material';

export const LoadingFallback = ({ message = 'Loading...' }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal,
      }}
    >
      {/* Sci-fi container */}
      <Box
        sx={{
          position: 'relative',
          padding: 4,
          border: `2px solid ${theme.palette.primary.main}`,
          backgroundColor: `${theme.palette.primary.main}08`,
          backdropFilter: 'blur(4px)',
          clipPath:
            'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {/* Hexagonal spinner */}
        <Box sx={{ position: 'relative', width: 80, height: 80 }}>
          {/* Outer ring */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              border: `4px solid ${theme.palette.primary.light}`,
              clipPath:
                'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
              animation: 'spin 2s linear infinite',
              '@keyframes spin': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' },
              },
            }}
          />

          {/* Inner ring */}
          <Box
            sx={{
              position: 'absolute',
              inset: '8px',
              border: `4px solid ${theme.palette.primary.main}`,
              clipPath:
                'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
              animation: 'spin-reverse 1.5s linear infinite',
              '@keyframes spin-reverse': {
                from: { transform: 'rotate(360deg)' },
                to: { transform: 'rotate(0deg)' },
              },
            }}
          />

          {/* Core */}
          <Box
            sx={{
              position: 'absolute',
              inset: '16px',
              border: `2px solid ${theme.palette.primary.dark}`,
              clipPath:
                'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
              animation: 'pulse 1s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.3 },
              },
            }}
          />
        </Box>

        {/* Terminal-style text */}
        {message && (
          <Box
            className="loading-message"
            sx={{
              textAlign: 'center',
              gap: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.dark,
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.875rem',
              }}
            >
              {message}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.primary.main,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
              }}
            >
              INITIALIZING SYSTEMS...
            </Typography>
          </Box>
        )}

        {/* Progress dots */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[0, 200, 400, 600].map((delay, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 4,
                backgroundColor: theme.palette.primary.main,
                animation: `pulse 1s ease-in-out infinite`,
                animationDelay: `${delay}ms`,
                opacity: 0.6 + index * 0.1,
              }}
            />
          ))}
        </Box>

        {/* Corner decorations */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 16,
            height: 16,
            borderTop: `2px solid ${theme.palette.primary.main}`,
            borderRight: `2px solid ${theme.palette.primary.main}`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 16,
            height: 16,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            borderLeft: `2px solid ${theme.palette.primary.main}`,
          }}
        />
      </Box>
    </Box>
  );
};
