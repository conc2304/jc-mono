// Size presets that determine the scale of augmentations
export type PresetSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// Base augmentation types inspired by augmented-ui
export type AugmentationType = 'clip' | 'step' | 'rect' | 'round' | 'scoop';

// Configuration for each section preset
export type SectionPreset =
  | {
      type: AugmentationType;
      size: PresetSize;
    }
  | undefined;

// Main shape configuration with 8 sections
export type NewShapeConfig = {
  topLeft: SectionPreset;
  top: SectionPreset;
  topRight: SectionPreset;
  right: SectionPreset;
  bottomRight: SectionPreset;
  bottom: SectionPreset;
  bottomLeft: SectionPreset;
  left: SectionPreset;
};

// Internal augmentation data with calculated dimensions
interface AugmentationData {
  type: AugmentationType;
  size: number; // Actual pixel size
  width: number;
  height: number;
}

// Size mappings for different preset sizes
const SIZE_PRESETS: Record<PresetSize, number> = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Section positions for path generation
type SectionPosition =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'right'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'left';

/**
 * Convert preset configuration to augmentation data
 */
function resolveAugmentation(preset: SectionPreset): AugmentationData | null {
  if (!preset) return null;

  const size = SIZE_PRESETS[preset.size];
  return {
    type: preset.type,
    size,
    width: size,
    height: size,
  };
}

/**
 * Calculate the offset points for a clip augmentation (angled cut)
 */
function getClipOffset(size: number, angle = 45): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.abs(size * Math.cos(radians)),
    y: Math.abs(size * Math.sin(radians)),
  };
}

/**
 * Generate path points for different augmentation types
 */
function generateAugmentationPoints(
  augmentation: AugmentationData,
  position: SectionPosition,
  width: number,
  height: number
): {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  midPoints: { x: number; y: number }[];
} {
  const { type, size } = augmentation;

  switch (position) {
    case 'topLeft':
      return generateCornerAugmentation(type, size, 0, 0, 'topLeft');
    case 'topRight':
      return generateCornerAugmentation(type, size, width, 0, 'topRight');
    case 'bottomRight':
      return generateCornerAugmentation(
        type,
        size,
        width,
        height,
        'bottomRight'
      );
    case 'bottomLeft':
      return generateCornerAugmentation(type, size, 0, height, 'bottomLeft');
    case 'top':
      return generateEdgeAugmentation(type, size, width / 2, 0, 'horizontal');
    case 'right':
      return generateEdgeAugmentation(
        type,
        size,
        width,
        height / 2,
        'vertical'
      );
    case 'bottom':
      return generateEdgeAugmentation(
        type,
        size,
        width / 2,
        height,
        'horizontal'
      );
    case 'left':
      return generateEdgeAugmentation(type, size, 0, height / 2, 'vertical');
    default:
      throw new Error(`Unknown position: ${position}`);
  }
}

/**
 * Generate augmentation points for corner positions
 */
