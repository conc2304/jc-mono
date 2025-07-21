import * as THREE from 'three';

export type SceneElements =
  | THREE.Mesh<
      THREE.TorusGeometry,
      THREE.MeshBasicMaterial,
      THREE.Object3DEventMap
    >
  | THREE.Line<
      THREE.BufferGeometry<
        THREE.NormalBufferAttributes,
        THREE.BufferGeometryEventMap
      >,
      THREE.LineBasicMaterial,
      THREE.Object3DEventMap
    >;

export type Particle3JS = THREE.Points<
  THREE.BufferGeometry<
    THREE.NormalBufferAttributes,
    THREE.BufferGeometryEventMap
  >,
  THREE.PointsMaterial,
  THREE.Object3DEventMap
>;

// Universal color type - accepts any common color format
export type ColorValue =
  | string
  | number
  | THREE.Color
  | { r: number; g: number; b: number };

export interface ColorScheme {
  backgroundColor?: ColorValue;
  beamColor?: ColorValue;
  torusColor?: ColorValue;
  particleColor?: ColorValue;
  verticalLineColor?: ColorValue;
}

export interface MouseInteraction {
  normalized: THREE.Vector2; // -1 to 1 range
  world3D: THREE.Vector3; // Projected 3D world position
  isDown: boolean;
  clickIntensity: number; // 0-1, fades over time
  distanceFromCenter: number; // 0-1
}
