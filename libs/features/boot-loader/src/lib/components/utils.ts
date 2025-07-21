import * as THREE from 'three';
import { ColorValue } from './boot-layout/types';

/**
 * Universal color converter that handles multiple input formats
 * and returns a THREE.Color instance
 */
export const convertToThreeColor = (color: ColorValue): THREE.Color => {
  if (color instanceof THREE.Color) {
    return color.clone();
  }

  if (typeof color === 'number') {
    return new THREE.Color(color);
  }

  if (typeof color === 'string') {
    // Handle various string formats
    const trimmed = color.trim();

    // Hex without # prefix
    if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(trimmed)) {
      return new THREE.Color(`#${trimmed}`);
    }

    // All other string formats (hex with #, rgb, hsl, color names)
    return new THREE.Color(trimmed);
  }

  if (
    typeof color === 'object' &&
    'r' in color &&
    'g' in color &&
    'b' in color
  ) {
    // Handle RGB objects - detect if values are 0-1 or 0-255 range
    const { r, g, b } = color;
    if (r <= 1 && g <= 1 && b <= 1) {
      // 0-1 range
      return new THREE.Color(r, g, b);
    } else {
      // 0-255 range
      return new THREE.Color(r / 255, g / 255, b / 255);
    }
  }

  // Fallback to white if conversion fails
  console.warn('Invalid color format, defaulting to white:', color);
  return new THREE.Color(0xffffff);
};

/**
 * Creates color variations for different states (activated, dimmed, bright)
 */
export const createColorVariations = (baseColor: THREE.Color) => {
  const brightColor = baseColor.clone().multiplyScalar(1.5);
  // Manually clamp RGB values to [0, 1] range
  brightColor.r = Math.min(1, brightColor.r);
  brightColor.g = Math.min(1, brightColor.g);
  brightColor.b = Math.min(1, brightColor.b);

  return {
    base: baseColor.clone(),
    bright: brightColor,
    dim: baseColor.clone().multiplyScalar(0.3),
    glow: baseColor.clone().multiplyScalar(0.8),
  };
};
