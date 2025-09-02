import { Box, Container, Paper, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/system';
import { MediaGallery, MediaGalleryProps } from '../../organisms';
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
          />
        </Box>
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
