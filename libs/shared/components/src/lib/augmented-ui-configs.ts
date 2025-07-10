// Define the shape mapping interface
export interface ShapeMapping {
  [key: string]: {
    'data-augmented-ui': string;
    'data-augmented-ui-border'?: string;
    'data-augmented-ui-inlay'?: string;
  };
}

export const BUTTON_SHAPE_MAPPINGS: ShapeMapping = {
  buttonLeft: {
    'data-augmented-ui': 'bl-clip tr-clip',
  },
  buttonRight: {
    'data-augmented-ui': 'br-clip tl-clip',
  },
  buttonRounded: {
    'data-augmented-ui': 'tl-round tr-round br-round bl-round',
  },
  buttonClipped: {
    'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip',
  },
  buttonScoop: {
    'data-augmented-ui': 'tl-scoop tr-scoop br-scoop bl-scoop',
  },
};
// Define semantic shape names to augmented-ui mixin mappings
export const SHAPE_MAPPINGS: ShapeMapping = {
  // Basic button shapes
  ...BUTTON_SHAPE_MAPPINGS,

  // Futuristic shapes
  futuristicHex: {
    'data-augmented-ui': 'all-hex',
  },
  futuristicTriangle: {
    'data-augmented-ui': 'all-triangle-up',
  },
  futuristicDiamond: {
    'data-augmented-ui': 'all-hexangle-up',
  },

  // Asymmetric designs
  asymmetricLeft: {
    'data-augmented-ui': 'tl-clip bl-clip border',
  },
  asymmetricRight: {
    'data-augmented-ui': 'tr-clip br-clip border',
  },

  // Complex shapes
  complexPanel: {
    'data-augmented-ui': 'tl-clip tr-2-clip-x br-clip bl-2-clip-x inlay',
  },
  gamingButton: {
    'data-augmented-ui': 'tl-clip tr-round br-clip bl-round',
  },

  // Edge variations
  topClipped: {
    'data-augmented-ui': 'tl-clip tr-clip',
  },
  bottomClipped: {
    'data-augmented-ui': 'bl-clip br-clip',
  },
  leftClipped: {
    'data-augmented-ui': 'tl-clip bl-clip',
  },
  rightClipped: {
    'data-augmented-ui': 'tr-clip br-clip',
  },

  // Inlay examples
  inlayButton: {
    'data-augmented-ui': 'tl-clip tr-clip br-clip bl-clip border inlay',
  },
  glowButton: {
    'data-augmented-ui': 'tl-round tr-round br-round bl-round border inlay',
  },
};

export const getShapeData = ({
  shape,
  hasBorder,
}: {
  shape: keyof typeof SHAPE_MAPPINGS;
  hasBorder: boolean;
}) => {
  const { ...shapeAttributes } = SHAPE_MAPPINGS[shape];
  const borderValue = hasBorder ? 'border' : '';
  shapeAttributes['data-augmented-ui'] += ` ${borderValue}`;

  return shapeAttributes;
};
