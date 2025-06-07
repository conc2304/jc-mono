import { Property } from 'csstype';

import { BevelConfig, CornerBevel, StepConfig, EdgeStepConfig } from '../types';

// Helper function to calculate stroke width for angled lines
export const getAdjustedStrokeWidth = (
  angle: number,
  baseStrokeWidth: number
): number => {
  const radians = (angle * Math.PI) / 180;
  return baseStrokeWidth * Math.sin(radians);
};

// Calculate the final height offset at the end of an edge after all steps
const getEdgeEndOffset = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  stepConfig?: EdgeStepConfig
): { offsetX: number; offsetY: number } => {
  if (!stepConfig?.segments || stepConfig.segments.length === 0) {
    return { offsetX: 0, offsetY: 0 };
  }

  const edgeAngle = Math.atan2(endY - startY, endX - startX);
  const normalX = -Math.sin(edgeAngle);
  const normalY = Math.cos(edgeAngle);

  // Find the step that extends to the end (position 1)
  const endStep = stepConfig.segments.find((segment) => segment.end === 1);

  if (!endStep) {
    return { offsetX: 0, offsetY: 0 };
  }

  const stepHeight = Math.abs(endStep.height);
  return {
    offsetX: stepHeight * normalX,
    offsetY: stepHeight * normalY,
  };
};

// Calculate the final height offset at the start of an edge after all steps
const getEdgeStartOffset = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  stepConfig?: EdgeStepConfig
): { offsetX: number; offsetY: number } => {
  if (!stepConfig?.segments || stepConfig.segments.length === 0) {
    return { offsetX: 0, offsetY: 0 };
  }

  const edgeAngle = Math.atan2(endY - startY, endX - startX);
  const normalX = -Math.sin(edgeAngle);
  const normalY = Math.cos(edgeAngle);

  // Find the step that starts at the beginning (position 0)
  const startStep = stepConfig.segments.find((segment) => segment.start === 0);

  if (!startStep) {
    return { offsetX: 0, offsetY: 0 };
  }

  const stepHeight = Math.abs(startStep.height);
  return {
    offsetX: stepHeight * normalX,
    offsetY: stepHeight * normalY,
  };
};

// Generate stepped edge path that maintains end height and connects to bevel
const generateSteppedEdgePath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  stepConfig?: EdgeStepConfig,
  bevelStartX?: number,
  bevelStartY?: number
): { path: string; endOffset: { offsetX: number; offsetY: number } } => {
  const endOffset = getEdgeEndOffset(startX, startY, endX, endY, stepConfig);

  if (!stepConfig?.segments || stepConfig.segments.length === 0) {
    return {
      path: `M ${startX} ${startY} L ${endX} ${endY}`,
      endOffset: { offsetX: 0, offsetY: 0 },
    };
  }

  const points: string[] = [];
  const edgeAngle = Math.atan2(endY - startY, endX - startX);
  const normalX = -Math.sin(edgeAngle);
  const normalY = Math.cos(edgeAngle);
  const edgeDirectionX = Math.cos(edgeAngle);
  const edgeDirectionY = Math.sin(edgeAngle);

  const sortedSegments = [...stepConfig.segments].sort(
    (a, b) => a.start - b.start
  );

  points.push(`M ${startX} ${startY}`);

  let currentPos = 0;
  let currentHeight = 0;

  for (const segment of sortedSegments) {
    const segmentStart = Math.max(0, Math.min(1, segment.start));
    const segmentEnd = Math.max(0, Math.min(1, segment.end));

    if (segmentStart >= segmentEnd) continue;

    // Move to start of segment if there's a gap
    if (currentPos < segmentStart) {
      const gapEndX =
        startX + (endX - startX) * segmentStart + currentHeight * normalX;
      const gapEndY =
        startY + (endY - startY) * segmentStart + currentHeight * normalY;
      points.push(`L ${gapEndX} ${gapEndY}`);
    }

    // Calculate step positions
    const stepStartX =
      startX + (endX - startX) * segmentStart + currentHeight * normalX;
    const stepStartY =
      startY + (endY - startY) * segmentStart + currentHeight * normalY;

    const stepHeight = Math.abs(segment.height);

    // 45-degree ascent
    const ascentEndX =
      stepStartX + stepHeight * edgeDirectionX + stepHeight * normalX;
    const ascentEndY =
      stepStartY + stepHeight * edgeDirectionY + stepHeight * normalY;

    // Add step path
    points.push(`L ${ascentEndX} ${ascentEndY}`); // 45° up

    // If this segment goes to the end (position 1), connect directly to bevel start
    if (
      segmentEnd === 1 &&
      bevelStartX !== undefined &&
      bevelStartY !== undefined
    ) {
      points.push(`L ${bevelStartX} ${bevelStartY}`); // top surface connects to bevel
      currentHeight = stepHeight;
    } else {
      // Normal step behavior - top surface then descent
      const stepEndX = startX + (endX - startX) * segmentEnd;
      const stepEndY = startY + (endY - startY) * segmentEnd;
      const topEndX =
        stepEndX - stepHeight * edgeDirectionX + stepHeight * normalX;
      const topEndY =
        stepEndY - stepHeight * edgeDirectionY + stepHeight * normalY;

      points.push(`L ${topEndX} ${topEndY}`); // top surface

      if (segmentEnd < 1) {
        points.push(`L ${stepEndX} ${stepEndY}`); // 45° down
        currentHeight = 0;
      } else {
        currentHeight = stepHeight;
      }
    }

    currentPos = segmentEnd;
  }

  // Complete the edge if there's remaining distance
  if (currentPos < 1) {
    const finalX = endX + currentHeight * normalX;
    const finalY = endY + currentHeight * normalY;
    points.push(`L ${finalX} ${finalY}`);
  }

  return {
    path: points.join(' '),
    endOffset,
  };
};

