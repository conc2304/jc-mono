import { Pane } from 'tweakpane';
import { Color, Mesh, MeshStandardMaterial, PointLight } from 'three';

import type { BoidsApp } from '../core/boids-app';

type AppWithOptionalMeshes = BoidsApp & {
  box?: Mesh;
  shadedBox?: Mesh;
};

type TweakpaneChangeEvent = { value: Record<string, number> };

type TweakpaneFolder = {
  addInput: (
    object: object,
    key: string,
    options?: object
  ) => { on: (event: 'change', handler: (ev: TweakpaneChangeEvent) => void) => void };
  addButton: (options: { title: string }) => { on: (event: 'click', handler: () => void) => void };
};

type TweakpanePane = {
  addFolder: (options: { title: string }) => TweakpaneFolder;
  refresh: () => void;
};

export class DebugPanel {
  app: AppWithOptionalMeshes;
  pane!: TweakpanePane;

  constructor(app: BoidsApp) {
    this.app = app as AppWithOptionalMeshes;
    this.#createPanel();
    this.#createSceneConfig();
    this.#createPhysicsConfig();
    this.#createBoxConfig();
    this.#createShadedBoxConfig();
    this.#createLightConfig();
  }

  refresh(): void {
    this.pane.refresh();
  }

  #createPanel(): void {
    const container = this.app.debugContainer ?? document.body;
    this.pane = new Pane({ container }) as unknown as TweakpanePane;
  }

  #createSceneConfig(): void {
    const folder = this.pane.addFolder({ title: 'Scene' });
    const params = { background: { r: 18, g: 18, b: 18 } };

    folder.addInput(params, 'background', { label: 'Background Color' }).on('change', (e) => {
      this.app.renderer.setClearColor(
        new Color(e.value.r / 255, e.value.g / 255, e.value.b / 255)
      );
    });
  }

  #createPhysicsConfig(): void {
    if (!this.app.hasPhysics) return;

    const folder = this.pane.addFolder({ title: 'Physics' });
    folder.addButton({ title: 'Toggle Debug' }).on('click', () => {
      window.dispatchEvent(new CustomEvent('togglePhysicsDebug'));
    });
  }

  #createBoxConfig(): void {
    const mesh = this.app.box;
    if (!mesh?.material || !(mesh.material instanceof MeshStandardMaterial)) return;

    const folder = this.pane.addFolder({ title: 'Box' });
    this.#createColorControl(mesh.material, folder);
    folder.addInput(mesh.material, 'metalness', { label: 'Metallic', min: 0, max: 1 });
    folder.addInput(mesh.material, 'roughness', { label: 'Roughness', min: 0, max: 1 });
  }

  #createShadedBoxConfig(): void {
    const mesh = this.app.shadedBox;
    if (!mesh) return;

    const folder = this.pane.addFolder({ title: 'Shaded Box' });
    folder.addInput(mesh.scale, 'x', { label: 'Width', min: 0.1, max: 4 });
    folder.addInput(mesh.scale, 'y', { label: 'Height', min: 0.1, max: 4 });
    folder.addInput(mesh.scale, 'z', { label: 'Depth', min: 0.1, max: 4 });
  }

  #createLightConfig(): void {
    const folder = this.pane.addFolder({ title: 'Light' });
    this.#createColorControl(this.app.pointLight, folder);
    folder.addInput(this.app.pointLight, 'intensity', {
      label: 'Intensity',
      min: 0,
      max: 1000,
    });
  }

  #createColorControl(
    obj: PointLight | MeshStandardMaterial,
    folder: TweakpaneFolder
  ): void {
    const baseColor255 = obj.color.clone().multiplyScalar(255);
    const params = {
      color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b },
    };

    folder.addInput(params, 'color', { label: 'Color' }).on('change', (e) => {
      obj.color.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255);
    });
  }
}
