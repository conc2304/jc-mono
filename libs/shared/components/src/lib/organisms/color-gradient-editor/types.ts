export interface ColorStop {
  id: number;
  color: string;
  position: number;
}

export interface Gradient {
  id: string;
  stops: ColorStop[];
  isDefault?: boolean; // Marks if this is a default/preset gradient
}

export type GradientPatternType =
  | 'vertical'
  | 'horizontal'
  | 'circular'
  | 'radial';

export type InterpolationMode = 'linear' | 'step';

export interface GradientPattern {
  id: string;
  name: string;
  type: GradientPatternType;
  interpolation: InterpolationMode;
  speed: number; // 0-100, where 0 is static
  period?: number; // 0.2-10, where 1 is default
  gradient?: Gradient;
}

export type SpeedDirection = 'forward' | 'backward';

export type WaveType = 'sine' | 'triangle' | 'sawtooth' | 'square' | null;

export interface WaveConfig {
  type: WaveType;
  period: number; // 0.2-4, default 1
  amplitude: number; // 0-1, default 0.5
}

export interface GradientPatternConfig {
  type: GradientPatternType;
  interpolation: InterpolationMode;
  speed: number;
  direction?: SpeedDirection;
  period?: number;
  wave?: WaveConfig;
}
