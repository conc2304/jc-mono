import { Body, Plane } from 'cannon-es';
import { Mesh, Scene } from 'three';

import { PhysicsBody } from './body';

export class PhysicsFloor extends PhysicsBody {
  constructor(mesh: Mesh, scene: Scene) {
    super(mesh, scene);
    this.#addBody();
  }

  #addBody(): void {
    const { quaternion, position } = this.mesh;

    this.body = new Body({
      mass: 0,
      quaternion: quaternion as unknown as import('cannon-es').Quaternion,
      position: position as unknown as import('cannon-es').Vec3,
      shape: new Plane(),
    });
  }
}
