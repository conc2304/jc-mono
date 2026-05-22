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
export type ControlParamType = 'float' | 'int' | 'bool' | 'enum' | 'color' | 'gradient';

/**
 * A single stop in a gradient — position t in [0,1], linear RGB channels in [0,1].
 * The backend stores and transmits gradients in linear RGB, not sRGB.
 */
export interface GradientStop {
  t: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * A single showWhen visibility rule.
 * A param is visible only when ALL rules match (AND semantics).
 */
export interface ShowWhenRule {
  path: string;
  equals: unknown;
}

/**
 * UI hint for rendering a control
 */
export interface ControlParamUI {
  control?: 'slider' | 'toggle' | 'select' | 'number' | 'color' | 'gradient';
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
  value: unknown;
  defaultValue?: unknown;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string | number | boolean }>;
  modes: string[];
  description?: string;
  advanced?: boolean;
  readOnly?: boolean;
  ui?: ControlParamUI;
  showWhen?: ShowWhenRule[];
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
  mode?: string;
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
 * Projection corners as an ordered 4-tuple (internal representation).
 * Index: 0=topLeft, 1=topRight, 2=bottomRight, 3=bottomLeft
 */
export type ProjectionCorners = [NormalizedPoint, NormalizedPoint, NormalizedPoint, NormalizedPoint];

/**
 * Projection corners as named keys matching the wire format.
 */
export interface ProjectionCornersWire {
  topLeft: NormalizedPoint;
  topRight: NormalizedPoint;
  bottomRight: NormalizedPoint;
  bottomLeft: NormalizedPoint;
}

/**
 * Projection state. `dirty` reflects server-side unsaved state.
 */
export interface ProjectionState {
  corners: ProjectionCorners;
  calibrationEnabled: boolean;
  testGridEnabled: boolean;
  gridSize: number;
  dirty: boolean;
}

/**
 * UI enrichment entry from the settingsManifest server message.
 * Drives manifest-based rendering: category order, placement, control hints, descriptions.
 */
export interface SettingsManifestEntry {
  id?: string;
  path?: string;
  label?: string;
  category?: string;
  categoryLabel?: string;
  categoryDescription?: string;
  categoryOrder?: number;
  order?: number;
  placement?: 'globalDrawer' | 'modeDrawer' | 'hidden';
  layout?: 'full' | 'compact';
  control?: string;
  description?: string;
  advanced?: boolean;
  showWhen?: ShowWhenRule[];
  defaultValue?: unknown;
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
