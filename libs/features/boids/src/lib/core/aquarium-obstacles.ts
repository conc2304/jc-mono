import {
  Box3,
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
} from 'three';

import type { BoxHalfExtents } from './vaporwave-grid-box';
import type { GridThemeColors } from '../types';

type BobConfig = {
  baseY: number;
  amplitude: number;
  speed: number;
  phase: number;
};

export type ObstacleMesh = Mesh & {
  repulsion?: number;
  bob?: BobConfig;
  bounds?: Box3;
};

function syncObstacleBounds(mesh: ObstacleMesh): void {
  if (!mesh.bounds) {
    mesh.bounds = new Box3();
  }
  mesh.updateMatrixWorld(true);
  mesh.bounds.setFromObject(mesh);
}

export type AquariumObstaclesOptions = {
  extents: BoxHalfExtents;
  colors: GridThemeColors;
  count?: number;
  layoutSeed?: number;
};

type ObstacleSpec = {
  kind: 'rock' | 'kelp' | 'coral';
  xNorm?: number;
  zNorm?: number;
  scale?: number;
  floating?: boolean;
  floatSeed?: number;
  heightRatio?: number;
  yNorm?: number;
  bobPhase?: number;
};

const SIZE_SCALE = 1.5;
const KELP_SCALE = 1.2;
const KELP_MIN_HEIGHT_RATIO = 0.4;
const KELP_MAX_HEIGHT_RATIO = 0.8;
const FLOAT_SPREAD = 0.68;

function seededRandom(seed: number): number {
  const value = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const DEFAULT_SPECS: ObstacleSpec[] = [
  { kind: 'rock', scale: 1.3 },
  { kind: 'rock', scale: 1.0 },
  { kind: 'rock', scale: 0.85 },
  { kind: 'kelp', heightRatio: 0.48 },
  { kind: 'kelp', heightRatio: 0.74 },
  { kind: 'rock', scale: 1.0, floating: true },
  { kind: 'coral', scale: 0.95, floating: true },
  { kind: 'rock', scale: 0.85, floating: true },
  { kind: 'coral', scale: 1.0 },
  { kind: 'coral', scale: 0.8 },
];

function buildRandomSpecs(count: number, layoutSeed: number): ObstacleSpec[] {
  const templates = DEFAULT_SPECS.slice(0, Math.max(1, count));

  return templates.map((template, index) => {
    const seed = layoutSeed + index * 131;

    if (template.floating) {
      return {
        ...template,
        floatSeed: seed,
        bobPhase: seededRandom(seed + 7) * Math.PI * 2,
        scale:
          (template.scale ?? 1) * (0.85 + seededRandom(seed + 11) * 0.3),
      };
    }

    return {
      ...template,
      xNorm: (seededRandom(seed) * 2 - 1) * 0.75,
      zNorm: (seededRandom(seed + 13) * 2 - 1) * 0.75,
      scale:
        (template.scale ?? 1) * (0.85 + seededRandom(seed + 17) * 0.3),
      heightRatio:
        template.kind === 'kelp'
          ? KELP_MIN_HEIGHT_RATIO +
            seededRandom(seed + 23) *
              (KELP_MAX_HEIGHT_RATIO - KELP_MIN_HEIGHT_RATIO)
          : template.heightRatio,
    };
  });
}

const OBSTACLE_REPULSION = 9;

function obstacleMaterial(color: string): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color,
    opacity: 0.4,
    transparent: true,
  });
}

function tagObstacle(mesh: Mesh, repulsion = OBSTACLE_REPULSION): ObstacleMesh {
  const obstacle = mesh as ObstacleMesh;
  obstacle.repulsion = repulsion;
  return obstacle;
}

function createRock(
  extents: BoxHalfExtents,
  colors: GridThemeColors,
  scale: number
): ObstacleMesh {
  const w = extents.halfWidth * 0.1 * scale * SIZE_SCALE;
  const h = extents.halfHeight * 0.07 * scale * SIZE_SCALE;
  const d = extents.halfDepth * 0.1 * scale * SIZE_SCALE;
  const mesh = new Mesh(new BoxGeometry(w, h, d), obstacleMaterial(colors.gridColor));
  mesh.position.y = -extents.halfHeight + h / 2 + 4;
  return tagObstacle(mesh);
}

function createKelp(
  extents: BoxHalfExtents,
  colors: GridThemeColors,
  scale: number,
  heightRatio: number
): ObstacleMesh {
  const boxHeight = extents.halfHeight * 2;
  const clampedRatio = Math.min(
    KELP_MAX_HEIGHT_RATIO,
    Math.max(KELP_MIN_HEIGHT_RATIO, heightRatio)
  );
  const radius = extents.halfWidth * 0.018 * scale * SIZE_SCALE * KELP_SCALE;
  const height = boxHeight * clampedRatio;
  const mesh = new Mesh(
    new CylinderGeometry(radius, radius * 1.4, height, 8),
    obstacleMaterial(colors.centerColor)
  );
  mesh.position.y = -extents.halfHeight + height / 2 + 4;
  return tagObstacle(mesh);
}