function generateCornerAugmentation(
  type: AugmentationType,
  size: number,
  cornerX: number,
  cornerY: number,
  corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
): {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  midPoints: { x: number; y: number }[];
} {
  const midPoints: { x: number; y: number }[] = [];

  switch (type) {
    case 'clip': {
      const offset = getClipOffset(size);
      switch (corner) {
        case 'topLeft':
          return {
            startPoint: { x: 0, y: offset.y },
            endPoint: { x: offset.x, y: 0 },
            midPoints: [],
          };
        case 'topRight':
          return {
            startPoint: { x: cornerX - offset.x, y: 0 },
            endPoint: { x: cornerX, y: offset.y },
            midPoints: [],
          };
        case 'bottomRight':
          return {
            startPoint: { x: cornerX, y: cornerY - offset.y },
            endPoint: { x: cornerX - offset.x, y: cornerY },
            midPoints: [],
          };
        case 'bottomLeft':
          return {
            startPoint: { x: offset.x, y: cornerY },
            endPoint: { x: 0, y: cornerY - offset.y },
            midPoints: [],
          };
      }
      break;
    }

    case 'step': {
      switch (corner) {
        case 'topLeft':
          return {
            startPoint: { x: 0, y: size },
            endPoint: { x: size, y: 0 },
            midPoints: [
              { x: 0, y: 0 },
              { x: size, y: 0 },
            ],
          };
        case 'topRight':
          return {
            startPoint: { x: cornerX - size, y: 0 },
            endPoint: { x: cornerX, y: size },
            midPoints: [
              { x: cornerX, y: 0 },
              { x: cornerX, y: size },
            ],
          };
        case 'bottomRight':
          return {
            startPoint: { x: cornerX, y: cornerY - size },
            endPoint: { x: cornerX - size, y: cornerY },
            midPoints: [
              { x: cornerX, y: cornerY },
              { x: cornerX - size, y: cornerY },
            ],
          };
        case 'bottomLeft':
          return {
            startPoint: { x: size, y: cornerY },
            endPoint: { x: 0, y: cornerY - size },
            midPoints: [
              { x: 0, y: cornerY },
              { x: 0, y: cornerY - size },
            ],
          };
      }
      break;
    }

    case 'rect': {
      switch (corner) {
        case 'topLeft':
          return {
            startPoint: { x: 0, y: size },
            endPoint: { x: size, y: 0 },
            midPoints: [{ x: size, y: size }],
          };
        case 'topRight':
          return {
            startPoint: { x: cornerX - size, y: 0 },
            endPoint: { x: cornerX, y: size },
            midPoints: [{ x: cornerX - size, y: size }],
          };
        case 'bottomRight':
          return {
            startPoint: { x: cornerX, y: cornerY - size },
            endPoint: { x: cornerX - size, y: cornerY },
            midPoints: [{ x: cornerX - size, y: cornerY - size }],
          };
        case 'bottomLeft':
          return {
            startPoint: { x: size, y: cornerY },
            endPoint: { x: 0, y: cornerY - size },
            midPoints: [{ x: size, y: cornerY - size }],
          };
      }
      break;
    }

    case 'round': {
      // Generate bezier curve points for rounded corners
      const controlPointRatio = 0.552; // Standard ratio for circular bezier curves
      const cp = size * controlPointRatio;

      switch (corner) {
        case 'topLeft':
          return {
            startPoint: { x: 0, y: size },
            endPoint: { x: size, y: 0 },
            midPoints: [
              { x: 0, y: cp }, // Control point 1
              { x: cp, y: 0 }, // Control point 2
            ],
          };
        case 'topRight':
          return {
            startPoint: { x: cornerX - size, y: 0 },
            endPoint: { x: cornerX, y: size },
            midPoints: [
              { x: cornerX - cp, y: 0 },
              { x: cornerX, y: cp },
            ],
          };
        case 'bottomRight':
          return {
            startPoint: { x: cornerX, y: cornerY - size },
            endPoint: { x: cornerX - size, y: cornerY },
            midPoints: [
              { x: cornerX, y: cornerY - cp },
              { x: cornerX - cp, y: cornerY },
            ],
          };
        case 'bottomLeft':
          return {
            startPoint: { x: size, y: cornerY },
            endPoint: { x: 0, y: cornerY - size },
            midPoints: [
              { x: cp, y: cornerY },
              { x: 0, y: cornerY - cp },
            ],
          };
      }
      break;
    }

    case 'scoop': {
      // Generate inverted curve (scoop) points
      const controlPointRatio = 0.552;
      const cp = size * controlPointRatio;

      switch (corner) {
        case 'topLeft':
          return {
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 0 },
            midPoints: [
              { x: cp, y: 0 },
              { x: 0, y: cp },
              { x: size, y: 0 },
              { x: 0, y: size },
            ],
          };
        case 'topRight':
          return {
            startPoint: { x: cornerX, y: 0 },
            endPoint: { x: cornerX, y: 0 },
            midPoints: [
              { x: cornerX - cp, y: 0 },
              { x: cornerX, y: cp },
              { x: cornerX - size, y: 0 },
              { x: cornerX, y: size },
            ],
          };
        case 'bottomRight':
          return {
            startPoint: { x: cornerX, y: cornerY },
            endPoint: { x: cornerX, y: cornerY },
            midPoints: [
              { x: cornerX, y: cornerY - cp },
              { x: cornerX - cp, y: cornerY },
              { x: cornerX, y: cornerY - size },
              { x: cornerX - size, y: cornerY },
            ],
          };
        case 'bottomLeft':
          return {
            startPoint: { x: 0, y: cornerY },
            endPoint: { x: 0, y: cornerY },
            midPoints: [
              { x: cp, y: cornerY },
              { x: 0, y: cornerY - cp },
              { x: size, y: cornerY },
              { x: 0, y: cornerY - size },
            ],
          };
      }
      break;
    }
  }

  // Fallback
  return {
    startPoint: { x: cornerX, y: cornerY },
    endPoint: { x: cornerX, y: cornerY },
    midPoints: [],
  };
}