// Helper function to generate straight edges path
export const generateStraightEdgesPath = (
  width: number,
  height: number,
  bevelConfig: BevelConfig,
  stepConfig?: StepConfig
): string => {
  const points: string[] = [];

  function getBevelOffset(
    bevelSize: number,
    angle = 45
  ): { x: number; y: number } {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.abs(bevelSize * Math.cos(radians)),
      y: Math.abs(bevelSize * Math.sin(radians)),
    };
  }

  const tlBevel: CornerBevel = bevelConfig.topLeft || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const trBevel: CornerBevel = bevelConfig.topRight || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const brBevel: CornerBevel = bevelConfig.bottomRight || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const blBevel: CornerBevel = bevelConfig.bottomLeft || {
    bevelSize: 0,
    bevelAngle: 45,
  };

  const tlOffset = getBevelOffset(tlBevel.bevelSize, tlBevel.bevelAngle);
  const trOffset = getBevelOffset(trBevel.bevelSize, trBevel.bevelAngle);
  const brOffset = getBevelOffset(brBevel.bevelSize, brBevel.bevelAngle);
  const blOffset = getBevelOffset(blBevel.bevelSize, blBevel.bevelAngle);

  // First, calculate all step end offsets for each edge
  const topEndOffset = getEdgeEndOffset(
    tlBevel.bevelSize > 0 ? tlOffset.x : 0,
    0,
    trBevel.bevelSize > 0 ? width - trOffset.x : width,
    0,
    stepConfig?.top
  );

  const rightEndOffset = getEdgeEndOffset(
    width,
    trBevel.bevelSize > 0 ? trOffset.y : 0,
    width,
    brBevel.bevelSize > 0 ? height - brOffset.y : height,
    stepConfig?.right
  );

  const bottomEndOffset = getEdgeEndOffset(
    brBevel.bevelSize > 0 ? width - brOffset.x : width,
    height,
    blBevel.bevelSize > 0 ? blOffset.x : 0,
    height,
    stepConfig?.bottom
  );

  const leftEndOffset = getEdgeEndOffset(
    0,
    blBevel.bevelSize > 0 ? height - blOffset.y : height,
    0,
    tlBevel.bevelSize > 0 ? tlOffset.y : 0,
    stepConfig?.left
  );

  // Now calculate all bevel start points using the offsets
  const topRightBevelStartX =
    trBevel.bevelSize > 0
      ? width - trOffset.x + topEndOffset.offsetX
      : undefined;
  const topRightBevelStartY =
    trBevel.bevelSize > 0 ? 0 + topEndOffset.offsetY : undefined;

  const rightBevelStartX =
    brBevel.bevelSize > 0 ? width + rightEndOffset.offsetX : undefined;
  const rightBevelStartY =
    brBevel.bevelSize > 0
      ? height - brOffset.y + rightEndOffset.offsetY
      : undefined;

  const bottomBevelStartX =
    blBevel.bevelSize > 0 ? blOffset.x + bottomEndOffset.offsetX : undefined;
  const bottomBevelStartY =
    blBevel.bevelSize > 0 ? height + bottomEndOffset.offsetY : undefined;

  const leftBevelStartX =
    tlBevel.bevelSize > 0 ? 0 + leftEndOffset.offsetX : undefined;
  const leftBevelStartY =
    tlBevel.bevelSize > 0 ? tlOffset.y + leftEndOffset.offsetY : undefined;

  // Now generate all the edge paths with proper bevel connections
  // Top edge
  const topStartX = tlBevel.bevelSize > 0 ? tlOffset.x : 0;
  const topEndX = trBevel.bevelSize > 0 ? width - trOffset.x : width;
  if (topStartX < topEndX) {
    const topResult = generateSteppedEdgePath(
      topStartX,
      0,
      topEndX,
      0,
      stepConfig?.top,
      topRightBevelStartX,
      topRightBevelStartY
    );
    points.push(topResult.path);
  }

  // Right edge
  const rightStartY =
    trBevel.bevelSize > 0 ? trOffset.y + topEndOffset.offsetY : 0;
  const rightEndY = brBevel.bevelSize > 0 ? height - brOffset.y : height;
  if (rightStartY < rightEndY) {
    const rightResult = generateSteppedEdgePath(
      width + topEndOffset.offsetX,
      rightStartY,
      width,
      rightEndY,
      stepConfig?.right,
      rightBevelStartX,
      rightBevelStartY
    );
    points.push(rightResult.path);
  }

  // Bottom edge
  const bottomStartX =
    brBevel.bevelSize > 0 ? width - brOffset.x + rightEndOffset.offsetX : width;
  const bottomEndX = blBevel.bevelSize > 0 ? blOffset.x : 0;
  if (bottomStartX > bottomEndX) {
    const bottomResult = generateSteppedEdgePath(
      bottomStartX,
      height + rightEndOffset.offsetY,
      bottomEndX,
      height,
      stepConfig?.bottom,
      bottomBevelStartX,
      bottomBevelStartY
    );
    points.push(bottomResult.path);
  }

  // Left edge
  const leftStartY =
    blBevel.bevelSize > 0
      ? height - blOffset.y + bottomEndOffset.offsetY
      : height;
  const leftEndY = tlBevel.bevelSize > 0 ? tlOffset.y : 0;
  if (leftStartY > leftEndY) {
    const leftResult = generateSteppedEdgePath(
      0 + bottomEndOffset.offsetX,
      leftStartY,
      0,
      leftEndY,
      stepConfig?.left,
      leftBevelStartX,
      leftBevelStartY
    );
    points.push(leftResult.path);
  }

  return points.join(' ');
};

