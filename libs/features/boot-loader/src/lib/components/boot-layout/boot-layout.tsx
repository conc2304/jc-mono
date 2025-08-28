import React from 'react';

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
import { MobileLayout } from './pages/mobile-layout';
import { TabletLayout } from './pages/tablet-layout';
import { FullDesktopLayout } from './pages/desktop-layout';

interface SciFiLayoutProps {
  className?: string;
  bootMessages?: any[];
  scrambleCharacterSet?: string;
  themedWidgetGifUrl?: any;
  progressMessages?: { start: string; end: string };
  radarMetricsConfig?: any;
  infoPanelContent?: any;
  passwordMessage?: string;
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
    progressMessages,
    radarMetricsConfig,
    infoPanelContent,
    progress,
    isComplete,
    backgroundState,
    radarData,
    handlers,
  };

  return (
    <BootContainer {...containerProps}>
      {breakpoints.isSm ? (
        <MobileLayout {...commonProps} isXs={breakpoints.isXs} />
      ) : breakpoints.isMd ? (
        <TabletLayout {...commonProps} />
      ) : (
        <FullDesktopLayout {...commonProps} />
      )}
    </BootContainer>
  );
};
