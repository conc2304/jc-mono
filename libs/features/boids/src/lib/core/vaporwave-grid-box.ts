import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Vector3,
} from 'three';

import type { GridThemeColors } from '../types';

export type WallMesh = Mesh & { repulsion?: number };

export type BoxHalfExtents = {
  halfWidth: number;
  halfHeight: number;
  halfDepth: number;
};

const DEFAULT_GRID_COLORS: GridThemeColors = {
  gridColor: '#00ffff',
  centerColor: '#ff00ff',
};

const GRID_OPACITY = 0.25;
const COLLISION_SUBDIVISIONS = 12;

function hexToVector3(hex: string): Vector3 {
  const color = new Color(hex);
  return new Vector3(color.r, color.g, color.b);
}

export function computeViewportBoxHalfExtents(
  camera: PerspectiveCamera,
  distance: number,
  fill = 0.99
): BoxHalfExtents {
  const vFov = (camera.fov * Math.PI) / 180;
  const halfHeight = Math.tan(vFov / 2) * distance * fill;
  const halfWidth = halfHeight * camera.aspect;
  const halfDepth = halfWidth * 0.72;

  return { halfWidth, halfHeight, halfDepth };
}

type WallFaceConfig = {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  collisionRotation: [number, number, number];
  visual?: boolean;
};

function buildWallFaces(extents: BoxHalfExtents): WallFaceConfig[] {
  const { halfWidth: w, halfHeight: h, halfDepth: d } = extents;

  return [
    {
      name: 'floor',
      position: [0, -h, 0],
      rotation: [-Math.PI / 2, 0, 0],
      width: w * 2,
      height: d * 2,
      collisionRotation: [-Math.PI / 2, 0, 0],
    },
    {
      name: 'ceiling',
      position: [0, h, 0],
      rotation: [Math.PI / 2, 0, 0],
      width: w * 2,
      height: d * 2,
      collisionRotation: [Math.PI / 2, 0, 0],
    },
    {
      name: 'backWall',
      position: [0, 0, -d],
      rotation: [0, 0, 0],
      width: w * 2,
      height: h * 2,
      collisionRotation: [0, Math.PI, 0],
    },
    {
      name: 'leftWall',
      position: [-w, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      width: d * 2,
      height: h * 2,
      collisionRotation: [0, -Math.PI / 2, 0],
    },
    {
      name: 'rightWall',
      position: [w, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
      width: d * 2,
      height: h * 2,
      collisionRotation: [0, Math.PI / 2, 0],
    },
    // Open front toward camera — collision only so boids can't escape toward viewer
    {
      name: 'frontWall',
      position: [0, 0, d],
      rotation: [0, 0, 0],
      width: w * 2,
      height: h * 2,
      collisionRotation: [0, 0, 0],
      visual: false,
    },
  ];
}

function gridDivisions(extents: BoxHalfExtents): number {
  const span = Math.min(
    extents.halfWidth,
    extents.halfHeight,
    extents.halfDepth
  );
  return Math.max(10, Math.min(32, Math.round(span / 22)));
}

function createGridLines(
  width: number,
  height: number,
  divisions: number,
  colors: GridThemeColors
): LineSegments {
  const halfW = width / 2;
  const halfH = height / 2;
  const positions: number[] = [];
  const colorValues: number[] = [];

  const gridColor = hexToVector3(colors.gridColor);
  const centerColor = hexToVector3(colors.centerColor);

  const addLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isCenter: boolean
  ) => {
    positions.push(x1, y1, 0, x2, y2, 0);
    const c = isCenter ? centerColor : gridColor;
    colorValues.push(c.x, c.y, c.z, c.x, c.y, c.z);
  };

  const uDiv = divisions;
  const vDiv = Math.max(4, Math.round(divisions * (height / width)));

  for (let i = 0; i <= uDiv; i++) {
    const x = -halfW + (width * i) / uDiv;
    addLine(x, -halfH, x, halfH, i === Math.floor(uDiv / 2));
  }

  for (let i = 0; i <= vDiv; i++) {
    const y = -halfH + (height * i) / vDiv;
    addLine(-halfW, y, halfW, y, i === Math.floor(vDiv / 2));
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(positions), 3)
  );
  geometry.setAttribute(
    'color',
    new BufferAttribute(new Float32Array(colorValues), 3)
  );

  const material = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: GRID_OPACITY,
    fog: false,
    depthWrite: false,
  });

  return new LineSegments(geometry, material);
}

function disposeLineSegments(line: LineSegments): void {
  line.geometry.dispose();
  const material = line.material;
  if (Array.isArray(material)) {
    material.forEach((m) => m.dispose());
  } else {
    material.dispose();
  }
}

function disposeMesh(mesh: Mesh): void {
  mesh.geometry.dispose();
  const material = mesh.material;
  if (Array.isArray(material)) {
    material.forEach((m) => m.dispose());
  } else {
    material.dispose();
  }
}

/** World-space vaporwave grid room — static; camera stays fixed while boids rotate. */
export class VaporwaveGridBox {
  readonly group = new Group();
  walls: WallMesh[] = [];
  #gridLines: LineSegments[] = [];
  #colors: GridThemeColors = DEFAULT_GRID_COLORS;

  setColors(colors: GridThemeColors): void {
    this.#colors = colors;
  }

  rebuild(extents: BoxHalfExtents, colors?: GridThemeColors): void {
    if (colors) {
      this.#colors = colors;
    }
    this.dispose();

    const divisions = gridDivisions(extents);
    const faces = buildWallFaces(extents);

    for (const face of faces) {
      if (face.visual !== false) {
        const grid = createGridLines(
          face.width,
          face.height,
          divisions,
          this.#colors
        );
        grid.position.set(...face.position);
        grid.rotation.set(...face.rotation);
        grid.name = face.name;
        grid.renderOrder = 1;
        this.group.add(grid);
        this.#gridLines.push(grid);
      }

      const collisionGeometry = new PlaneGeometry(
        face.width,
        face.height,
        COLLISION_SUBDIVISIONS,
        COLLISION_SUBDIVISIONS
      );
      const collisionMaterial = new MeshBasicMaterial({
        visible: false,
        side: DoubleSide,
      });
      const collisionPlane = new Mesh(
        collisionGeometry,
        collisionMaterial
      ) as WallMesh;
      collisionPlane.name = `${face.name}-collision`;
      collisionPlane.position.set(...face.position);
      collisionPlane.rotation.set(...face.collisionRotation);
      collisionPlane.repulsion = 5;
      this.group.add(collisionPlane);
      this.walls.push(collisionPlane);
    }
  }

  dispose(): void {
    for (const grid of this.#gridLines) {
      this.group.remove(grid);
      disposeLineSegments(grid);
    }
    this.#gridLines = [];

    for (const wall of this.walls) {
      this.group.remove(wall);
      disposeMesh(wall);
    }
    this.walls = [];
  }
}
