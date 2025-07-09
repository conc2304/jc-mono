'use client';
import React, { useState } from 'react';

import { ThemeProvider, useTheme } from '../../context/theme-context';
import { Button } from '../button';
import { Card } from '../card';
import { Input } from '../input';
import { Panel } from '../panel';
import { ThemeCustomizer } from '../theme-customizer';
import { ThemeSwitcher } from '../theme-switcher';

export const ThemeShowcase: React.FC = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { currentTheme, themeConfig } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.text,
        padding: '2rem',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h1 style={{ margin: 0 }}>Augmented UI Theme System</h1>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ThemeSwitcher
            variant="cyberpunk"
            size="medium"
            showDarkModeToggle={true}
            showColorPreview={true}
          />

          <Button
            variant="accent"
            shape="clip"
            glow
            onClick={() => setShowCustomizer(!showCustomizer)}
          >
            {showCustomizer ? 'Hide' : 'Show'} Customizer
          </Button>
        </div>
      </div>

      {showCustomizer && (
        <div style={{ marginBottom: '2rem' }}>
          <ThemeCustomizer onClose={() => setShowCustomizer(false)} />
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <Panel variant="primary" size="large" panelType="elevated">
          <h2>Current Theme: {currentTheme.toString()}</h2>
          <p>This panel showcases the primary variant with elevated styling.</p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <Button variant="primary" shape="clip" glow>
              Primary Button
            </Button>

            <Input
              variant="primary"
              placeholder="Type something..."
              style={{ width: '100%' }}
            />
          </div>
        </Panel>

        <Panel variant="secondary" size="large" panelType="glass">
          <h2>Glass Panel</h2>
          <p>This panel uses the glass effect with secondary colors.</p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <Button variant="secondary" shape="round">
              Secondary Button
            </Button>

            <Button variant="secondary" shape="scoop" size="small">
              Small Scoop Button
            </Button>
          </div>
        </Panel>

        <Panel variant="accent" size="large" panelType="flat">
          <h2>Flat Panel</h2>
          <p>This panel uses flat styling with accent colors.</p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            <Button variant="accent" shape="mixed" size="small">
              Mixed Shape
            </Button>

            <Button variant="accent" shape="clip" size="small">
              Clip Shape
            </Button>
          </div>
        </Panel>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <Card variant="neon" shape="hex" glow>
          <h3>Hexagon</h3>
          <p>Neon hexagonal card</p>
        </Card>

        <Card variant="cyberpunk" shape="triangle">
          <h3>Triangle</h3>
          <p>Cyberpunk triangle card</p>
        </Card>

        <Card variant="primary" shape="hexangle">
          <h3>Hexangle</h3>
          <p>Primary hexangle card</p>
        </Card>

        <Card
          variant="secondary"
          shape="custom"
          customAugmentation="tl-3-clip tr-round br-2-scoop bl-step border inlay"
        >
          <h3>Custom</h3>
          <p>Mixed augmentation</p>
        </Card>
      </div>

      <Panel
        variant="cyberpunk"
        size="large"
        glow
        customAugmentation="tl-clip-x tr-scoop br-clip-x bl-round border inlay"
      >
        <h2>Theme Information</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <h3>Colors</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Object.entries(themeConfig.colors).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: value,
                      border: '1px solid #333',
                      borderRadius: '2px',
                    }}
                  />
                  {key}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Augmented Settings</h3>
            <div style={{ fontSize: '12px' }}>
              {Object.entries(themeConfig.augmented).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.25rem' }}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
};
