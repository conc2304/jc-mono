import type {
  ClientMessage,
  ServerMessage,
  ConnectionState,
  ConnectionStatus,
} from '@jc/of-control-protocol';

export type MessageListener = (msg: ServerMessage) => void;
export type ConnectionListener = (state: ConnectionState) => void;

const DEFAULT_RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000];

function resolveWsUrl(): string {
  if (typeof window === 'undefined') return 'ws://localhost:8080/ws';
  const { protocol, hostname, port } = window.location;
  const wsProto = protocol === 'https:' ? 'wss:' : 'ws:';
  const p = port ? `:${port}` : '';
  return `${wsProto}//${hostname}${p}/ws`;
}

export class OFControlClient {
  private ws: WebSocket | null = null;
  private url: string;
  private messageListeners = new Set<MessageListener>();
  private connectionListeners = new Set<ConnectionListener>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  private destroyed = false;
  private pendingRequests = new Map<string, (msg: ServerMessage) => void>();

  connectionState: ConnectionState = { status: 'disconnected' };

  constructor(url?: string) {
    this.url = url ?? resolveWsUrl();
  }

  connect(): void {
    if (this.destroyed) return;
    this._setStatus('connecting');
    this._openSocket();
  }

  disconnect(): void {
    this.destroyed = true;
    this._clearReconnect();
    this.ws?.close();
    this.ws = null;
    this._setStatus('disconnected');
  }

  send(msg: ClientMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendWithAck(msg: ClientMessage & { requestId: string }, timeoutMs = 5000): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(msg.requestId);
        reject(new Error(`Request ${msg.requestId} timed out`));
      }, timeoutMs);

      this.pendingRequests.set(msg.requestId, (response) => {
        clearTimeout(timer);
        resolve(response);
      });

      this.send(msg);
    });
  }

  onMessage(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onConnectionChange(listener: ConnectionListener): () => void {
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  private _openSocket(): void {
    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempt = 0;
      this._setStatus('connected');
      this.send({ type: 'getParamSchema' });
      this.send({ type: 'getState' });
    };

    ws.onmessage = (event) => {
      try {
        const msg: ServerMessage = JSON.parse(event.data);
        if ('requestId' in msg && msg.requestId) {
          const handler = this.pendingRequests.get(msg.requestId as string);
          if (handler) {
            this.pendingRequests.delete(msg.requestId as string);
            handler(msg);
            return;
          }
        }
        this.messageListeners.forEach((l) => l(msg));
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      this._setStatus('error', 'WebSocket error');
    };

    ws.onclose = () => {
      if (this.destroyed) return;
      this._scheduleReconnect();
    };
  }

  private _scheduleReconnect(): void {
    const delay = DEFAULT_RECONNECT_DELAYS[
      Math.min(this.reconnectAttempt, DEFAULT_RECONNECT_DELAYS.length - 1)
    ];
    this.reconnectAttempt++;
    this._setStatus('reconnecting', undefined, this.reconnectAttempt);
    this.reconnectTimer = setTimeout(() => {
      if (!this.destroyed) this._openSocket();
    }, delay);
  }

  private _clearReconnect(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private _setStatus(status: ConnectionStatus, error?: string, reconnectAttempt?: number): void {
    this.connectionState = { status, error, reconnectAttempt, timestamp: Date.now() };
    this.connectionListeners.forEach((l) => l(this.connectionState));
  }
}
