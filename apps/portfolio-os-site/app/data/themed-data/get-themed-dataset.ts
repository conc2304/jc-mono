import { BootMessage } from '@jc/boot-loader';

import { getThemedBgTexture } from './themed-background-texture';
import { DefaultBootMessage, ThemedBootMessages } from './themed-boot-messages';
import { getThemedGifUrl } from './themed-gif';
import { getRadarMetrics } from './themed-metric-labels';
import { getPasswordHoverMessage } from './themed-password-message';
import { getProgressMessages } from './themed-progress-state';
import { getScrambleCharacters } from './themed-scramble-characters';
import { getInfoPanelContent } from './themed-warning panel-text';

export const getThemedDataset = (
  themeId = '',
  colorMode: 'light' | 'dark' = 'dark'
) => {
  const contextMessages: BootMessage[] = [
    [
      'accessing creative technologist portfolio',
      'intersecting art & engineering',
    ],
    'entering JOSE_CONCHELLO digital archive',
    [
      'portfolio systems online and operational',
      'creative tech showcase installed',
    ],
  ];
  const endMessage = 'digital portfolio access granted';

  const initialMessage = 'Reinitializing new identity ...';
  const newLine = '';

  const bootMessagesThemed =
    ThemedBootMessages[themeId][
      Math.floor(Math.random() * ThemedBootMessages[themeId].length)
    ] || DefaultBootMessage;

  const bootMessages = [
    ...contextMessages,
    newLine,
    initialMessage,
    ...bootMessagesThemed.slice(0, -1),
    bootMessagesThemed[bootMessagesThemed.length - 1],
    newLine,
    endMessage,
    newLine,
  ];

  const scrambleCharacterSet = getScrambleCharacters(themeId);
  const gifUrl = getThemedGifUrl(themeId);
  const progressMsg = getProgressMessages(themeId);
  const themedMetricConfigs = getRadarMetrics(themeId);
  const themeInfoPanelContent = getInfoPanelContent(themeId);
  const themedPasswordMessage = getPasswordHoverMessage(themeId);
  const themedBgTexture = getThemedBgTexture(themeId, colorMode);

  return {
    bootMessages: bootMessages,
    scrambleCharacterSet: scrambleCharacterSet,
    themedWidgetGifUrl: gifUrl,
    progressMessages: progressMsg,
    radarMetricsConfig: themedMetricConfigs,
    infoPanelContent: themeInfoPanelContent,
    passwordMessage: themedPasswordMessage,
    bgTexture: themedBgTexture,
  };
};
