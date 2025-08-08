import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Paper,
  CardContent,
  useTheme,
  Chip,
} from '@mui/material';
import { ProjectData, ProjectContent } from '../../types';
import { getImageUrl, getResponsiveImageSet, getVideoUrl } from '@jc/utils';
import { ImageContainer, VideoPlayer } from '@jc/ui-components';

interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

interface VideoData {
  url: string;
  title?: string;
  type?: 'demo' | 'process' | 'final' | 'inspiration';
  thumbnail?: string;
  caption?: string;
}

interface TabData {
  key: string;
  label: string;
}

interface MediaItem {
  type: 'image' | 'video';
  data: Screenshot | VideoData;
  index: number;
}

interface DesktopMainContentProps {
  data: ProjectData;
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  tabs: TabData[];
  renderContent: (content?: string | string[]) => React.ReactNode;
  screenshots: Screenshot[];
  videos?: VideoData[];
  activeImageIndex: number;
  onImageChange: (index: number) => void;
}

export const DesktopMainContent: React.FC<DesktopMainContentProps> = ({
  data,
  activeTab,
  onTabChange,
  tabs,
  renderContent,
  screenshots,
  videos = [],
  activeImageIndex,
  onImageChange,
}) => {
  const theme = useTheme();

  // Combine screenshots and videos into a single media array
  const mediaItems: MediaItem[] = [
    ...screenshots.map((screenshot, index) => ({
      type: 'image' as const,
      data: screenshot,
      index,
    })),
    ...videos.map((video, index) => ({
      type: 'video' as const,
      data: video,
      index: screenshots.length + index,
    })),
  ];

  const getVideoTypeColor = (type?: string) => {
    switch (type) {
      case 'demo':
        return theme.palette.primary.main;
      case 'process':
        return theme.palette.secondary.main;
      case 'final':
        return theme.palette.success.main;
      case 'inspiration':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const renderMediaItem = (mediaItem: MediaItem) => {
    const { type, data, index } = mediaItem;

    if (type === 'image') {
      const screenshot = data as Screenshot;
      const imgSrcProps = getResponsiveImageSet(screenshot.url);

      return (
        <Grid size={{ xs: 12, lg: 6 }} key={`image-${index}`}>
          <Paper
            sx={{
              overflow: 'hidden',
              backgroundColor: theme.palette.getInvertedMode('secondary'),
              border: `1px solid ${
                theme.palette.secondary[theme.palette.mode]
              }`,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                '& img': {
                  transform: 'scale(1.05)',
                },
              },
            }}
            onClick={() => onImageChange(index)}
          >
            <Box sx={{ height: 256, overflow: 'hidden' }}>
              <ImageContainer
                {...imgSrcProps}
                alt={screenshot.alt}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  background: theme.palette.background.default,
                }}
              />
            </Box>
            {screenshot.caption && (
              <CardContent>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.getContrastText(
                      theme.palette.getInvertedMode('secondary')
                    ),
                  }}
                >
                  {screenshot.caption}
                </Typography>
              </CardContent>
            )}
          </Paper>
        </Grid>
      );
    }

    if (type === 'video') {
      const video = { ...(data as VideoData) };
      video.thumbnail = video.thumbnail
        ? getImageUrl(video.thumbnail, 'thumbnail')
        : undefined;
      video.url = getVideoUrl(video.url);

      return (
        <Grid size={{ xs: 12, lg: 6 }} key={`video-${index}`}>
          <Paper
            sx={{
              overflow: 'hidden',
              backgroundColor: theme.palette.getInvertedMode('secondary'),
              border: `1px solid ${
                theme.palette.secondary[theme.palette.mode]
              }`,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <Box sx={{ height: 256, position: 'relative' }}>
              <VideoPlayer
                video={video}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
                muted={true}
                controls={true}
              />
            </Box>
            {(video.caption || video.title || video.type) && (
              <CardContent>
                <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                  {video.type && (
                    <Chip
                      label={video.type}
                      size="small"
                      sx={{
                        bgcolor: getVideoTypeColor(video.type),
                        color: 'white',
                        textTransform: 'capitalize',
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                  {video.title && (
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.getContrastText(
                          theme.palette.getInvertedMode('secondary')
                        ),
                        fontWeight: 'medium',
                      }}
                    >
                      {video.title}
                    </Typography>
                  )}
                </Box>
                {video.caption && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.getContrastText(
                        theme.palette.getInvertedMode('secondary')
                      ),
                    }}
                  >
                    {video.caption}
                  </Typography>
                )}
              </CardContent>
            )}
          </Paper>
        </Grid>
      );
    }

    return null;
  };

  return (
    <Box>
      {/* Tab Navigation */}
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        sx={{
          mb: 4,
          borderBottom: `1px solid ${theme.palette.grey[800]}`,
          '& .MuiTab-root': {
            textTransform: 'capitalize',
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.key} label={tab.label} value={tab.key} />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ mb: 8 }}>
        {data.content?.[activeTab as keyof ProjectContent] && (
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                textTransform: 'capitalize',
                color: theme.palette.primary.main,
              }}
            >
              {activeTab}
            </Typography>
            {renderContent(data.content[activeTab as keyof ProjectContent])}
          </Box>
        )}
      </Box>

      {/* Media Gallery (Images and Videos) */}
      {mediaItems.length > 0 && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Gallery
            </Typography>
            <Box display="flex" gap={1}>
              {screenshots.length > 0 && (
                <Chip
                  label={`${screenshots.length} Image${
                    screenshots.length !== 1 ? 's' : ''
                  }`}
                  size="small"
                  variant="outlined"
                  sx={{ color: theme.palette.text.secondary }}
                />
              )}
              {videos.length > 0 && (
                <Chip
                  label={`${videos.length} Video${
                    videos.length !== 1 ? 's' : ''
                  }`}
                  size="small"
                  variant="outlined"
                  sx={{ color: theme.palette.text.secondary }}
                />
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            {mediaItems.map(renderMediaItem)}
          </Grid>
        </Box>
      )}
    </Box>
  );
};
