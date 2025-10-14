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

export interface YouTubePlaylistPlayerProps {
  playlistId: string;
  apiKey: string;
}

export const YouTubePlaylistPlayer = ({
  playlistId,
  apiKey,
}: YouTubePlaylistPlayerProps) => {
  const theme = useTheme();
  const [playlistData, setPlaylistData] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = apiKey;

  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to load playlist');
      }

      const data = await response.json();
      setPlaylistData(data.items);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleVideoClick = (index: number) => {
    setCurrentVideoIndex(index);
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
    <Box sx={{ display: 'flex', gap: 2, height: '100vh', p: 2 }}>
      {/* Player Section */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </Paper>

        <Card elevation={2}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              color="primary"
            >
              {currentVideo?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentVideo?.description || 'No description available'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Playlist Section */}
      <Paper
        elevation={3}
        sx={{
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Typography variant="h6">
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
                <ListItemButton onClick={() => handleVideoClick(index)}>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={video.thumbnails.default.url}
                      sx={{ width: 120, height: 68 }}
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
                        }}
                      >
                        {video.title}
                      </Typography>
                    }
                    secondary={`Video ${index + 1} of ${playlistData.length}`}
                    sx={{ ml: 2 }}
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