// Helper function to generate beveled corners path with step adjustments
export const generateBeveledCornersPath = (
  width: number,
  height: number,
  bevelConfig: BevelConfig,
  stepConfig?: StepConfig
): string => {
  const points: string[] = [];

  function getBevelOffset(
    bevelSize: number,
    angle = 45
  ): { x: number; y: number } {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.abs(bevelSize * Math.cos(radians)),
      y: Math.abs(bevelSize * Math.sin(radians)),
    };
  }

  const tlBevel: CornerBevel = bevelConfig.topLeft || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const trBevel: CornerBevel = bevelConfig.topRight || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const brBevel: CornerBevel = bevelConfig.bottomRight || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const blBevel: CornerBevel = bevelConfig.bottomLeft || {
    bevelSize: 0,
    bevelAngle: 45,
  };

  const tlOffset = getBevelOffset(tlBevel.bevelSize, tlBevel.bevelAngle);
  const trOffset = getBevelOffset(trBevel.bevelSize, trBevel.bevelAngle);
  const brOffset = getBevelOffset(brBevel.bevelSize, brBevel.bevelAngle);
  const blOffset = getBevelOffset(blBevel.bevelSize, blBevel.bevelAngle);

  // Calculate step end offsets for each edge
  const topEndOffset = getEdgeEndOffset(
    tlBevel.bevelSize > 0 ? tlOffset.x : 0,
    0,
    trBevel.bevelSize > 0 ? width - trOffset.x : width,
    0,
    stepConfig?.top
  );

  const rightEndOffset = getEdgeEndOffset(
    width,
    trBevel.bevelSize > 0 ? trOffset.y : 0,
    width,
    brBevel.bevelSize > 0 ? height - brOffset.y : height,
    stepConfig?.right
  );

  const bottomEndOffset = getEdgeEndOffset(
    brBevel.bevelSize > 0 ? width - brOffset.x : width,
    height,
    blBevel.bevelSize > 0 ? blOffset.x : 0,
    height,
    stepConfig?.bottom
  );

  const leftEndOffset = getEdgeEndOffset(
    0,
    blBevel.bevelSize > 0 ? height - blOffset.y : height,
    0,
    tlBevel.bevelSize > 0 ? tlOffset.y : 0,
    stepConfig?.left
  );

  // Top-left bevel - adjusted by left edge end offset
  if (tlBevel.bevelSize > 0) {
    const startX = 0 + leftEndOffset.offsetX;
    const startY = tlOffset.y + leftEndOffset.offsetY;
    const endX = tlOffset.x + leftEndOffset.offsetX;
    const endY = 0 + leftEndOffset.offsetY;
    points.push(`M ${startX} ${startY} L ${endX} ${endY}`);
  }

  // Top-right bevel - adjusted by top edge end offset
  if (trBevel.bevelSize > 0) {
    const startX = width - trOffset.x + topEndOffset.offsetX;
    const startY = 0 + topEndOffset.offsetY;
    const endX = width + topEndOffset.offsetX;
    const endY = trOffset.y + topEndOffset.offsetY;
    points.push(`M ${startX} ${startY} L ${endX} ${endY}`);
  }

  // Bottom-right bevel - adjusted by right edge end offset
  if (brBevel.bevelSize > 0) {
    const startX = width + rightEndOffset.offsetX;
    const startY = height - brOffset.y + rightEndOffset.offsetY;
    const endX = width - brOffset.x + rightEndOffset.offsetX;
    const endY = height + rightEndOffset.offsetY;
    points.push(`M ${startX} ${startY} L ${endX} ${endY}`);
  }

  // Bottom-left bevel - adjusted by bottom edge end offset
  if (blBevel.bevelSize > 0) {
    const startX = blOffset.x + bottomEndOffset.offsetX;
    const startY = height + bottomEndOffset.offsetY;
    const endX = 0 + bottomEndOffset.offsetX;
    const endY = height - blOffset.y + bottomEndOffset.offsetY;
    points.push(`M ${startX} ${startY} L ${endX} ${endY}`);
  }

  return points.join(' ');
};

