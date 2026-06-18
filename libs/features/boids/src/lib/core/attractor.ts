import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

export type AttractorOptions = {
  position?: Vector3 | [number, number, number];
  strength?: number;
  range?: number;
  boundingSize?: number;
  speed?: number;
  isVisible?: boolean;
};

export class Attractor {
  position: Vector3;
  strength: number;
  range: number;
  isVisible: boolean;
  noise: SimplexNoise;
  noiseScale: number;
  bounds: { x: [number, number]; y: [number, number]; z: [number, number] };
  mesh: Mesh;

  constructor({
    position,
    strength = 0.5,
    range = 600,
    boundingSize = 100,
    speed = 0.12,
    isVisible = true,
  }: AttractorOptions = {}) {
    this.position =
      position instanceof Vector3 ? position : new Vector3(...(position ?? [0, 0, 0]));
    this.strength = strength;
    this.range = range;
    this.isVisible = isVisible;
    this.noise = new SimplexNoise();
    this.noiseScale = speed;
    this.bounds = {
      x: [-boundingSize, boundingSize],
      y: [-boundingSize, boundingSize],
      z: [-boundingSize, boundingSize],
    };

    const geometry = new SphereGeometry(5, 32, 32);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.visible = this.isVisible;
  }

  update(time: number): void {
    this.moveWithNoise(time);
    this.mesh.position.copy(this.position);
  }

  moveWithNoise(time: number): void {
    this.position.x =
      (this.noise.noise(time * this.noiseScale, 0) * 0.5 + 0.5) *
        (this.bounds.x[1] - this.bounds.x[0]) +
      this.bounds.x[0];
    this.position.y =
      (this.noise.noise(time * this.noiseScale, 1) * 0.5 + 0.5) *
        (this.bounds.y[1] - this.bounds.y[0]) +
      this.bounds.y[0];
    this.position.z =
      (this.noise.noise(time * this.noiseScale, 2) * 0.5 + 0.5) *
        (this.bounds.z[1] - this.bounds.z[0]) +
      this.bounds.z[0];
    this.mesh.position.copy(this.position);
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
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as MeshBasicMaterial).dispose();
  }
}