/**
 * Generate augmentation points for edge positions
 */
function generateEdgeAugmentation(
  type: AugmentationType,
  size: number,
  centerX: number,
  centerY: number,
  orientation: 'horizontal' | 'vertical'
): {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  midPoints: { x: number; y: number }[];
} {
  const halfSize = size / 2;

  // Determine which edge we're on based on position
  const isTopEdge = centerY === 0;
  const isBottomEdge = centerY > 0 && orientation === 'horizontal';
  const isLeftEdge = centerX === 0;
  const isRightEdge = centerX > 0 && orientation === 'vertical';

  switch (type) {
    case 'clip': {
      if (orientation === 'horizontal') {
        if (isTopEdge) {
          // Top edge: go down from the edge
          return {
            startPoint: { x: centerX - halfSize, y: centerY },
            endPoint: { x: centerX + halfSize, y: centerY },
            midPoints: [{ x: centerX, y: centerY + size }],
          };
        } else {
          // Bottom edge: go up from the edge
          return {
            startPoint: { x: centerX - halfSize, y: centerY },
            endPoint: { x: centerX + halfSize, y: centerY }, // Note: reversed for bottom
            midPoints: [{ x: centerX, y: centerY - size }],
          };
        }
      } else {
        if (isLeftEdge) {
          // Left edge: go right from the edge
          return {
            startPoint: { x: centerX, y: centerY - halfSize },
            endPoint: { x: centerX, y: centerY + halfSize }, // Note: reversed for left
            midPoints: [{ x: centerX + size, y: centerY }],
          };
        } else {
          // Right edge: go left from the edge
          return {
            startPoint: { x: centerX, y: centerY - halfSize },
            endPoint: { x: centerX, y: centerY + halfSize },
            midPoints: [{ x: centerX - size, y: centerY }],
          };
        }
      }
    }

    case 'step': {
      if (orientation === 'horizontal') {
        if (isTopEdge) {
          const stepDirection = size; // Down for top
          return {
            startPoint: { x: centerX - halfSize, y: centerY },
            endPoint: { x: centerX + halfSize, y: centerY },
            midPoints: [
              { x: centerX - halfSize, y: centerY + stepDirection },
              { x: centerX + halfSize, y: centerY + stepDirection },
            ],
          };
        } else {
          const stepDirection = -size; // Up for bottom
          return {
            startPoint: { x: centerX + halfSize, y: centerY },
            endPoint: { x: centerX - halfSize, y: centerY },
            midPoints: [
              { x: centerX + halfSize, y: centerY + stepDirection },
              { x: centerX - halfSize, y: centerY + stepDirection },
            ],
          };
        }
      } else {
        if (isLeftEdge) {
          const stepDirection = size; // Right for left
          return {
            startPoint: { x: centerX, y: centerY + halfSize },
            endPoint: { x: centerX, y: centerY - halfSize },
            midPoints: [
              { x: centerX + stepDirection, y: centerY + halfSize },
              { x: centerX + stepDirection, y: centerY - halfSize },
            ],
          };
        } else {
          const stepDirection = -size; // Left for right
          return {
            startPoint: { x: centerX, y: centerY - halfSize },
            endPoint: { x: centerX, y: centerY + halfSize },
            midPoints: [
              { x: centerX + stepDirection, y: centerY - halfSize },
              { x: centerX + stepDirection, y: centerY + halfSize },
            ],
          };
        }
      }
    }

    case 'rect': {
      if (orientation === 'horizontal') {
        if (isTopEdge) {
          const stepDirection = size;
          return {
            startPoint: { x: centerX - halfSize, y: centerY },
            endPoint: { x: centerX + halfSize, y: centerY },
            midPoints: [
              { x: centerX - halfSize, y: centerY + stepDirection },
              { x: centerX + halfSize, y: centerY + stepDirection },
            ],
          };
        } else {
          const stepDirection = -size;
          return {
            startPoint: { x: centerX + halfSize, y: centerY },
            endPoint: { x: centerX - halfSize, y: centerY },
            midPoints: [
              { x: centerX + halfSize, y: centerY + stepDirection },
              { x: centerX - halfSize, y: centerY + stepDirection },
            ],
          };
        }
      } else {
        if (isLeftEdge) {
          const stepDirection = size;
          return {
            startPoint: { x: centerX, y: centerY + halfSize },
            endPoint: { x: centerX, y: centerY - halfSize },
            midPoints: [
              { x: centerX + stepDirection, y: centerY + halfSize },
              { x: centerX + stepDirection, y: centerY - halfSize },
            ],
          };
        } else {
          const stepDirection = -size;
          return {
            startPoint: { x: centerX, y: centerY - halfSize },
            endPoint: { x: centerX, y: centerY + halfSize },
            midPoints: [
              { x: centerX + stepDirection, y: centerY - halfSize },
              { x: centerX + stepDirection, y: centerY + halfSize },
            ],
          };
        }
      }
    }

    case 'round': {
      const controlPointRatio = 0.552;
      const cp = size * controlPointRatio;

      if (orientation === 'horizontal') {
        if (isTopEdge) {
          const curveDirection = size;
          return {
            startPoint: { x: centerX - halfSize, y: centerY },
            endPoint: { x: centerX + halfSize, y: centerY },
            midPoints: [
              { x: centerX - halfSize, y: centerY + cp },
              { x: centerX + halfSize, y: centerY + cp },
            ],
          };
        } else {
          const curveDirection = -size;
          return {
            startPoint: { x: centerX + halfSize, y: centerY },
            endPoint: { x: centerX - halfSize, y: centerY },
            midPoints: [
              {
                x: centerX + halfSize,
                y: centerY + cp * Math.sign(curveDirection),
              },
              {
                x: centerX - halfSize,
                y: centerY + cp * Math.sign(curveDirection),
              },
            ],
          };
        }
      } else {
        if (isLeftEdge) {
          const curveDirection = size;
          return {
            startPoint: { x: centerX, y: centerY + halfSize },
            endPoint: { x: centerX, y: centerY - halfSize },
            midPoints: [
              { x: centerX + cp, y: centerY + halfSize },
              { x: centerX + cp, y: centerY - halfSize },
            ],
          };
        } else {
          const curveDirection = -size;
          return {
            startPoint: { x: centerX, y: centerY - halfSize },
            endPoint: { x: centerX, y: centerY + halfSize },
            midPoints: [
              {
                x: centerX + cp * Math.sign(curveDirection),
                y: centerY - halfSize,
              },
              {
                x: centerX + cp * Math.sign(curveDirection),
                y: centerY + halfSize,
              },
            ],
          };
        }
      }
    }

    case 'scoop': {
      const controlPointRatio = 0.552;
      const cp = size * controlPointRatio;

      if (orientation === 'horizontal') {
        if (isTopEdge) {
          // Scoop curves inward (opposite of round)
          const curveDirection = -size;
          return {
            startPoint: { x: centerX - halfSize, y: centerY },
            endPoint: { x: centerX + halfSize, y: centerY },
            midPoints: [
              {
                x: centerX - halfSize,
                y: centerY + cp * Math.sign(curveDirection),
              },
              {
                x: centerX + halfSize,
                y: centerY + cp * Math.sign(curveDirection),
              },
            ],
          };
        } else {
          const curveDirection = size;
          return {
            startPoint: { x: centerX + halfSize, y: centerY },
            endPoint: { x: centerX - halfSize, y: centerY },
            midPoints: [
              {
                x: centerX + halfSize,
                y: centerY + cp * Math.sign(curveDirection),
              },
              {
                x: centerX - halfSize,
                y: centerY + cp * Math.sign(curveDirection),
              },
            ],
          };
        }
      } else {
        if (isLeftEdge) {
          const curveDirection = -size;
          return {
            startPoint: { x: centerX, y: centerY + halfSize },
            endPoint: { x: centerX, y: centerY - halfSize },
            midPoints: [
              {
                x: centerX + cp * Math.sign(curveDirection),
                y: centerY + halfSize,
              },
              {
                x: centerX + cp * Math.sign(curveDirection),
                y: centerY - halfSize,
              },
            ],
          };
        } else {
          const curveDirection = size;
          return {
            startPoint: { x: centerX, y: centerY - halfSize },
            endPoint: { x: centerX, y: centerY + halfSize },
            midPoints: [
              {
                x: centerX + cp * Math.sign(curveDirection),
                y: centerY - halfSize,
              },
              {
                x: centerX + cp * Math.sign(curveDirection),
                y: centerY + halfSize,
              },
            ],
          };
        }
      }
    }
  }

  // Fallback
  return {
    startPoint: { x: centerX, y: centerY },
    endPoint: { x: centerX, y: centerY },
    midPoints: [],
  };
}

