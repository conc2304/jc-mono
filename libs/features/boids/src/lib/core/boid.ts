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
  Raycaster,
  Shape,
  ShapeGeometry,
  Spherical,
  Vector3,
} from 'three';
import { MathUtils } from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

import { getRandomInRange } from './utils';

type WallMesh = Mesh & { repulsion?: number };

export class Boid {
  boidMesh!: Mesh;
  neighborhoodRadius = 150;
  neighborhoodAngle = 20;
  crowdingRadius = 30;
  collisionRadius = 60;
  maxRange = 200;
  updateAngle = -Math.PI / 2;
  startAngle: number;
  endAngle: number;
  boidSpeed = 2;
  rotationSpeed = 0.35;
  weightOld = 0.5;
  weightAvg = 0.5;
  raycaster = new Raycaster();
  id: string;
  noiseSeed: number;
  simplex: SimplexNoise;

  constructor() {
    this.startAngle = this.neighborhoodAngle + this.updateAngle;
    this.endAngle = -this.neighborhoodAngle + this.updateAngle;
    this.id = MathUtils.generateUUID();
    this.noiseSeed = Math.round(Math.random() * Math.pow(5, 10));
    this.simplex = new SimplexNoise();
  }

  createBoid(maxRange = 200): Mesh {
    const boidHeight = 15;
    const boidWidth = 5;
    const geometry = new ConeGeometry(boidWidth, boidHeight, 6);
    const material = new MeshBasicMaterial({ color: 0xffff00 });
    const boid = new Mesh(geometry, material);
    this.maxRange = maxRange;

    boid.position.set(0, 0, 0);
    boid.rotation.set(
      getRandomInRange(-Math.PI, Math.PI),
      getRandomInRange(-Math.PI, Math.PI),
      getRandomInRange(-Math.PI, Math.PI)
    );

    this.boidMesh = boid;
    return boid;
  }

  update(
    boidsList: Boid[],
    walls: WallMesh[],
    obstacles: Mesh[],
    attractors: { mesh: Mesh; calculateAttraction: (boid: Mesh) => Vector3 }[],
    elapsedTime: number
  ): void {
    let heading = this.getAlignmentHeading(boidsList);
    heading = this.getAvoidanceHeading(walls, obstacles, heading);
    heading = this.getSeparationHeading(boidsList, heading);
    heading = this.addAttractorForce(attractors, heading);

    const currentQuaternion = this.boidMesh.quaternion.clone();
    const targetQuaternion = new Quaternion();
    targetQuaternion.setFromUnitVectors(new Vector3(0, 1, 0), heading);

    const noiseScale = 0.05;
    const noiseStrength = 0.01;
    const noiseX =
      this.simplex.noise(this.noiseSeed, elapsedTime * noiseScale) * noiseStrength;
    const noiseY =
      this.simplex.noise(Math.pow(this.noiseSeed, 2), elapsedTime * noiseScale) *
      noiseStrength;

    const noiseQuaternion = new Quaternion();
    const noiseEuler = new Euler(noiseX, 0, noiseY, 'XYZ');
    noiseQuaternion.setFromEuler(noiseEuler);
    targetQuaternion.multiply(noiseQuaternion);

    this.boidMesh.quaternion.slerpQuaternions(
      currentQuaternion,
      targetQuaternion,
      this.rotationSpeed
    );

    this.boidMesh.position.add(heading.multiplyScalar(this.boidSpeed));

    if (this.boidMesh.position.distanceTo(new Vector3()) > this.maxRange * 1.75) {
      this.boidMesh.position.set(0, 0, 0);
    }

    this.updateBoidColor(this.boidMesh, this.maxRange * 1.7);
  }

  getAlignmentHeading(boidsList: Boid[]): Vector3 {
    const headingCurrent = this.getHeadingVector(this.boidMesh);
    const headingFlockAvg = this.getAverageHeading(boidsList);
    const WaHa = headingFlockAvg.clone().multiplyScalar(this.weightAvg);
    const WoHc = headingCurrent.clone().multiplyScalar(this.weightOld);
    const WoWa = this.weightOld + this.weightAvg;

    const numerator = new Vector3().addVectors(WoHc, WaHa);
    return numerator.clone().divideScalar(WoWa).normalize();
  }

  addAttractorForce(
    attractors: { mesh: Mesh; calculateAttraction: (boid: Mesh) => Vector3 }[],
    heading: Vector3
  ): Vector3 {
    let nearestDistance = Infinity;
    let nearestAttractor: (typeof attractors)[number] | null = null;

    for (const attractor of attractors) {
      const distance = this.boidMesh.position.distanceTo(attractor.mesh.position);
      if (distance < nearestDistance) {
        nearestAttractor = attractor;
        nearestDistance = distance;
      }
    }
    if (!nearestAttractor) return heading;

    const attractionForce = nearestAttractor.calculateAttraction(this.boidMesh);
    return heading.add(attractionForce);
  }

