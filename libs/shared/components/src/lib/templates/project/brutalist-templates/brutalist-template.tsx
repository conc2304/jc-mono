// Main BrutalistTemplate.tsx
import React, { useState } from 'react';
import { Box, Typography, useTheme, styled } from '@mui/material';

import ProjectData from '../types';
import { MobileNavigation } from './navigation/mobile-navigation';
import { MobileMenu } from './navigation/mobile-menu';
import { DesktopNavigation } from './navigation/desktop-navigation';
import { HeroSection } from './hero/hero-section';
import { MobileContent } from './mobile/mobile-content';
import { DesktopContent } from './desktop/desktop-content';

const ResponsiveContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  overflow: 'auto',
  containerType: 'inline-size',
  '& .mobile-layout': {
    display: 'block',
    '@container (min-width: 769px)': {
      display: 'none',
    },
  },
  '& .desktop-layout': {
    display: 'none',
    '@container (min-width: 769px)': {
      display: 'block',
    },
  },
  '& .hero-mobile': {
    height: '250px',
    '@container (min-width: 769px)': {
      height: '500px',
    },
    '@container (min-width: 1200px)': {
      height: '600px',
    },
  },
  '& .title-mobile': {
    fontSize: '2rem',
    '@container (min-width: 769px)': {
      fontSize: '4rem',
    },
    '@container (min-width: 1200px)': {
      fontSize: '6rem',
    },
  },
  '& .description-mobile': {
    fontSize: '1rem',
    '@container (min-width: 769px)': {
      fontSize: '1.25rem',
    },
    '@container (min-width: 1200px)': {
      fontSize: '1.5rem',
    },
  },
}));

export interface BrutalistTemplateProps {
  hasNavigation: boolean;
}

export const BrutalistTemplate = ({
  hasNavigation = false,
  ...project
}: BrutalistTemplateProps & ProjectData) => {
  const theme = useTheme();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const data = project;
  const screenshots = data?.media?.screenshots || [];

  const nextImage = (): void => {
    setActiveImageIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevImage = (): void => {
    setActiveImageIndex(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length
    );
  };

  const getStatusColor = (
    status?: string
  ): 'success' | 'warning' | 'default' | 'primary' => {
    switch (status) {
      case 'live':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'primary';
    }
  };

  const renderContent = (content?: string | string[]): React.ReactNode => {
    if (Array.isArray(content)) {
      return content.map((paragraph, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            color: theme.palette.grey[300],
          }}
        >
          {paragraph}
        </Typography>
      ));
    }
    return (
      <Typography
        variant="body1"
        sx={{
          lineHeight: 1.6,
          color: theme.palette.grey[300],
        }}
      >
        {content}
      </Typography>
    );
  };

  const tabsData = [
    { key: 'overview', label: 'Overview' },
    { key: 'process', label: 'Process' },
    { key: 'results', label: 'Results' },
    { key: 'challenges', label: 'Challenges' },
    { key: 'learnings', label: 'Learnings' },
  ];

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: string
  ): void => {
    setActiveTab(newValue);
  };

  return (
    <ResponsiveContainer>
      <MobileNavigation
        hasNavigation={hasNavigation}
        onMenuClick={(e) => setMobileMenuAnchor(e.currentTarget)}
      />

      <MobileMenu
        anchorEl={mobileMenuAnchor}
        onClose={() => setMobileMenuAnchor(null)}
        tabs={tabsData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        status={data.metadata?.status}
        getStatusColor={getStatusColor}
      />

      <DesktopNavigation
        hasNavigation={hasNavigation}
        status={data.metadata?.status}
        getStatusColor={getStatusColor}
      />

      <HeroSection
        screenshots={screenshots}
        activeImageIndex={activeImageIndex}
        onImageChange={setActiveImageIndex}
        onNextImage={nextImage}
        onPrevImage={prevImage}
        projectName={data.projectName}
        description={data.basics?.description}
      />

      <MobileContent
        screenshots={screenshots}
        activeImageIndex={activeImageIndex}
        onImageChange={setActiveImageIndex}
        activeTab={activeTab}
        data={data}
        renderContent={renderContent}
      />

      <DesktopContent
        data={data}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabsData}
        renderContent={renderContent}
        screenshots={screenshots}
        activeImageIndex={activeImageIndex}
        onImageChange={setActiveImageIndex}
      />
    </ResponsiveContainer>
  );
};
