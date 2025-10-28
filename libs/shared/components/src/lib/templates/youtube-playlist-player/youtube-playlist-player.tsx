import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';

import {
  YouTubePlaylistItem,
  YouTubePlaylistItemsResponse,
} from './youtube-playlist-types';

export interface YouTubePlaylistPlayerProps {
  playlistId: string;
  apiKey: string;
  maxResults?: number;
}

export const YouTubePlaylistPlayer = ({
  playlistId,
  apiKey,
  maxResults = 50,
}: YouTubePlaylistPlayerProps) => {
  const theme = useTheme();
  const [playlistData, setPlaylistData] = useState<YouTubePlaylistItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  const API_KEY = apiKey;

  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to load playlist');
      }

      const data: YouTubePlaylistItemsResponse = await response.json();
      setPlaylistData(data.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (index: number) => {
    setCurrentVideoIndex(index);
    setShouldAutoplay(true);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const currentVideo = playlistData[currentVideoIndex]?.snippet;
  const videoId = currentVideo?.resourceId?.videoId;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        minHeight: { xs: 'auto', md: '100%' },
        maxHeight: '100%',
        p: { xs: 1, sm: 2 },
      }}
    >
      {/* Player Section */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: 1 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            bgcolor: 'black',
          }}
        >
          {videoId && (
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              src={`https://www.youtube.com/embed/${videoId}${
                shouldAutoplay ? '?autoplay=1' : ''
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </Paper>

        <Card elevation={2}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              color="primary"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {currentVideo?.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: { xs: 3, sm: 5 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {currentVideo?.description || 'No description available'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Playlist Section */}
      <Paper
        elevation={3}
        sx={{
          width: { xs: '100%', md: 400 },
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Playlist ({playlistData.length} videos)
          </Typography>
        </Box>

        <List
          sx={{
            overflow: 'auto',
            flex: 1,
            '& .MuiListItemButton-root:hover': {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          {playlistData.map((item, index) => {
            const video = item.snippet;
            const isActive = index === currentVideoIndex;

            if (!video) return <></>;
            return (
              <ListItem
                key={item.id}
                disablePadding
                sx={{
                  bgcolor: isActive
                    ? theme.palette.action.selected
                    : 'transparent',
                  borderLeft: isActive
                    ? `4px solid ${theme.palette.primary.main}`
                    : '4px solid transparent',
                }}
              >
                <ListItemButton
                  onClick={() => handleVideoClick(index)}
                  sx={{ py: { xs: 1, sm: 1.5 } }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={item.snippet?.thumbnails?.default?.url}
                      sx={{
                        width: { xs: 80, sm: 120 },
                        height: { xs: 45, sm: 68 },
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 600 : 400,
                          color: isActive
                            ? theme.palette.primary.main
                            : 'inherit',
                          fontSize: { xs: '0.875rem', sm: '0.875rem' },
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {video.title}
                      </Typography>
                    }
                    secondary={`Video ${index + 1} of ${playlistData.length}`}
                    sx={{ ml: { xs: 1, sm: 2 } }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};
