import React from 'react';
import { Box, Container, Typography, alpha, useTheme } from '@mui/material';
import { ImageContainer } from '../../../../atoms';
import { ImageMediaData } from '../../../../organisms';

interface HeroSectionProps {
  heroImage: ImageMediaData;
  projectName: string;
  projectSubtitle?: string;
  description?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroImage,
  projectName,
  projectSubtitle,
  description,
}) => {
  const theme = useTheme();

  const { relativePath, detailedCaption, ...imgAttributes } = heroImage;
  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        className="hero-image--container"
        sx={{
          position: 'absolute',
          overflow: 'hidden',
          height: '100%',
          width: '100%',
        }}
      >
        <ImageContainer
          {...imgAttributes}
          lazy={false}
          showSkeletonDuration={1}
          className="hero-image"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          className="hero-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to top, ${alpha(
              theme.palette.background.paper,
              0.7
            )}, ${alpha(theme.palette.grey[900], 0.2)}, transparent)`,
          }}
        />
      </Box>

      <Box
        className="hero-content"
        sx={{
          zIndex: 0,
          position: 'relative',
          bottom: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
          padding: theme.spacing(4),
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 24 }}>
          <Typography
            variant="display"
            className="hero-title"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: theme.palette.primary.main,
              lineHeight: 1,

              fontSize: '1.5rem',
              '@container (min-width: 769px)': {
                fontSize: '3.5rem',
              },
              '@container (min-width: 1200px)': {
                fontSize: '5.5rem',
              },
            }}
          >
            {projectName}
          </Typography>
          {projectSubtitle && (
            <Typography
              variant="h3"
              className="hero-title"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                color: theme.palette.primary.main,
                lineHeight: 1,

                fontSize: '1.25rem',
                '@container (min-width: 769px)': {
                  fontSize: '2.5rem',
                },
                '@container (min-width: 1200px)': {
                  fontSize: '3.75rem',
                },
              }}
            >
              {projectSubtitle}
            </Typography>
          )}
          {description && (
            <Typography
              className="hero-description"
              sx={{
                color: theme.palette.text.primary,
                maxWidth: '768px',

                fontSize: '1rem',
                '@container (min-width: 769px)': {
                  fontSize: '1.25rem',
                },
                '@container (min-width: 1200px)': {
                  fontSize: '1.5rem',
                },
              }}
            >
              {description}
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
};
