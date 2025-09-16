import React, { useEffect, useRef, useState } from 'react';
import { Box, styled } from '@mui/material';

import ProjectData from '../types';
import { MobileNavigation } from './navigation/mobile-navigation';
import { MobileMenu } from './navigation/mobile-menu';
import { DesktopNavigation } from './navigation/desktop-navigation';
import { HeroSection } from './hero/hero-section';
import { MobileContent } from './mobile/mobile-content';
import { DesktopContent } from './desktop/desktop-content';
import { NavigationContext } from '@jc/file-system';
import { MarkdownRenderer } from '../../../molecules/markdown-renderer';
import { useMediaProvider } from '../../../context';
import { ImageRenderAttributes } from '../../../organisms';

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
  ...portfolioProject
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  portfolioProject;
  // const transformedMedia = useProjectMedia(portfolioProject);

  const { generateImageSources } = useMediaProvider().provider;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    // Reset active tab to overview when project changes
    setActiveTab('overview');
  }, [portfolioProject.projectName]);

  const projectData = { ...portfolioProject };

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
    return <MarkdownRenderer content={content} />;
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

  const heroImageData: ImageRenderAttributes = {
    ...generateImageSources(projectData.media.hero.relativePath, 'hero'),
    alt: projectData.media.hero.alt,
    caption: projectData.media.hero.caption,
    detailedCaption: projectData.media.hero.detailedCaption,
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
        status={projectData.metadata?.status}
        getStatusColor={getStatusColor}
      />
      <MobileContent
        activeTab={activeTab}
        data={projectData}
        renderContent={renderContent}
      />

      <DesktopNavigation
        title={projectData.projectName}
        onNext={onNext}
        onPrevious={onPrevious}
        onSelectItem={onSelectItem}
        navigationInfo={navigationInfo}
      />

      <HeroSection
        heroImage={heroImageData}
        projectName={projectData.projectName}
        description={projectData.basics?.description}
        projectSubtitle={projectData.projectSubtitle}
      />

      <DesktopContent
        projectData={projectData}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabsData}
        renderContent={renderContent}
      />
    </ResponsiveContainer>
  );
};
