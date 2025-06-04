import { BevelConfig, CornerBevel } from '../types';


// Helper function to calculate stroke width for angled lines
export const getAdjustedStrokeWidth = (angle: number, baseStrokeWidth: number): number => {
  const radians = (angle * Math.PI) / 180;
  return baseStrokeWidth * Math.sin(radians);
}

// Helper function to generate straight edges path
export const generateStraightEdgesPath = (
  width: number,
  height: number,
  bevelConfig: BevelConfig
): string => {
  const points: string[] = [];

  function getBevelOffset(bevelSize: number, angle = 45): { x: number; y: number } {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.abs(bevelSize * Math.cos(radians)),
      y: Math.abs(bevelSize * Math.sin(radians))
    };
  }

  const tlBevel: CornerBevel = bevelConfig.tl || { bevelSize: 0, bevelAngle: 45 };
  const trBevel: CornerBevel = bevelConfig.tr || { bevelSize: 0, bevelAngle: 45 };
  const brBevel: CornerBevel = bevelConfig.br || { bevelSize: 0, bevelAngle: 45 };
  const blBevel: CornerBevel = bevelConfig.bl || { bevelSize: 0, bevelAngle: 45 };

  const tlOffset = getBevelOffset(tlBevel.bevelSize, tlBevel.bevelAngle);
  const trOffset = getBevelOffset(trBevel.bevelSize, trBevel.bevelAngle);
  const brOffset = getBevelOffset(brBevel.bevelSize, brBevel.bevelAngle);
  const blOffset = getBevelOffset(blBevel.bevelSize, blBevel.bevelAngle);

  // Top edge
  if (tlBevel.bevelSize > 0 && trBevel.bevelSize > 0) {
    points.push(`M ${tlOffset.x} 0 L ${width - trOffset.x} 0`);
  } else if (tlBevel.bevelSize > 0) {
    points.push(`M ${tlOffset.x} 0 L ${width} 0`);
  } else if (trBevel.bevelSize > 0) {
    points.push(`M 0 0 L ${width - trOffset.x} 0`);
  } else {
    points.push(`M 0 0 L ${width} 0`);
  }

  // Right edge
  if (trBevel.bevelSize > 0 && brBevel.bevelSize > 0) {
    points.push(`M ${width} ${trOffset.y} L ${width} ${height - brOffset.y}`);
  } else if (trBevel.bevelSize > 0) {
    points.push(`M ${width} ${trOffset.y} L ${width} ${height}`);
  } else if (brBevel.bevelSize > 0) {
    points.push(`M ${width} 0 L ${width} ${height - brOffset.y}`);
  } else {
    points.push(`M ${width} 0 L ${width} ${height}`);
  }

  // Bottom edge
  if (brBevel.bevelSize > 0 && blBevel.bevelSize > 0) {
    points.push(`M ${width - brOffset.x} ${height} L ${blOffset.x} ${height}`);
  } else if (brBevel.bevelSize > 0) {
    points.push(`M ${width - brOffset.x} ${height} L 0 ${height}`);
  } else if (blBevel.bevelSize > 0) {
    points.push(`M ${width} ${height} L ${blOffset.x} ${height}`);
  } else {
    points.push(`M ${width} ${height} L 0 ${height}`);
  }

  // Left edge
  if (blBevel.bevelSize > 0 && tlBevel.bevelSize > 0) {
    points.push(`M 0 ${height - blOffset.y} L 0 ${tlOffset.y}`);
  } else if (blBevel.bevelSize > 0) {
    points.push(`M 0 ${height - blOffset.y} L 0 0`);
  } else if (tlBevel.bevelSize > 0) {
    points.push(`M 0 ${height} L 0 ${tlOffset.y}`);
  } else {
    points.push(`M 0 ${height} L 0 0`);
  }

  return points.join(' ');
}

