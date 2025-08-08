// components/Desktop/DesktopContent.tsx
import React from 'react';
import { Container, Grid, Box } from '@mui/material';
// import { DesktopSidebar } from './DesktopSidebar';
// import { DesktopMainContent } from './DesktopMainContent';
import { ProjectData, ProjectContent } from '../../types';
import { DesktopSidebar } from './desktop-sidebar';
import { DesktopMainContent } from './desktop-main-content';

interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

interface TabData {
  key: string;
  label: string;
}

interface DesktopContentProps {
  data: ProjectData;
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  tabs: TabData[];
  renderContent: (content?: string | string[]) => React.ReactNode;
  screenshots: Screenshot[];
  activeImageIndex: number;
  onImageChange: (index: number) => void;
}

export const DesktopContent: React.FC<DesktopContentProps> = ({
  data,
  activeTab,
  onTabChange,
  tabs,
  renderContent,
  screenshots,
  activeImageIndex,
  onImageChange,
}) => {
  return (
    <Container maxWidth="xl" className="desktop-layout" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <DesktopSidebar data={data} />
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          <DesktopMainContent
            data={data}
            activeTab={activeTab}
            onTabChange={onTabChange}
            tabs={tabs}
            renderContent={renderContent}
            videos={data.media?.videos}
            screenshots={screenshots}
            activeImageIndex={activeImageIndex}
            onImageChange={onImageChange}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
