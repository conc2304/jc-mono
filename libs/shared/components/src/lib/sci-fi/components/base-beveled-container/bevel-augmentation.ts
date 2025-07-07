import {
  CornersConfig,
  CornerBevel,
  StepConfig,
  EdgeStepConfig,
  ShadowTarget,
  StateStyles,
  ElementStyleConfig,
} from '../../types';

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
  // const edgeAngle = 0;
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

// Helper function to generate fill path
export const generateFillPath = (
  width: number,
  height: number,
  bevelConfig: CornersConfig,
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
  bevelConfig: CornersConfig;
  stepsConfig: StepConfig;
  strokeWidth: number;
}): {
  padding: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
} => {
  const strokePadding = Math.ceil(strokeWidth / 2) + 1;

  const paddingTop =
    Math.max(
      (bevelConfig?.topLeft?.bevelSize || 0) / 2,
      (bevelConfig?.topRight?.bevelSize || 0) / 2,
      stepsConfig.top?.segments?.reduce(
        (max, curr) => Math.max(max, curr.height),
        -Infinity
      ) || 0
    ) + strokePadding;

  const paddingRight =
    Math.max(
      (bevelConfig?.topRight?.bevelSize || 0) / 2,
      (bevelConfig?.bottomRight?.bevelSize || 0) / 2,
      stepsConfig.right?.segments?.reduce(
        (max, curr) => Math.max(max, curr.height),
        -Infinity
      ) || 0
    ) + strokePadding;

  const paddingBottom =
    Math.max(
      (bevelConfig?.bottomRight?.bevelSize || 0) / 2,
      (bevelConfig?.bottomLeft?.bevelSize || 0) / 2,
      stepsConfig.bottom?.segments?.reduce(
        (max, curr) => Math.max(max, curr.height),
        -Infinity
      ) || 0
    ) + strokeWidth;

  const paddingLeft =
    Math.max(
      (bevelConfig?.topLeft?.bevelSize || 0) / 2,
      (bevelConfig?.bottomLeft?.bevelSize || 0) / 2,
      stepsConfig.bottom?.segments?.reduce(
        (max, curr) => Math.max(max, curr.height),
        -Infinity
      ) || 0
    ) + strokePadding;

  const padding =
    Math.max(paddingTop, paddingRight, paddingBottom, paddingLeft) +
    strokePadding * 2;

  return { padding, paddingTop, paddingRight, paddingBottom, paddingLeft };
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

export const calculateDynamicShadow = (
  elementRect: DOMRect,
  maxShadowDistance = 20,
  target: ShadowTarget = 'viewportCenter'
) => {
  let targetX = 0;
  let targetY = 0;

  if (target === 'viewportCenter') {
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
  } else if ('x' in target && 'y' in target) {
    targetX = target.x;
    targetY = target.y;
  } else if ('element' in target) {
    const rect = target.element.getBoundingClientRect();
    targetX = rect.x + rect.width / 2;
    targetY = rect.y + rect.height / 2;
  } else if ('percentX' in target && 'percentY' in target) {
    targetX = window.innerWidth * target.percentX;
    targetY = window.innerHeight * target.percentY;
  }

  const elementCenterX = elementRect.x + elementRect.width / 2;
  const elementCenterY = elementRect.y + elementRect.height / 2;

  const deltaX = elementCenterX - targetX;
  const deltaY = elementCenterY - targetY;

  const normalizedX = deltaX / (window.innerWidth / 2);
  const normalizedY = deltaY / (window.innerHeight / 2);

  const shadowX = normalizedX * maxShadowDistance;
  const shadowY = normalizedY * maxShadowDistance;

  return {
    x: Math.round(shadowX),
    y: Math.round(shadowY),
  };
};

export const generateShapePath = (
  width: number,
  height: number,
  bevelConfig: CornersConfig,
  stepConfig?: StepConfig
): string => {
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
  const defaultBevel = {
    bevelSize: 0,
    bevelAngle: 45,
  };

  const tlBevel: CornerBevel = bevelConfig.topLeft || defaultBevel;
  const trBevel: CornerBevel = bevelConfig.topRight || defaultBevel;
  const brBevel: CornerBevel = bevelConfig.bottomRight || defaultBevel;
  const blBevel: CornerBevel = bevelConfig.bottomLeft || defaultBevel;

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

  // Calculate step start offsets for each edge
  const topStartOffset = getEdgeStartOffset(
    tlBevel.bevelSize > 0 ? tlOffset.x : 0,
    0,
    trBevel.bevelSize > 0 ? width - trOffset.x : width,
    0,
    stepConfig?.top
  );

  const rightStartOffset = getEdgeStartOffset(
    width,
    trBevel.bevelSize > 0 ? trOffset.y : 0,
    width,
    brBevel.bevelSize > 0 ? height - brOffset.y : height,
    stepConfig?.right
  );

  const bottomStartOffset = getEdgeStartOffset(
    brBevel.bevelSize > 0 ? width - brOffset.x : width,
    height,
    blBevel.bevelSize > 0 ? blOffset.x : 0,
    height,
    stepConfig?.bottom
  );

  const leftStartOffset = getEdgeStartOffset(
    0,
    blBevel.bevelSize > 0 ? height - blOffset.y : height,
    0,
    tlBevel.bevelSize > 0 ? tlOffset.y : 0,
    stepConfig?.left
  );

  // Helper function to extract path coordinates from a path string
  function extractPathCoordinates(
    pathStr: string
  ): Array<{ x: number; y: number }> {
    const coords: Array<{ x: number; y: number }> = [];
    // Match M, L commands followed by coordinates
    const matches = pathStr.match(/[ML]\s*([-\d.]+)\s+([-\d.]+)/g);
    if (matches) {
      matches.forEach((match) => {
        const coordMatch = match.match(/([-\d.]+)\s+([-\d.]+)/);
        if (coordMatch) {
          coords.push({
            x: parseFloat(coordMatch[1]),
            y: parseFloat(coordMatch[2]),
          });
        }
      });
    }
    return coords;
  }

  // Start building the complete path
  const pathCommands: string[] = [];

  // 1. Start at top-left corner (start of left edge or left bevel start)
  const startX = 0 + leftEndOffset.offsetX;
  const startY =
    tlBevel.bevelSize > 0
      ? tlOffset.y + leftEndOffset.offsetY
      : 0 + leftEndOffset.offsetY;
  pathCommands.push(`M ${startX} ${startY}`);

  // 2. Top-left bevel (if exists) - adjust end point for top edge start offset
  if (tlBevel.bevelSize > 0) {
    const bevelEndX =
      tlOffset.x + leftEndOffset.offsetX + topStartOffset.offsetX;
    const bevelEndY = 0 + leftEndOffset.offsetY + topStartOffset.offsetY;
    pathCommands.push(`L ${bevelEndX} ${bevelEndY}`);
  }

  // 3. Top edge (with steps)
  const topStartX =
    tlBevel.bevelSize > 0
      ? tlOffset.x + leftEndOffset.offsetX
      : 0 + leftEndOffset.offsetX;
  const topStartY = 0 + leftEndOffset.offsetY;
  const topEndX = trBevel.bevelSize > 0 ? width - trOffset.x : width;
  const topEndY = 0; // Keep the base edge at Y=0 for proper horizontal steps

  if (topStartX < topEndX) {
    const topResult = generateSteppedEdgePath(
      topStartX,
      topStartY,
      topEndX,
      topEndY,
      stepConfig?.top,
      undefined, // Don't pass bevel target for cleaner step calculation
      undefined
    );

    // Extract coordinates and add them, but adjust final coordinate for bevel connection
    const coords = extractPathCoordinates(topResult.path);
    for (let i = 1; i < coords.length; i++) {
      // Skip first coordinate (M command)
      if (i === coords.length - 1) {
        // Last coordinate should connect to the top-right bevel or adjusted end point
        const finalX =
          trBevel.bevelSize > 0
            ? width -
              trOffset.x +
              topEndOffset.offsetX +
              rightStartOffset.offsetX
            : width + topEndOffset.offsetX + rightStartOffset.offsetX;
        const finalY = 0 + topEndOffset.offsetY + rightStartOffset.offsetY;
        pathCommands.push(`L ${finalX} ${finalY}`);
      } else {
        pathCommands.push(`L ${coords[i].x} ${coords[i].y}`);
      }
    }
  } else {
    const finalX =
      trBevel.bevelSize > 0
        ? width - trOffset.x + topEndOffset.offsetX + rightStartOffset.offsetX
        : width + topEndOffset.offsetX + rightStartOffset.offsetX;
    const finalY = 0 + topEndOffset.offsetY + rightStartOffset.offsetY;
    pathCommands.push(`L ${finalX} ${finalY}`);
  }

  // 4. Top-right bevel (if exists) - adjust end point for right edge start offset
  if (trBevel.bevelSize > 0) {
    const bevelEndX = width + topEndOffset.offsetX + rightStartOffset.offsetX;
    const bevelEndY =
      trOffset.y + topEndOffset.offsetY + rightStartOffset.offsetY;
    pathCommands.push(`L ${bevelEndX} ${bevelEndY}`);
  }

  // 5. Right edge (with steps)
  const rightStartX = width + topEndOffset.offsetX;
  const rightStartY =
    trBevel.bevelSize > 0
      ? trOffset.y + topEndOffset.offsetY
      : 0 + topEndOffset.offsetY;
  const rightEndX = width;
  const rightEndY = brBevel.bevelSize > 0 ? height - brOffset.y : height;

  if (rightStartY < rightEndY) {
    const rightResult = generateSteppedEdgePath(
      rightStartX,
      rightStartY,
      rightEndX,
      rightEndY,
      stepConfig?.right,
      undefined,
      undefined
    );

    const coords = extractPathCoordinates(rightResult.path);
    for (let i = 1; i < coords.length; i++) {
      if (i === coords.length - 1) {
        // Last coordinate should connect to the bottom-right bevel or adjusted end point
        const finalX =
          width + rightEndOffset.offsetX + bottomStartOffset.offsetX;
        const finalY =
          brBevel.bevelSize > 0
            ? height -
              brOffset.y +
              rightEndOffset.offsetY +
              bottomStartOffset.offsetY
            : height + rightEndOffset.offsetY + bottomStartOffset.offsetY;
        pathCommands.push(`L ${finalX} ${finalY}`);
      } else {
        pathCommands.push(`L ${coords[i].x} ${coords[i].y}`);
      }
    }
  } else {
    const finalX = width + rightEndOffset.offsetX + bottomStartOffset.offsetX;
    const finalY =
      brBevel.bevelSize > 0
        ? height -
          brOffset.y +
          rightEndOffset.offsetY +
          bottomStartOffset.offsetY
        : height + rightEndOffset.offsetY + bottomStartOffset.offsetY;
    pathCommands.push(`L ${finalX} ${finalY}`);
  }

  // 6. Bottom-right bevel (if exists) - adjust end point for bottom edge start offset
  if (brBevel.bevelSize > 0) {
    const bevelEndX =
      width - brOffset.x + rightEndOffset.offsetX + bottomStartOffset.offsetX;
    const bevelEndY =
      height + rightEndOffset.offsetY + bottomStartOffset.offsetY;
    pathCommands.push(`L ${bevelEndX} ${bevelEndY}`);
  }

  // 7. Bottom edge (with steps)
  const bottomStartX =
    brBevel.bevelSize > 0
      ? width - brOffset.x + rightEndOffset.offsetX
      : width + rightEndOffset.offsetX;
  const bottomStartY = height + rightEndOffset.offsetY;
  const bottomEndX = blBevel.bevelSize > 0 ? blOffset.x : 0;
  const bottomEndY = height;

  if (bottomStartX > bottomEndX) {
    const bottomResult = generateSteppedEdgePath(
      bottomStartX,
      bottomStartY,
      bottomEndX,
      bottomEndY,
      stepConfig?.bottom,
      undefined,
      undefined
    );

    const coords = extractPathCoordinates(bottomResult.path);
    for (let i = 1; i < coords.length; i++) {
      if (i === coords.length - 1) {
        // Last coordinate should connect to the bottom-left bevel or adjusted end point
        const finalX =
          blBevel.bevelSize > 0
            ? blOffset.x + bottomEndOffset.offsetX + leftStartOffset.offsetX
            : 0 + bottomEndOffset.offsetX + leftStartOffset.offsetX;
        const finalY =
          height + bottomEndOffset.offsetY + leftStartOffset.offsetY;
        pathCommands.push(`L ${finalX} ${finalY}`);
      } else {
        pathCommands.push(`L ${coords[i].x} ${coords[i].y}`);
      }
    }
  } else {
    const finalX =
      blBevel.bevelSize > 0
        ? blOffset.x + bottomEndOffset.offsetX + leftStartOffset.offsetX
        : 0 + bottomEndOffset.offsetX + leftStartOffset.offsetX;
    const finalY = height + bottomEndOffset.offsetY + leftStartOffset.offsetY;
    pathCommands.push(`L ${finalX} ${finalY}`);
  }

  // 8. Bottom-left bevel (if exists) - adjust end point for left edge start offset
  if (blBevel.bevelSize > 0) {
    const bevelEndX = 0 + bottomEndOffset.offsetX + leftStartOffset.offsetX;
    const bevelEndY =
      height - blOffset.y + bottomEndOffset.offsetY + leftStartOffset.offsetY;
    pathCommands.push(`L ${bevelEndX} ${bevelEndY}`);
  }

  // 9. Left edge (with steps) - back to start
  const leftStartX = 0 + bottomEndOffset.offsetX;
  const leftStartY =
    blBevel.bevelSize > 0
      ? height - blOffset.y + bottomEndOffset.offsetY
      : height + bottomEndOffset.offsetY;
  const leftEndX = 0;
  const leftEndY = tlBevel.bevelSize > 0 ? tlOffset.y : 0;

  if (leftStartY > leftEndY) {
    const leftResult = generateSteppedEdgePath(
      leftStartX,
      leftStartY,
      leftEndX,
      leftEndY,
      stepConfig?.left,
      undefined,
      undefined
    );

    const coords = extractPathCoordinates(leftResult.path);
    for (let i = 1; i < coords.length; i++) {
      if (i === coords.length - 1) {
        // Last coordinate should connect back to start point properly
        const finalX = 0 + leftEndOffset.offsetX + topStartOffset.offsetX;
        const finalY =
          tlBevel.bevelSize > 0
            ? tlOffset.y + leftEndOffset.offsetY + topStartOffset.offsetY
            : 0 + leftEndOffset.offsetY + topStartOffset.offsetY;
        pathCommands.push(`L ${finalX} ${finalY}`);
      } else {
        pathCommands.push(`L ${coords[i].x} ${coords[i].y}`);
      }
    }
  } else {
    const finalX = 0 + leftEndOffset.offsetX + topStartOffset.offsetX;
    const finalY =
      tlBevel.bevelSize > 0
        ? tlOffset.y + leftEndOffset.offsetY + topStartOffset.offsetY
        : 0 + leftEndOffset.offsetY + topStartOffset.offsetY;
    pathCommands.push(`L ${finalX} ${finalY}`);
  }

  // 10. Close the path
  pathCommands.push('Z');

  return pathCommands.join(' ');
};

export const getCurrentStateStyles = (
  elementStyles: StateStyles = {},
  isHovered: boolean,
  isActive: boolean,
  disabled: boolean
) => {
  const baseStyles = elementStyles.default || {};

  if (disabled && elementStyles.disabled) {
    return { ...baseStyles, ...elementStyles.disabled };
  }
  if (isActive && elementStyles.active) {
    return { ...baseStyles, ...elementStyles.active };
  }
  if (isHovered && elementStyles.hover) {
    return { ...baseStyles, ...elementStyles.hover };
  }
  return baseStyles;
};

export const processAllStyles = (
  styleConfig: ElementStyleConfig,
  isHovered: boolean,
  isActive: boolean,
  disabled: boolean
) => ({
  rootStyles: getCurrentStateStyles(
    styleConfig.root,
    isHovered,
    isActive,
    disabled
  ),
  backgroundStyles: getCurrentStateStyles(
    styleConfig.background,
    isHovered,
    isActive,
    disabled
  ),
  shadowStyles: getCurrentStateStyles(
    styleConfig.shadow,
    isHovered,
    isActive,
    disabled
  ),
  borderStyles: getCurrentStateStyles(
    styleConfig.border,
    isHovered,
    isActive,
    disabled
  ),
  contentStyles: getCurrentStateStyles(
    styleConfig.content,
    isHovered,
    isActive,
    disabled
  ),
});

/**
 * Extracts the numeric pixel value from a CSS strokeWidth value
 * @param value - The strokeWidth value (string, number, or undefined)
 * @returns The numeric pixel value, defaulting to 0 for invalid inputs
 */
export function getStrokeWidthPixels(
  value: string | number | undefined
): number {
  // Handle undefined/null
  if (value == null) {
    return 0;
  }

  // Handle numeric values (assume pixels)
  if (typeof value === 'number') {
    return Math.max(0, value); // Ensure non-negative
  }

  // Handle string values
  if (typeof value === 'string') {
    const trimmed = value.trim();

    // Handle empty string
    if (!trimmed) {
      return 0;
    }

    // Handle "0" or pure numbers
    const numericValue = parseFloat(trimmed);
    if (!isNaN(numericValue)) {
      // If it's just a number, treat as pixels
      if (trimmed === numericValue.toString()) {
        return Math.max(0, numericValue);
      }

      // Handle units
      if (trimmed.endsWith('px')) {
        return Math.max(0, numericValue);
      }

      // Handle other common CSS units (convert to approximate pixels)
      if (trimmed.endsWith('em')) {
        return Math.max(0, numericValue * 16); // Assuming 1em = 16px
      }

      if (trimmed.endsWith('rem')) {
        return Math.max(0, numericValue * 16); // Assuming 1rem = 16px
      }

      if (trimmed.endsWith('pt')) {
        return Math.max(0, numericValue * 1.333); // 1pt ≈ 1.333px
      }

      if (trimmed.endsWith('%')) {
        // Percentage is context-dependent, but for strokeWidth we'll assume 100% = 1px
        return Math.max(0, numericValue / 100);
      }

      // If we have a number but unrecognized unit, just return the number
      return Math.max(0, numericValue);
    }

    // Handle CSS keywords
    switch (trimmed.toLowerCase()) {
      case 'thin':
        return 1;
      case 'medium':
        return 3;
      case 'thick':
        return 5;
      case 'none':
      case 'hidden':
        return 0;
      default:
        return 0;
    }
  }

  // Fallback for any other type
  return 0;
}
