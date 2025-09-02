import { Box, Container, Typography, Grid } from '@mui/material';
import { styled, useTheme, getContrastRatio } from '@mui/material/styles';
import { ImageContainer } from '../../atoms';
import { ImageMediaData } from '../../organisms';
import { CSSProperties } from 'react';

const StyledBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default}, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
  minHeight: '100vh',
}));

const SectionTitle = styled(Typography)(({ theme, borderColor }) => ({
  fontWeight: 300,
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `2px solid ${borderColor}`,
}));

export interface ArtGalleryProcessProps {
  processStartImages: ImageMediaData[];
  processEndImages: ImageMediaData[];
  decorImages: [ImageMediaData, ImageMediaData];
}

const ArtGalleryProcess = ({
  processStartImages,
  processEndImages,
  decorImages,
}: ArtGalleryProcessProps) => {
  const theme = useTheme();

  //
  // image is black on a white background, make the black background disappear in any mode with any background
  const imgBgRatio = getContrastRatio('#FFF', theme.palette.background.paper);
  console.log({ imgBgRatio });
  const decorImageStyles: CSSProperties =
    imgBgRatio > 5
      ? {
          filter: 'invert(1)',
          mixBlendMode: 'plus-lighter',
        }
      : {
          mixBlendMode: 'multiply',
        };

  // getContrastRatio(),

  return (
    <StyledBox>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Header */}
        <Box textAlign="center" mb={10}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 300,
              color: 'text.primary',
              mb: 2,
            }}
          >
            iOS Art Gallery
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              maxWidth: '48rem',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            A collection of art produced entirely and exclusively using mobile
            phone apps on my iPhone.
          </Typography>
        </Box>

        {/* The Need Section */}
        <Box mb={15}>
          <Grid container spacing={6} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 3 }}>
                <SectionTitle
                  variant="h3"
                  borderColor={theme.palette.primary.main}
                >
                  The Need
                </SectionTitle>
                <Box
                  sx={{
                    '& > *': { mb: 2 },
                    color: 'text.secondary',
                    lineHeight: 1.7,
                  }}
                >
                  <Grid container spacing={2} alignItems="flex-start" py={2}>
                    {processStartImages.map((imageData) => (
                      <Grid size={{ xs: 3 }} key={imageData.src}>
                        <ImageContainer {...imageData} height={'100px'} />
                      </Grid>
                    ))}
                  </Grid>
                  <Typography mb={2}>
                    My "mobile" studio art began, as it does for many artists of
                    all walks of life, through music. My favorite band, The
                    Glitch Mob, teamed up with StageBloc Development to produce
                    the Mirrorgram app for iOS. This gave me the opportunity to
                    take seemingly mundane photos from my everyday life on my
                    iPhone and transform them into entirely new visceral
                    experiences. They began to act as a photo album of my
                    life—each photo containing and conveying a memory, each
                    discernible only by me and those involved. Yet I can proudly
                    share my experience, complex and masked as it may be.
                  </Typography>

                  <Typography>
                    The need to make art on-the-go arose from my lack of
                    physical studio space. I had just moved from Oklahoma, where
                    my own backyard served as both sculpture and painting
                    studio—a place where I could play and experiment with
                    different mediums. Moving to Boston meant giving up this
                    physical space to create in. I had nowhere to set up shop,
                    nowhere I could let creativity and messes flow and intermix.
                    As I delved into the world of photography apps, I discovered
                    more powerful ways to distort and embellish the world around
                    me. I now use over 20 separate apps in a physically infinite
                    studio that is with me wherever I may roam.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                {processEndImages.map((imageData) => (
                  <Grid size={{ xs: 6 }} key={imageData.src}>
                    <ImageContainer {...imageData} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Influences Section */}
        <Box mb={15}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <ImageContainer
                {...decorImages[0]}
                sx={{
                  ...decorImageStyles,
                  height: { xs: '300px', md: '400px' },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 3 }}>
                <SectionTitle
                  variant="h3"
                  borderColor={theme.palette.secondary.main}
                >
                  Influences in the Digital Age
                </SectionTitle>
                <Box
                  sx={{
                    '& > *': { mb: 2 },
                    color: 'text.secondary',
                    lineHeight: 1.7,
                  }}
                >
                  <Typography>
                    I purchased my first iPhone in Boston in 2013. Inspired by
                    The Glitch Mob—whose classical methodology and compositional
                    structure contrasts beautifully with their use of
                    technology—I use image manipulation via various iOS apps to
                    create modern, digital collages.
                  </Typography>
                  <Typography>
                    Largely influenced by Boston's urban, contemporary
                    architecture and modern geometric shapes, mundane
                    photographs of familiar cityscapes and favorite hiking spots
                    are transformed into surreal yet somewhat familiar scenes.
                    Incorporating visual influences from contemporary
                    surrealism, I mix natural and urban structures to add wonder
                    and playfulness to otherwise mundane moments in our human
                    experience.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Philosophy Section */}
        <Box>
          <Grid container spacing={6} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 0 }}>
                <SectionTitle
                  variant="h3"
                  borderColor={theme.palette.secondary.main}
                >
                  Philosophy
                </SectionTitle>
                <Box
                  sx={{
                    '& > *': { mb: 2 },
                    color: 'text.secondary',
                    lineHeight: 1.7,
                  }}
                >
                  <Typography>
                    My use of an iPhone for artistic creation and expression
                    represents a fundamental shift in the experience of art and
                    aesthetic expression. My mobile art series focuses on
                    abstract expression through geometry and masking techniques,
                    as well as distorting reality through photo manipulations.
                  </Typography>
                  <Typography>
                    The process involves the characteristic development of
                    personal aesthetic expression through curiosity and
                    exploration. Making art—and the experience of it—becomes an
                    integral part of daily life and the digital experience. As
                    the rise of Instagram's artistic community suggests, my work
                    is <em>intended</em> to be experienced through the medium of
                    a mobile and digital device.
                  </Typography>
                  <Typography>
                    The accessibility of iPhone and app technology is the appeal
                    of digital media: sharing my work on social media
                    effectively makes an iPhone an art gallery in every pocket
                    and purse.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ImageContainer
                {...decorImages[1]}
                sx={{
                  ...decorImageStyles,
                  height: { xs: '300px', md: '400px' },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </StyledBox>
  );
};

export default ArtGalleryProcess;
