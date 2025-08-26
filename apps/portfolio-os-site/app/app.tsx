// import { darken, rgbToHex, useTheme } from '@mui/material';
// import { DesktopOS } from '@jc/desktop-OS';
// import {
//   // CursorTrail,
//   // CursorTrailConfig,
//   GradientShader,
// } from '@jc/ui-components';
// // import { remToPixels } from '@jc/themes';
// import { FileSystem } from './data/file-system';

// export function App() {
//   const theme = useTheme();

//   const bgColors = [
//     theme.palette.background.default,
//     rgbToHex(darken(theme.palette.primary[theme.palette.mode], 0.3)),
//     rgbToHex(darken(theme.palette.secondary.dark, 0.3)),
//     theme.palette.background.default,
//     rgbToHex(darken(theme.palette.getInvertedMode('primary'), 0.6)),
//   ];

//   const key = bgColors.reduce((prev, curr) => `${prev}-${curr}`, '');

//   // const taskbarHeight = remToPixels(theme.mixins.taskbar.height as string);
//   // const cursorConfig: CursorTrailConfig = {
//   //   floorHeight: 0,
//   //   trailLength: 6,
//   //   trailDecayRate: 0.1,
//   //   wallBounce: 0.5,
//   //   groundBounce: 0.3,
//   //   returnDuration: 300,
//   //   returnGlowColor: theme.palette.primary.main,
//   //   cursorColor: theme.palette.primary.main,
//   //   returnTintColor: theme.palette.primary[theme.palette.getInvertedMode()],
//   // };

//   return (
//     <>
//       {/* TODO make cursor something that you turn on */}
//       {/* <CursorTrail {...cursorConfig} /> */}
//       <DesktopOS fileSystem={FileSystem} />
//       <GradientShader
//         className={key}
//         key={key}
//         colors={bgColors}
//         resolution={0.15}
//         scrollSpeed={0.04}
//         scale={0.75}
//         angle={135}
//         width={window.innerWidth}
//         height={window.innerHeight}
//         isBackground
//         autoResize
//         style={{
//           position: 'absolute',
//           top: 0,
//           bottom: 0,
//           left: 0,
//           right: 0,
//           zIndex: -1,
//           opacity: 0.3,
//         }}
//       />
//     </>
//   );
// }

// export default App;

import { Box, useTheme } from '@mui/system';
import {
  // DefaultBootMessage,
  // ThemedBootMessages,
  BootLayout,
  BootMessage,
  // MobileThemedBootMessages,
  // MobileDefaultBootMessage,
  // getScrambleCharacters,
} from '@jc/boot-loader';
import { useEnhancedTheme } from '@jc/themes';
import { randomInt } from 'd3';
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

export default function App() {
  const theme = useTheme();
  const isSm = theme.breakpoints.down('sm');

  const { currentThemeId } = useEnhancedTheme();

  const messageBankByScreenSize = isSm
    ? MobileThemedBootMessages
    : ThemedBootMessages;
  const fallbackMessages = isSm ? MobileDefaultBootMessage : DefaultBootMessage;

  const getRandomMessageIndexFn = randomInt(
    messageBankByScreenSize[currentThemeId].length
  ); // set max to length

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
    messageBankByScreenSize[currentThemeId][getRandomMessageIndexFn()] ||
    fallbackMessages;

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

  return (
    <BootLayout
      bootMessages={bootMessages}
      scrambleCharacterSet={scrambleCharacterSet}
      themedWidgetGifUrl={gifUrl}
      progressMessages={progressMsg}
      radarMetricsConfig={themedMetricConfigs}
      infoPanelContent={themeInfoPanelContent}
    />
  );
}
