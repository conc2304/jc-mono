import { darken, rgbToHex, useTheme } from '@mui/material';
import { DesktopOS } from '@jc/desktop-OS';
import {
  CursorTrail,
  CursorTrailConfig,
  GradientShader,
} from '@jc/ui-components';
import { remToPixels } from '@jc/themes';
import { mockFileSystem } from './data/file-system';

export function App() {
  const theme = useTheme();

  const bgColors = [
    theme.palette.background.default,
    rgbToHex(darken(theme.palette.primary[theme.palette.mode], 0.3)),
    rgbToHex(darken(theme.palette.secondary.dark, 0.3)),
    theme.palette.background.default,
    rgbToHex(darken(theme.palette.getInvertedMode('primary'), 0.6)),
  ];

  const key = bgColors.reduce((prev, curr) => `${prev}-${curr}`, '');
  const taskbarHeight = remToPixels(theme.mixins.taskbar.height as string);

  const cursorConfig: CursorTrailConfig = {
    floorHeight: 0,
    trailLength: 6,
    trailDecayRate: 0.1,
    wallBounce: 0.5,
    groundBounce: 0.3,
    returnDuration: 300,
    returnGlowColor: theme.palette.primary.main,
    cursorColor: theme.palette.primary.main,
    returnTintColor: theme.palette.primary[theme.palette.getInvertedMode()],
  };

  return (
    <>
      {/* TODO make cursor something that you turn on */}
      {/* <CursorTrail {...cursorConfig} /> */}
      <DesktopOS fileSystem={mockFileSystem} />
      <GradientShader
        className={key}
        key={key}
        colors={bgColors}
        resolution={0.15}
        scrollSpeed={0.04}
        scale={0.75}
        angle={135}
        width={window.innerWidth}
        height={window.innerHeight}
        isBackground
        autoResize
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          opacity: 0.3,
        }}
      />
    </>
  );
}

export default App;
