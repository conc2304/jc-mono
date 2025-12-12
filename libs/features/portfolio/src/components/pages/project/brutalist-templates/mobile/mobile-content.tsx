import React, { useState } from 'react';
import { Box } from '@mui/material';

import { ProjectData, ProjectContent } from '../../types';
import { MobileTabContent } from './mobile-tab-content';
import { MobileProjectDetails } from './mobile-project-details';
import { MobileTechnologies } from './mobile-technologies';
import { MediaGallery, simplePriorityVideoSort } from '@jc/ui-components';
import { MobileMenu } from '../navigation/mobile-menu';

interface TabData {
  key: string;
  label: string;
}

interface MobileContentProps {
  activeTab: string;
  data: ProjectData;
  renderContent: (content?: string | string[]) => React.ReactNode;
  tabs: TabData[];
  onTabChange: (tab: string) => void;
  status?: string;
  getStatusColor: (
    status?: string
  ) => 'success' | 'warning' | 'default' | 'primary';
}

export const MobileContent: React.FC<MobileContentProps> = ({
  activeTab,
  data,
  renderContent,
  tabs,
  onTabChange,
  status,
  getStatusColor,
}) => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  return (
    <Box className="mobile-layout" sx={{ p: 2 }}>
      <MediaGallery
        images={data.media.screenshots}
        videos={data.media.videos}
        sortFunction={simplePriorityVideoSort}
      />

      <MobileTabContent
        activeTab={activeTab}
        content={data.content?.[activeTab as keyof ProjectContent]}
        renderContent={renderContent}
        onMenuClick={(e) => setMobileMenuAnchor(e.currentTarget)}
      />

      <MobileMenu
        anchorEl={mobileMenuAnchor}
        onClose={() => setMobileMenuAnchor(null)}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        status={status}
        getStatusColor={getStatusColor}
      />

      <MobileProjectDetails data={data} />

      <MobileTechnologies technologies={data.technical?.technologies} />
    </Box>
  );
};
