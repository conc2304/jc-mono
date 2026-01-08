import { GradientPatternType, InterpolationMode } from '@jc/utils';

export type LedDisplayMode = 'solid-color' | 'gradient' | 'image';

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
  type: GradientPatternType;
  colorStops: ColorStop[];
  speed: number;
  period: number;
  interpolation: InterpolationMode;
  wave?: WaveConfig;
}

export interface LedState {
  power_on: boolean;
  brightness: number;
  hue_rotation_speed: number;
  current_content_index: number;
  current_content_name: LedDisplayMode;
  current_solid_color: ColorRGB;
  current_gradient_pattern: GradientPattern;
}

// Response Types
export interface LedStatusResponse {
  status: 'online' | 'offline';
  message: string;
  'led-state': LedState;
}

// Base response types for control endpoints
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Specific response data types
export interface PowerResponseData {
  power: number;
}

export interface ColorResponseData {
  color: ColorRGB;
  active_state: 'solid-color';
}

export interface BrightnessResponseData {
  brightness: number;
}

export interface GradientResponseData {
  gradient: GradientPattern;
  active_state: 'gradient';
}

export interface HueRotationResponseData {
  speed: number;
}

// Endpoint-specific response types
export type PowerSetResponse = APIResponse<PowerResponseData>;
export type ColorPostResponse = APIResponse<ColorResponseData>;
export type BrightnessPostResponse = APIResponse<BrightnessResponseData>;
export type GradientPostResponse = APIResponse<GradientResponseData>;
export type HueRotationPostResponse = APIResponse<HueRotationResponseData>;

// Union type for all possible control responses
export type LEDControllerResponse =
  | PowerSetResponse
  | ColorPostResponse
  | BrightnessPostResponse
  | GradientPostResponse
  | HueRotationPostResponse;

// Error response type
export interface ErrorResponse extends APIResponse<never> {
  success: false;
  error: string;
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

// Type guards for checking active state
export function isSolidColorActive(
  ledState: LedState
): ledState is LedState & { current_solid_color: ColorRGB } {
  return (
    ledState.current_content_name === 'solid-color' &&
    ledState.current_solid_color !== undefined
  );
}

export function isGradientActive(
  ledState: LedState
): ledState is LedState & { current_gradient_pattern: GradientPattern } {
  return (
    ledState.current_content_name === 'gradient' &&
    ledState.current_gradient_pattern !== undefined
  );
}
