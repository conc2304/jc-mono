'use client';

import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

import { useTheme } from '../../context/theme-context';
import { themes } from '../../themes/themes';

import {
  themeSwitcherContainer,
  themeSwitcherButton,
  themeSwitcherDropdown,
  themeOption,
  themeOptionActive,
  themePreview,
  themeColorSwatch,
  darkModeToggle,
  toggleSwitch,
  toggleSwitchActive,
  toggleHandle,
  toggleHandleActive,
} from './theme-switcher.css';
import { augmentedBase, augmentedSizes } from '../base/augmented-base.css';

export interface ThemeSwitcherProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'cyberpunk' | 'neon';
  size?: 'small' | 'medium' | 'large';
  showDarkModeToggle?: boolean;
  showColorPreview?: boolean;
  customAugmentation?: string;
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'primary',
  size = 'medium',
  showDarkModeToggle = true,
  showColorPreview = true,
  customAugmentation,
  className,
}) => {
  const {
    currentTheme,
    setTheme,
    availableThemes,
    isDarkMode,
    setDarkMode,
    themeConfig,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const augmentedUIAttribute =
    customAugmentation || 'tl-clip tr-clip br-clip bl-clip border';

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName as any);
    setIsOpen(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!isDarkMode);
  };

  const getThemeDisplayName = (themeName: string) => {
    return themeName.charAt(0).toUpperCase() + themeName.slice(1);
  };

  return (
    <div className={clsx(themeSwitcherContainer, className)} ref={dropdownRef}>
      <button
        data-augmented-ui={augmentedUIAttribute}
        className={clsx(
          augmentedBase,
          augmentedSizes[size],
          themeSwitcherButton
        )}
        onClick={() => setIsOpen(!isOpen)}
        style={
          {
            '--aug-border-bg': themeConfig.colors.primary,
          } as React.CSSProperties
        }
      >
        {getThemeDisplayName(currentTheme.toString())}
        <span style={{ marginLeft: '8px' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div
          data-augmented-ui="tl-2-clip tr-2-clip br-2-clip bl-2-clip border"
          className={clsx(augmentedBase, themeSwitcherDropdown)}
          style={
            {
              '--aug-border-bg': themeConfig.colors.border,
              '--aug-border-all': '1px',
            } as React.CSSProperties
          }
        >
          {availableThemes.map((themeName) => (
            <button
              key={themeName.toString()}
              className={clsx(
                themeOption,
                currentTheme === themeName && themeOptionActive
              )}
              onClick={() => handleThemeChange(themeName.toString())}
            >
              <div className={themePreview}>
                {showColorPreview && (
                  <div
                    className={themeColorSwatch}
                    style={{
                      background: `linear-gradient(45deg, ${themes[themeName].colors.primary}, ${themes[themeName].colors.secondary})`,
                    }}
                  />
                )}
                {getThemeDisplayName(themeName.toString())}
              </div>
            </button>
          ))}

          {showDarkModeToggle && (
            <div className={darkModeToggle}>
              <span>Dark Mode</span>
              <div
                className={clsx(toggleSwitch, isDarkMode && toggleSwitchActive)}
                onClick={handleDarkModeToggle}
              >
                <div
                  className={clsx(
                    toggleHandle,
                    isDarkMode && toggleHandleActive
                  )}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
