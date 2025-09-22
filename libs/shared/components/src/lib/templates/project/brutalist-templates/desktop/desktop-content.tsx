import React from 'react';
import { Container, Grid } from '@mui/material';
import { ProjectData } from '../../types';
import { DesktopSidebar } from './desktop-sidebar';
import { DesktopMainContent } from './desktop-main-content';

interface TabData {
  key: string;
  label: string;
}

interface DesktopContentProps {
  projectData: ProjectData;
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  tabs: TabData[];
  renderContent: (content?: string | string[]) => React.ReactNode;
}

export const DesktopContent: React.FC<DesktopContentProps> = ({
  projectData,
  activeTab,
  onTabChange,
  tabs,
  renderContent,
}) => {
  return (
    <Container maxWidth="xl" className="desktop-layout" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <DesktopSidebar data={projectData} />
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          <DesktopMainContent
            projectData={projectData}
            activeTab={activeTab}
            onTabChange={onTabChange}
            tabs={tabs}
            renderContent={renderContent}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