/**
 * Generate SVG path string from augmented shape configuration
 */
export const generateAugmentedShapePath = (
  width: number,
  height: number,
  config: NewShapeConfig
): string => {
  const pathCommands: string[] = [];

  // Resolve all augmentations
  const augmentations = {
    topLeft: resolveAugmentation(config.topLeft),
    top: resolveAugmentation(config.top),
    topRight: resolveAugmentation(config.topRight),
    right: resolveAugmentation(config.right),
    bottomRight: resolveAugmentation(config.bottomRight),
    bottom: resolveAugmentation(config.bottom),
    bottomLeft: resolveAugmentation(config.bottomLeft),
    left: resolveAugmentation(config.left),
  };

  // Start from the appropriate starting point
  let startX = 0;
  let startY = 0;

  // Adjust starting point if top-left has augmentation
  if (augmentations.topLeft) {
    const points = generateAugmentationPoints(
      augmentations.topLeft,
      'topLeft',
      width,
      height
    );
    startX = points.startPoint.x;
    startY = points.startPoint.y;
  }

  pathCommands.push(`M ${startX} ${startY}`);

  // Generate each edge with proper flow

  // 1. Top-left corner augmentation
  if (augmentations.topLeft) {
    const points = generateAugmentationPoints(
      augmentations.topLeft,
      'topLeft',
      width,
      height
    );
    addAugmentationToPath(pathCommands, points, augmentations.topLeft.type);
  }

  // 2. Top edge - from end of top-left to start of top augmentation or start of top-right
  let topStartX = augmentations.topLeft
    ? generateAugmentationPoints(
        augmentations.topLeft,
        'topLeft',
        width,
        height
      ).endPoint.x
    : 0;

  if (augmentations.top) {
    // Go to start of top augmentation
    const topPoints = generateAugmentationPoints(
      augmentations.top,
      'top',
      width,
      height
    );
    pathCommands.push(`L ${topPoints.startPoint.x} ${topPoints.startPoint.y}`);
    addAugmentationToPath(pathCommands, topPoints, augmentations.top.type);
    // Continue from end of top augmentation
    topStartX = topPoints.endPoint.x;
  }

  // Continue top edge to top-right corner
  const topRightStartX = augmentations.topRight
    ? generateAugmentationPoints(
        augmentations.topRight,
        'topRight',
        width,
        height
      ).startPoint.x
    : width;

  if (topStartX < topRightStartX) {
    pathCommands.push(`L ${topRightStartX} 0`);
  }

  // 3. Top-right corner augmentation
  if (augmentations.topRight) {
    const points = generateAugmentationPoints(
      augmentations.topRight,
      'topRight',
      width,
      height
    );
    addAugmentationToPath(pathCommands, points, augmentations.topRight.type);
  }

  // 4. Right edge
  let rightStartY = augmentations.topRight
    ? generateAugmentationPoints(
        augmentations.topRight,
        'topRight',
        width,
        height
      ).endPoint.y
    : 0;

  if (augmentations.right) {
    const rightPoints = generateAugmentationPoints(
      augmentations.right,
      'right',
      width,
      height
    );
    pathCommands.push(
      `L ${rightPoints.startPoint.x} ${rightPoints.startPoint.y}`
    );
    addAugmentationToPath(pathCommands, rightPoints, augmentations.right.type);
    rightStartY = rightPoints.endPoint.y;
  }

  const bottomRightStartY = augmentations.bottomRight
    ? generateAugmentationPoints(
        augmentations.bottomRight,
        'bottomRight',
        width,
        height
      ).startPoint.y
    : height;

  if (rightStartY < bottomRightStartY) {
    pathCommands.push(`L ${width} ${bottomRightStartY}`);
  }

  // 5. Bottom-right corner augmentation
  if (augmentations.bottomRight) {
    const points = generateAugmentationPoints(
      augmentations.bottomRight,
      'bottomRight',
      width,
      height
    );
    addAugmentationToPath(pathCommands, points, augmentations.bottomRight.type);
  }

  // 6. Bottom edge (moving right to left)
  let bottomStartX = augmentations.bottomRight
    ? generateAugmentationPoints(
        augmentations.bottomRight,
        'bottomRight',
        width,
        height
      ).endPoint.x
    : width;

  if (augmentations.bottom) {
    const bottomPoints = generateAugmentationPoints(
      augmentations.bottom,
      'bottom',
      width,
      height
    );
    // For bottom edge, we need to go to the END point first (since we're moving right to left)
    pathCommands.push(
      `L ${bottomPoints.endPoint.x} ${bottomPoints.endPoint.y}`
    );
    // Then add the augmentation in reverse
    addAugmentationToPathReverse(
      pathCommands,
      bottomPoints,
      augmentations.bottom.type
    );
    bottomStartX = bottomPoints.startPoint.x;
  }

  const bottomLeftStartX = augmentations.bottomLeft
    ? generateAugmentationPoints(
        augmentations.bottomLeft,
        'bottomLeft',
        width,
        height
      ).startPoint.x
    : 0;

  if (bottomStartX > bottomLeftStartX) {
    pathCommands.push(`L ${bottomLeftStartX} ${height}`);
  }

  // 7. Bottom-left corner augmentation
  if (augmentations.bottomLeft) {
    const points = generateAugmentationPoints(
      augmentations.bottomLeft,
      'bottomLeft',
      width,
      height
    );
    addAugmentationToPath(pathCommands, points, augmentations.bottomLeft.type);
  }

  // 8. Left edge (moving bottom to top)
  let leftStartY = augmentations.bottomLeft
    ? generateAugmentationPoints(
        augmentations.bottomLeft,
        'bottomLeft',
        width,
        height
      ).endPoint.y
    : height;

  if (augmentations.left) {
    const leftPoints = generateAugmentationPoints(
      augmentations.left,
      'left',
      width,
      height
    );
    // For left edge, we need to go to the END point first (since we're moving bottom to top)
    pathCommands.push(`L ${leftPoints.endPoint.x} ${leftPoints.endPoint.y}`);
    // Then add the augmentation in reverse
    addAugmentationToPathReverse(
      pathCommands,
      leftPoints,
      augmentations.left.type
    );
    leftStartY = leftPoints.startPoint.y;
  }

  // Close the path back to start
  const topLeftEndY = augmentations.topLeft
    ? generateAugmentationPoints(
        augmentations.topLeft,
        'topLeft',
        width,
        height
      ).startPoint.y
    : 0;

  if (leftStartY > topLeftEndY) {
    pathCommands.push(`L 0 ${topLeftEndY}`);
  }

  pathCommands.push('Z');
  return pathCommands.join(' ');
};

