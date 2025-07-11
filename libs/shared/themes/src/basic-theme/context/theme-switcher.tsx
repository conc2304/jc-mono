'use client';

import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { PaletteOptions } from '@mui/material/styles';
import { PaletteIcon } from 'lucide-react';

import { ThemeOption } from '../types';

export interface ThemeSwitcherProps {
  /** Array of available themes to choose from */
  themes: ThemeOption[];
  /** Currently selected theme ID */
  selectedThemeId: string;
  /** Callback when theme is changed */
  onThemeChange?: (themeId: string, theme: ThemeOption) => void;
  /** Optional label for the select input */
  label?: string;
  /** Show theme preview chips */
  showPreview?: boolean;
  /** Size of the select component */
  size?: 'small' | 'medium';
  /** Variant of the select component */
  variant?: 'outlined' | 'filled' | 'standard';
  /** Storage key for persisting theme selection */
  storageKey?: string;
  /** Group themes by category */
  groupByCategory?: boolean;
  /** Custom width for the select component */
  width?: string | number;
}

// Utility function to safely access localStorage in Next.js
const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Failed to write to localStorage:', error);
  }
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  themes,
  selectedThemeId,
  onThemeChange,
  label = 'Theme',
  showPreview = true,
  size = 'medium',
  variant = 'outlined',
  storageKey = 'app-theme',
  groupByCategory = false,
  width = 200,
}) => {
  const currentTheme = useTheme();
  const [internalSelectedId, setInternalSelectedId] = useState(selectedThemeId);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration - prevents SSR/client mismatch
  useEffect(() => {
    setIsHydrated(true);

    if (storageKey) {
      const savedTheme = getStorageItem(storageKey);
      if (savedTheme && themes.find((t) => t.id === savedTheme)) {
        setInternalSelectedId(savedTheme);
        const theme = themes.find((t) => t.id === savedTheme);
        if (theme) {
          onThemeChange && onThemeChange(savedTheme, theme);
        }
      }
    }
  }, []);

  // Save theme to localStorage when changed (only after hydration)
  useEffect(() => {
    if (isHydrated && storageKey && internalSelectedId) {
      setStorageItem(storageKey, internalSelectedId);
    }
  }, [storageKey, internalSelectedId, isHydrated]);

  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    const newThemeId = event.target.value;
    const selectedTheme = themes.find((theme) => theme.id === newThemeId);

    if (selectedTheme) {
      setInternalSelectedId(newThemeId);
      onThemeChange && onThemeChange(newThemeId, selectedTheme);
    }
  };

  const getPreviewColors = (palette: PaletteOptions) => {
    return [
      palette.primary?.main || '#000',
      palette.secondary?.main || '#000',
      palette.error?.main || '#000',
      palette.success?.main || '#000',
      palette.warning?.main || '#000',
      palette.info?.main || '#000',
    ];
  };

  const renderThemePreview = (palette: PaletteOptions) => {
    if (!showPreview) return null;

    const colors = getPreviewColors(palette);

    return (
      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
        {colors.map((color, index) => (
          <Box
            key={index}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: color,
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          />
        ))}
      </Box>
    );
  };

  const renderMenuItems = () => {
    if (groupByCategory) {
      const categorizedThemes = themes.reduce((acc, theme) => {
        const category = theme.category || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(theme);
        return acc;
      }, {} as Record<string, ThemeOption[]>);

      return Object.entries(categorizedThemes)
        .map(([category, categoryThemes]) => [
          <MenuItem
            key={`${category}-header`}
            disabled
            sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
          >
            {category} Themes
          </MenuItem>,
          ...categoryThemes.map((theme) => (
            <MenuItem key={theme.id} value={theme.id}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ fontWeight: 'medium' }}>{theme.name}</Box>
                  {theme.description && (
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {theme.description}
                    </Box>
                  )}
                </Box>
                {renderThemePreview(theme.palette)}
              </Box>
            </MenuItem>
          )),
        ])
        .flat();
    }

    return themes.map((theme) => (
      <MenuItem key={theme.id} value={theme.id}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ fontWeight: 'medium' }}>{theme.name}</Box>
            {theme.description && (
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {theme.description}
              </Box>
            )}
          </Box>
          {renderThemePreview(theme.palette)}
        </Box>
      </MenuItem>
    ));
  };

  const selectedTheme = themes.find((t) => t.id === internalSelectedId);

  // Don't render until hydrated to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <Box sx={{ width }}>
        <FormControl fullWidth size={size} variant={variant}>
          <InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon style={{ fontSize: '1rem' }} />
              {label}
            </Box>
          </InputLabel>
          <Select value="" disabled>
            <MenuItem value="">Loading...</MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  }

  return (
    <Box sx={{ width }}>
      <FormControl fullWidth size={size} variant={variant}>
        <InputLabel id="theme-switcher-label">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaletteIcon style={{ fontSize: '1rem' }} />
            {label}
          </Box>
        </InputLabel>
        <Select
          labelId="theme-switcher-label"
          value={internalSelectedId}
          onChange={handleThemeChange}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon style={{ fontSize: '1rem' }} />
              {label}
            </Box>
          }
        >
          {renderMenuItems()}
        </Select>
      </FormControl>

      {selectedTheme && (
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={selectedTheme.palette.mode || 'auto'}
            color={
              selectedTheme.palette.mode === 'dark' ? 'default' : 'primary'
            }
            variant="outlined"
          />
          {selectedTheme.category && (
            <Chip
              size="small"
              label={selectedTheme.category}
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
};
