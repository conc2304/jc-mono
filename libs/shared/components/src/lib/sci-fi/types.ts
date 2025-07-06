import { ThemeColor, ThemeVariant } from '@jc/theming';
import { Properties, Property } from 'csstype';

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

export interface ShadowConfig {
  locationAware?: boolean;
  maxSpreadPx?: number;
  transition?: {
    duration?: string;
    easing?: string;
    property?: string;
  };
  states: {
    default: {
      color?: Property.Color;
      offsetX?: number;
      offsetY?: number;
      blur?: number;
      opacity?: number;
    };
    hover?: {
      color?: Property.Color;
      offsetX?: number;
      offsetY?: number;
      blur?: number;
      opacity?: number;
    };
    active?: {
      color?: Property.Color;
      offsetX?: number;
      offsetY?: number;
      blur?: number;
      opacity?: number;
    };
  };
}

export interface LineElement {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
}

export interface StateStyles {
  default?: Properties;
  hover?: Properties;
  focus?: Properties;
  active?: Properties;
  disabled?: Properties;
}

export interface ElementStyleConfig {
  root?: StateStyles;
  background?: StateStyles;
  shadow?: StateStyles;
  border?: StateStyles;
  content?: StateStyles;
}

export type ShadowTarget =
  | 'viewportCenter'
  | { x: number; y: number }
  | { element: Element }
  | { percentX: number; percentY: number };

export type { BevelConfig, CornerBevel, GlowConfig };

export interface Dimensions {
  width: number;
  height: number;
}

export interface ShadowOffset {
  x: number;
  y: number;
}

export interface InnerRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Component states
export type ComponentState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled';

// Style configuration for each state
export interface StateStyleConfig {
  default?: Properties;
  hover?: Properties;
  focus?: Properties;
  active?: Properties;
  disabled?: Properties;
}

// Slot style configuration
export interface SlotStyleConfig {
  root?: StateStyleConfig;
  background?: StateStyleConfig;
  border?: StateStyleConfig;
  content?: StateStyleConfig;
  shadow?: StateStyleConfig;
}

// Theme configuration for a component
export interface ComponentThemeConfig {
  [key: string]: {
    // color variant key
    [key: string]: SlotStyleConfig; // component variant key
  };
}

// Utility type for creating component themes
export type ComponentTheme<T extends string = ThemeColor> = {
  [K in T]: {
    [V in ThemeVariant]?: SlotStyleConfig;
  };
};

export type SizeConfigItem = {
  bevelConfig: BevelConfig;
  strokeWidth: Property.StrokeWidth;
  className: string;
};
