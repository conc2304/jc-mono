'use client';

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  EnhancedThemeSwitcher,
  useColorMode,
  useEnhancedTheme,
} from '@jc/themes';

export default function ThemeControls() {
  const { themes, currentThemeId, changeTheme } = useEnhancedTheme();
  const { mode, resolvedMode } = useColorMode();

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Theme Controls
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Current: {resolvedMode} mode,{' '}
        {themes.find((t) => t.id === currentThemeId)?.name}
      </Typography>

      <EnhancedThemeSwitcher
        themes={themes}
        selectedThemeId={currentThemeId}
        onThemeChange={(themeId, theme) => changeTheme(themeId)}
        showModeToggle={true}
        compact={false}
      />
    </Paper>
  );
}
