import { Box } from '@mui/material';

import { GradientShaderScreenSaver } from '@jc/ui-components';

export const GradientShaderScreenSaverThemed = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 320,
        overflow: 'hidden',
      }}
    >
      <GradientShaderScreenSaver
        className="GradientShaderScreenSaver--portfolio"
        useThemeColors
        defaultColorKeys={['primary.main', 'secondary.dark']}
        resolution={0.15}
        defaultScrollSpeed={0.04}
        defaultScale={0.75}
        angle={135}
        isBackground
        autoResize
        idleTimeoutMs={120_000}
        defaultPattern="perlin"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};
