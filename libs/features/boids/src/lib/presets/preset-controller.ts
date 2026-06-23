import type { Boid } from '../core/boid';
import type { Attractor } from '../core/attractor/attractor';
import type { FlowField } from '../core/flow/flow-field';
import { createFlowField } from '../core/flow/create-flow-field';
import {
  assignBoidMix,
  boidMixToCounts,
  computeMixDelta,
  countBoidMix,
} from './assign-boid-mix';
import { getAttractorPresetConfig } from './attractor-presets';
import { cloneBoidConfig, getBoidPresetConfig } from './boid-presets';
import { getFlowPresetConfig } from './flow-presets';
import {
  isBoidConfigNearTarget,
  isGlobalStateNearTarget,
  morphAlpha,
  morphBoidConfigInPlace,
  morphGlobalStateInPlace,
} from './preset-morph';
import { getScenePreset } from './scene-presets';
import type {
  AttractorFieldMode,
  AttractorMotionPreset,
  BoidMix,
  FlowFieldConfig,
  FlowFieldPreset,
  GlobalMorphState,
  PresetState,
  ScenePresetId,
} from './types';
import { DEFAULT_BOID_MIX } from './types';

export type PresetControllerCallbacks = {
  onAttractorMotionChange?: (preset: AttractorMotionPreset) => void;
  onFieldModeChange?: (mode: AttractorFieldMode) => void;
  onAttractorConfigChange?: () => void;
  onSceneBoidCountChange?: (count: number) => void;
  onSceneObstaclesChange?: (
    preset: import('../types').ObstaclePreset,
    enabled: boolean
  ) => void;
  onAttractorCountChange?: (count: number) => void;
  onAttractorVisibilityChange?: (visible: boolean) => void;
};

export class PresetController {
  #boids: Boid[] = [];
  #attractors: Attractor[] = [];
  #flowField: FlowField;
  #flowFieldPreset: FlowFieldPreset = 'curlNoise';
  #flowConfig: FlowFieldConfig;
  #flowConfigTarget: FlowFieldConfig;

  #attractorMotion: AttractorMotionPreset = 'noise';
  #attractorMotionTarget: AttractorMotionPreset = 'noise';
  #fieldMode: AttractorFieldMode = 'points';
  #fieldModeTarget: AttractorFieldMode = 'points';

  #boidMixTarget: BoidMix = { ...DEFAULT_BOID_MIX };
  #scenePresetId: ScenePresetId | null = null;

