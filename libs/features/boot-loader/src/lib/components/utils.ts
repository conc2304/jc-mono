import * as d3 from 'd3';
import * as THREE from 'three';
import {
  MetricGroup,
  RadarData,
  RadarDataEntry,
} from './radar-chart-widget/radar-chart-widget';
import { ColorScheme, ColorValue } from './torus-field-progress/types';

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
 * Creates color variations for different states based on theme mode
 */
export const createColorVariations = (
  baseColor: THREE.Color,
  themeMode: 'light' | 'dark' = 'dark'
) => {
  const isLight = themeMode === 'light';

  // For light mode: brighten less, darken more for subtle effects
  // For dark mode: brighten more, darken less for vibrant effects
  const brightMultiplier = isLight ? 1.2 : 1.5;
  const dimMultiplier = isLight ? 0.6 : 0.3;
  const glowMultiplier = isLight ? 0.9 : 0.8;

  const brightColor = baseColor.clone().multiplyScalar(brightMultiplier);
  // Manually clamp RGB values to [0, 1] range
  brightColor.r = Math.min(1, brightColor.r);
  brightColor.g = Math.min(1, brightColor.g);
  brightColor.b = Math.min(1, brightColor.b);

  return {
    base: baseColor.clone(),
    bright: brightColor,
    dim: baseColor.clone().multiplyScalar(dimMultiplier),
    glow: baseColor.clone().multiplyScalar(glowMultiplier),
  };
};

// Default colors for different theme modes
export const getDefaultColors = (
  themeMode: 'light' | 'dark' = 'dark'
): ColorScheme => {
  if (themeMode === 'light') {
    return {
      backgroundColor: 0xf5f5f5, // Light gray background
      beamColor: '#1976d2', // Blue beam
      torusColor: 'rgb(25, 118, 210)', // Blue torus
      particleColor: { r: 25, g: 118, b: 210 }, // Blue particles
      verticalLineColor: '#1976d2', // Blue lines
      themeMode: 'light',
    };
  } else {
    return {
      backgroundColor: 0x220000, // Dark red background
      beamColor: '#ff0000', // Red beam
      torusColor: 'rgb(255, 0, 0)', // Red torus
      particleColor: { r: 255, g: 0, b: 0 }, // Red particles
      verticalLineColor: 'red', // Red lines
      themeMode: 'dark',
    };
  }
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
      const node = tspan.node();
      if (node !== null && node.getComputedTextLength() > width) {
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

// Simple Perlin noise implementation
export class SimplexNoise {
  private grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ];

  private p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];

  private perm: number[];

  constructor(seed: number = 0) {
    this.perm = new Array(512);
    // Seed the permutation
    for (let i = 0; i < 256; i++) {
      this.perm[i] = this.p[i];
      this.perm[i + 256] = this.p[i];
    }
  }

  private dot(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y;
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = this.fade(x);
    const v = this.fade(y);

    const A = this.perm[X] + Y;
    const AA = this.perm[A];
    const AB = this.perm[A + 1];
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B];
    const BB = this.perm[B + 1];

    const gradAA = this.grad3[AA % 12];
    const gradBA = this.grad3[BA % 12];
    const gradAB = this.grad3[AB % 12];
    const gradBB = this.grad3[BB % 12];

    return this.lerp(
      this.lerp(this.dot(gradAA, x, y), this.dot(gradBA, x - 1, y), u),
      this.lerp(this.dot(gradAB, x, y - 1), this.dot(gradBB, x - 1, y - 1), u),
      v
    );
  }
}

interface TrailingConfig {
  numTrails: number;
  trailOffset: number;
  timeStep: number;
  baseData: MetricGroup;
  noiseScale?: number;
  trailIntensity?: number;
}

const noise = new SimplexNoise(42); // Fixed seed for consistent results

/**
 * Generates radar chart data with trailing effects using Perlin noise
 * @param numTrails - Number of trailing metric groups to generate
 * @param trailOffset - Time offset between each trail (larger = more spacing)
 * @param timeStep - Current animation time step
 * @param baseData - The main metric group to create trails from
 * @param noiseScale - Scale factor for noise (default: 0.1)
 * @param trailIntensity - How much the trails deviate from base data (default: 0.3)
 * @returns Array of MetricGroups representing the trails
 */
export function generateTrailingRadarData({
  numTrails,
  trailOffset,
  timeStep,
  baseData,
  noiseScale = 0.1,
  trailIntensity = 0.3,
}: TrailingConfig): RadarData {
  const trails: RadarData = [];

  console.log('generateTrailingRadarData');
  for (let trailIndex = 0; trailIndex < numTrails; trailIndex++) {
    const trailTime = timeStep - trailIndex * trailOffset;
    const trailGroup: MetricGroup = [];

    baseData.forEach((entry, axisIndex) => {
      // Create noise coordinates using trail time and axis index
      const noiseX = trailTime * noiseScale;
      const noiseY = (axisIndex + trailIndex) * 0.5; // Offset Y by axis and trail

      // Get noise value (-1 to 1)
      const noiseValue = noise.noise2D(noiseX, noiseY);
      // console.log({ noiseValue, trailIndex, trailTime });

      // Apply noise to create trailing effect
      const trailIntensityForThisTrail =
        trailIntensity * (1 - trailIndex * 0.1); // Reduce intensity for later trails
      const valueOffset = noiseValue * trailIntensityForThisTrail * entry.value;

      // Calculate the new value, ensuring it stays within reasonable bounds
      const newValue = Math.max(0, Math.min(100, entry.value + valueOffset));

      // Create trail entry with modified group name
      const trailEntry: RadarDataEntry = {
        ...entry,
        value: newValue,
        metricGroupName:
          trailIndex === 0
            ? entry.metricGroupName || 'Main'
            : `${entry.metricGroupName || 'Main'} Trail ${trailIndex}`,
      };

      trailGroup.push(trailEntry);
    });

    trails.push(trailGroup);
  }

  // console.log({ trails });
  return trails;
}

/**
 * Remaps a value from one range to another range
 * @param value - The input value to remap
 * @param sourceMin - Minimum of the source range
 * @param sourceMax - Maximum of the source range
 * @param targetMin - Minimum of the target range
 * @param targetMax - Maximum of the target range
 * @param clamp - Whether to clamp the result to the target range (default: false)
 * @returns The remapped value
 */
export function remap(
  value: number,
  sourceMin: number,
  sourceMax: number,
  targetMin: number,
  targetMax: number,
  clamp: boolean = false
): number {
  // Calculate the remapped value
  const result =
    targetMin +
    ((value - sourceMin) * (targetMax - targetMin)) / (sourceMax - sourceMin);

  // Optionally clamp to target range
  if (clamp) {
    return Math.max(targetMin, Math.min(targetMax, result));
  }

  return result;
}
