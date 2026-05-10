/**
 * Connection status type for WebSocket to OF app
 */
export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface ConnectionState {
  status: ConnectionStatus;
  error?: string;
  reconnectAttempt?: number;
  timestamp?: number;
}