  #globalCurrent: GlobalMorphState = {
    flowWeight: 0,
    pointAttractorWeight: 1,
    attractorStrength: 0.5,
    attractorSpeed: 0.12,
    boidSpeedMultiplier: 1,
  };
  #globalTarget: GlobalMorphState = { ...this.#globalCurrent };

  #callbacks: PresetControllerCallbacks;

  constructor(callbacks: PresetControllerCallbacks = {}) {
    this.#callbacks = callbacks;
    this.#flowConfig = getFlowPresetConfig('curlNoise');
    this.#flowConfigTarget = { ...this.#flowConfig };
    this.#flowField = createFlowField('curlNoise');
    this.#flowField.setConfig(this.#flowConfig);
  }

  bind(boids: Boid[], attractors: Attractor[]): void {
    this.#boids = boids;
    this.#attractors = attractors;
  }

  initializeBoids(mix: BoidMix = DEFAULT_BOID_MIX): void {
    this.#boidMixTarget = { ...mix };
    const assignments = assignBoidMix(mix, this.#boids.length);

    for (let i = 0; i < this.#boids.length; i++) {
      const preset = assignments[i] ?? 'default';
      const config = getBoidPresetConfig(preset);
      const boid = this.#boids[i];
      boid.behaviorPresetId = preset;
      boid.behaviorConfig = cloneBoidConfig(config);
      boid.targetBehaviorConfig = cloneBoidConfig(config);
      boid.applyBehaviorConfig(boid.behaviorConfig, this.#globalCurrent.boidSpeedMultiplier);
    }
  }

  tick(dt: number): void {
    const alpha = morphAlpha(dt);

    morphGlobalStateInPlace(this.#globalCurrent, this.#globalTarget, alpha);
    this.#applyGlobalToAttractors();

    this.#morphFlowConfig(alpha);

    for (const boid of this.#boids) {
      morphBoidConfigInPlace(
        boid.behaviorConfig,
        boid.targetBehaviorConfig,
        alpha
      );
      boid.applyBehaviorConfig(boid.behaviorConfig, this.#globalCurrent.boidSpeedMultiplier);
    }

    if (this.#attractorMotion !== this.#attractorMotionTarget) {
      this.#attractorMotion = this.#attractorMotionTarget;
      this.#callbacks.onAttractorMotionChange?.(this.#attractorMotion);
    }

    if (this.#fieldMode !== this.#fieldModeTarget) {
      this.#fieldMode = this.#fieldModeTarget;
      this.#callbacks.onFieldModeChange?.(this.#fieldMode);
    }
  }

  getFlowField(): FlowField {
    return this.#flowField;
  }

  getFlowWeight(): number {
    return this.#globalCurrent.flowWeight;
  }

  getPointAttractorWeight(): number {
    return this.#globalCurrent.pointAttractorWeight;
  }

  getPresetState(): PresetState {
    return {
      scenePresetId: this.#scenePresetId,
      attractorMotion: this.#attractorMotionTarget,
      fieldMode: this.#fieldModeTarget,
      flowFieldPreset: this.#flowFieldPreset,
      boidMix: { ...this.#boidMixTarget },
      flowWeight: this.#globalTarget.flowWeight,
      pointAttractorWeight: this.#globalTarget.pointAttractorWeight,
      attractorStrength: this.#globalTarget.attractorStrength,
      attractorSpeed: this.#globalTarget.attractorSpeed,
      boidSpeedMultiplier: this.#globalTarget.boidSpeedMultiplier,
    };
  }

  setAttractorMotion(preset: AttractorMotionPreset): void {
    this.#scenePresetId = null;
    this.#attractorMotionTarget = preset;
    const config = getAttractorPresetConfig(preset);
    this.#globalTarget.attractorStrength = config.strength;
    this.#globalTarget.attractorSpeed = config.speed;

    for (let i = 0; i < this.#attractors.length; i++) {
      const attractor = this.#attractors[i];
      const phase =
        this.#attractors.length > 1
          ? (i / this.#attractors.length) * Math.PI * 2
          : 0;
      attractor.setMotionPreset(preset, phase);
      attractor.applyMotionConfig({
        ...config,
        strength: this.#globalTarget.attractorStrength,
        speed: this.#globalTarget.attractorSpeed,
        isVisible: attractor.isVisible,
        motionParams: { ...config.motionParams, phase },
      });
    }
  }

  setFieldMode(mode: AttractorFieldMode): void {
    this.#scenePresetId = null;
    this.#fieldModeTarget = mode;
    if (mode === 'flow') {
      this.#globalTarget.flowWeight = Math.max(this.#globalTarget.flowWeight, 0.85);
      this.#globalTarget.pointAttractorWeight = 0.15;
    } else {
      this.#globalTarget.flowWeight = 0;
      this.#globalTarget.pointAttractorWeight = 1;
    }
  }

  setFlowFieldPreset(preset: FlowFieldPreset): void {
    this.#scenePresetId = null;
    this.#flowFieldPreset = preset;
    this.#flowField = createFlowField(preset);
    this.#flowConfigTarget = getFlowPresetConfig(preset);
    this.#flowField.setConfig(this.#flowConfigTarget);
  }

  setFlowWeight(weight: number): void {
    this.#scenePresetId = null;
    this.#globalTarget.flowWeight = Math.max(0, Math.min(1, weight));
    this.#globalTarget.pointAttractorWeight = 1 - this.#globalTarget.flowWeight;
    this.#fieldModeTarget = weight > 0.01 ? 'flow' : 'points';
  }

  setAttractorStrength(strength: number): void {
    this.#scenePresetId = null;
    this.#globalTarget.attractorStrength = strength;
  }

  setAttractorSpeed(speed: number): void {
    this.#scenePresetId = null;
    this.#globalTarget.attractorSpeed = speed;
  }

  setBoidSpeedMultiplier(multiplier: number): void {
    this.#scenePresetId = null;
    this.#globalTarget.boidSpeedMultiplier = Math.max(0.25, Math.min(3, multiplier));
  }

  setBoidMix(mix: BoidMix): void {
    this.#scenePresetId = null;
    this.#boidMixTarget = { ...mix };
    this.rebalanceBoidMix(mix);
  }

  rebalanceBoidMix(mix: BoidMix): void {
    const targetCounts = boidMixToCounts(mix, this.#boids.length);
    const currentAssignments = this.#boids.map((b) => b.behaviorPresetId);
    const currentCounts = countBoidMix(currentAssignments);
    const { increase, decrease } = computeMixDelta(currentCounts, targetCounts);

    const candidates = this.#boids
      .map((boid, index) => ({ boid, index }))
      .filter(({ boid }) => decrease.includes(boid.behaviorPresetId));

    shuffleInPlace(candidates);

    for (let i = 0; i < increase.length && i < candidates.length; i++) {
      const newPreset = increase[i];
      const { boid } = candidates[i];
      boid.behaviorPresetId = newPreset;
      boid.targetBehaviorConfig = cloneBoidConfig(getBoidPresetConfig(newPreset));
    }
  }

  applyScenePreset(id: ScenePresetId): void {
    const scene = getScenePreset(id);
    this.#scenePresetId = id;

    this.setAttractorMotion(scene.attractorMotion);
    this.setFlowFieldPreset(scene.flowFieldPreset);
    this.setFieldMode(scene.fieldMode);
    this.#globalTarget.flowWeight = scene.flowWeight;
    this.#globalTarget.pointAttractorWeight = 1 - scene.flowWeight;
    this.setBoidMix(scene.boidMix);

    if (id === 'default') {
      this.#globalTarget.boidSpeedMultiplier = 1;
    }

    if (scene.attractorVisible !== undefined) {
      this.#callbacks.onAttractorVisibilityChange?.(scene.attractorVisible);
    }

    if (scene.attractorCount !== undefined) {
      this.#callbacks.onAttractorCountChange?.(scene.attractorCount);
    }

    if (scene.boidCount !== undefined) {
      this.#callbacks.onSceneBoidCountChange?.(scene.boidCount);
    }

    if (scene.obstacles !== undefined) {
      this.#callbacks.onSceneObstaclesChange?.(
        scene.obstacles,
        scene.obstaclesEnabled ?? false
      );
    }
  }

  #applyGlobalToAttractors(): void {
    for (const attractor of this.#attractors) {
      attractor.strength = this.#globalCurrent.attractorStrength;
      attractor.motionConfig.strength = this.#globalCurrent.attractorStrength;
      attractor.motionConfig.speed = this.#globalCurrent.attractorSpeed;
    }
    this.#callbacks.onAttractorConfigChange?.();
  }

  #morphFlowConfig(alpha: number): void {
    this.#flowConfig.strength +=
      (this.#flowConfigTarget.strength - this.#flowConfig.strength) * alpha;
    this.#flowConfig.evolutionSpeed +=
      (this.#flowConfigTarget.evolutionSpeed - this.#flowConfig.evolutionSpeed) *
      alpha;
    this.#flowConfig.inwardPull +=
      (this.#flowConfigTarget.inwardPull - this.#flowConfig.inwardPull) * alpha;
    this.#flowField.setConfig(this.#flowConfig);
  }
}

function shuffleInPlace<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export { isBoidConfigNearTarget, isGlobalStateNearTarget };
