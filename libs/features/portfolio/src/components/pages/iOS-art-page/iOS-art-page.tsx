import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/system';
import { MediaGallery, MediaGalleryProps } from '@jc/ui-components';
import ArtGalleryProcess, {
  ArtGalleryProcessProps,
} from './art-gallery-process';

export const MediaGalleryPage = ({
  images,
  videos,
  showSkeletonDuration,
  lazy,
  rootMargin,
  threshold,
  processStartImages,
  processEndImages,
  decorImages,
  highlightVideo,
}: MediaGalleryProps & ArtGalleryProcessProps) => {
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
        <Box mb={4}>
          <ArtGalleryProcess
            processStartImages={processStartImages}
            processEndImages={processEndImages}
            decorImages={decorImages}
            highlightVideo={highlightVideo}
          />
        </Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem', textAlign: 'center' },
            fontWeight: 300,
            color: 'text.primary',
            my: 10,
          }}
        >
          The Gallery
        </Typography>
        <MediaGallery
          images={images}
          videos={videos}
          showSkeletonDuration={showSkeletonDuration}
          lazy={lazy}
          rootMargin={rootMargin}
          threshold={threshold}
          allowMobileScrolling={false}
        />
      </Paper>
    </Container>
  );
};
