import React from 'react';
import { Box, Tabs, Tab, Typography, useTheme } from '@mui/material';
import { ProjectData, ProjectContent } from '../../types';
import { MediaGallery, simplePriorityVideoSort } from '@jc/ui-components';

interface TabData {
  key: string;
  label: string;
}

interface DesktopMainContentProps {
  projectData: ProjectData;
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  tabs: TabData[];
  renderContent: (content?: string | string[]) => React.ReactNode;
  onMediaClick?: (mediaItem: any) => void; // Callback for when media is clicked
}

export const DesktopMainContent: React.FC<DesktopMainContentProps> = ({
  projectData,
  activeTab,
  onTabChange,
  tabs,
  renderContent,
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
        {projectData.content?.[activeTab as keyof ProjectContent] && (
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
            {renderContent(
              projectData.content[activeTab as keyof ProjectContent]
            )}
          </Box>
        )}
      </Box>

      {/* Gallery Component */}
      {((projectData?.media?.screenshots &&
        projectData?.media?.screenshots?.length > 0) ||
        (projectData?.media?.videos &&
          projectData?.media?.videos.length > 0)) && (
        <MediaGallery
          images={projectData?.media?.screenshots}
          videos={projectData?.media?.videos}
          onMediaClick={onMediaClick}
          sortFunction={simplePriorityVideoSort}
        />
      )}
    </Box>
  );
};
