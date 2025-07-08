'use client';
import React, { useState } from 'react';

import { useTheme } from '../../context/theme-context';
import { ThemeConfig } from '../../themes/types';
import { Button } from '../button';
import { Input } from '../input';
import { Panel } from '../panel';

export interface ThemeCustomizerProps {
  onClose?: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  onClose,
}) => {
  const { themeConfig, setCustomTheme, currentTheme } = useTheme();
  const [customConfig, setCustomConfig] =
    useState<Partial<ThemeConfig>>(themeConfig);

  const handleColorChange = (
    colorKey: keyof ThemeConfig['colors'],
    value: string
  ) => {
    setCustomConfig((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
  };

  const handleAugmentedChange = (
    augmentedKey: keyof ThemeConfig['augmented'],
    value: string
  ) => {
    setCustomConfig((prev) => ({
      ...prev,
      augmented: {
        ...prev.augmented,
        [augmentedKey]: value,
      },
    }));
  };

  const applyCustomTheme = () => {
    setCustomTheme(customConfig);
    onClose?.();
  };

  const resetToDefault = () => {
    setCustomConfig(themeConfig);
    setCustomTheme(null);
  };

  return (
    <Panel
      variant="cyberpunk"
      size="large"
      customAugmentation="tl-clip-x tr-clip-x br-clip-x bl-clip-x border inlay"
      style={{
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>Theme Customizer</h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <section>
          <h3>Colors</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.5rem',
            }}
          >
            {Object.entries(customConfig.colors || {}).map(([key, value]) => (
              <div
                key={key}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <label style={{ minWidth: '80px', fontSize: '12px' }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) =>
                    handleColorChange(
                      key as keyof ThemeConfig['colors'],
                      e.target.value
                    )
                  }
                  style={{
                    width: '40px',
                    height: '30px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                />
                <Input
                  variant="accent"
                  size="small"
                  value={value}
                  onChange={(e) =>
                    handleColorChange(
                      key as keyof ThemeConfig['colors'],
                      e.target.value
                    )
                  }
                  style={{ fontSize: '12px' }}
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>Augmented Settings</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.5rem',
            }}
          >
            {Object.entries(customConfig.augmented || {}).map(
              ([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <label style={{ minWidth: '120px', fontSize: '12px' }}>
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </label>
                  <Input
                    variant="secondary"
                    size="small"
                    value={value}
                    onChange={(e) =>
                      handleAugmentedChange(
                        key as keyof ThemeConfig['augmented'],
                        e.target.value
                      )
                    }
                    style={{ fontSize: '12px' }}
                  />
                </div>
              )
            )}
          </div>
        </section>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button variant="primary" shape="clip" onClick={applyCustomTheme}>
            Apply Theme
          </Button>

          <Button variant="secondary" shape="round" onClick={resetToDefault}>
            Reset to Default
          </Button>

          {onClose && (
            <Button variant="accent" shape="scoop" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
};
