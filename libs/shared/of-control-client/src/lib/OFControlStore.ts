import type {
  ControlSchema,
  ServerMessage,
  ConnectionState,
  ProjectionCornersWire,
  ProjectionCorners,
  ProjectionState,
} from '@jc/of-control-protocol';
import type { OFControlClient } from './OFControlClient';

export type StoreListener = (store: OFControlStore) => void;

function normalizeCorners(wire: ProjectionCornersWire): ProjectionCorners {
  return [wire.topLeft, wire.topRight, wire.bottomRight, wire.bottomLeft];
}

export class OFControlStore {
  schema: ControlSchema | null = null;
  values: Record<string, unknown> = {};
  currentMode: string | null = null;
  currentPreset: string | null = null;
  fps: number | null = null;
  projection: ProjectionState | null = null;
  maskVersion = 0;
  connection: ConnectionState = { status: 'disconnected' };

  private listeners = new Set<StoreListener>();
  private unsubMessage: (() => void) | null = null;
  private unsubConnection: (() => void) | null = null;

  attach(client: OFControlClient): void {
    this.unsubMessage?.();
    this.unsubConnection?.();

    this.unsubMessage = client.onMessage((msg: ServerMessage) => {
      this._handleMessage(msg);
    });

    this.unsubConnection = client.onConnectionChange((state: ConnectionState) => {
      this.connection = state;
      this._notify();
    });
  }

  detach(): void {
    this.unsubMessage?.();
    this.unsubConnection?.();
    this.unsubMessage = null;
    this.unsubConnection = null;
  }

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getValue(id: string): unknown {
    return this.values[id];
  }

  setValueOptimistic(id: string, value: unknown): void {
    this.values = { ...this.values, [id]: value };
    this._notify();
  }

  private _handleMessage(msg: ServerMessage): void {
    switch (msg.type) {
      case 'paramSchema':
        this.schema = {
          modes: [],
          presets: [],
          params: (msg.params ?? []).map(normalizeParam),
        };
        break;

      case 'fullState':
        this.values = { ...this.values, ...msg.values };
        if (msg.preset !== undefined) this.currentPreset = msg.preset;
        if (msg.presets !== undefined && this.schema) {
          this.schema = {
            ...this.schema,
            presets: msg.presets.map((p) => ({
              id: p.id,
              label: p.label,
              description: p.description,
              mode: '',
            })),
          };
        }
        if (msg.projection !== undefined) {
          const p = msg.projection;
          this.projection = {
            corners: normalizeCorners(p.corners),
            calibrationEnabled: p.calibrationEnabled,
            testGridEnabled: p.testGridEnabled,
            gridSize: p.gridSize,
            dirty: p.dirty,
          };
        }
        break;

      case 'state':
        this.values = { ...this.values, ...msg.values };
        if (msg.mode !== undefined) this.currentMode = msg.mode;
        if (msg.preset !== undefined) this.currentPreset = msg.preset;
        if (msg.fps !== undefined) this.fps = msg.fps;
        break;

      case 'paramChanged':
        this.values = { ...this.values, [msg.id]: msg.value };
        break;

      case 'modeChanged':
        this.currentMode = msg.mode;
        break;

      case 'presetChanged':
        this.currentPreset = msg.presetId;
        break;

      case 'projectionChanged': {
        const p = msg.projection;
        this.projection = {
          corners: normalizeCorners(p.corners),
          calibrationEnabled: p.calibrationEnabled,
          testGridEnabled: p.testGridEnabled,
          gridSize: p.gridSize,
          dirty: p.dirty,
        };
        break;
      }

      case 'maskChanged':
        this.maskVersion += 1;
        break;

      default:
        break;
    }

    this._notify();
  }

  private _notify(): void {
    this.listeners.forEach((l) => l(this));
  }
}

export const globalStore = new OFControlStore();

// OF sends options as either string[] or {label,value}[] — normalise to {label,value}[].
function normalizeParam(p: Record<string, unknown>): Record<string, unknown> {
  if (!Array.isArray(p.options)) return p;
  const options = (p.options as unknown[]).map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o
  );
  return { ...p, options };
}
