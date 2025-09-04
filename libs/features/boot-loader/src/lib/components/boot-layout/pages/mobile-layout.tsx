import React, { lazy, Suspense } from 'react';
import { Box, Stack } from '@mui/material';
import { BrowserFrame, EnterButton, HeroText } from '../atoms';
import { Header, GifContainer } from '../molecules';
import { ThemePickerPanel } from '../molecules/theme-picker/theme-picker';

const TorusProgressPanel = lazy(
  () => import('../panels/torus-progress-panel/torus-progress-panel')
);

const BootTextPanel = lazy(
  () => import('../panels/boot-text-panel/boot-text-panel')
);

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

    <GifContainer
      flexGrow={1}
      url={themedWidgetGifUrl.url}
      sx={{
        minHeight: '80px',
        maxHeight: '200px',
        flexShrink: 0,
        flexGrow: 0.5,
        backgroundPositionY: themedWidgetGifUrl.backgroundPositionY,
        m: 1,
        '@media (max-height: 700px)': {
          display: 'none',
        },
      }}
    />

    <Stack sx={{ textAlign: 'center', flexShrink: 0, py: 1.5 }}>
      <HeroText />
    </Stack>
    <Box flexShrink={0} flexGrow={1.5} px={1} py={2}>
      <EnterButton onMouseEnter={triggerPreload} fontSize={'3rem'} />
    </Box>
    <Box
      className="MobileContent--flex-wrapper"
      p={1}
      display="flex"
      flexDirection="column"
      gap={1}
      flexGrow={1}
      overflow="hidden"
      sx={{ minHeight: '150px' }} // Add this
    >
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: '150px', // Ensure BootTextPanel gets at least 150px
          overflow: 'hidden',
        }}
      >
        <Suspense
          fallback={<Box sx={{ bgcolor: 'background.paper', opacity: 0.5 }} />}
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
        </Suspense>
      </Box>

      <Box flexShrink={0}>
        <ThemePickerPanel compactMenu />
      </Box>
    </Box>
  </BrowserFrame>
);

export default MobileLayout;
