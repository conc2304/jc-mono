import { BackgroundOverlay } from '@jc/ui-components';
import { getThemedBgTexture } from '../data/themed-data/themed-background-texture';
import { useColorMode, useEnhancedTheme } from '@jc/themes';

export const ThemedBgContainer = () => {
  const { currentThemeId } = useEnhancedTheme();
  const { resolvedMode } = useColorMode();
  const bgTexture = getThemedBgTexture(currentThemeId, resolvedMode);

  return (
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
  );
};