/**
 * Helper function to add augmentation points to path
 */
function addAugmentationToPath(
  pathCommands: string[],
  points: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    midPoints: { x: number; y: number }[];
  },
  type: AugmentationType
): void {
  if (type === 'round' || type === 'scoop') {
    // Use cubic bezier curves for rounded corners
    if (points.midPoints.length >= 2) {
      pathCommands.push(
        `C ${points.midPoints[0].x} ${points.midPoints[0].y} ${points.midPoints[1].x} ${points.midPoints[1].y} ${points.endPoint.x} ${points.endPoint.y}`
      );
    } else {
      pathCommands.push(`L ${points.endPoint.x} ${points.endPoint.y}`);
    }
  } else {
    // Handle other types with line segments
    for (const midPoint of points.midPoints) {
      pathCommands.push(`L ${midPoint.x} ${midPoint.y}`);
    }
    pathCommands.push(`L ${points.endPoint.x} ${points.endPoint.y}`);
  }
}

/**
 * Helper function to add augmentation points to path in reverse order
 * Used for bottom and left edges where we traverse in opposite direction
 */
function addAugmentationToPathReverse(
  pathCommands: string[],
  points: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    midPoints: { x: number; y: number }[];
  },
  type: AugmentationType
): void {
  if (type === 'round' || type === 'scoop') {
    // Use cubic bezier curves for rounded corners (reverse control points)
    if (points.midPoints.length >= 2) {
      pathCommands.push(
        `C ${points.midPoints[1].x} ${points.midPoints[1].y} ${points.midPoints[0].x} ${points.midPoints[0].y} ${points.startPoint.x} ${points.startPoint.y}`
      );
    } else {
      pathCommands.push(`L ${points.startPoint.x} ${points.startPoint.y}`);
    }
  } else {
    // Handle other types with line segments in reverse order
    for (let i = points.midPoints.length - 1; i >= 0; i--) {
      pathCommands.push(`L ${points.midPoints[i].x} ${points.midPoints[i].y}`);
    }
    pathCommands.push(`L ${points.startPoint.x} ${points.startPoint.y}`);
  }
}

