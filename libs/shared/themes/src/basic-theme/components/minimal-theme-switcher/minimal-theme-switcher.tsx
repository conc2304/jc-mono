import { Box, Tooltip } from '@mui/material';
import { useColorMode, useEnhancedTheme } from '../../context';
import { ColorMode } from '../../types';
import { ModeSwitcherButtonGroup } from '../mode-switcher-button-group';

export const MinimalThemeSwitcher = () => {
  const { themes, currentThemeId, changeTheme } = useEnhancedTheme();
  const { mode, setMode, resolvedMode, systemMode } = useColorMode();

  const getThemeColors = (theme: any, currentMode: string) => {
    const palette =
      currentMode === 'dark' ? theme.darkPalette : theme.lightPalette;
    return [
      palette.primary?.main,
      palette.secondary?.main,
      palette.error?.main,
      palette.warning?.main,
      palette.info?.main,
      palette.success?.main,
    ];
  };

  const handleThemeSelect = (themeId: string, mode: 'light' | 'dark') => {
    changeTheme(themeId);
    setMode(mode);
  };

  const handleModeToggle = () => {
    const modes: ColorMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setMode(nextMode);
  };

  // Filter themes based on mode support (same as EnhancedThemeSwitcher)
  const availableThemes = themes.filter((theme) => {
    if (resolvedMode === 'dark') return theme.supportsDark !== false;
    if (resolvedMode === 'light') return theme.supportsLight !== false;
    return true;
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        maxWidth: 400,
        height: '100%',
      }}
    >
      {/* Mode Toggle Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Tooltip title={`Current: ${mode} mode (${resolvedMode})`}>
          {/* <IconButton
            onClick={handleModeToggle}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1,
              backgroundColor:
                mode !== 'system' ? 'transparent' : 'action.selected',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {getModeIcon(mode)}
          </IconButton> */}
          <ModeSwitcherButtonGroup
            compact
            mode={mode}
            resolvedMode={resolvedMode}
            systemMode={systemMode}
            onModeChange={(nextMode) => setMode(nextMode)}
          />
        </Tooltip>
      </Box>

      {/* Theme Previews */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          flexGrow: 1,
          maxHeight: '100%',
          minHeight: 0,
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {availableThemes.map((themeDisplay) => {
          const isSelected = themeDisplay.id === currentThemeId;

          const backgroundPaperLight =
            themeDisplay.lightPalette.background.paper;
          const colorsLight = getThemeColors(themeDisplay, 'light');
          const backgroundPaperDark = themeDisplay.darkPalette.background.paper;
          const colorsDark = getThemeColors(themeDisplay, 'dark');

          return (
            <Box
              key={themeDisplay.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                border: 2,
                borderStyle: 'dotted',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: isSelected ? 'primary.main' : 'divider',
                },
              }}
            >
              {/* Background Paper Box */}
              {[
                {
                  bg: backgroundPaperLight,
                  colors: colorsLight,
                  mode: 'light',
                },
                { bg: backgroundPaperDark, colors: colorsDark, mode: 'dark' },
              ].map(({ bg, colors, mode }) => (
                <Box
                  onClick={() => handleThemeSelect(themeDisplay.id, mode)}
                  sx={{
                    width: '50%',
                    height: 32,
                    backgroundColor: bg,
                    border: '2px solid',
                    borderColor:
                      isSelected && mode === resolvedMode
                        ? 'primary.main'
                        : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    p: 0.75,
                  }}
                >
                  {/* Color Palette Boxes */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {colors.map((color, index) => (
                      <Box
                        key={index}
                        sx={{
                          // width: 12,
                          flexGrow: 1,
                          height: '100%',
                          backgroundColor: color,
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: 0.25,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
