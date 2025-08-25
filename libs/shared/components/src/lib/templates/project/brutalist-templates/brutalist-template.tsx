import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, useTheme, styled } from '@mui/material';

import ProjectData from '../types';
import { MobileNavigation } from './navigation/mobile-navigation';
import { MobileMenu } from './navigation/mobile-menu';
import { DesktopNavigation } from './navigation/desktop-navigation';
import { HeroSection } from './hero/hero-section';
import { MobileContent } from './mobile/mobile-content';
import { DesktopContent } from './desktop/desktop-content';
import { NavigationContext } from '@jc/file-system';

const ResponsiveContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  overflow: 'auto',
  paddingBottom: '8rem',
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
}));

export interface BrutalistTemplateProps {
  hasNavigation?: boolean;
}

export const BrutalistTemplate: React.FC<
  BrutalistTemplateProps & ProjectData & NavigationContext
> = ({
  hasNavigation = false,
  onNext,
  onPrevious,
  onSelectItem,
  navigationInfo,
  // Project props
  ...project
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    // Reset active tab to overview when project changes
    setActiveTab('overview');
  }, [project.projectName]);

  const data = project;
  const screenshots = data?.media?.screenshots || [];

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
            color: theme.palette.text.primary,
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
          color: theme.palette.text.primary,
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
    <ResponsiveContainer ref={containerRef}>
      <MobileNavigation
        hasNavigation={hasNavigation}
        onMenuClick={(e) => setMobileMenuAnchor(e.currentTarget)}
        onNext={onNext}
        onPrevious={onPrevious}
        navigationInfo={navigationInfo}
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
        title={data.projectName}
        onNext={onNext}
        onPrevious={onPrevious}
        onSelectItem={onSelectItem}
        navigationInfo={navigationInfo}
      />

      <HeroSection
        heroImage={data.media.thumbnail}
        projectName={data.projectName}
        description={data.basics?.description}
        projectSubtitle={data.projectSubtitle}
      />

      <MobileContent
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
      />
    </ResponsiveContainer>
  );
};
