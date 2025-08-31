import React from 'react';
import { Box, Stack } from '@mui/material';
import { BrowserFrame, EnterButton, HeroText } from '../atoms';
import { Header, GifContainer } from '../molecules';
import { ThemePickerPanel } from '../molecules/theme-picker/theme-picker';
import { BootTextPanel } from '../panels/boot-text-panel';
import { TorusProgressPanel } from '../panels/torus-progress-panel';

interface MobileLayoutProps {
  bootMessages: any[];
  scrambleCharacterSet: string;
  passwordMessage: string;
  themedWidgetGifUrl: any;
  handlers: any;
  isXs?: boolean;
  triggerPreload?: () => void;
  progress?: any;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  bootMessages,
  scrambleCharacterSet,
  passwordMessage,
  themedWidgetGifUrl,
  handlers,
  progress = 100,
  isXs = true,
  triggerPreload,
}) => (
  <BrowserFrame>
    {!isXs && <Header compact={true} passwordMsg={passwordMessage} />}

    <Stack sx={{ textAlign: 'center', flexShrink: 0 }}>
      <HeroText />
    </Stack>

    <Box
      className="MobileContent--flex-wrapper"
      p={1}
      display="flex"
      flexDirection="column"
      gap={1}
      flexGrow={1}
      overflow="hidden"
    >
      <Box
        sx={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}
      >
        <BootTextPanel
          bootMessages={bootMessages}
          scrambleCharacterSet={scrambleCharacterSet}
          onProgress={handlers.handleProgress}
          onComplete={handlers.handleBootComplete}
          textWrapMode="ellipsis"
          flex={1}
          bgOpacity={0}
        />
        <TorusProgressPanel
          showAsBackground
          progress={progress.current}
          progressMessage={progress.message}
        />
      </Box>

      <ThemePickerPanel compactMenu />

      <GifContainer
        flexGrow={1}
        url={themedWidgetGifUrl.url}
        sx={{
          minHeight: '15%',
          flexGrow: 0.5,
          backgroundPositionY: themedWidgetGifUrl.backgroundPositionY,
        }}
      />

      <Box flexGrow={0.25} flexShrink={0}>
        <EnterButton onMouseEnter={triggerPreload} />
      </Box>
    </Box>
  </BrowserFrame>
);

export default MobileLayout;
