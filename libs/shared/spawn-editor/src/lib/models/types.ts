export type SpawnRegion = {
  id: string;
  /** Simulation space (640×360) */
  x: number;
  y: number;
  width: number;
  height: number;
  enabled: boolean;
  metadata?: {
    weight?: number;
    direction?: number;
    velocity?: number;
    timing?: number;
  };
};

export type SpawnConfig = {
  id: string;
  maskId: string;
  name?: string;
  useDefaultTopSpawn: boolean;
  regions: SpawnRegion[];
  createdAt: number;
  updatedAt: number;
};

export type HandleId = 'nw' | 'ne' | 'se' | 'sw';

export type SpawnInteraction =
  | { kind: 'idle' }
  | { kind: 'drawing'; startMx: number; startMy: number; curMx: number; curMy: number }
  | { kind: 'moving'; regionId: string; startMx: number; startMy: number; origX: number; origY: number }
  | { kind: 'resizing'; regionId: string; handle: HandleId; startMx: number; startMy: number; origRegion: SpawnRegion };

export type SpawnDrawMode = 'select' | 'draw';

export type SpawnSaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type SpawnActivateStatus = 'idle' | 'activating' | 'done' | 'error';
