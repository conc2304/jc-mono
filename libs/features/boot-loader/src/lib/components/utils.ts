import { Color } from 'three';
import * as d3 from 'd3';

import { ColorValue } from './boot-layout/types';
import { ReactNode } from 'react';

/**
 * Universal color converter that handles multiple input formats
 * and returns a THREE.Color instance
 */
export const convertToThreeColor = (color: ColorValue): Color => {
  if (color instanceof Color) {
    return color.clone();
  }

  if (typeof color === 'number') {
    return new Color(color);
  }

  if (typeof color === 'string') {
    // Handle various string formats
    const trimmed = color.trim();

    // Hex without # prefix
    if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(trimmed)) {
      return new Color(`#${trimmed}`);
    }

    // All other string formats (hex with #, rgb, hsl, color names)
    return new Color(trimmed);
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
      return new Color(r, g, b);
    } else {
      // 0-255 range
      return new Color(r / 255, g / 255, b / 255);
    }
  }

  // Fallback to white if conversion fails
  console.warn('Invalid color format, defaulting to white:', color);
  return new Color(0xffffff);
};

/**
 * Creates color variations for different states (activated, dimmed, bright)
 */
export const createColorVariations = (baseColor: Color) => {
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

export function wrap(text: d3.Selection<any, any, any, any>, width: number) {
  text.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    const lineHeight = 1.4; // ems
    const y = text.attr('y');
    const x = text.attr('x');
    const dy = parseFloat(text.attr('dy'));
    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', dy + 'em');

    let word;
    let line: string[] = [];
    let lineNumber = 0;

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (
        tspan.node() !== null &&
        tspan.node().getComputedTextLength() > width
      ) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  });
} //wrap
