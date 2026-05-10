/**
 * Coordinate system for normalized projection points
 * 0.0 = top/left, 1.0 = bottom/right
 */
export interface NormalizedPoint {
  x: number; // 0.0 to 1.0
  y: number; // 0.0 to 1.0
}

/**
 * Parameter type for control schema
 */
export type ControlParamType = 'float' | 'int' | 'bool' | 'enum' | 'color';

/**
 * UI hint for rendering a control
 */
export interface ControlParamUI {
  control?: 'slider' | 'toggle' | 'select' | 'number' | 'color';
  precision?: number;
  unit?: string;
}

/**
 * Single parameter definition from OF app
 */
export interface ControlParam {
  id: string;
  label: string;
  type: ControlParamType;
  group: string;
  mode?: string; // e.g., "water", "fire", or undefined for global
  value: unknown;
  defaultValue?: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string | number | boolean }>;
  description?: string;
  advanced?: boolean;
  readOnly?: boolean;
  ui?: ControlParamUI;
}

/**
 * Mode summary (future: will be expanded from OF)
 */
export interface ModeSummary {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

/**
 * Preset summary (future: will be expanded from OF)
 */
export interface PresetSummary {
  id: string;
  label: string;
  description?: string;
  mode: string;
  tags?: string[];
  piSafe?: boolean;
}

/**
 * Full parameter schema from OF
 */
export interface ControlSchema {
  modes: ModeSummary[];
  presets: PresetSummary[];
  params: ControlParam[];
}

/**
 * Projection corners with normalized coordinates
 */
export interface ProjectionCorners {
  topLeft: NormalizedPoint;
  topRight: NormalizedPoint;
  bottomRight: NormalizedPoint;
  bottomLeft: NormalizedPoint;
}

/**
 * Projection state including calibration
 */
export interface ProjectionState {
  corners: ProjectionCorners;
  calibrationEnabled: boolean;
  testGridEnabled: boolean;
  gridSize?: number;
  dirty?: boolean;
}

/**
 * Mask asset state from OF
 */
export interface MaskAssetState {
  id?: string;
  name?: string;
  width: number;
  height: number;
  imageUrl: string;
  updatedAt?: string;
  source?: 'default' | 'uploaded' | 'camera' | 'editor';
}
