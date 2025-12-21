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

export interface GradientPatternConfig {
  type: GradientPatternType;
  interpolation: InterpolationMode;
  speed: number;
  direction?: SpeedDirection;
  period?: number;
}
