/**
 * WebSocket messages sent from OF server to client (frontend)
 */

import type {
  ProjectionCornersWire,
  MaskAssetState,
  SettingsManifestEntry,
  PresetSummary,
} from './types';

/**
 * Parameter schema sent on connect
 */
export interface ParamSchemaMessage {
  type: 'paramSchema';
  params: Array<any>; // ControlParam[]
}

/**
 * Full state snapshot sent on connect by OF
 */
export interface FullStateMessage {
  type: 'fullState';
  values: Record<string, unknown>;
  projection?: {
    corners: ProjectionCornersWire;
    calibrationEnabled: boolean;
    testGridEnabled: boolean;
    gridSize: number;
    dirty: boolean;
  };
  preset?: string;
  presets?: PresetSummary[];
}

/**
 * Current state snapshot (legacy, kept for compatibility)
 */
export interface StateMessage {
  type: 'state';
  values: Record<string, unknown>;
  mode?: string;
  preset?: string;
  fps?: number;
}

/**
 * Notification when a single parameter changes
 * Broadcast to all connected clients
 */
export interface ParamChangedMessage {
  type: 'paramChanged';
  id: string;
  value: unknown;
}

/**
 * Notification when mode changes
 * Broadcast to all connected clients
 */
export interface ModeChangedMessage {
  type: 'modeChanged';
  mode: string;
}

/**
 * Notification when preset changes
 * Broadcast to all connected clients
 */
export interface PresetChangedMessage {
  type: 'presetChanged';
  presetId: string;
}

/**
 * Notification when projection corners change
 * Broadcast to all connected clients after corner updates and reset
 */
export interface ProjectionChangedMessage {
  type: 'projectionChanged';
  projection: {
    corners: ProjectionCornersWire;
    calibrationEnabled: boolean;
    testGridEnabled: boolean;
    gridSize: number;
    dirty: boolean;
  };
}

/**
 * Notification when mask/image changes
 * Broadcast to all connected clients
 */
export interface MaskChangedMessage {
  type: 'maskChanged';
  mask: MaskAssetState;
}

/**
 * UI enrichment metadata for manifest-driven rendering, sent once on connect
 */
export interface SettingsManifestMessage {
  type: 'settingsManifest';
  uiVersion?: number;
  manifest: SettingsManifestEntry[];
}

/**
 * Response to getPresets — full preset list with current active preset
 */
export interface PresetsMessage {
  type: 'presets';
  requestId?: string;
  current: string;
  presets: PresetSummary[];
}

/**
 * Broadcast when a preset is successfully loaded.
 * mode/switchedMode are present only when the backend switched modes.
 */
export interface PresetLoadedMessage {
  type: 'presetLoaded';
  presetId: string;
  mode?: string;
  switchedMode?: boolean;
}

/**
 * Acknowledgment of a client request (when requestId is provided)
 */
export interface AckMessage {
  type: 'ack';
  requestId: string;
  ok: boolean;
  error?: string;
}

/**
 * Error message sent to client
 */
export interface ErrorMessage {
  type: 'error';
  message: string;
  requestId?: string;
  id?: string;
}

/**
 * Discriminated union of all server messages
 */
export type ServerMessage =
  | ParamSchemaMessage
  | FullStateMessage
  | StateMessage
  | ParamChangedMessage
  | ModeChangedMessage
  | PresetChangedMessage
  | PresetsMessage
  | PresetLoadedMessage
  | ProjectionChangedMessage
  | MaskChangedMessage
  | SettingsManifestMessage
  | AckMessage
  | ErrorMessage;
