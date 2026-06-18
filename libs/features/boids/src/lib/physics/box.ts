import { Body, Box, Vec3 } from 'cannon-es';
import { Mesh, Scene } from 'three';

import { PhysicsBody } from './body';

export class PhysicsBox extends PhysicsBody {
  constructor(mesh: Mesh, scene: Scene) {
    super(mesh, scene);
    this.#addBody();
  }

  #addBody(): void {
    const { position, quaternion } = this.mesh;
    const params = (this.mesh.geometry as { parameters?: { width: number; height: number; depth: number } })
      .parameters;
    const width = params?.width ?? 1;
    const height = params?.height ?? 1;
    const depth = params?.depth ?? 1;
    const halfExtents = new Vec3(width / 2, height / 2, depth / 2);

    this.body = new Body({
      mass: 1,
      position: new Vec3(position.x, position.y, position.z),
      quaternion: quaternion as unknown as import('cannon-es').Quaternion,
      shape: new Box(halfExtents),
    });
  }
}
