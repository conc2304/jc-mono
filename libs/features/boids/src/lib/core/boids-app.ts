import {
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Attractor } from './attractor';
import { Boid } from './boid';
import type { BoidsAppOptions } from '../types';

type WallMesh = Mesh & { repulsion?: number };

type StatsPanel = {
  dom: HTMLElement;
  begin: () => void;
  end: () => void;
};

export class BoidsApp {
  container: HTMLElement;
  screen: Vector2;
  hasPhysics: boolean;
  hasDebug: boolean;
  boidCount: number;
  attractorCount: number;
  debugContainer: HTMLElement | null;
  statsContainer: HTMLElement | null;

  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  controls!: OrbitControls;
  clock!: Clock;
  pointLight!: PointLight;
  stats: StatsPanel | null = null;

  simulation?: {
    update: () => void;
  };

  PhysicsBox?: new (mesh: Mesh, scene: Scene) => unknown;
  PhysicsFloor?: new (mesh: Mesh, scene: Scene) => unknown;

  #boids: Boid[] = [];
  #walls: WallMesh[] = [];
  #obstacles: Mesh[] = [];
  #attractors: Attractor[] = [];
  #planesGroup = new Mesh();
  #resizeObserver: ResizeObserver | null = null;
  #disposed = false;
  #togglePhysicsDebugHandler: (() => void) | null = null;

  constructor(container: HTMLElement, opts: BoidsAppOptions = {}) {
    this.container = container;
    this.screen = new Vector2(container.clientWidth, container.clientHeight);
    this.hasPhysics = opts.physics ?? false;
    this.hasDebug = opts.debug ?? false;
    this.boidCount = opts.boidCount ?? 250;
    this.attractorCount = opts.attractorCount ?? 15;
    this.debugContainer = opts.debugContainer ?? null;
    this.statsContainer = opts.statsContainer ?? null;
  }

  async init(): Promise<void> {
    if (this.#disposed) return;

    this.#createScene();
    this.#createCamera();
    this.#createRenderer();

    if (this.hasPhysics) {
      const { Simulation } = await import('../physics/simulation');
      this.simulation = new Simulation(this);

      const { PhysicsBox } = await import('../physics/box');
      const { PhysicsFloor } = await import('../physics/floor');

      this.PhysicsBox = PhysicsBox;
      this.PhysicsFloor = PhysicsFloor;
    }

    this.#createLight();
    this.#createClock();
    this.#createControls();
    this.#setupResizeObserver();

    const boundingBoxSize = 1000;
    this.#createBoids(boundingBoxSize / 2);
    this.#createAttractors(this.attractorCount, boundingBoxSize);

    if (this.hasDebug) {
      const { DebugPanel } = await import('../debug/debug-panel');
      new DebugPanel(this);

      const { default: Stats } = await import('stats.js');
      this.stats = new Stats() as StatsPanel;
      const statsTarget = this.statsContainer ?? this.container;
      statsTarget.appendChild(this.stats.dom);
    }

    if (this.#disposed) {
      this.destroy();
      return;
    }

    this.renderer.setAnimationLoop(() => {
      if (this.#disposed) return;

      this.stats?.begin();
      this.#update();
      this.#render();
      this.stats?.end();
    });
  }

  destroy(): void {
    if (this.#disposed) return;
    this.#disposed = true;

    this.renderer?.setAnimationLoop(null);

    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;

    if (this.#togglePhysicsDebugHandler) {
      window.removeEventListener('togglePhysicsDebug', this.#togglePhysicsDebugHandler);
      this.#togglePhysicsDebugHandler = null;
    }

    this.controls?.dispose();

    for (const boid of this.#boids) {
      boid.dispose();
    }
    for (const attractor of this.#attractors) {
      attractor.dispose();
    }

    this.#disposeObject3D(this.#planesGroup);
    this.#disposeScene(this.scene);

    if (this.stats?.dom.parentElement) {
      this.stats.dom.parentElement.removeChild(this.stats.dom);
    }
    this.stats = null;

    if (this.renderer) {
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }

  #update(): void {
    const elapsed = this.clock.getElapsedTime();
    this.#updateSimulation(elapsed);
    this.simulation?.update();
  }

  #updateSimulation(elapsedTime: number): void {
    for (const boid of this.#boids) {
      boid.update(this.#boids, this.#walls, this.#obstacles, this.#attractors, elapsedTime);
    }

    for (const attractor of this.#attractors) {
      attractor.update(elapsedTime);
    }

    this.#planesGroup.rotation.z = elapsedTime * 0.06;
    this.#planesGroup.rotation.x = elapsedTime * 0.06;
  }

  #createBoids(maxRange = 200): void {
    for (let i = 0; i < this.boidCount; i++) {
      const boid = new Boid();
      const boidMesh = boid.createBoid(maxRange);
      this.#boids[i] = boid;
      this.scene.add(boidMesh);
    }
  }

  #createAttractors(attractorsQty = 0, boundingRange = 100): void {
    for (let i = 0; i < attractorsQty; i++) {
      const attractor = new Attractor({
        position: new Vector3(),
        strength: 0.5,
        range: 600,
        speed: 0.12,
        boundingSize: boundingRange * 0.57,
        isVisible: false,
      });
      this.#attractors.push(attractor);
      this.scene.add(attractor.mesh);
    }
  }

  #createObstacles(): void {
    const tMesh = new Mesh(
      new TorusGeometry(80, 10, 22, 22),
      new MeshBasicMaterial({ color: 0x02aacd, opacity: 0.05 })
    );
    tMesh.name = 'basicObstacle';
    this.scene.add(tMesh);
    this.#obstacles.push(tMesh);
  }

  /** Reserved for optional obstacle setup in future configs. */
  enableObstacles(): void {
    this.#createObstacles();
  }

  #render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  #createScene(): void {
    this.scene = new Scene();
  }

  #createCamera(): void {
    const aspect = this.#safeAspect();
    this.camera = new PerspectiveCamera(75, aspect, 0.1, 10000);
    this.camera.position.set(0, 0, 800);
  }

  #createRenderer(): void {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio === 1,
    });

    this.container.appendChild(this.renderer.domElement);
    this.#applyRendererSize();
    this.renderer.setClearColor(0x121212);
  }

  #createLight(): void {
    this.pointLight = new PointLight(0xff0055, 500, 100, 2);
    this.pointLight.position.set(0, 10, 13);
    this.scene.add(this.pointLight);
  }

  #createControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  #createClock(): void {
    this.clock = new Clock();
  }

  #setupResizeObserver(): void {
    this.#resizeObserver = new ResizeObserver(() => {
      this.#onResize();
    });
    this.#resizeObserver.observe(this.container);
    this.#onResize();
  }

  #onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (width === 0 || height === 0) return;

    this.screen.set(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
  }

  #safeAspect(): number {
    const width = this.container.clientWidth || 1;
    const height = this.container.clientHeight || 1;
    return width / height;
  }

  #applyRendererSize(): void {
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    this.screen.set(width, height);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
  }

  #disposeObject3D(object: Mesh): void {
    object.geometry?.dispose();
    const material = object.material;
    if (Array.isArray(material)) {
      material.forEach((m) => m.dispose());
    } else if (material) {
      material.dispose();
    }
  }

  #disposeScene(scene: Scene): void {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        this.#disposeObject3D(child);
      }
    });
  }

  registerPhysicsDebugToggle(handler: () => void): void {
    if (this.#togglePhysicsDebugHandler) return;
    this.#togglePhysicsDebugHandler = handler;
    window.addEventListener('togglePhysicsDebug', handler);
  }
}
