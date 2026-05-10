/**
 * WebSocket messages sent from OF server to client (frontend)
 */

import type {
  ControlSchema,
  ProjectionState,
  MaskAssetState,
} from './types';

/**
 * Parameter schema sent on connect or when requested
 */
export interface ParamSchemaMessage {
  type: 'paramSchema';
  params: Array<any>; // ControlParam[]
}

/**
 * Current state snapshot sent on connect or when requested
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
 * Notification when projection changes
 * Broadcast to all connected clients
 */
export interface ProjectionChangedMessage {
  type: 'projectionChanged';
  projection: ProjectionState;
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
  | StateMessage
  | ParamChangedMessage
  | ModeChangedMessage
  | PresetChangedMessage
  | ProjectionChangedMessage
  | MaskChangedMessage
  | AckMessage
  | ErrorMessage;
