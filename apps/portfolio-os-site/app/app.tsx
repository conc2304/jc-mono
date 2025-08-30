import { useTheme } from '@mui/system';
import { BootLayout, BootMessage } from '@jc/boot-loader';
import { useColorMode, useEnhancedTheme } from '@jc/themes';
import {
  DefaultBootMessage,
  MobileDefaultBootMessage,
  MobileThemedBootMessages,
  ThemedBootMessages,
} from './data/themed-data/themed-boot-messages';
import { getScrambleCharacters } from './data/themed-data/themed-scramble-charsets';
import { getThemedGifUrl } from './data/themed-data/themed-gif';
import { getProgressMessages } from './data/themed-data/themed-progress-state';
import { getRadarMetrics } from './data/themed-data/themed-metric-labels';
import { getInfoPanelContent } from './data/themed-data/themed-warning panel-text';
import { getPasswordHoverMessage } from './data/themed-data/themed-password-message';
import { getThemedBgTexture } from './data/themed-data/themed-background-texture';
import { randomInt } from '@jc/utils';

export default function App() {
  const theme = useTheme();
  const isSm = theme.breakpoints.down('sm');

  const { currentThemeId } = useEnhancedTheme();
  const { resolvedMode } = useColorMode();

  const messageBankByScreenSize = isSm
    ? MobileThemedBootMessages
    : ThemedBootMessages;
  const fallbackMessages = isSm ? MobileDefaultBootMessage : DefaultBootMessage;

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
    messageBankByScreenSize[currentThemeId][
      randomInt(messageBankByScreenSize[currentThemeId].length)
    ] || fallbackMessages;

  const bootMessages = [
    ...contextMessages,
    newLine,
    initialMessage,
    ...bootMessagesThemed.slice(0, -1),
    bootMessagesThemed[bootMessagesThemed.length - 1],
    newLine,
    endMessage,
  ];

  const scrambleCharacterSet = getScrambleCharacters(currentThemeId);
  const gifUrl = getThemedGifUrl(currentThemeId);
  const progressMsg = getProgressMessages(currentThemeId);
  const themedMetricConfigs = getRadarMetrics(currentThemeId);
  const themeInfoPanelContent = getInfoPanelContent(currentThemeId);
  const themedPasswordMessage = getPasswordHoverMessage(currentThemeId);
  const themedBgTexture = getThemedBgTexture(currentThemeId, resolvedMode);

  const preloadHome = () => {
    import('./routes/home');
  };

  return (
    <BootLayout
      bootMessages={bootMessages}
      scrambleCharacterSet={scrambleCharacterSet}
      themedWidgetGifUrl={gifUrl}
      progressMessages={progressMsg}
      radarMetricsConfig={themedMetricConfigs}
      infoPanelContent={themeInfoPanelContent}
      passwordMessage={themedPasswordMessage}
      bgTexture={themedBgTexture}
      triggerPreload={preloadHome}
    />
  );
}