// Function to calculate average bevel angle for stroke adjustment
export const getAverageBevelAngle = (bevelConfig: BevelConfig): number => {
  const angles: number[] = [];

  if (bevelConfig.topLeft?.bevelSize && bevelConfig.topLeft.bevelSize > 0) {
    angles.push(bevelConfig.topLeft.bevelAngle || 45);
  }
  if (bevelConfig.topRight?.bevelSize && bevelConfig.topRight.bevelSize > 0) {
    angles.push(bevelConfig.topRight.bevelAngle || 45);
  }
  if (
    bevelConfig.bottomRight?.bevelSize &&
    bevelConfig.bottomRight.bevelSize > 0
  ) {
    angles.push(bevelConfig.bottomRight.bevelAngle || 45);
  }
  if (
    bevelConfig.bottomLeft?.bevelSize &&
    bevelConfig.bottomLeft.bevelSize > 0
  ) {
    angles.push(bevelConfig.bottomLeft.bevelAngle || 45);
  }

  if (angles.length === 0) return 45;
  return angles.reduce((sum, angle) => sum + angle, 0) / angles.length;
};

// Helper function to generate fill path
export const generateFillPath = (
  width: number,
  height: number,
  bevelConfig: BevelConfig,
  stepConfig?: StepConfig
): string => {
  const points: string[] = [];

  function getBevelOffset(
    bevelSize: number,
    angle = 45
  ): { x: number; y: number } {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.abs(bevelSize * Math.cos(radians)),
      y: Math.abs(bevelSize * Math.sin(radians)),
    };
  }

  const tlBevel: CornerBevel = bevelConfig.topLeft || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const trBevel: CornerBevel = bevelConfig.topRight || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const brBevel: CornerBevel = bevelConfig.bottomRight || {
    bevelSize: 0,
    bevelAngle: 45,
  };
  const blBevel: CornerBevel = bevelConfig.bottomLeft || {
    bevelSize: 0,
    bevelAngle: 45,
  };

  const tlOffset = getBevelOffset(tlBevel.bevelSize, tlBevel.bevelAngle);
  const trOffset = getBevelOffset(trBevel.bevelSize, trBevel.bevelAngle);
  const brOffset = getBevelOffset(brBevel.bevelSize, brBevel.bevelAngle);
  const blOffset = getBevelOffset(blBevel.bevelSize, blBevel.bevelAngle);

  // Calculate all step end offsets first
  const topEndOffset = getEdgeEndOffset(
    tlBevel.bevelSize > 0 ? tlOffset.x : 0,
    0,
    trBevel.bevelSize > 0 ? width - trOffset.x : width,
    0,
    stepConfig?.top
  );

  const rightEndOffset = getEdgeEndOffset(
    width,
    trBevel.bevelSize > 0 ? trOffset.y : 0,
    width,
    brBevel.bevelSize > 0 ? height - brOffset.y : height,
    stepConfig?.right
  );

  const bottomEndOffset = getEdgeEndOffset(
    brBevel.bevelSize > 0 ? width - brOffset.x : width,
    height,
    blBevel.bevelSize > 0 ? blOffset.x : 0,
    height,
    stepConfig?.bottom
  );

  const leftEndOffset = getEdgeEndOffset(
    0,
    blBevel.bevelSize > 0 ? height - blOffset.y : height,
    0,
    tlBevel.bevelSize > 0 ? tlOffset.y : 0,
    stepConfig?.left
  );

  // Calculate all bevel start points using the offsets
  const topRightBevelStartX =
    trBevel.bevelSize > 0
      ? width - trOffset.x + topEndOffset.offsetX
      : undefined;
  const topRightBevelStartY =
    trBevel.bevelSize > 0 ? 0 + topEndOffset.offsetY : undefined;

  const rightBevelStartX =
    brBevel.bevelSize > 0 ? width + rightEndOffset.offsetX : undefined;
  const rightBevelStartY =
    brBevel.bevelSize > 0
      ? height - brOffset.y + rightEndOffset.offsetY
      : undefined;

  const bottomBevelStartX =
    blBevel.bevelSize > 0 ? blOffset.x + bottomEndOffset.offsetX : undefined;
  const bottomBevelStartY =
    blBevel.bevelSize > 0 ? height + bottomEndOffset.offsetY : undefined;

  const leftBevelStartX =
    tlBevel.bevelSize > 0 ? 0 + leftEndOffset.offsetX : undefined;
  const leftBevelStartY =
    tlBevel.bevelSize > 0 ? tlOffset.y + leftEndOffset.offsetY : undefined;

  // Helper function to add stepped edge to fill
  const addSteppedEdgeToFill = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    stepConfig?: EdgeStepConfig,
    bevelStartX?: number,
    bevelStartY?: number
  ): void => {
    if (!stepConfig?.segments || stepConfig.segments.length === 0) {
      points.push(`L ${endX} ${endY}`);
      return;
    }

    const edgeAngle = Math.atan2(endY - startY, endX - startX);
    const normalX = -Math.sin(edgeAngle);
    const normalY = Math.cos(edgeAngle);
    const edgeDirectionX = Math.cos(edgeAngle);
    const edgeDirectionY = Math.sin(edgeAngle);

    const sortedSegments = [...stepConfig.segments].sort(
      (a, b) => a.start - b.start
    );

    let currentPos = 0;
    let currentHeight = 0;

    for (const segment of sortedSegments) {
      const segmentStart = Math.max(0, Math.min(1, segment.start));
      const segmentEnd = Math.max(0, Math.min(1, segment.end));

      if (segmentStart >= segmentEnd) continue;

      // Move to start of segment if there's a gap
      if (currentPos < segmentStart) {
        const gapEndX =
          startX + (endX - startX) * segmentStart + currentHeight * normalX;
        const gapEndY =
          startY + (endY - startY) * segmentStart + currentHeight * normalY;
        points.push(`L ${gapEndX} ${gapEndY}`);
      }

      const stepStartX =
        startX + (endX - startX) * segmentStart + currentHeight * normalX;
      const stepStartY =
        startY + (endY - startY) * segmentStart + currentHeight * normalY;

      const stepHeight = Math.abs(segment.height);

      // 45-degree ascent
      const ascentEndX =
        stepStartX + stepHeight * edgeDirectionX + stepHeight * normalX;
      const ascentEndY =
        stepStartY + stepHeight * edgeDirectionY + stepHeight * normalY;

      points.push(`L ${ascentEndX} ${ascentEndY}`); // 45° up

      // If this segment goes to the end and there's a bevel, connect to bevel
      if (
        segmentEnd === 1 &&
        bevelStartX !== undefined &&
        bevelStartY !== undefined
      ) {
        points.push(`L ${bevelStartX} ${bevelStartY}`); // connect to bevel
        currentHeight = stepHeight;
      } else {
        // Normal step behavior
        const stepEndX = startX + (endX - startX) * segmentEnd;
        const stepEndY = startY + (endY - startY) * segmentEnd;
        const topEndX =
          stepEndX - stepHeight * edgeDirectionX + stepHeight * normalX;
        const topEndY =
          stepEndY - stepHeight * edgeDirectionY + stepHeight * normalY;

        points.push(`L ${topEndX} ${topEndY}`); // top surface

        if (segmentEnd < 1) {
          points.push(`L ${stepEndX} ${stepEndY}`); // 45° down
          currentHeight = 0;
        } else {
          currentHeight = stepHeight;
        }
      }

      currentPos = segmentEnd;
    }

    // Complete the edge if there's remaining distance
    if (currentPos < 1) {
      const finalX = endX + currentHeight * normalX;
      const finalY = endY + currentHeight * normalY;
      points.push(`L ${finalX} ${finalY}`);
    }
  };

  // Start the path
  if (tlBevel.bevelSize > 0) {
    points.push(`M ${tlOffset.x} 0`);
  } else {
    points.push(`M 0 0`);
  }

  // Top edge
  const topStartX = tlBevel.bevelSize > 0 ? tlOffset.x : 0;
  const topEndX = trBevel.bevelSize > 0 ? width - trOffset.x : width;
  addSteppedEdgeToFill(
    topStartX,
    0,
    topEndX,
    0,
    stepConfig?.top,
    topRightBevelStartX,
    topRightBevelStartY
  );

  // Top-right bevel
  if (trBevel.bevelSize > 0) {
    const bevelX = width + topEndOffset.offsetX;
    const bevelY = trOffset.y + topEndOffset.offsetY;
    points.push(`L ${bevelX} ${bevelY}`);
  }

  // Right edge
  const rightStartY =
    trBevel.bevelSize > 0 ? trOffset.y + topEndOffset.offsetY : 0;
  const rightEndY = brBevel.bevelSize > 0 ? height - brOffset.y : height;
  addSteppedEdgeToFill(
    width + topEndOffset.offsetX,
    rightStartY,
    width,
    rightEndY,
    stepConfig?.right,
    rightBevelStartX,
    rightBevelStartY
  );

  // Bottom-right bevel
  if (brBevel.bevelSize > 0) {
    const bevelX = width - brOffset.x + rightEndOffset.offsetX;
    const bevelY = height + rightEndOffset.offsetY;
    points.push(`L ${bevelX} ${bevelY}`);
  }

  // Bottom edge
  const bottomStartX =
    brBevel.bevelSize > 0 ? width - brOffset.x + rightEndOffset.offsetX : width;
  const bottomEndX = blBevel.bevelSize > 0 ? blOffset.x : 0;
  addSteppedEdgeToFill(
    bottomStartX,
    height + rightEndOffset.offsetY,
    bottomEndX,
    height,
    stepConfig?.bottom,
    bottomBevelStartX,
    bottomBevelStartY
  );

  // Bottom-left bevel
  if (blBevel.bevelSize > 0) {
    const bevelX = 0 + bottomEndOffset.offsetX;
    const bevelY = height - blOffset.y + bottomEndOffset.offsetY;
    points.push(`L ${bevelX} ${bevelY}`);
  }

  // Left edge
  const leftStartY =
    blBevel.bevelSize > 0
      ? height - blOffset.y + bottomEndOffset.offsetY
      : height;
  const leftEndY = tlBevel.bevelSize > 0 ? tlOffset.y : 0;
  addSteppedEdgeToFill(
    0 + bottomEndOffset.offsetX,
    leftStartY,
    0,
    leftEndY,
    stepConfig?.left,
    leftBevelStartX,
    leftBevelStartY
  );

  // Close path
  points.push('Z');
  return points.join(' ');
};

