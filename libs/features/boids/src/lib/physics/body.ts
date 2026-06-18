import { Mesh, Scene } from 'three';

export class PhysicsBody {
  scene: Scene;
  mesh: Mesh;
  body: import('cannon-es').Body | null = null;

  constructor(mesh: Mesh, scene: Scene) {
    this.scene = scene;
    this.mesh = mesh;
  }

  update(): void {
    if (!this.body) return;
    this.mesh.position.copy(this.body.position as unknown as import('three').Vector3);
    this.mesh.quaternion.copy(this.body.quaternion as unknown as import('three').Quaternion);
  }
}