  getSeparationHeading(boidsList: Boid[], heading: Vector3): Vector3 {
    const position = this.boidMesh.position;
    const separationHeading = new Vector3().add(heading);
    const repulsionPower = 4;
    const forceVector = new Vector3(0, 0, 0);

    boidsList.forEach((otherBoid) => {
      if (otherBoid.id === this.id) return;

      const boidInCrowdingArea = this.isBoidInSector(
        otherBoid.boidMesh,
        this.crowdingRadius,
        this.startAngle
      );
      if (!boidInCrowdingArea) return;

      const positionOther = otherBoid.boidMesh.position;
      const distanceVector = new Vector3().subVectors(position, positionOther);
      const distance = distanceVector.length();

      if (distance > 0) {
        const repulsionStrength = 1 / Math.pow(distance / this.crowdingRadius, repulsionPower);
        distanceVector.normalize().multiplyScalar(repulsionStrength);
        forceVector.add(distanceVector);
      }
    });

    return separationHeading.clone().add(forceVector).normalize();
  }

  getDistanceToObstacle(obstacle: Mesh): { distance: number; closestPoint: Vector3 | null } {
    const boidPos = this.boidMesh.position.clone();

    if (!obstacle.geometry?.attributes?.position) {
      return { distance: Infinity, closestPoint: null };
    }

    const positionAttribute = obstacle.geometry.attributes.position;
    const matrixWorld = obstacle.matrixWorld;
    let closestPoint: Vector3 | null = null;
    let minDistance = Infinity;

    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i)
      );
      vertex.applyMatrix4(matrixWorld);
      const distance = boidPos.distanceTo(vertex);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = vertex.clone();
      }
    }

    return { distance: minDistance, closestPoint };
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

    const relativePos = new Vector3().subVectors(this.boidMesh.position, boidOther.position);
    const axis = new Vector3(0, 0, 1);
    const angle = -this.boidMesh.rotation.z;

    const tempSpherical = new Spherical();
    tempSpherical.setFromVector3(relativePos);
    const { theta } = tempSpherical;

    relativePos.applyAxisAngle(axis, angle);
    return Math.abs(theta) < Math.abs(startAngle);
  }

  getAvoidanceHeading(walls: WallMesh[], _obstacles: Mesh[], currentHeading: Vector3): Vector3 {
    let newHeading = currentHeading;
    let totalRepulsion = new Vector3();
    let obstaclePushCount = 0;

    walls.forEach((wall) => {
      const { distance, closestPoint } = this.getDistanceToObstacle(wall);

      if (distance < this.collisionRadius && closestPoint) {
        obstaclePushCount++;
        const rayDirection = new Vector3()
          .subVectors(closestPoint, this.boidMesh.position)
          .normalize();
        this.raycaster.set(this.boidMesh.position, rayDirection);
        const intersects = this.raycaster.intersectObjects(walls);

        let worldNormal = new Vector3();
        if (intersects.length > 0) {
          const closestIntersection = intersects[0];
          const normal = closestIntersection.face?.normal;
          if (normal) {
            worldNormal = normal
              .clone()
              .transformDirection(closestIntersection.object.matrixWorld)
              .normalize();
          }
        }
        const repulsionScale = 1 - distance / this.collisionRadius;
        const repulsionVector = new Vector3()
          .add(worldNormal)
          .multiplyScalar((wall.repulsion ?? 5) * repulsionScale);
        totalRepulsion = totalRepulsion.add(repulsionVector);
      }
    });

    if (obstaclePushCount > 0) {
      const avgRepulsion = totalRepulsion.divideScalar(obstaclePushCount);
      newHeading = newHeading.add(avgRepulsion);
    }

    return newHeading;
  }

  getAverageHeading(boids: Boid[]): Vector3 {
    const headingSum = new Vector3(0, 0, 0);
    let count = 0;

    boids.forEach((boid) => {
      if (boid.id === this.id) return;
      if (!this.isBoidInSector(boid.boidMesh, this.neighborhoodRadius, this.startAngle)) {
        return;
      }

      const headingVector = this.getHeadingVector(boid.boidMesh);
      headingSum.add(headingVector);
      count++;
    });

    if (count === 0) return this.getHeadingVector(this.boidMesh);

    return headingSum.clone().divideScalar(count);
  }

  getHeadingVector(meshObject: Mesh): Vector3 {
    const forward = new Vector3(0, 1, 0);
    forward.normalize();
    forward.applyQuaternion(meshObject.quaternion);
    return forward.normalize();
  }

  updateBoidColor(boidMesh: Mesh, range: number, saturation = 1): void {
    const pos = boidMesh.position;
    const rot = boidMesh.rotation;

    const normX = (pos.x - range) / range;
    const normY = (pos.y - range) / range;
    const normZ = (pos.z - range) / range;
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
