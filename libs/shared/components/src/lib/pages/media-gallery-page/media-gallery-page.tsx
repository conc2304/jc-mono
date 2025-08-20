import { Container, Paper, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/system';
import { MediaGallery, MediaGalleryProps } from '../../organisms';

export const MediaGalleryPage = ({
  images,
  videos,
  showSkeletonDuration,
  lazy,
  rootMargin,
  threshold,
}: MediaGalleryProps) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container
      className="MediaGalleryPage--root"
      maxWidth="lg"
      sx={{
        height: '100%',
        overflowY: 'auto',
        containerType: 'inline-size',
        px: isXs ? 0 : undefined,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          '@container (max-width: 769px)': {
            px: 1,
          },
        }}
      >
        <MediaGallery
          images={images}
          videos={videos}
          showSkeletonDuration={showSkeletonDuration}
          lazy={lazy}
          rootMargin={rootMargin}
          threshold={threshold}
        />
      </Paper>
    </Container>
  );
};
