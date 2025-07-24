import { Box, useTheme } from '@mui/material';

interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

interface MobileThumbnailsProps {
  screenshots: Screenshot[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export const MobileThumbnails: React.FC<MobileThumbnailsProps> = ({
  screenshots,
  activeIndex,
  onIndexChange,
}) => {
  const theme = useTheme();

  if (screenshots.length <= 1) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1.5 }}>
        {screenshots.map((screenshot, index) => (
          <Box
            key={index}
            component="button"
            onClick={() => onIndexChange(index)}
            sx={{
              flexShrink: 0,
              width: 80,
              height: 64,
              borderRadius: 1,
              overflow: 'hidden',
              border: 2,
              borderColor:
                index === activeIndex
                  ? theme.palette.primary.main
                  : theme.palette.grey[600],
              cursor: 'pointer',
              transition: 'border-color 0.3s',
              '&:hover': {
                borderColor: theme.palette.grey[500],
              },
            }}
          >
            <img
              src={screenshot.url}
              alt={screenshot.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
