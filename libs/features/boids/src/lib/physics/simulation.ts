import { SAPBroadphase, Vec3, World } from 'cannon-es';

import type { BoidsApp } from '../core/boids-app';

export class Simulation {
  app: BoidsApp;
  items: { body: import('cannon-es').Body; update: () => void }[] = [];
  world!: World;
  debugger?: { update: () => void };

  constructor(app: BoidsApp) {
    this.app = app;
    void this.init();
  }

  async init(): Promise<void> {
    this.world = new World({
      gravity: new Vec3(0, -9.82, 0),
    });
    this.world.broadphase = new SAPBroadphase(this.world);

    if (this.app.hasDebug) {
      const { default: createDebugger } = await import('cannon-es-debugger');

      this.debugger = createDebugger(this.app.scene, this.world, {
        color: 0x005500,
        onInit: (_body, mesh) => {
          this.app.registerPhysicsDebugToggle(() => {
            mesh.visible = !mesh.visible;
          });
        },
      });
    }
  }

  addItem(item: { body: import('cannon-es').Body; update: () => void }): void {
    this.items.push(item);
    this.world.addBody(item.body);
  }

  removeItem(item: { body: import('cannon-es').Body; update: () => void }): void {
    setTimeout(() => {
      this.items = this.items.filter((b) => b !== item);
      this.world.removeBody(item.body);
    }, 0);
  }

  update(): void {
    if (!this.world) return;

    this.world.fixedStep();

    for (const item of this.items) {
      item.update();
    }

    this.debugger?.update();
  }
}
