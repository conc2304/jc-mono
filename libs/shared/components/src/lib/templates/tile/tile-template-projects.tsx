import React, { useState, useEffect } from 'react';
import { Box, Typography, alpha, useTheme, styled } from '@mui/material';
import {
  ContentContainer,
  IconContainer,
} from '../../molecules/live-tile/styled-components';
import { TileContentProps } from '../../molecules';
import { ProjectData } from '../project';
import { ImageContainer } from '../../atoms';
import { Star } from '@mui/icons-material';

export const ProjectsTileContent: React.FC<TileContentProps<ProjectData[]>> = ({
  name,
  children,
  currentIndex = 0,
  isLarge,
  tileData,
}) => {
  const theme = useTheme();
  const projects: ProjectData[] = tileData || [];
  const currentProject = projects[currentIndex];

  const { relativePath, detailedCaption, ...imageProps } =
    currentProject.media.thumbnail;
  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* {isLarge && (
        <Box mb={2}>
          <Typography variant="h6" color="white" fontWeight="bold">
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: alpha(theme.palette.common.white, 0.8) }}
          >
            {projects.length} projects
          </Typography>
        </Box>
      )} */}

      {currentProject && isLarge && (
        <ContentContainer sx={{ mb: 2 }}>
          <Box textAlign="center" position={'relative'}>
            <ImageContainer
              className="ProjectImageContainer--root"
              {...imageProps}
              showSkeletonDuration={0}
              lazy={false}
              sx={{ height: '100px', pb: 1, '*': { objectFit: 'contain' } }}
            />
            <Typography
              variant="body2"
              color="white"
              fontWeight="medium"
              noWrap
            >
              {currentProject.projectName}
              {currentProject.metadata?.featured && (
                <Star
                  sx={{ pt: 0.25, ml: 1, color: '#fbbf24', fontSize: 12 }}
                  fill="currentColor"
                />
              )}
            </Typography>
            <Typography
              variant="caption"
              color="white"
              fontWeight="medium"
              noWrap
            >
              {currentProject.projectSubtitle}
            </Typography>
          </Box>
        </ContentContainer>
      )}

      {!isLarge && (
        <Box textAlign="center">
          <Typography variant="caption" color="white" fontWeight="bold">
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.8),
              display: 'block',
            }}
          >
            {projects.length} projects loaded
          </Typography>
        </Box>
      )}
    </Box>
  );
};
