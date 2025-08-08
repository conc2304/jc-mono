// components/Hero/HeroSection.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material';
import { ImageCarousel } from './image-carousel';
import { getResponsiveImageSet } from '@jc/utils';
import { ImageContainer } from '../../../../atoms';

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

interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

interface HeroSectionProps {
  screenshots: Screenshot[];
  activeImageIndex: number;
  onImageChange: (index: number) => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  projectName: string;
  description?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  screenshots,
  activeImageIndex,
  onImageChange,
  onNextImage,
  onPrevImage,
  projectName,
  description,
}) => {
  const theme = useTheme();

  const imgSrcProps = getResponsiveImageSet(screenshots[activeImageIndex]?.url);
  return (
    <HeroSectionContainer>
      {screenshots.length > 0 && (
        <Box
          className="hero-mobile"
          sx={{ position: 'relative', overflow: 'hidden' }}
        >
          <ImageContainer
            {...imgSrcProps}
            alt={screenshots[activeImageIndex]?.alt}
            className="hero-image"
          />
          <Box className="hero-overlay" />

          <ImageCarousel
            screenshots={screenshots}
            activeIndex={activeImageIndex}
            onIndexChange={onImageChange}
            onNext={onNextImage}
            onPrev={onPrevImage}
          />
        </Box>
      )}

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
