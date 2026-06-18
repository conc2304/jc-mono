import type { CSSProperties } from 'react';

export type BoidsAppOptions = {
  physics?: boolean;
  debug?: boolean;
  boidCount?: number;
  attractorCount?: number;
  debugContainer?: HTMLElement | null;
  statsContainer?: HTMLElement | null;
};

export type BoidsSimulationProps = {
  physics?: boolean;
  debug?: boolean;
  boidCount?: number;
  attractorCount?: number;
  className?: string;
  style?: CSSProperties;
};
