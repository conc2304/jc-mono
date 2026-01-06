export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorStop extends ColorRGB {
  position: number;
}

export interface WaveConfig {
  type: string | null;
  period: number;
  amplitude: number;
}

export interface GradientPattern {
  type: string;
  colorStops: ColorStop[];
  speed: number;
  period: number;
  interpolation: string;
  wave?: WaveConfig;
}

export interface LedState {
  power_on: boolean;
  brightness: number;
  hue_rotation_speed: number;
  current_content_index: number;
  current_content_name: string;
  current_solid_color: ColorRGB;
  current_gradient_pattern: GradientPattern;
}

export interface LedStatusResponse {
  status: string;
  message: string;
  'led-state': LedState;
}

// Request types
export interface SetColorRequest {
  r: number;
  g: number;
  b: number;
}

export interface SetGradientPatternRequest {
  colorStops: ColorStop[];
  type: string;
  speed: number;
  interpolation: string;
  period?: number;
  direction?: string;
  wave?: WaveConfig;
}

export interface SetBrightnessRequest {
  brightness: number;
}

export interface SetInvertRequest {
  invert: number;
}

export interface SetHueRotationSpeedRequest {
  speed: number;
}

export interface SetPowerRequest {
  power: number;
}
