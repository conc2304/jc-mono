import { BackgroundOverlay } from '@jc/ui-components';
import { getThemedBgTexture } from '../data/themed-data/themed-background-texture';
import { useColorMode, useEnhancedTheme } from '@jc/themes';
import { Box } from '@mui/material';

export const ThemedBgContainer = () => {
  const { currentThemeId } = useEnhancedTheme();
  const { resolvedMode } = useColorMode();
  const bgTexture = getThemedBgTexture(currentThemeId, resolvedMode);

  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
      })}
    >
      <BackgroundOverlay
        className="ThemedBackgroundTexture--overlay"
        url={bgTexture.url}
        style={{
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          zIndex: 0,
          ...bgTexture.style,
        }}
      />
    </Box>
  );
};
