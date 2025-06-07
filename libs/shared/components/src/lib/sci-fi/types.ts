type CornerBevel = {
  bevelSize: number;
  bevelAngle?: number;
};

type BevelConfig = {
  topLeft?: CornerBevel;
  topRight?: CornerBevel;
  bottomRight?: CornerBevel;
  bottomLeft?: CornerBevel;
};

type GlowConfig = {
  color?: string;
  intensity?: number;
  spread?: number;
  opacity?: number;
};

export interface StepSegment {
  start: number; // Position along edge (0-1, where 0 is start of edge, 1 is end)
  end: number; // Position along edge (0-1)
  height: number; // Height of the step (positive = outward from shape)
}

export interface EdgeStepConfig {
  segments?: StepSegment[];
}

export interface StepConfig {
  top?: EdgeStepConfig;
  right?: EdgeStepConfig;
  bottom?: EdgeStepConfig;
  left?: EdgeStepConfig;
}

export type { BevelConfig, CornerBevel, GlowConfig };
