import React from 'react';
import {
  Box,
  Container,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material';
import { ImageContainer } from '../../../../atoms';
import { ImageMediaData } from '../../../../organisms';

const HeroSectionContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .hero-image': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '& .hero-overlay': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(to top, ${alpha(
      theme.palette.background.paper,
      0.7
    )}, ${alpha(theme.palette.grey[900], 0.2)}, transparent)`,
  },
  '& .hero-content': {
    zIndex: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
    padding: theme.spacing(4),
  },
}));

interface HeroSectionProps {
  heroImage: ImageMediaData;
  projectName: string;
  description?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroImage,
  projectName,
  description,
}) => {
  const theme = useTheme();

  const { relativePath, ...imgAttributes } = heroImage;
  return (
    <HeroSectionContainer>
      <Box
        className="hero-mobile"
        sx={{ position: 'relative', overflow: 'hidden' }}
      >
        <ImageContainer
          {...imgAttributes}
          lazy={false}
          showSkeletonDuration={50}
          className="hero-image"
        />
        <Box className="hero-overlay" />
      </Box>

      <Box className="hero-content">
        <Container maxWidth="xl">
          <Typography
            variant="h1"
            className="title-mobile"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: theme.palette.primary.main,
              lineHeight: 1,
            }}
          >
            {projectName}
          </Typography>
          {description && (
            <Typography
              className="description-mobile"
              sx={{
                color: theme.palette.text.primary,
                maxWidth: '768px',
              }}
            >
              {description}
            </Typography>
          )}
        </Container>
      </Box>
    </HeroSectionContainer>
  );
};
