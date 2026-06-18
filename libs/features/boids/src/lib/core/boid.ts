import {
  BufferGeometry,
  ConeGeometry,
  DoubleSide,
  Euler,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Shape,
  ShapeGeometry,
  Spherical,
  Vector3,
} from 'three';
import { MathUtils } from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

import type { ObstacleMesh } from './aquarium-obstacles';
import { getRandomInRange } from './utils';
import type { BoxHalfExtents, WallMesh } from './vaporwave-grid-box';

type AvoidableMesh = WallMesh | ObstacleMesh;

const BOID_MARGIN = 12;
const REFERENCE_BOX_MIN = 300;

export class Boid {
  boidMesh!: Mesh;
  neighborhoodRadius = 150;
  neighborhoodAngle = 20;
  crowdingRadius = 30;
  collisionRadius = 60;
  boxBounds: BoxHalfExtents = { halfWidth: 200, halfHeight: 200, halfDepth: 200 };
  updateAngle = -Math.PI / 2;
  startAngle: number;
  endAngle: number;
  boidSpeed = 2;
  rotationSpeed = 0.35;
  weightOld = 0.5;
  weightAvg = 0.5;
  id: string;
  noiseSeed: number;
  simplex: SimplexNoise;

  #heading = new Vector3();
  #headingCurrent = new Vector3();
  #headingFlockAvg = new Vector3();
  #headingBlend = new Vector3();
  #currentQuat = new Quaternion();
  #targetQuat = new Quaternion();
  #noiseQuat = new Quaternion();
  #noiseEuler = new Euler();
  #forward = new Vector3(0, 1, 0);
  #boidWorld = new Vector3();
  #worldClamped = new Vector3();
  #separationForce = new Vector3();
  #distanceVector = new Vector3();
  #relativePos = new Vector3();
  #repulsionTotal = new Vector3();
  #repulsionAvg = new Vector3();
  #repulsionVector = new Vector3();
  #repulsionNormal = new Vector3();
  #closestPoint = new Vector3();
  #toBoid = new Vector3();
  #attractorDelta = new Vector3();
  #attractorForce = new Vector3();
  #headingSum = new Vector3();
  #colorWorld = new Vector3();

  constructor() {
    this.startAngle = this.neighborhoodAngle + this.updateAngle;
    this.endAngle = -this.neighborhoodAngle + this.updateAngle;
    this.id = MathUtils.generateUUID();
    this.noiseSeed = Math.round(Math.random() * Math.pow(5, 10));
    this.simplex = new SimplexNoise();
  }

  createBoid(bounds: BoxHalfExtents): Mesh {
    this.setBoxBounds(bounds);

    const boidHeight = 15;
    const boidWidth = 5;
    const geometry = new ConeGeometry(boidWidth, boidHeight, 6);
    const material = new MeshBasicMaterial({ color: 0xffff00 });
    const boid = new Mesh(geometry, material);

    const spawnX = bounds.halfWidth - BOID_MARGIN;
    const spawnY = bounds.halfHeight - BOID_MARGIN;
    const spawnZ = bounds.halfDepth - BOID_MARGIN;
    boid.position.set(
      getRandomInRange(-spawnX, spawnX),
      getRandomInRange(-spawnY, spawnY),
      getRandomInRange(-spawnZ, spawnZ)
    );
    boid.rotation.set(
      getRandomInRange(-Math.PI, Math.PI),
      getRandomInRange(-Math.PI, Math.PI),
      getRandomInRange(-Math.PI, Math.PI)
    );

    this.boidMesh = boid;
    return boid;
  }

  setBoxBounds(bounds: BoxHalfExtents): void {
    this.boxBounds = { ...bounds };
    const scale =
      Math.min(bounds.halfWidth, bounds.halfHeight, bounds.halfDepth) / REFERENCE_BOX_MIN;
    this.neighborhoodRadius = 150 * scale;
    this.crowdingRadius = 30 * scale;
    this.collisionRadius = 60 * scale;
  }

