// Advanced ThemeSwitcher with previews
import React, { useState } from 'react';

import { useTheme } from '../../context';
import { AvailableThemes } from '../../themes/themes';
import { Button } from '../button';

export interface AdvancedThemeSwitcherProps {
  showPreviews?: boolean;
  gridLayout?: boolean;
  className?: string;
}

export const AdvancedThemeSwitcher: React.FC<AdvancedThemeSwitcherProps> = ({
  showPreviews = true,
  gridLayout = true,
  className,
}) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleThemeSelect = (themeName: string) => {
    setTheme(themeName as any);
  };

  const getThemePreview = (themeName: string) => {
    const theme = AvailableThemes[themeName];
    return (
      <div
        style={{
          width: '100%',
          height: '80px',
          background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.surface} 100%)`,
          border: `2px solid ${
            currentTheme === themeName
              ? theme.colors.primary
              : theme.colors.border
          }`,
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: hoveredTheme === themeName ? 'scale(1.05)' : 'scale(1)',
        }}
        onClick={() => handleThemeSelect(themeName)}
        onMouseEnter={() => setHoveredTheme(themeName)}
        onMouseLeave={() => setHoveredTheme(null)}
      >
        {/* Color swatches */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: theme.colors.primary,
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: theme.colors.secondary,
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: theme.colors.accent,
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Theme name */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            color: theme.colors.text,
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {themeName}
        </div>

        {/* Active indicator */}
        {currentTheme === themeName && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              backgroundColor: theme.colors.primary,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${theme.colors.primary}`,
            }}
          />
        )}

        {/* Augmented-UI preview */}
        <div
          data-augmented-ui="tl-clip tr-clip br-clip bl-clip border"
          style={
            {
              position: 'absolute',
              bottom: '20px',
              right: '8px',
              width: '30px',
              height: '15px',
              '--aug-border-all': '1px',
              '--aug-border-bg': theme.colors.primary,
              '--aug-tl': '3px',
              '--aug-tr': '3px',
              '--aug-br': '3px',
              '--aug-bl': '3px',
            } as React.CSSProperties
          }
        />
      </div>
    );
  };

  return (
    <div className={className}>
      <h3 style={{ marginBottom: '1rem' }}>Choose Theme</h3>

      <div
        style={{
          display: gridLayout ? 'grid' : 'flex',
          gridTemplateColumns: gridLayout
            ? 'repeat(auto-fit, minmax(150px, 1fr))'
            : undefined,
          flexDirection: gridLayout ? undefined : 'column',
          gap: '1rem',
        }}
      >
        {availableThemes.map((themeName) => (
          <div key={themeName}>
            {showPreviews ? (
              getThemePreview(themeName)
            ) : (
              <Button
                variant={currentTheme === themeName ? 'primary' : 'secondary'}
                size="medium"
                shape="clip"
                onClick={() => handleThemeSelect(themeName)}
                style={{ width: '100%' }}
              >
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Theme performance utilities
// utils/themeUtils.ts
export const themeUtils = {
  // Preload theme assets
  preloadTheme: (themeName: string) => {
    const theme = AvailableThemes[themeName];
    if (!theme) return;

    // Preload any images or assets used in gradients
    Object.values(theme.gradients).forEach((gradient) => {
      if (gradient.includes('url(')) {
        const urlMatch = gradient.match(/url\(([^)]+)\)/);
        if (urlMatch) {
          const img = new Image();
          img.src = urlMatch[1];
        }
      }
    });
  },

  // Get theme-appropriate text color for contrast
  getContrastTextColor: (backgroundColor: string): string => {
    // Simple contrast calculation
    const color = backgroundColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  },

  // Generate CSS custom properties for a theme
  generateThemeCSS: (theme: any): string => {
    const cssVars: string[] = [];

    const processObject = (obj: any, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          processObject(value, `${prefix}${key}-`);
        } else {
          cssVars.push(`--aug-${prefix}${key}: ${value};`);
        }
      });
    };

    processObject(theme);
    return `:root {\n  ${cssVars.join('\n  ')}\n}`;
  },

  // Validate theme structure
  validateTheme: (theme: any): boolean => {
    const requiredKeys = ['colors', 'spacing', 'augmented', 'gradients'];
    return requiredKeys.every((key) => key in theme);
  },
};
