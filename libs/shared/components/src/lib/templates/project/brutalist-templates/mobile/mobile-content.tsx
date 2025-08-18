import React from 'react';
import { Box } from '@mui/material';

import { ProjectData, ProjectContent } from '../../types';
import { MobileTabContent } from './mobile-tab-content';
import { MobileProjectDetails } from './mobile-project-details';
import { MobileTechnologies } from './mobile-technologies';
import { MediaGallery } from '../../../../organisms';

interface MobileContentProps {
  activeTab: string;
  data: ProjectData;
  renderContent: (content?: string | string[]) => React.ReactNode;
}

export const MobileContent: React.FC<MobileContentProps> = ({
  activeTab,
  data,
  renderContent,
}) => {
  return (
    <Box className="mobile-layout" sx={{ p: 2 }}>
      <MediaGallery
        images={data.media.screenshots}
        videos={data.media.videos}
      />

      <MobileTabContent
        activeTab={activeTab}
        content={data.content?.[activeTab as keyof ProjectContent]}
        renderContent={renderContent}
      />

      <MobileProjectDetails data={data} />

      <MobileTechnologies technologies={data.technical?.technologies} />
    </Box>
  );
};