  update(
    boidsList: Boid[],
    avoidables: AvoidableMesh[],
    attractors: { mesh: Mesh; position: Vector3; strength: number; range: number }[],
    elapsedTime: number
  ): void {
    this.getAlignmentHeading(boidsList, this.#heading);
    this.getAvoidanceHeading(avoidables, this.#heading, this.#heading);
    this.getSeparationHeading(boidsList, this.#heading, this.#heading);
    this.addAttractorForce(attractors, this.#heading, this.#heading);

    this.#currentQuat.copy(this.boidMesh.quaternion);
    this.#targetQuat.setFromUnitVectors(this.#forward, this.#heading);

    const noiseScale = 0.05;
    const noiseStrength = 0.01;
    const noiseX =
      this.simplex.noise(this.noiseSeed, elapsedTime * noiseScale) * noiseStrength;
    const noiseY =
      this.simplex.noise(Math.pow(this.noiseSeed, 2), elapsedTime * noiseScale) *
      noiseStrength;

    this.#noiseEuler.set(noiseX, 0, noiseY);
    this.#noiseQuat.setFromEuler(this.#noiseEuler);
    this.#targetQuat.multiply(this.#noiseQuat);

    this.boidMesh.quaternion.slerpQuaternions(
      this.#currentQuat,
      this.#targetQuat,
      this.rotationSpeed
    );

    this.boidMesh.position.addScaledVector(this.#heading, this.boidSpeed);

    this.#enforceWorldBoxBounds();
    this.updateBoidColor(this.boidMesh, this.boxBounds);
  }

  #enforceWorldBoxBounds(): void {
    const { halfWidth: w, halfHeight: h, halfDepth: d } = this.boxBounds;
    const margin = BOID_MARGIN;

    this.boidMesh.getWorldPosition(this.#boidWorld);

    this.#worldClamped.set(
      Math.max(-w + margin, Math.min(w - margin, this.#boidWorld.x)),
      Math.max(-h + margin, Math.min(h - margin, this.#boidWorld.y)),
      Math.max(-d + margin, Math.min(d - margin, this.#boidWorld.z))
    );

    if (this.#worldClamped.equals(this.#boidWorld)) return;

    const parent = this.boidMesh.parent;
    if (parent) {
      parent.worldToLocal(this.#worldClamped);
    }
    this.boidMesh.position.copy(this.#worldClamped);
  }

  getAlignmentHeading(boidsList: Boid[], out: Vector3): Vector3 {
    this.getHeadingInto(this.boidMesh, this.#headingCurrent);
    this.getAverageHeading(boidsList, this.#headingFlockAvg);

    out
      .copy(this.#headingCurrent)
      .multiplyScalar(this.weightOld)
      .add(this.#headingBlend.copy(this.#headingFlockAvg).multiplyScalar(this.weightAvg))
      .divideScalar(this.weightOld + this.weightAvg)
      .normalize();

    return out;
  }

  addAttractorForce(
    attractors: { mesh: Mesh; position: Vector3; strength: number; range: number }[],
    heading: Vector3,
    out: Vector3
  ): Vector3 {
    out.copy(heading);

    let nearestDistance = Infinity;
    let nearestAttractor: (typeof attractors)[number] | null = null;

    for (const attractor of attractors) {
      const distance = this.boidMesh.position.distanceTo(attractor.mesh.position);
      if (distance < nearestDistance) {
        nearestAttractor = attractor;
        nearestDistance = distance;
      }
    }

    if (!nearestAttractor || nearestDistance >= nearestAttractor.range) {
      return out;
    }

    this.#attractorDelta.subVectors(nearestAttractor.position, this.boidMesh.position);
    this.#attractorForce.copy(this.#attractorDelta).normalize().multiplyScalar(nearestAttractor.strength);
    return out.add(this.#attractorForce);
  }

  getSeparationHeading(boidsList: Boid[], heading: Vector3, out: Vector3): Vector3 {
    const position = this.boidMesh.position;
    out.copy(heading);
    this.#separationForce.set(0, 0, 0);
    const repulsionPower = 4;

    for (const otherBoid of boidsList) {
      if (otherBoid.id === this.id) continue;

      if (
        !this.isBoidInSector(otherBoid.boidMesh, this.crowdingRadius, this.startAngle)
      ) {
        continue;
      }

      const positionOther = otherBoid.boidMesh.position;
      this.#distanceVector.subVectors(position, positionOther);
      const distance = this.#distanceVector.length();

      if (distance > 0) {
        const repulsionStrength =
          1 / Math.pow(distance / this.crowdingRadius, repulsionPower);
        this.#separationForce.add(
          this.#distanceVector.normalize().multiplyScalar(repulsionStrength)
        );
      }
    }

    return out.add(this.#separationForce).normalize();
  }

  #distanceToAvoidable(
    mesh: AvoidableMesh,
    boidWorld: Vector3,
    outClosest: Vector3
  ): number {
    if (mesh.inwardNormal && mesh.planePoint) {
      this.#toBoid.subVectors(boidWorld, mesh.planePoint);
      const signedDist = this.#toBoid.dot(mesh.inwardNormal);
      if (signedDist < 0) return Infinity;

      outClosest.copy(boidWorld).addScaledVector(mesh.inwardNormal, -signedDist);
      return signedDist;
    }

    const bounds = (mesh as ObstacleMesh).bounds;
    if (bounds) {
      bounds.clampPoint(boidWorld, outClosest);
      return boidWorld.distanceTo(outClosest);
    }

    return Infinity;
  }

  getAvoidanceHeading(
    avoidables: AvoidableMesh[],
    currentHeading: Vector3,
    out: Vector3
  ): Vector3 {
    out.copy(currentHeading);
    this.boidMesh.getWorldPosition(this.#boidWorld);

    this.#repulsionTotal.set(0, 0, 0);
    let pushCount = 0;

    for (const mesh of avoidables) {
      const distance = this.#distanceToAvoidable(mesh, this.#boidWorld, this.#closestPoint);
      if (distance >= this.collisionRadius) continue;

      pushCount++;

      if (mesh.inwardNormal) {
        this.#repulsionNormal.copy(mesh.inwardNormal);
      } else {
        this.#repulsionNormal.subVectors(this.#boidWorld, this.#closestPoint);
        if (this.#repulsionNormal.lengthSq() === 0) {
          this.#repulsionNormal.set(0, 1, 0);
        } else {
          this.#repulsionNormal.normalize();
        }
      }

      const repulsionScale = 1 - distance / this.collisionRadius;
      this.#repulsionTotal.add(
        this.#repulsionVector
          .copy(this.#repulsionNormal)
          .multiplyScalar((mesh.repulsion ?? 5) * repulsionScale)
      );
    }

    if (pushCount === 0) return out;

    return out.add(
      this.#repulsionAvg.copy(this.#repulsionTotal).divideScalar(pushCount)
    );
  }

  getAverageHeading(boids: Boid[], out: Vector3): Vector3 {
    this.#headingSum.set(0, 0, 0);
    let count = 0;

    for (const boid of boids) {
      if (boid.id === this.id) continue;
      if (!this.isBoidInSector(boid.boidMesh, this.neighborhoodRadius, this.startAngle)) {
        continue;
      }

      this.getHeadingInto(boid.boidMesh, this.#headingCurrent);
      this.#headingSum.add(this.#headingCurrent);
      count++;
    }

    if (count === 0) {
      return this.getHeadingInto(this.boidMesh, out);
    }

    return out.copy(this.#headingSum).divideScalar(count);
  }

  getHeadingInto(meshObject: Mesh, out: Vector3): Vector3 {
    return out.copy(this.#forward).applyQuaternion(meshObject.quaternion).normalize();
  }

  createAngleLine(): Line {
    const points = [new Vector3(0, 0, 0), new Vector3(0, this.neighborhoodRadius, 0)];
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({ color: 0xff0000 });
    return new Line(geometry, material);
  }

  createBoidSector(
    radius: number,
    startAngle: number,
    endAngle: number,
    materialConf: Partial<MeshBasicMaterial>
  ): Mesh {
    const shape = new Shape();
    const centerX = 0;
    const centerY = 0;

    shape.moveTo(centerX, centerY);
    shape.lineTo(
      centerX + radius * Math.cos(startAngle),
      centerY + radius * Math.sin(startAngle)
    );
    shape.absarc(centerX, centerY, radius, startAngle, endAngle, false);
    shape.lineTo(centerX, centerY);

    const geometry = new ShapeGeometry(shape);
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.15,
      side: DoubleSide,
      transparent: true,
      ...materialConf,
    });
    return new Mesh(geometry, material);
  }

  isBoidInSector(boidOther: Mesh, radius: number, startAngle: number): boolean {
    const distanceToBoid = boidOther.position.distanceTo(this.boidMesh.position);
    if (distanceToBoid >= radius) return false;

    this.#relativePos.subVectors(this.boidMesh.position, boidOther.position);
    const axis = new Vector3(0, 0, 1);
    const angle = -this.boidMesh.rotation.z;

    const tempSpherical = new Spherical();
    tempSpherical.setFromVector3(this.#relativePos);
    const { theta } = tempSpherical;

    this.#relativePos.applyAxisAngle(axis, angle);
    return Math.abs(theta) < Math.abs(startAngle);
  }

  updateBoidColor(boidMesh: Mesh, bounds: BoxHalfExtents, saturation = 1): void {
    boidMesh.getWorldPosition(this.#colorWorld);
    const rot = boidMesh.rotation;

    const normX = this.#colorWorld.x / bounds.halfWidth;
    const normY = this.#colorWorld.y / bounds.halfHeight;
    const normZ = this.#colorWorld.z / bounds.halfDepth;
    const normRotX = (rot.x % (2 * Math.PI)) / (2 * Math.PI);
    const normRotY = (rot.y % (2 * Math.PI)) / (2 * Math.PI);
    const normRotZ = (rot.z % (2 * Math.PI)) / (2 * Math.PI);

    const r = Math.abs(normX + normRotX) / 2;
    const g = Math.abs(normY + normRotY) / 2;
    const b = Math.abs(normZ + normRotZ) / 2;

    const material = boidMesh.material as MeshBasicMaterial;
    material.color.setRGB(r, g, b);

    const hsl = { h: 0, s: 0, l: 0 };
    material.color.getHSL(hsl);
    material.color.setHSL(hsl.h, saturation, hsl.l);
  }

  dispose(): void {
    this.boidMesh.geometry.dispose();
    (this.boidMesh.material as MeshBasicMaterial).dispose();
  }
}
