import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';

import { getAttractorPresetConfig } from '../../presets/attractor-presets';
import type { AttractorMotionConfig, AttractorMotionPreset } from '../../presets/types';
import { createMotionStrategy } from './motion/create-motion-strategy';
import type { AttractorBounds } from './motion/attractor-motion-strategy';
import type { AttractorMotionStrategy } from './motion/attractor-motion-strategy';

export type AttractorOptions = {
  position?: Vector3 | [number, number, number];
  strength?: number;
  range?: number;
  boundingSize?: number;
  speed?: number;
  isVisible?: boolean;
  motionPreset?: AttractorMotionPreset;
  phase?: number;
};

export class Attractor {
  position: Vector3;
  strength: number;
  range: number;
  isVisible: boolean;
  bounds: AttractorBounds;
  mesh: Mesh;
  motionPreset: AttractorMotionPreset;
  motionConfig: AttractorMotionConfig;
  #strategy: AttractorMotionStrategy;
  #motionState: {
    position: Vector3;
    speed: number;
    motionParams: AttractorMotionConfig['motionParams'];
  };

  constructor({
    position,
    strength,
    range = 600,
    boundingSize = 100,
    speed,
    isVisible,
    motionPreset = 'noise',
    phase = 0,
  }: AttractorOptions = {}) {
    this.motionPreset = motionPreset;
    this.motionConfig = getAttractorPresetConfig(motionPreset);
    if (strength !== undefined) this.motionConfig.strength = strength;
    if (speed !== undefined) this.motionConfig.speed = speed;
    if (isVisible !== undefined) this.motionConfig.isVisible = isVisible;
    this.motionConfig.motionParams.phase = phase;

    this.position =
      position instanceof Vector3 ? position : new Vector3(...(position ?? [0, 0, 0]));
    this.strength = this.motionConfig.strength;
    this.range = range;
    this.isVisible = this.motionConfig.isVisible;
    this.bounds = {
      x: [-boundingSize, boundingSize],
      y: [-boundingSize, boundingSize],
      z: [-boundingSize, boundingSize],
    };

    this.#strategy = createMotionStrategy(motionPreset);
    this.#motionState = {
      position: this.position,
      speed: this.motionConfig.speed,
      motionParams: { ...this.motionConfig.motionParams },
    };

    const geometry = new SphereGeometry(5, 32, 32);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.visible = this.isVisible;
  }

  update(time: number): void {
    this.#motionState.speed = this.motionConfig.speed;
    this.#motionState.motionParams = this.motionConfig.motionParams;
    this.#strategy.update(this.#motionState, time, this.bounds);
    this.position.copy(this.#motionState.position);
    this.mesh.position.copy(this.position);
  }

  setMotionPreset(preset: AttractorMotionPreset, phase?: number): void {
    if (preset === this.motionPreset) return;
    this.motionPreset = preset;
    const config = getAttractorPresetConfig(preset);
    this.motionConfig = {
      ...config,
      strength: this.motionConfig.strength,
      speed: this.motionConfig.speed,
      isVisible: this.motionConfig.isVisible,
      motionParams: {
        ...config.motionParams,
        phase: phase ?? config.motionParams.phase,
      },
    };
    this.#strategy = createMotionStrategy(preset);
    this.#strategy.resetFrom(this.position);
  }

  applyMotionConfig(config: AttractorMotionConfig): void {
    this.motionConfig = {
      ...config,
      motionParams: { ...config.motionParams },
    };
    this.strength = config.strength;
    this.isVisible = config.isVisible;
    this.mesh.visible = config.isVisible;
    this.#motionState.speed = config.speed;
    this.#motionState.motionParams = { ...config.motionParams };
  }

  calculateAttraction(boid: Mesh): Vector3 {
    const distanceVector = new Vector3().subVectors(this.position, boid.position);
    const distance = distanceVector.length();
    if (distance < this.range) {
      return distanceVector.normalize().multiplyScalar(this.strength);
    }
    return new Vector3(0, 0, 0);
  }

  setVisible(isVisible: boolean): void {
    this.mesh.visible = isVisible;
    this.isVisible = isVisible;
    this.motionConfig.isVisible = isVisible;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as MeshBasicMaterial).dispose();
  }
}
