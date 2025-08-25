import React from 'react';
import {
  Box,
  Typography,
  alpha,
  useTheme,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { ContentContainer } from '../../molecules/live-tile/styled-components';
import { TileContentProps } from '../../molecules';
import { ProjectData } from '../project';
import { DiagonalLines, ImageContainer } from '../../atoms';
import { Star } from '@mui/icons-material';

export const ProjectsTileContent: React.FC<TileContentProps<ProjectData[]>> = ({
  name,
  children,
  currentIndex = 0,
  isLarge,
  tileData,
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('md'));
  const projects: ProjectData[] = tileData || [];
  const currentProject = projects[currentIndex];

  const { relativePath, detailedCaption, ...imageProps } =
    currentProject.media.thumbnail;
  return (
    <Box
      className="TileTemplate--projects"
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
    >
      {currentProject && isLarge && (
        <ContentContainer>
          <Box
            className="ProjectTile--content-left"
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              alignContent: 'flex-start',
              pl: 4,
              justifyContent: 'space-evenly',
            }}
          >
            {/* Image Flex Item */}
            <Box
              data-augmented-ui="tl-clip br-clip border"
              sx={{
                '--aug-border-bg': theme.palette.action.focus,
                '--aug-border-all': '2px',
                flexGrow: 1,
                maxWidth: '60%',
                maxHeight: '40%',
              }}
            >
              <ImageContainer
                className="ProjectImageContainer--root"
                {...imageProps}
                showSkeletonDuration={0}
                lazy={false}
                sx={{
                  height: '100%',
                  '*': { objectFit: 'fill' },
                }}
              />
            </Box>

            {/* Text Flex Item */}
            <Box display={'flex'} position={'relative'}>
              <DiagonalLines
                lineThickness={4}
                height="4rem"
                width="4rem"
                direction="diagonal-alt"
                color={theme.palette.text.primary}
              />

              <Stack
                textAlign="left"
                position="relative"
                flexGrow={1}
                pl={2}
                justifyContent="space-between"
              >
                <Typography
                  variant="h3"
                  color="textPrimary"
                  fontWeight="medium"
                  noWrap
                  // sx={{verticalAlign: }}
                >
                  {currentProject.projectName}
                  {currentProject.metadata?.featured && (
                    <Star
                      sx={{
                        pt: 0.25,
                        ml: 1,
                        color: 'warning.main',
                        fontSize: 12,
                      }}
                      fill="currentColor"
                    />
                  )}
                </Typography>
                <Typography
                  variant="caption"
                  color="textPrimary"
                  fontWeight="medium"
                  noWrap
                >
                  {currentProject.projectSubtitle}
                </Typography>
              </Stack>
            </Box>
          </Box>

          {isMd && (
            <Box
              className="ProjectTile--content-right"
              flexGrow={1}
              sx={{
                maxHeight: '100%',
                width: '100%',
              }}
            >
              <Typography
                variant="display"
                sx={{
                  writingMode: 'sideways-lr',
                  lineHeight: 1.2,
                  textOverflow: 'clip',
                  fontSize: isLg
                    ? '6.5rem !important'
                    : isMd
                    ? '5rem !important'
                    : '4rem !important',
                  textAlign: 'center',
                  maxHeight: '100%',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  transform: 'translateX(0%)',
                  bgcolor: alpha(theme.palette.action.active, 0.5),
                  zIndex: 0,
                }}
              >
                {(
                  currentProject.basics.category || currentProject.basics.type
                ).slice(0, 4)}

                <DiagonalLines
                  width="20px"
                  height="100%"
                  lineThickness={1}
                  spacing={10}
                  direction="diagonal"
                  color={alpha(theme.palette.action.active, 0.5)}
                  sx={{
                    position: 'absolute',
                    left: '-20px',
                    top: 0,
                    bottom: 0,
                    border: '3px solid',
                    borderColor: alpha(theme.palette.action.active, 0.5),
                  }}
                />
              </Typography>
            </Box>
          )}
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
