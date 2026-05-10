/**
 * WebSocket messages sent from OF server to client (frontend)
 */

import type {
  NormalizedPoint,
  MaskAssetState,
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
    corners: [NormalizedPoint, NormalizedPoint, NormalizedPoint, NormalizedPoint];
    calibrating: boolean;
  };
  preset?: string;
  presets?: Array<{ id: string; label: string; description?: string }>;
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
    corners: [NormalizedPoint, NormalizedPoint, NormalizedPoint, NormalizedPoint];
    calibrating: boolean;
  };
}

/**
 * Notification when calibration mode changes
 * Sent in response to setProjectionCalibration
 */
export interface ProjectionCalibrationChangedMessage {
  type: 'projectionCalibrationChanged';
  calibrating: boolean;
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
  | ProjectionChangedMessage
  | ProjectionCalibrationChangedMessage
  | MaskChangedMessage
  | AckMessage
  | ErrorMessage;
