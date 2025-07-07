// theme-switcher.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeVariant } from './theme-provider';

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

const PaletteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 13.5997 21.8174 15.1116 21.4849 16.4163C21.1525 17.7211 20.2604 18.7464 19.0711 19.0711C17.8818 19.3957 16.4696 19.0711 15.5355 18.1421C14.6014 17.2132 14.6014 15.8995 15.5355 14.9645C16.4696 14.0294 17.7132 14.0294 18.6473 14.9645C18.6473 14.9645 18.6473 14.9645 18.6473 14.9645C18.9426 15.2598 19.418 15.2598 19.7132 14.9645C20.0085 14.6693 20.0085 14.1939 19.7132 13.8986C18.2426 12.428 15.9574 12.428 14.4868 13.8986C13.0163 15.3693 13.0163 17.6547 14.4868 19.1253C15.9574 20.5958 18.2426 20.5958 19.7132 19.1253C20.9025 17.9361 21.7946 16.9108 22.1270 15.6060C22.4595 14.3012 22.6421 12.7893 22.6421 11.1896C22.6421 5.06684 17.5752 0 11.4524 0C5.32962 0 0.262695 5.06684 0.262695 11.1896C0.262695 17.3124 5.32962 22.3792 11.4524 22.3792H12C13.1046 22.3792 14 21.4838 14 20.3792C14 19.2746 13.1046 18.3792 12 18.3792H11.4524C7.53719 18.3792 4.26270 15.1047 4.26270 11.1896C4.26270 7.27447 7.53719 4 11.4524 4C15.3675 4 18.6421 7.27447 18.6421 11.1896V12C18.6421 13.1046 19.5375 14 20.6421 14C21.7467 14 22.6421 13.1046 22.6421 12V11.1896C22.6421 5.06684 17.5752 0 11.4524 0Z" />
  </svg>
);

// Theme variant colors for UI indicators
const variantColors = {
  blue: '#1976d2',
  default: '#7c3aed',
};

const variantNames = {
  default: 'Default',
  blue: 'Blue',
};

interface ModeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  showLabel = false,
  className = '',
}) => {
  const { mode, resolvedTheme, toggleMode, systemPreference } = useTheme();

  const getLabel = () => {
    if (mode === 'system') return `System (${systemPreference})`;
    return resolvedTheme === 'light' ? 'Light mode' : 'Dark mode';
  };

  const getCurrentIcon = () => {
    if (mode === 'system') return <SystemIcon />;
    return resolvedTheme === 'light' ? <MoonIcon /> : <SunIcon />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Toggle theme mode. Currently: ${getLabel()}`}
        title={getLabel()}
      >
        {getCurrentIcon()}
      </button>
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {getLabel()}
        </span>
      )}
    </div>
  );
};

// 2. Theme Variant Selector Component
interface VariantSelectorProps {
  variant?: 'dropdown' | 'palette' | 'buttons';
  showLabel?: boolean;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variant = 'dropdown',
  showLabel = false,
  className = '',
}) => {
  const { variant: currentVariant, setVariant, availableVariants } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (variant === 'palette') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Theme:
          </span>
        )}
        <div className="flex gap-1">
          {availableVariants.map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                currentVariant === v
                  ? 'border-gray-800 dark:border-gray-200 scale-110'
                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
              }`}
              style={{ backgroundColor: variantColors[v] }}
              aria-label={`Switch to ${variantNames[v]} theme`}
              title={variantNames[v]}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Theme:
          </span>
        )}
        <div className="flex gap-1">
          {availableVariants.map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                currentVariant === v
                  ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 border-transparent'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
              }`}
            >
              {variantNames[v]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {showLabel && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Theme:
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: variantColors[currentVariant] }}
          />
          <span className="text-sm">{variantNames[currentVariant]}</span>
          <PaletteIcon />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-full">
          {availableVariants.map((v) => (
            <button
              key={v}
              onClick={() => {
                setVariant(v);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                currentVariant === v ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
              role="menuitem"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: variantColors[v] }}
              />
              {variantNames[v]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Combined Theme Controls Component
interface ThemeControlsProps {
  layout?: 'horizontal' | 'vertical';
  variantSelector?: 'dropdown' | 'palette' | 'buttons';
  showLabels?: boolean;
  className?: string;
}

export const ThemeControls: React.FC<ThemeControlsProps> = ({
  layout = 'horizontal',
  variantSelector = 'dropdown',
  showLabels = true,
  className = '',
}) => {
  const containerClass =
    layout === 'horizontal' ? 'flex items-center gap-4' : 'flex flex-col gap-3';

  return (
    <div className={`${containerClass} ${className}`}>
      <VariantSelector variant={variantSelector} showLabel={showLabels} />
      <ModeToggle showLabel={showLabels} />
    </div>
  );
};

// Usage Examples:
/*
// 1. Just mode toggle (light/dark)
<ModeToggle showLabel />

// 2. Theme variant selector with palette
<VariantSelector variant="palette" showLabel />

// 3. Theme variant selector with buttons
<VariantSelector variant="buttons" showLabel />

// 4. Combined controls
<ThemeControls layout="horizontal" variantSelector="palette" />

// 5. Vertical layout with dropdown
<ThemeControls layout="vertical" variantSelector="dropdown" showLabels />

// 6. Backward compatible
<ThemeSwitcher variant="dropdown" showLabel includeSystem />
*/
