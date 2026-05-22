import type {
  ControlSchema,
  ServerMessage,
  ConnectionState,
  ProjectionCornersWire,
  ProjectionCorners,
  ProjectionState,
  SettingsManifestEntry,
  PresetSummary,
} from '@jc/shared/of-control-protocol';
import type { OFControlClient } from './OFControlClient';

export type StoreListener = (store: OFControlStore) => void;

function normalizeCorners(wire: ProjectionCornersWire): ProjectionCorners {
  return [wire.topLeft, wire.topRight, wire.bottomRight, wire.bottomLeft];
}

export class OFControlStore {
  schema: ControlSchema | null = null;
  settingsManifest: SettingsManifestEntry[] = [];
  uiVersion: number = 1;
  values: Record<string, unknown> = {};
  currentMode: string | null = null;
  optimisticMode: string | undefined = undefined;
  currentPreset: string | null = null;
  presets: PresetSummary[] = [];
  presetLoadingId: string | undefined = undefined;
  presetError: string | undefined = undefined;
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

  setOptimisticMode(mode: string): void {
    this.optimisticMode = mode;
    this._notify();
  }

  clearOptimisticMode(): void {
    if (this.optimisticMode === undefined) return;
    this.optimisticMode = undefined;
    this._notify();
  }

  setPresetLoading(presetId: string): void {
    this.presetLoadingId = presetId;
    this.presetError = undefined;
    this._notify();
  }

  setPresetError(error: string): void {
    this.presetLoadingId = undefined;
    this.presetError = error;
    this._notify();
  }

  clearPresetError(): void {
    this.presetError = undefined;
    this._notify();
  }

  private _handleMessage(msg: ServerMessage): void {
    switch (msg.type) {
      case 'settingsManifest':
        this.settingsManifest = msg.manifest ?? [];
        this.uiVersion = msg.uiVersion ?? 1;
        break;

      case 'paramSchema':
        this.schema = {
          modes: [],
          presets: [],
          params: (msg.params ?? []).map(normalizeParam),
        };
        break;

      case 'fullState':
        this.values = { ...this.values, ...msg.values };
        if (msg.values['experienceMode'] !== undefined) this.currentMode = msg.values['experienceMode'] as string;
        if (msg.preset !== undefined) this.currentPreset = msg.preset;
        if (msg.presets !== undefined) {
          this.presets = msg.presets;
          if (this.schema) {
            this.schema = { ...this.schema, presets: msg.presets };
          }
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
        if (msg.id === 'experienceMode') {
          this.currentMode = msg.value as string;
          // Canonical mode arrived — clear optimistic hint regardless of match
          this.optimisticMode = undefined;
        }
        break;

      case 'modeChanged':
        this.currentMode = msg.mode;
        this.optimisticMode = undefined;
        break;

      case 'presetChanged':
        this.currentPreset = msg.presetId;
        break;

      case 'presets':
        this.presets = msg.presets;
        this.currentPreset = msg.current;
        break;

      case 'presetLoaded':
        this.currentPreset = msg.presetId;
        this.presetLoadingId = undefined;
        if (msg.switchedMode && msg.mode) {
          this.optimisticMode = msg.mode;
        }
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

// Normalise a raw param from the wire format into a typed ControlParam.
function normalizeParam(p: Record<string, unknown>): Record<string, unknown> {
  const modes = Array.isArray(p.modes) ? p.modes : [];
  if (!Array.isArray(p.options)) return { ...p, modes };
  const options = (p.options as unknown[]).map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o
  );
  return { ...p, modes, options };
}
