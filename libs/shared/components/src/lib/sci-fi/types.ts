type CornerBevel = {
  bevelSize: number;
  bevelAngle?: number;
};

type BevelConfig = {
  tl?: CornerBevel;
  tr?: CornerBevel;
  br?: CornerBevel;
  bl?: CornerBevel;
};

type GlowConfig = {
  color?: string;
  intensity?: number;
  spread?: number;
  opacity?: number;
};

export type { BevelConfig, CornerBevel, GlowConfig };
