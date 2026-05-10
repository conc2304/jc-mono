/**
 * WebSocket messages sent from client (frontend) to OF server
 */

import type { ProjectionCornersWire } from './types';

/**
 * Base message with optional requestId for ack pattern
 */
export interface BaseClientMessage {
  requestId?: string;
}

/**
 * Request parameter schema from OF
 */
export interface GetParamSchemaMessage extends BaseClientMessage {
  type: 'getParamSchema';
}

/**
 * Request current state from OF
 */
export interface GetStateMessage extends BaseClientMessage {
  type: 'getState';
}

/**
 * Set a single parameter value
 */
export interface SetParamMessage extends BaseClientMessage {
  type: 'setParam';
  id: string;
  value: unknown;
}

/**
 * Set experience mode (convenience wrapper around setParam)
 */
export interface SetModeMessage extends BaseClientMessage {
  type: 'setMode';
  mode: string;
}

/**
 * Load a preset
 */
export interface LoadPresetMessage extends BaseClientMessage {
  type: 'loadPreset';
  presetId: string;
}

/**
 * Set a single projection corner by name.
 */
export interface SetProjectionCornerMessage extends BaseClientMessage {
  type: 'setProjectionCorner';
  corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
  point: { x: number; y: number };
}

/**
 * Set all projection corners at once (named keys, normalized coords)
 */
export interface SetProjectionCornersMessage extends BaseClientMessage {
  type: 'setProjectionCorners';
  corners: ProjectionCornersWire;
}

/**
 * Show or hide the test grid overlay
 */
export interface SetProjectionGridMessage extends BaseClientMessage {
  type: 'setProjectionGrid';
  enabled: boolean;
  gridSize?: number;
}

/**
 * Save current projection calibration
 */
export interface SaveProjectionMessage extends BaseClientMessage {
  type: 'saveProjection';
}

/**
 * Reset projection to defaults
 */
export interface ResetProjectionMessage extends BaseClientMessage {
  type: 'resetProjection';
}

/**
 * Enable/disable projection calibration mode
 */
export interface SetProjectionCalibrationMessage extends BaseClientMessage {
  type: 'setProjectionCalibration';
  enabled: boolean;
}

/**
 * Discriminated union of all client messages
 */
export type ClientMessage =
  | GetParamSchemaMessage
  | GetStateMessage
  | SetParamMessage
  | SetModeMessage
  | LoadPresetMessage
  | SetProjectionCornerMessage
  | SetProjectionCornersMessage
  | SetProjectionGridMessage
  | SaveProjectionMessage
  | ResetProjectionMessage
  | SetProjectionCalibrationMessage;
