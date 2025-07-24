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
} from '@mui/material';
import { ProjectData, ProjectContent } from '../../types';

interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

interface TabData {
  key: string;
  label: string;
}

interface DesktopMainContentProps {
  data: ProjectData;
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  tabs: TabData[];
  renderContent: (content?: string | string[]) => React.ReactNode;
  screenshots: Screenshot[];
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
  activeImageIndex,
  onImageChange,
}) => {
  const theme = useTheme();

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
            color: theme.palette.grey[400],
            '&.Mui-selected': {
              color: theme.palette.common.white,
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
                color: theme.palette.common.white,
              }}
            >
              {activeTab}
            </Typography>
            {renderContent(data.content[activeTab as keyof ProjectContent])}
          </Box>
        )}
      </Box>

      {/* Desktop Image Gallery */}
      {screenshots.length > 1 && (
        <Box>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Gallery
          </Typography>
          <Grid container spacing={3}>
            {screenshots.map((screenshot, index) => (
              <Grid size={{ xs: 12, lg: 6 }} key={index}>
                <Paper
                  sx={{
                    overflow: 'hidden',
                    backgroundColor: theme.palette.grey[800],
                    border: `1px solid ${theme.palette.grey[700]}`,
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
                    <img
                      src={screenshot.url}
                      alt={screenshot.alt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </Box>
                  {screenshot.caption && (
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.grey[300] }}
                      >
                        {screenshot.caption}
                      </Typography>
                    </CardContent>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};
