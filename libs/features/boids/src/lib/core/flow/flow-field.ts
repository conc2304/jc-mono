import type { Vector3 } from 'three';

export interface FlowField {
  sample(position: Vector3, time: number, out: Vector3): Vector3;
  setConfig(config: { strength: number; evolutionSpeed: number; inwardPull: number }): void;
}
