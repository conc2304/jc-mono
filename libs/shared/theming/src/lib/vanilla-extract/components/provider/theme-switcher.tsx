'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './theme-provider';
import {
  switcherContainer,
  switcherButton,
  toggleSwitch,
  toggleThumb,
  switcherLabel,
  switcherVariants,
  dropdownMenu,
  dropdownItem,
} from './theme-switcher.css';

// Icons
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z" />
  </svg>
);

const SystemIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 16H20V5H4V16ZM2 16V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V16C22 16.5523 21.5523 17 21 17H13V19H17V21H7V19H11V17H3C2.44772 17 2 16.5523 2 16Z" />
  </svg>
);

interface ThemeSwitcherProps {
  variant?: 'icon' | 'toggle' | 'dropdown';
  showLabel?: boolean;
  includeSystem?: boolean;
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'dropdown',
  showLabel = false,
  includeSystem = true,
  className = '',
}) => {
  const { mode, resolvedTheme, toggleTheme, setTheme, systemPreference } =
    useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Get the appropriate icon based on current mode/resolved theme
  const getCurrentIcon = () => {
    if (mode === 'system') {
      return <SystemIcon />;
    }
    return resolvedTheme === 'light' ? <MoonIcon /> : <SunIcon />;
  };

  // Get theme label for display
  const getThemeLabel = () => {
    if (mode === 'system') {
      return `System (${systemPreference})`;
    }
    return mode === 'light' ? 'Light mode' : 'Dark mode';
  };

  // Icon variant - cycles through themes
  if (variant === 'icon') {
    return (
      <div className={`${switcherContainer} ${className}`}>
        <button
          onClick={toggleTheme}
          className={switcherButton}
          aria-label={`Current theme: ${getThemeLabel()}. Click to switch.`}
          title={`Current: ${getThemeLabel()}. Click to switch.`}
        >
          {getCurrentIcon()}
        </button>
        {showLabel && <span className={switcherLabel}>{getThemeLabel()}</span>}
      </div>
    );
  }

  // Toggle variant - only works with light/dark (system not suitable for toggle)
  if (variant === 'toggle') {
    // If current mode is system, show the resolved theme but don't allow toggle to system
    const isChecked = resolvedTheme === 'dark';

    return (
      <div className={`${switcherContainer} ${className}`}>
        {showLabel && (
          <span className={switcherLabel}>
            {mode === 'system' ? `System (${systemPreference})` : 'Dark mode'}
          </span>
        )}
        <button
          onClick={() => {
            // If currently system, switch to the opposite of current system preference
            if (mode === 'system') {
              setTheme(systemPreference === 'dark' ? 'light' : 'dark');
            } else {
              setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
            }
          }}
          className={toggleSwitch}
          data-checked={isChecked}
          aria-label={`Switch theme. Currently ${getThemeLabel()}`}
          role="switch"
          aria-checked={isChecked}
        >
          <div className={toggleThumb}>
            {resolvedTheme === 'light' ? '☀️' : '🌙'}
          </div>
        </button>
      </div>
    );
  }

  // Dropdown variant - with system preference option
  if (variant === 'dropdown') {
    return (
      <div
        className={`${switcherContainer} ${switcherVariants.dropdown} ${className}`}
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={switcherButton}
          aria-label={`Theme options. Current: ${getThemeLabel()}`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          title={`Current: ${getThemeLabel()}`}
        >
          {getCurrentIcon()}
        </button>

        <div className={dropdownMenu} data-open={isDropdownOpen} role="menu">
          <button
            className={dropdownItem}
            data-selected={mode === 'light'}
            onClick={() => {
              setTheme('light');
              setIsDropdownOpen(false);
            }}
            role="menuitem"
          >
            <SunIcon />
            Light
          </button>
          <button
            className={dropdownItem}
            data-selected={mode === 'dark'}
            onClick={() => {
              setTheme('dark');
              setIsDropdownOpen(false);
            }}
            role="menuitem"
          >
            <MoonIcon />
            Dark
          </button>
          {includeSystem && (
            <button
              className={dropdownItem}
              data-selected={mode === 'system'}
              onClick={() => {
                setTheme('system');
                setIsDropdownOpen(false);
              }}
              role="menuitem"
            >
              <SystemIcon />
              System ({systemPreference})
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// Usage examples:
/*
// Dropdown with system option (recommended)
<ThemeSwitcher variant="dropdown" />

// Icon button that cycles through all modes
<ThemeSwitcher variant="icon" showLabel />

// Toggle switch (light/dark only, but respects system)
<ThemeSwitcher variant="toggle" showLabel />

// Dropdown without system option
<ThemeSwitcher variant="dropdown" includeSystem={false} />
*/
