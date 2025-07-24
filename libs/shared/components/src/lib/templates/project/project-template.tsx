import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ProjectData from './types';
import { AugmentedButton } from '../../atoms';

export interface ProjectTemplateProps {
  hasNavigation: boolean;
}

const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'serif',
  fontWeight: 400,
  lineHeight: 0.75,
  letterSpacing: '-0.03ch',
  fontSize: 'clamp(2.5rem, 8vw, 6rem)',
  [theme.breakpoints.up('lg')]: {
    fontSize: 'clamp(4rem, 10vw, 8rem)',
  },
}));

const UppercaseText = styled(Typography)(({ theme }) => ({
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: '0.75rem',
  [theme.breakpoints.up('lg')]: {
    fontSize: '0.875rem',
  },
}));

const NavButton = styled(AugmentedButton)(({ theme }) => ({
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: '0.875rem',
  color: '#010101',
  padding: 0,
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'transparent',
    opacity: 0.5,
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: '0.75rem',
  color: '#010101',
  textDecoration: 'underline',
  '&:hover': {
    opacity: 0.5,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '0.875rem',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#e5e5dd',
  zIndex: 10,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-45%',
    height: '100%',
    width: '45%',
    background:
      'linear-gradient(to right, rgba(251,251,251,0.05), rgba(251,251,251,0.3), rgba(251,251,251,0.6), rgba(251,251,251,0.3), rgba(251,251,251,0.05))',
    animation: 'loading 1.5s ease-in-out infinite',
  },
  '@keyframes loading': {
    '0%': {
      '&::before': {
        left: '-45%',
      },
    },
    '100%': {
      '&::before': {
        left: '100%',
      },
    },
  },
}));

