export interface ColorStop {
  id: number;
  color: string;
  position: number;
}

export interface Gradient {
  id: string;
  stops: ColorStop[];
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
  gradient?: Gradient;
}

export interface GradientPatternConfig {
  type: GradientPatternType;
  interpolation: InterpolationMode;
  speed: number;
}
