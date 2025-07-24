import React from 'react';
import { Box } from '@mui/material';

import { ProjectData, ProjectContent } from '../../types';
import { MobileThumbnails } from './mobile-thumbnails';
import { MobileTabContent } from './mobile-tab-content';
import { MobileProjectDetails } from './mobile-project-details';
import { MobileTechnologies } from './mobile-technologies';

interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

interface MobileContentProps {
  screenshots: Screenshot[];
  activeImageIndex: number;
  onImageChange: (index: number) => void;
  activeTab: string;
  data: ProjectData;
  renderContent: (content?: string | string[]) => React.ReactNode;
}

export const MobileContent: React.FC<MobileContentProps> = ({
  screenshots,
  activeImageIndex,
  onImageChange,
  activeTab,
  data,
  renderContent,
}) => {
  return (
    <Box className="mobile-layout" sx={{ p: 2 }}>
      <MobileThumbnails
        screenshots={screenshots}
        activeIndex={activeImageIndex}
        onIndexChange={onImageChange}
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