export const ProjectTemplate = ({
  hasNavigation = '',
  ...project
}: ProjectTemplateProps & ProjectData) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    if (project.media?.screenshots) {
      const loadingStates = project.media.screenshots.reduce(
        (acc, _, index) => {
          acc[index] = true;
          return acc;
        },
        {} as { [key: number]: boolean }
      );
      setImageLoading(loadingStates);
    }
  }, [project.media?.screenshots]);

  const handleImageLoad = (index: number) => {
    setImageLoading((prev) => ({ ...prev, [index]: false }));
  };

  const formatTechnologies = (technologies?: string[]) => {
    if (!technologies) return [];
    return technologies.map((tech) => tech.toLowerCase());
  };

  const getProjectYear = () => {
    if (project.technical?.timeline?.startDate) {
      return new Date(project.technical.timeline.startDate).getFullYear();
    }
    if (project.metadata?.lastUpdated) {
      return new Date(project.metadata.lastUpdated).getFullYear();
    }
    return new Date().getFullYear();
  };

  const renderContentSection = (content?: string | string[]) => {
    if (!content) return null;
    if (Array.isArray(content)) {
      return content.map((paragraph, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{ mb: 2, '&:last-child': { mb: 0 } }}
        >
          {paragraph}
        </Typography>
      ));
    }
    return <Typography variant="body2">{content}</Typography>;
  };

  return (
    <Paper
      className="ProjectTemplate--root"
      elevation={0}
      sx={{
        height: '100%', // Changed from maxHeight to height
        overflow: 'hidden', // Prevent root from scrolling
      }}
    >
      <Box
        className="ProjectTemplate--flex-container"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          m: 1,
          mt: 0,
          pt: 3,
          overflow: 'hidden', // Prevent flex container from scrolling
        }}
      >
        {/* Text Content */}
        <Box
          className="ProjectTemplate--text-container"
          sx={{
            height: { xs: 'auto', lg: '100%' },
            width: { xs: '100%', lg: '40%' },
            overflowY: { xs: 'visible', lg: 'auto' }, // Enable scrolling on large screens only
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { xs: 2, lg: 3 },
          }}
        >
          <>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: { xs: 6, lg: 8 },
              }}
            >
              <ProjectTitle variant="h1">{project.projectName}</ProjectTitle>
            </Box>

            {/* Description */}
            <Box sx={{ mb: { xs: 4, lg: 6 } }}>
              {project.basics.description && (
                <Box sx={{ maxWidth: 500 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: { xs: '0.875rem', lg: '1rem' },
                    }}
                  >
                    {project.basics.description}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Credits */}
            <Grid
              container
              spacing={{ xs: 3, lg: 4 }}
              sx={{ mb: { xs: 4, lg: 0 } }}
            >
              {/* Role */}
              {project.technical?.myRole && (
                <Grid size={{ xs: 6, sm: 6, lg: 6, xl: 6 }}>
                  <UppercaseText
                    variant="caption"
                    sx={{ mb: 1, display: 'block' }}
                  >
                    role
                  </UppercaseText>
                  <Typography
                    variant="body2"
                    sx={{ textTransform: 'lowercase', fontSize: '0.75rem' }}
                  >
                    {project.technical.myRole}
                  </Typography>
                </Grid>
              )}

              {/* Tools/Technologies */}
              {project.technical?.technologies && (
                <Grid size={{ xs: 6, sm: 6, lg: 6, xl: 6 }}>
                  <UppercaseText
                    variant="caption"
                    sx={{ mb: 1, display: 'block' }}
                  >
                    tools
                  </UppercaseText>
                  <Box>
                    {formatTechnologies(project.technical.technologies).map(
                      (tech, index) => (
                        <Chip key={index} label={tech} size="small" />
                      )
                    )}
                  </Box>
                </Grid>
              )}

              {/* Year */}
              <Grid size={{ xs: 6, sm: 6, lg: 6, xl: 6 }}>
                <UppercaseText
                  variant="caption"
                  sx={{ mb: 1, display: 'block' }}
                >
                  year
                </UppercaseText>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  {getProjectYear()}
                </Typography>
              </Grid>

              {/* Live Link */}
              {(project.links?.liveDemo || project.links?.repository) && (
                <Grid size={{ xs: 6, sm: 6, lg: 6, xl: 6 }}>
                  <StyledLink
                    href={project.links.liveDemo || project.links.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [visit live]
                  </StyledLink>
                </Grid>
              )}
            </Grid>

            {/* Desktop Navigation */}
            {!isMobile && hasNavigation && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <NavButton shape="buttonLeft">[prev]</NavButton>
                <NavButton shape="buttonRight">[next]</NavButton>
              </Box>
            )}
          </>
        </Box>

        {/* Images */}
        <Box
          className="ProjectTemplate--image-container"
          sx={{
            width: { xs: '100%', lg: '60%' },
            overflow: { xs: 'visible', lg: 'auto' }, // Enable scrolling on large screens only
            height: { xs: 'auto', lg: '100%' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1, lg: 2 },
              p: { xs: 2, lg: 3 },
              pt: { lg: 0 },
            }}
          >
            {project.media?.screenshots?.map((screenshot, index) => (
              <ImageContainer key={index}>
                {imageLoading[index] && <LoadingOverlay />}

                <img
                  src={screenshot.url}
                  alt={screenshot.alt}
                  onLoad={() => handleImageLoad(index)}
                  style={{
                    opacity: imageLoading[index] ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                />
              </ImageContainer>
            ))}

            {/* Show description in content if no screenshots */}
            {(!project.media?.screenshots ||
              project.media.screenshots.length === 0) && (
              <Paper
                sx={{
                  p: 4,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  maxWidth: 800,
                  mx: 'auto',
                }}
              >
                <Box sx={{ space: 3 }}>
                  {project.content?.overview && (
                    <Box sx={{ mb: 3 }}>
                      <UppercaseText variant="h6" sx={{ mb: 2 }}>
                        Overview
                      </UppercaseText>
                      <Box sx={{ lineHeight: 1.6 }}>
                        {renderContentSection(project.content.overview)}
                      </Box>
                    </Box>
                  )}

                  {project.content?.process && (
                    <Box sx={{ mb: 3 }}>
                      <UppercaseText variant="h6" sx={{ mb: 2 }}>
                        Process
                      </UppercaseText>
                      <Box sx={{ lineHeight: 1.6 }}>
                        {renderContentSection(project.content.process)}
                      </Box>
                    </Box>
                  )}

                  {project.content?.results && (
                    <Box>
                      <UppercaseText variant="h6" sx={{ mb: 2 }}>
                        Results
                      </UppercaseText>
                      <Box sx={{ lineHeight: 1.6 }}>
                        {renderContentSection(project.content.results)}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