/**
 * Convert SVG path to line elements (keeping your existing function)
 */
export interface LineElement {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
}

export const convertPathToLines = (pathString: string): LineElement[] => {
  const lines: LineElement[] = [];

  if (!pathString || pathString.trim() === '') {
    return lines;
  }

  // Parse the path string to extract coordinates
  const pathCommands = pathString.trim().split(/(?=[MLCZ])/);

  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let lineIndex = 0;

  for (const command of pathCommands) {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) continue;

    const type = trimmedCommand[0];
    const coords = trimmedCommand.slice(1).trim();

    switch (type) {
      case 'M': {
        const [x, y] = coords.split(/\s+/).map(Number);
        currentX = x;
        currentY = y;
        startX = x;
        startY = y;
        break;
      }

      case 'L': {
        const [x, y] = coords.split(/\s+/).map(Number);
        lines.push({
          x1: currentX,
          y1: currentY,
          x2: x,
          y2: y,
          key: `line-${lineIndex++}`,
        });
        currentX = x;
        currentY = y;
        break;
      }

      case 'C': {
        // For cubic bezier curves, approximate with multiple line segments
        const values = coords.split(/\s+/).map(Number);
        if (values.length >= 6) {
          const [cp1x, cp1y, cp2x, cp2y, x, y] = values;

          // Simple approximation: create a few line segments
          const segments = 8;
          for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const bezierX =
              Math.pow(1 - t, 3) * currentX +
              3 * Math.pow(1 - t, 2) * t * cp1x +
              3 * (1 - t) * Math.pow(t, 2) * cp2x +
              Math.pow(t, 3) * x;
            const bezierY =
              Math.pow(1 - t, 3) * currentY +
              3 * Math.pow(1 - t, 2) * t * cp1y +
              3 * (1 - t) * Math.pow(t, 2) * cp2y +
              Math.pow(t, 3) * y;

            lines.push({
              x1: currentX,
              y1: currentY,
              x2: bezierX,
              y2: bezierY,
              key: `line-${lineIndex++}`,
            });

            currentX = bezierX;
            currentY = bezierY;
          }
        }
        break;
      }

      case 'Z': {
        if (currentX !== startX || currentY !== startY) {
          lines.push({
            x1: currentX,
            y1: currentY,
            x2: startX,
            y2: startY,
            key: `line-${lineIndex++}`,
          });
        }
        break;
      }
    }
  }

  return lines;
};