function createCoral(
  extents: BoxHalfExtents,
  colors: GridThemeColors,
  scale: number
): ObstacleMesh {
  const radius = extents.halfWidth * 0.04 * scale * SIZE_SCALE;
  const height = extents.halfHeight * 0.12 * scale * SIZE_SCALE;
  const mesh = new Mesh(
    new ConeGeometry(radius, height, 6),
    obstacleMaterial(colors.centerColor)
  );
  mesh.position.y = -extents.halfHeight + height / 2 + 4;
  return tagObstacle(mesh);
}

function resolveFloatingPlacement(
  spec: ObstacleSpec,
  extents: BoxHalfExtents
): { x: number; z: number; yNorm: number } {
  const seed = spec.floatSeed ?? 1;
  const xRand = seededRandom(seed);
  const zRand = seededRandom(seed + 17);
  const yRand = seededRandom(seed + 41);

  return {
    x: (xRand * 2 - 1) * extents.halfWidth * FLOAT_SPREAD,
    z: (zRand * 2 - 1) * extents.halfDepth * FLOAT_SPREAD,
    yNorm: (yRand * 2 - 1) * 0.5,
  };
}

function attachBob(
  mesh: ObstacleMesh,
  yNorm: number,
  bobPhase: number,
  extents: BoxHalfExtents
): void {
  const yCenter = yNorm * extents.halfHeight * 0.55;

  mesh.position.y = yCenter;
  mesh.bob = {
    baseY: yCenter,
    amplitude: extents.halfHeight * 0.07,
    speed: 0.75 + (bobPhase % 3) * 0.15,
    phase: bobPhase,
  };
}

function createFromSpec(
  spec: ObstacleSpec,
  extents: BoxHalfExtents,
  colors: GridThemeColors
): ObstacleMesh {
  const scale = spec.scale ?? 1;
  let mesh: ObstacleMesh;

  switch (spec.kind) {
    case 'rock':
      mesh = createRock(extents, colors, scale);
      break;
    case 'kelp': {
      const heightRatio =
        spec.heightRatio ??
        KELP_MIN_HEIGHT_RATIO +
          seededRandom((spec.xNorm ?? 0) * 97 + (spec.zNorm ?? 0) * 53) *
            (KELP_MAX_HEIGHT_RATIO - KELP_MIN_HEIGHT_RATIO);
      mesh = createKelp(extents, colors, scale, heightRatio);
      break;
    }
    case 'coral':
      mesh = createCoral(extents, colors, scale);
      break;
  }

  if (spec.floating) {
    const placement = resolveFloatingPlacement(spec, extents);
    mesh.position.x = placement.x;
    mesh.position.z = placement.z;
    attachBob(mesh, placement.yNorm, spec.bobPhase ?? 0, extents);
  } else {
    mesh.position.x = (spec.xNorm ?? 0) * extents.halfWidth * 0.78;
    mesh.position.z = (spec.zNorm ?? 0) * extents.halfDepth * 0.78;
  }

  return mesh;
}

export function createAquariumObstacles(
  options: AquariumObstaclesOptions
): { group: Group; obstacles: ObstacleMesh[] } {
  const {
    extents,
    colors,
    count = DEFAULT_SPECS.length,
    layoutSeed = Math.random() * 1_000_000,
  } = options;
  const group = new Group();
  group.name = 'aquariumObstacles';

  const specs = buildRandomSpecs(count, layoutSeed);
  const obstacles: ObstacleMesh[] = [];

  for (const spec of specs) {
    const mesh = createFromSpec(spec, extents, colors);
    syncObstacleBounds(mesh);
    group.add(mesh);
    obstacles.push(mesh);
  }

  return { group, obstacles };
}

export function updateAquariumObstacles(
  obstacles: ObstacleMesh[],
  elapsedTime: number
): void {
  for (const obstacle of obstacles) {
    if (!obstacle.bob) continue;

    const { baseY, amplitude, speed, phase } = obstacle.bob;
    obstacle.position.y = baseY + Math.sin(elapsedTime * speed + phase) * amplitude;
    syncObstacleBounds(obstacle);
  }
}

export function disposeObstacleGroup(group: Group): void {
  group.traverse((child) => {
    if (child instanceof Mesh) {
      child.geometry?.dispose();
      const material = child.material;
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else {
        material?.dispose();
      }
    }
  });
}
