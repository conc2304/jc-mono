import { BootLayout } from '@jc/boot-loader';
import { useColorMode, useEnhancedTheme } from '@jc/themes';

import { getThemedDataset } from './data/themed-data/get-themed-dataset';

export default function App() {
  const { currentThemeId } = useEnhancedTheme();
  const { resolvedMode } = useColorMode();

  const themedBootData = getThemedDataset(currentThemeId, resolvedMode);

  const preloadHome = () => {
    import('./routes/home');
  };

  return <BootLayout {...themedBootData} triggerPreload={preloadHome} />;
}
