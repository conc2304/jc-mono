'use client';

import React, { forwardRef, useState } from 'react';

import { Button } from './button';
import { augmentedTheme } from '../../contract.css';
import { VariantColor, VariantShape, VariantSize } from '../../themes';

export const ButtonDemo = () => {
  const variants: VariantColor[] = [
    'primary',
    'secondary',
    'accent',
    'cyberpunk',
    'neon',
  ];
  const sizes: VariantSize[] = ['small', 'medium', 'large'];
  const shapes: VariantShape[] = ['clip', 'round', 'scoop', 'mixed'];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [glowEnabled, setGlowEnabled] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: augmentedTheme.colors.background,
        color: augmentedTheme.colors.text,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              background: augmentedTheme.gradients.cyberpunk,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Augmented Button Component
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: augmentedTheme.colors.textSecondary,
              margin: '0 auto',
              maxWidth: '600px',
            }}
          >
            A futuristic button component with customizable variants, sizes,
            shapes, and glow effects.
          </p>
        </div>

        {/* Interactive Playground */}
        <div
          style={{
            marginBottom: '3rem',
            padding: '2rem',
            backgroundColor: augmentedTheme.colors.surface,
            borderRadius: '12px',
            border: `1px solid ${augmentedTheme.colors.border}`,
          }}
        >
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Interactive Playground
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            {/* Variant Selector */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                }}
              >
                Variant
              </label>
              <select
                value={selectedVariant}
                onChange={(e) =>
                  setSelectedVariant(e.target.value as VariantColor)
                }
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: augmentedTheme.colors.background,
                  color: augmentedTheme.colors.text,
                  border: `1px solid ${augmentedTheme.colors.border}`,
                  borderRadius: '4px',
                }}
              >
                {variants.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selector */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                }}
              >
                Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as VariantSize)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: augmentedTheme.colors.background,
                  color: augmentedTheme.colors.text,
                  border: `1px solid ${augmentedTheme.colors.border}`,
                  borderRadius: '4px',
                }}
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Shape Selector */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                }}
              >
                Shape
              </label>
              <select
                value={selectedShape}
                onChange={(e) =>
                  setSelectedShape(e.target.value as VariantShape)
                }
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: augmentedTheme.colors.background,
                  color: augmentedTheme.colors.text,
                  border: `1px solid ${augmentedTheme.colors.border}`,
                  borderRadius: '4px',
                }}
              >
                {shapes.map((shape) => (
                  <option key={shape} value={shape}>
                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Glow Toggle */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <input
                type="checkbox"
                id="glow"
                checked={glowEnabled}
                onChange={(e) => setGlowEnabled(e.target.checked)}
                style={{ width: '1rem', height: '1rem' }}
              />
              <label htmlFor="glow" style={{ fontWeight: '600' }}>
                Glow Effect
              </label>
            </div>
          </div>

          {/* Preview */}
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: augmentedTheme.colors.background,
              borderRadius: '8px',
              border: `1px solid ${augmentedTheme.colors.border}`,
            }}
          >
            <Button
              variant={selectedVariant}
              size={selectedSize}
              shape={selectedShape}
              glow={glowEnabled}
            >
              Preview Button
            </Button>
          </div>
        </div>

        {/* Variants Showcase */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Variants
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {variants.map((variant) => (
              <div key={variant} style={{ textAlign: 'center' }}>
                <Button variant={variant} size="medium" shape="clip">
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes Showcase */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Sizes</h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {sizes.map((size) => (
              <Button key={size} variant="primary" size={size} shape="clip">
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Shapes Showcase */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Shapes</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {shapes.map((shape) => (
              <div key={shape} style={{ textAlign: 'center' }}>
                <Button variant="accent" size="medium" shape={shape}>
                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Glow Effects */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Glow Effects
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '2rem',
              padding: '2rem',
              backgroundColor: augmentedTheme.colors.surface,
              borderRadius: '12px',
            }}
          >
            {variants.map((variant) => (
              <div key={variant} style={{ textAlign: 'center' }}>
                <Button variant={variant} size="medium" shape="clip" glow>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Augmentation Example */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Custom Augmentation
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="cyberpunk"
              size="medium"
              customAugmentation="tl-clip tr-round br-scoop bl-round border inlay"
              glow
            >
              Custom Shape
            </Button>
            <Button
              variant="neon"
              size="large"
              customAugmentation="tl-scoop tr-scoop br-scoop bl-scoop border inlay"
            >
              All Scoops
            </Button>
          </div>
        </div>

        {/* Usage Examples */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            Usage Examples
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h3
                style={{
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  color: augmentedTheme.colors.textSecondary,
                }}
              >
                Call to Action
              </h3>
              <Button variant="primary" size="large" shape="clip" glow>
                Get Started
              </Button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3
                style={{
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  color: augmentedTheme.colors.textSecondary,
                }}
              >
                Gaming UI
              </h3>
              <Button variant="cyberpunk" size="medium" shape="mixed" glow>
                Play Now
              </Button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3
                style={{
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  color: augmentedTheme.colors.textSecondary,
                }}
              >
                Sci-Fi Interface
              </h3>
              <Button variant="neon" size="medium" shape="scoop">
                Initialize
              </Button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3
                style={{
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  color: augmentedTheme.colors.textSecondary,
                }}
              >
                Subtle Action
              </h3>
              <Button variant="secondary" size="small" shape="round">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