// Helper function to generate beveled corners path
export const generateBeveledCornersPath = (
  width: number,
  height: number,
  bevelConfig: BevelConfig
): string => {
  const points: string[] = [];

  function getBevelOffset(bevelSize: number, angle = 45): { x: number; y: number } {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.abs(bevelSize * Math.cos(radians)),
      y: Math.abs(bevelSize * Math.sin(radians))
    };
  }

  const tlBevel: CornerBevel = bevelConfig.tl || { bevelSize: 0, bevelAngle: 45 };
  const trBevel: CornerBevel = bevelConfig.tr || { bevelSize: 0, bevelAngle: 45 };
  const brBevel: CornerBevel = bevelConfig.br || { bevelSize: 0, bevelAngle: 45 };
  const blBevel: CornerBevel = bevelConfig.bl || { bevelSize: 0, bevelAngle: 45 };

  const tlOffset = getBevelOffset(tlBevel.bevelSize, tlBevel.bevelAngle);
  const trOffset = getBevelOffset(trBevel.bevelSize, trBevel.bevelAngle);
  const brOffset = getBevelOffset(brBevel.bevelSize, brBevel.bevelAngle);
  const blOffset = getBevelOffset(blBevel.bevelSize, blBevel.bevelAngle);

  // Top-left bevel
  if (tlBevel.bevelSize > 0) {
    points.push(`M 0 ${tlOffset.y} L ${tlOffset.x} 0`);
  }

  // Top-right bevel
  if (trBevel.bevelSize > 0) {
    points.push(`M ${width - trOffset.x} 0 L ${width} ${trOffset.y}`);
  }

  // Bottom-right bevel
  if (brBevel.bevelSize > 0) {
    points.push(`M ${width} ${height - brOffset.y} L ${width - brOffset.x} ${height}`);
  }

  // Bottom-left bevel
  if (blBevel.bevelSize > 0) {
    points.push(`M ${blOffset.x} ${height} L 0 ${height - blOffset.y}`);
  }

  return points.join(' ');
}

// Function to calculate average bevel angle for stroke adjustment
export const getAverageBevelAngle =(bevelConfig: BevelConfig): number  => {
  const angles: number[] = [];

  if (bevelConfig.tl?.bevelSize && bevelConfig.tl.bevelSize > 0) {
    angles.push(bevelConfig.tl.bevelAngle || 45);
  }
  if (bevelConfig.tr?.bevelSize && bevelConfig.tr.bevelSize > 0) {
    angles.push(bevelConfig.tr.bevelAngle || 45);
  }
  if (bevelConfig.br?.bevelSize && bevelConfig.br.bevelSize > 0) {
    angles.push(bevelConfig.br.bevelAngle || 45);
  }
  if (bevelConfig.bl?.bevelSize && bevelConfig.bl.bevelSize > 0) {
    angles.push(bevelConfig.bl.bevelAngle || 45);
  }

  if (angles.length === 0) return 45;

  return angles.reduce((sum, angle) => sum + angle, 0) / angles.length;
}

// Helper function to generate fill path
export const generateFillPath = (width: number, height: number, bevelConfig: BevelConfig): string => {
  const points: string[] = [];

  function getBevelOffset(bevelSize: number, angle = 45): { x: number; y: number } {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.abs(bevelSize * Math.cos(radians)),
      y: Math.abs(bevelSize * Math.sin(radians))
    };
  }

  const tlBevel: CornerBevel = bevelConfig.tl || { bevelSize: 0, bevelAngle: 45 };
  const trBevel: CornerBevel = bevelConfig.tr || { bevelSize: 0, bevelAngle: 45 };
  const brBevel: CornerBevel = bevelConfig.br || { bevelSize: 0, bevelAngle: 45 };
  const blBevel: CornerBevel = bevelConfig.bl || { bevelSize: 0, bevelAngle: 45 };

  const tlOffset = getBevelOffset(tlBevel.bevelSize, tlBevel.bevelAngle);
  const trOffset = getBevelOffset(trBevel.bevelSize, trBevel.bevelAngle);
  const brOffset = getBevelOffset(brBevel.bevelSize, brBevel.bevelAngle);
  const blOffset = getBevelOffset(blBevel.bevelSize, blBevel.bevelAngle);

  // Build complete path for fill
  if (tlBevel.bevelSize > 0) {
    points.push(`M ${tlOffset.x} 0`);
  } else {
    points.push(`M 0 0`);
  }

  if (trBevel.bevelSize > 0) {
    points.push(`L ${width - trOffset.x} 0`);
    points.push(`L ${width} ${trOffset.y}`);
  } else {
    points.push(`L ${width} 0`);
  }

  if (brBevel.bevelSize > 0) {
    points.push(`L ${width} ${height - brOffset.y}`);
    points.push(`L ${width - brOffset.x} ${height}`);
  } else {
    points.push(`L ${width} ${height}`);
  }

  if (blBevel.bevelSize > 0) {
    points.push(`L ${blOffset.x} ${height}`);
    points.push(`L 0 ${height - blOffset.y}`);
  } else {
    points.push(`L 0 ${height}`);
  }

  if (tlBevel.bevelSize > 0) {
    points.push(`L 0 ${tlOffset.y}`);
    points.push(`L ${tlOffset.x} 0`);
  } else {
    points.push(`L 0 0`);
  }

  points.push('Z');
  return points.join(' ');
}
