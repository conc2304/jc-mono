import { Vector3 } from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

import type { FlowFieldConfig } from '../../presets/types';
import type { FlowField } from './flow-field';

const SAMPLE_EPS = 0.5;

export class CurlNoiseFlowField implements FlowField {
  #noise = new SimplexNoise();
  #config: FlowFieldConfig = { strength: 0.8, evolutionSpeed: 0.15, inwardPull: 0 };

  setConfig(config: FlowFieldConfig): void {
    this.#config = { ...config };
  }

  sample(position: Vector3, time: number, out: Vector3): Vector3 {
    const { strength, evolutionSpeed } = this.#config;
    const scale = 0.003;
    const t = time * evolutionSpeed;

    const nx = position.x * scale + t;
    const ny = position.y * scale + t;

    const n1 = this.#noise.noise(nx, ny + SAMPLE_EPS);
    const n2 = this.#noise.noise(nx, ny - SAMPLE_EPS);
    const n3 = this.#noise.noise(nx + SAMPLE_EPS, ny);
    const n4 = this.#noise.noise(nx - SAMPLE_EPS, ny);

    out.set(n3 - n4, n1 - n2, 0).multiplyScalar(strength);
    if (out.lengthSq() === 0) {
      return out.set(0, 1, 0);
    }
    return out.normalize();
  }
}

export class VortexFlowField implements FlowField {
  #config: FlowFieldConfig = { strength: 1, evolutionSpeed: 0.05, inwardPull: 0.15 };

  setConfig(config: FlowFieldConfig): void {
    this.#config = { ...config };
  }

  sample(position: Vector3, time: number, out: Vector3): Vector3 {
    const { strength, inwardPull } = this.#config;
    const radial = new Vector3(position.x, 0, position.z);
    const dist = radial.length();

    if (dist < 0.001) {
      return out.set(0, 1, 0);
    }

    const tangent = new Vector3(-radial.z, 0, radial.x).normalize();
    out.copy(tangent).multiplyScalar(strength);

    if (inwardPull > 0) {
      out.add(radial.normalize().multiplyScalar(-inwardPull * strength));
    }

    const wobble = Math.sin(time * this.#config.evolutionSpeed + dist * 0.01) * 0.1;
    out.y += wobble;

    if (out.lengthSq() === 0) {
      return out.set(0, 1, 0);
    }
    return out.normalize();
  }
}

export function createFlowField(preset: import('../../presets/types').FlowFieldPreset): FlowField {
  if (preset === 'vortex') {
    return new VortexFlowField();
  }
  return new CurlNoiseFlowField();
}
