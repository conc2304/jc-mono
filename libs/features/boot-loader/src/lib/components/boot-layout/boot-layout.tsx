import React, { lazy, Suspense } from 'react';

import {
  defaultBootMessages,
  defaultGif,
  DefaultInfoPanelContent,
  DefaultPasswordHoverMessage,
  DefaultProgressMessages,
  DefaultRadarMetrics,
  defaultScrambleCharacterSet,
} from './default-data';
import { useBootLayout } from './hooks/use-boot-layout';
import { BootContainer } from './atoms';
import { CSSProperties } from '@mui/material';
import { LoadingFallback } from '@jc/ui-components';

const MobileLayout = lazy(() => import('./pages/mobile-layout'));
const TabletLayout = lazy(() => import('./pages/tablet-layout'));
const FullDesktopLayout = lazy(() => import('./pages/desktop-layout'));

interface SciFiLayoutProps {
  className?: string;
  bootMessages?: any[];
  scrambleCharacterSet?: string;
  themedWidgetGifUrl?: any;
  progressMessages?: { start: string; end: string };
  radarMetricsConfig?: any;
  infoPanelContent?: any;
  passwordMessage?: string;
  bgTexture: { url: string; style: CSSProperties };
  triggerPreload?: () => void;
}

export const BootLayout: React.FC<SciFiLayoutProps> = ({
  className = '',
  bootMessages = defaultBootMessages,
  scrambleCharacterSet = defaultScrambleCharacterSet,
  themedWidgetGifUrl: gifData,
  progressMessages = DefaultProgressMessages,
  radarMetricsConfig = DefaultRadarMetrics,
  infoPanelContent = DefaultInfoPanelContent,
  passwordMessage = DefaultPasswordHoverMessage,
  bgTexture = { url: '', style: {} },
  triggerPreload,
}) => {
  const {
    breakpoints,
    progress,
    isComplete,
    backgroundState,
    radarData,
    handlers,
  } = useBootLayout(radarMetricsConfig);

  const themedWidgetGifUrl = { ...defaultGif, ...gifData };
  const bgUrl = '/gifs/circle-tile-background.gif';

  const containerProps = {
    className: 'BootContainer--root ' + className,
    style: {
      backgroundImage: backgroundState.animateBackground
        ? `url(${bgUrl})`
        : 'initial',
      backgroundSize: `${backgroundState.backgroundSize}px`,
      backgroundRepeat: 'repeat',
      backgroundBlendMode: backgroundState.backgroundBlendMode,
    },
  };

  const commonProps = {
    bootMessages,
    scrambleCharacterSet,
    passwordMessage,
    themedWidgetGifUrl,
    bgTexture,
    progressMessages,
    radarMetricsConfig,
    infoPanelContent,
    progress,
    isComplete,
    backgroundState,
    radarData,
    handlers,
    triggerPreload,
  };

  const getLayoutComponent = () => {
    if (breakpoints.isSm) return <MobileLayout {...commonProps} />;
    if (breakpoints.isMd) return <TabletLayout {...commonProps} />;
    return <FullDesktopLayout {...commonProps} />;
  };

  return (
    <BootContainer {...containerProps}>
      <Suspense fallback={<LoadingFallback message="Loading portfolio..." />}>
        {getLayoutComponent()}
      </Suspense>
    </BootContainer>
  );
};