export const getMinPadding = ({
  bevelConfig,
  stepsConfig,
  strokeWidth = 0,
}: {
  bevelConfig: BevelConfig;
  stepsConfig: StepConfig;
  strokeWidth: number;
}): number => {
  const paddingTop = Math.max(
    (bevelConfig?.topLeft?.bevelSize || 0) / 2,
    (bevelConfig?.topRight?.bevelSize || 0) / 2,
    stepsConfig.top?.segments?.reduce(
      (max, curr) => Math.max(max, curr.height),
      -Infinity
    ) || 0
  );

  const paddingRight = Math.max(
    (bevelConfig?.topRight?.bevelSize || 0) / 2,
    (bevelConfig?.bottomRight?.bevelSize || 0) / 2,
    stepsConfig.right?.segments?.reduce(
      (max, curr) => Math.max(max, curr.height),
      -Infinity
    ) || 0
  );

  const paddingBottom = Math.max(
    (bevelConfig?.bottomRight?.bevelSize || 0) / 2,
    (bevelConfig?.bottomLeft?.bevelSize || 0) / 2,
    stepsConfig.bottom?.segments?.reduce(
      (max, curr) => Math.max(max, curr.height),
      -Infinity
    ) || 0
  );

  const paddingLeft = Math.max(
    (bevelConfig?.topLeft?.bevelSize || 0) / 2,
    (bevelConfig?.bottomLeft?.bevelSize || 0) / 2,
    stepsConfig.bottom?.segments?.reduce(
      (max, curr) => Math.max(max, curr.height),
      -Infinity
    ) || 0
  );

  const padding =
    Math.max(paddingTop, paddingRight, paddingBottom, paddingLeft) +
    strokeWidth * 2;

  return padding;
};

// Calculate extra space needed for steps
export const getStepBounds = (
  stepsConfig: StepConfig
): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} => {
  const bounds = { top: 0, right: 0, bottom: 0, left: 0 };

  // Check each edge for maximum step height
  if (stepsConfig.top?.segments) {
    bounds.top = Math.max(0, ...stepsConfig.top.segments.map((s) => s.height));
  }
  if (stepsConfig.right?.segments) {
    bounds.right = Math.max(
      0,
      ...stepsConfig.right.segments.map((s) => s.height)
    );
  }
  if (stepsConfig.bottom?.segments) {
    bounds.bottom = Math.max(
      0,
      ...stepsConfig.bottom.segments.map((s) => s.height)
    );
  }
  if (stepsConfig.left?.segments) {
    bounds.left = Math.max(
      0,
      ...stepsConfig.left.segments.map((s) => s.height)
    );
  }

  return bounds;
};
