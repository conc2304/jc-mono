import { alpha, Box, Typography, useTheme } from '@mui/material';

import { TileContentProps } from './live-tile';

export const DefaultTileContent: React.FC<TileContentProps> = ({
  name,
  icon,
  size,
  dateModified,
  metadata,
  isLarge,
  type,
}) => {
  const theme = useTheme();

  return (
    <Box
      className="TileComponentDefault--root"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      {!isLarge && (
        <>
          <Typography
            variant="h3"
            fontWeight="bold"
            noWrap
            sx={{ mb: 0.5 }}
            color="textPrimary"
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.text.primary, 0.8),
              fontSize: '0.65rem',
            }}
          >
            {size ? `${Math.round(size / 1024)} KB` : type || 'File'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.text.primary, 0.7),
              fontSize: '0.65rem',
              mt: 0.5,
            }}
          >
            {dateModified?.toLocaleDateString() || 'Recent'}
          </Typography>
        </>
      )}
    </Box>
  );
};
