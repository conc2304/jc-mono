import React from 'react';
import { Box, Tabs, Tab, Typography, useTheme } from '@mui/material';
import { ProjectData, ProjectContent } from '../../types';
import {
  MediaGallery,
  ImageMediaData,
  VideoMediaData,
} from '../../../../organisms';
import { simplePriorityVideoSort } from '../../../../molecules';

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
  screenshots?: ImageMediaData[];
  videos?: VideoMediaData[];
  onMediaClick?: (mediaItem: any) => void; // Callback for when media is clicked
}

export const DesktopMainContent: React.FC<DesktopMainContentProps> = ({
  data,
  activeTab,
  onTabChange,
  tabs,
  renderContent,
  screenshots = [],
  videos = [],
  onMediaClick,
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

      {/* Gallery Component */}
      {(screenshots.length > 0 || videos.length > 0) && (
        <MediaGallery
          images={screenshots}
          videos={videos}
          onMediaClick={onMediaClick}
          sortFunction={simplePriorityVideoSort}
        />
      )}
    </Box>
  );
};
