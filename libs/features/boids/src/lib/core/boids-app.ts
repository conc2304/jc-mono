import {
  Clock,
  FogExp2,
  Group,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { Attractor } from './attractor';
import {
  createAquariumObstacles,
  disposeObstacleGroup,
  updateAquariumObstacles,
} from './aquarium-obstacles';
import { Boid } from './boid';
import { BoidsViewControls } from './boids-view-controls';
import {
  computeViewportBoxHalfExtents,
  VaporwaveGridBox,
} from './vaporwave-grid-box';
import type { BoxHalfExtents, WallMesh } from './vaporwave-grid-box';
import { PresetController } from '../presets/preset-controller';
import type {
  AttractorFieldMode,
  AttractorMotionPreset,
  BoidMix,
  FlowFieldPreset,
  PresetState,
  ScenePresetId,
} from '../presets/types';
import { DEFAULT_BOID_MIX } from '../presets/types';
import type {
  BoidsAppOptions,
  GridThemeColors,
  ObstaclePreset,
} from '../types';

type StatsPanel = {
  dom: HTMLElement;
  begin: () => void;
  end: () => void;
};

const CAMERA_DISTANCE = 800;

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
  clock!: Clock;
  pointLight!: PointLight;
  stats: StatsPanel | null = null;

  simulation?: {
    update: () => void;
  };

  PhysicsBox?: new (mesh: Mesh, scene: Scene) => unknown;
  PhysicsFloor?: new (mesh: Mesh, scene: Scene) => unknown;

  readonly presetController: PresetController;

  #boids: Boid[] = [];
  #walls: WallMesh[] = [];
  #obstacles: Mesh[] = [];
  #avoidables: WallMesh[] = [];
  #obstacleGroup: Group | null = null;
  #obstaclePreset: ObstaclePreset;
  #obstacleCount: number;
  #obstaclesEnabled: boolean;
  #obstacleLayoutSeed = Math.random() * 1_000_000;
  #attractors: Attractor[] = [];
  #activeAttractorCount: number;
  #attractorVisibilityIntent = false;
  #gridBox = new VaporwaveGridBox();
  #boidsGroup = new Group();
  #viewControls: BoidsViewControls | null = null;
  #gridColors: GridThemeColors;
  #boxExtents = { halfWidth: 400, halfHeight: 300, halfDepth: 288 };
  #resizeObserver: ResizeObserver | null = null;
  #disposed = false;
  #togglePhysicsDebugHandler: (() => void) | null = null;
  #enableViewControls: boolean;
  #lastTickTime = 0;
  #initialBoidMix: BoidMix;
  #initialScenePreset?: ScenePresetId;

  constructor(container: HTMLElement, opts: BoidsAppOptions = {}) {
    this.container = container;
    this.screen = new Vector2(container.clientWidth, container.clientHeight);
    this.hasPhysics = opts.physics ?? false;
    this.hasDebug = opts.debug ?? false;
    this.boidCount = opts.boidCount ?? 250;
    this.attractorCount = opts.attractorCount ?? 15;
    this.#activeAttractorCount = this.attractorCount;
    this.debugContainer = opts.debugContainer ?? null;
    this.statsContainer = opts.statsContainer ?? null;
    this.#gridColors = opts.gridColors ?? {
      gridColor: '#00ffff',
      centerColor: '#ff00ff',
    };
    this.#obstaclePreset = opts.obstacles ?? 'none';
    this.#obstacleCount = opts.obstacleCount ?? 8;
    this.#obstaclesEnabled = opts.obstaclesEnabled ?? false;
    this.#enableViewControls = opts.enableViewControls ?? false;
    this.#initialBoidMix = opts.boidMix ?? DEFAULT_BOID_MIX;
    this.#initialScenePreset = opts.scenePreset;

    this.presetController = new PresetController({
      onAttractorCountChange: (count) => this.#setActiveAttractorCount(count),
      onAttractorVisibilityChange: (visible) =>
        this.setAttractorVisibilityIntent(visible),
      onSceneObstaclesChange: (preset, enabled) => {
        this.setObstaclePreset(preset);
        this.setObstaclesEnabled(enabled);
      },
    });

    if (opts.attractorMotion) {
      this.presetController.setAttractorMotion(opts.attractorMotion);
    }
    if (opts.flowFieldPreset) {
      this.presetController.setFlowFieldPreset(opts.flowFieldPreset);
    }
    if (opts.fieldMode) {
      this.presetController.setFieldMode(opts.fieldMode);
    }
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

    this.scene.add(this.#boidsGroup);
    this.#createLight();
    this.#createClock();
    this.#createViewControls();
    this.#setupResizeObserver();
    this.#updateGridBox();

    this.#createBoids(this.#boxExtents);
    this.#createAttractors(this.attractorCount, this.#boxExtents);

    this.presetController.bind(this.#boids, this.#attractors);
    this.presetController.initializeBoids(this.#initialBoidMix);

    if (this.#initialScenePreset) {
      this.presetController.applyScenePreset(this.#initialScenePreset);
    }

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

    this.#lastTickTime = this.clock.getElapsedTime();

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

    this.#viewControls?.dispose();
    this.#viewControls = null;

    if (this.#togglePhysicsDebugHandler) {
      window.removeEventListener(
        'togglePhysicsDebug',
        this.#togglePhysicsDebugHandler
      );
      this.#togglePhysicsDebugHandler = null;
    }

    for (const boid of this.#boids) {
      boid.dispose();
    }
    for (const attractor of this.#attractors) {
      attractor.dispose();
    }

    this.#gridBox.dispose();
    this.scene?.remove(this.#gridBox.group);
    this.#clearObstacles();
    this.#disposeScene(this.scene);

    if (this.stats?.dom.parentElement) {
      this.stats.dom.parentElement.removeChild(this.stats.dom);
    }
    this.stats = null;

    if (this.renderer) {
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(
          this.renderer.domElement
        );
      }
      this.renderer.dispose();
    }
  }

  getPresetState(): PresetState {
    return this.presetController.getPresetState();
  }

  setBoidMix(mix: BoidMix): void {
    this.presetController.setBoidMix(mix);
  }

  setAttractorMotion(preset: AttractorMotionPreset): void {
    this.presetController.setAttractorMotion(preset);
  }

  setFieldMode(mode: AttractorFieldMode): void {
    this.presetController.setFieldMode(mode);
  }

  setFlowFieldPreset(preset: FlowFieldPreset): void {
    this.presetController.setFlowFieldPreset(preset);
  }

  setFlowWeight(weight: number): void {
    this.presetController.setFlowWeight(weight);
  }

  setAttractorStrength(strength: number): void {
    this.presetController.setAttractorStrength(strength);
  }

  setAttractorSpeed(speed: number): void {
    this.presetController.setAttractorSpeed(speed);
  }

  setBoidSpeedMultiplier(multiplier: number): void {
    this.presetController.setBoidSpeedMultiplier(multiplier);
  }

  applyScenePreset(id: ScenePresetId): void {
    this.presetController.applyScenePreset(id);
  }

  #update(): void {
    const elapsed = this.clock.getElapsedTime();
    const dt = Math.min(0.05, elapsed - this.#lastTickTime);
    this.#lastTickTime = elapsed;

    if (this.#obstaclesEnabled && this.#obstacles.length > 0) {
      updateAquariumObstacles(this.#obstacles, elapsed);
      this.#obstacleGroup?.updateMatrixWorld(true);
    }
    this.presetController.tick(dt);
    this.#updateSimulation(elapsed);
    this.simulation?.update();
  }

  #updateSimulation(elapsedTime: number): void {
    const flowField = this.presetController.getFlowField();
    const flowWeight = this.presetController.getFlowWeight();
    const pointAttractorWeight = this.presetController.getPointAttractorWeight();

    const context = {
      flowField,
      flowWeight,
      pointAttractorWeight,
    };

    for (const boid of this.#boids) {
      boid.update(this.#boids, this.#avoidables, this.#attractors, elapsedTime, context);
    }

    for (let i = 0; i < this.#activeAttractorCount; i++) {
      this.#attractors[i]?.update(elapsedTime);
    }
  }

  #rebuildAvoidables(): void {
    this.#avoidables.length = 0;
    this.#avoidables.push(...this.#walls);
    if (this.#obstaclesEnabled) {
      this.#avoidables.push(...(this.#obstacles as WallMesh[]));
    }
  }

  #updateGridBox(): void {
    this.#boxExtents = computeViewportBoxHalfExtents(
      this.camera,
      CAMERA_DISTANCE
    );
    this.#gridBox.rebuild(this.#boxExtents, this.#gridColors);
    this.#walls = this.#gridBox.walls;

    if (!this.scene.children.includes(this.#gridBox.group)) {
      this.scene.add(this.#gridBox.group);
    }

    for (const boid of this.#boids) {
      boid.setBoxBounds(this.#boxExtents);
    }

    this.#syncAttractorBounds(this.#boxExtents);
    this.#rebuildObstacles();
    this.#rebuildAvoidables();
  }

  #clearObstacles(): void {
    if (this.#obstacleGroup) {
      this.scene?.remove(this.#obstacleGroup);
      disposeObstacleGroup(this.#obstacleGroup);
      this.#obstacleGroup = null;
    }
    this.#obstacles = [];
    this.#rebuildAvoidables();
  }

  #rebuildObstacles(): void {
    this.#clearObstacles();

    if (this.#obstaclePreset !== 'aquarium' || !this.scene) return;

    const { group, obstacles } = createAquariumObstacles({
      extents: this.#boxExtents,
      colors: this.#gridColors,
      count: this.#obstacleCount,
      layoutSeed: this.#obstacleLayoutSeed,
    });

    this.#obstacleGroup = group;
    this.#obstacles = obstacles;
    group.visible = this.#obstaclesEnabled;
    this.scene.add(group);
    this.#rebuildAvoidables();
  }

  setObstaclesEnabled(enabled: boolean): void {
    if (this.#obstaclesEnabled === enabled && this.#obstacleGroup) {
      this.#obstacleGroup.visible = enabled;
      this.#rebuildAvoidables();
      return;
    }
    this.#obstaclesEnabled = enabled;

    if (this.#obstaclePreset !== 'aquarium') return;

    this.#obstacleLayoutSeed = Math.random() * 1_000_000;
    this.#rebuildObstacles();
  }

  setObstaclePreset(preset: ObstaclePreset): void {
    if (this.#obstaclePreset === preset) return;
    this.#obstaclePreset = preset;
    this.#rebuildObstacles();
  }

  getObstaclesEnabled(): boolean {
    return this.#obstaclesEnabled;
  }

  getObstaclePreset(): ObstaclePreset {
    return this.#obstaclePreset;
  }

  #syncAttractorBounds(extents: BoxHalfExtents): void {
    const maxReach = Math.max(
      extents.halfWidth,
      extents.halfHeight,
      extents.halfDepth
    );
    for (const attractor of this.#attractors) {
      attractor.bounds = {
        x: [-extents.halfWidth, extents.halfWidth],
        y: [-extents.halfHeight, extents.halfHeight],
        z: [-extents.halfDepth, extents.halfDepth],
      };
      attractor.range = maxReach * 0.85;
    }
  }

  #setActiveAttractorCount(count: number): void {
    this.#activeAttractorCount = Math.max(1, Math.min(count, this.#attractors.length));
    for (let i = 0; i < this.#attractors.length; i++) {
      const active = i < this.#activeAttractorCount;
      this.#attractors[i].mesh.visible =
        active && this.#attractorVisibilityIntent && this.#attractors[i].isVisible;
    }
  }

  getAttractorsVisible(): boolean {
    return this.#attractorVisibilityIntent;
  }

  setAttractorsVisible(visible: boolean): void {
    this.setAttractorVisibilityIntent(visible);
  }

  setAttractorVisibilityIntent(visible: boolean): void {
    this.#attractorVisibilityIntent = visible;
    for (const attractor of this.#attractors) {
      attractor.motionConfig.isVisible = visible;
      attractor.isVisible = visible;
      attractor.mesh.visible = visible;
    }
    this.#setActiveAttractorCount(this.#activeAttractorCount);
  }

  #createBoids(bounds: BoxHalfExtents): void {
    for (let i = 0; i < this.boidCount; i++) {
      const boid = new Boid();
      const boidMesh = boid.createBoid(bounds);
      this.#boids[i] = boid;
      this.#boidsGroup.add(boidMesh);
    }
  }

  #createAttractors(attractorsQty = 0, bounds: BoxHalfExtents): void {
    const maxReach = Math.max(
      bounds.halfWidth,
      bounds.halfHeight,
      bounds.halfDepth
    );
    for (let i = 0; i < attractorsQty; i++) {
      const phase =
        attractorsQty > 1 ? (i / attractorsQty) * Math.PI * 2 : 0;
      const attractor = new Attractor({
        position: new Vector3(),
        strength: 0.5,
        range: maxReach * 0.85,
        speed: 0.12,
        isVisible: false,
        motionPreset: 'noise',
        phase,
      });
      attractor.bounds = {
        x: [-bounds.halfWidth, bounds.halfWidth],
        y: [-bounds.halfHeight, bounds.halfHeight],
        z: [-bounds.halfDepth, bounds.halfDepth],
      };
      this.#attractors.push(attractor);
      this.#boidsGroup.add(attractor.mesh);
    }
  }

  #render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  #createScene(): void {
    this.scene = new Scene();
    this.scene.fog = new FogExp2(0x1a0533, 0.00045);
  }

  #createCamera(): void {
    const aspect = this.#safeAspect();
    this.camera = new PerspectiveCamera(75, aspect, 0.1, 10000);
    this.camera.position.set(0, 0, CAMERA_DISTANCE);
    this.camera.lookAt(0, 0, 0);
  }

  #createRenderer(): void {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio === 1,
    });

    this.container.appendChild(this.renderer.domElement);
    this.#applyRendererSize();
    this.renderer.setClearColor(0x12001f);
  }

  #createLight(): void {
    this.pointLight = new PointLight(0xff00aa, 400, 2000, 2);
    this.pointLight.position.set(0, 120, 280);
    this.#boidsGroup.add(this.pointLight);

    const accent = new PointLight(0x00ffff, 280, 2000, 2);
    accent.position.set(-180, -80, -120);
    this.#boidsGroup.add(accent);
  }

  #createViewControls(): void {
    if (!this.#enableViewControls) return;

    this.#viewControls = new BoidsViewControls({
      element: this.renderer.domElement,
      target: this.#boidsGroup,
      onDragChange: (isDragging) => {
        this.renderer.domElement.style.cursor = isDragging
          ? 'grabbing'
          : 'grab';
      },
    });
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

    if (this.scene && this.camera) {
      this.#updateGridBox();
    }
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

  setGridColors(colors: GridThemeColors): void {
    this.#gridColors = colors;
    if (this.camera) {
      this.#updateGridBox();
    }
  }
}
