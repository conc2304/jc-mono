import React, { useRef, useEffect, useCallback } from 'react';
import type { ProjectionCorners } from '@jc/of-control-protocol';
import {
  drawWarpedOutline,
  drawCornerHandles,
  hitTestCorner,
  pixelToNormalized,
  type CornerKey,
} from '@jc/projection-warp';
import {
  buildWarpMesh,
  compositeGridOntoImage,
  initWebGL,
  type WarpProgram,
} from './webgl-warp';

interface Props {
  corners: ProjectionCorners;
  selectedCorner: CornerKey | null;
  testGrid?: boolean;
  gridSize?: number;
  maskVersion?: number;
  onSelectCorner: (corner: CornerKey | null) => void;
  onMoveCorner: (corner: CornerKey, corners: ProjectionCorners) => void;
}

const CANVAS_W = 600;
const CANVAS_H = 400;

export const ProjectionCanvas: React.FC<Props> = ({
  corners,
  selectedCorner,
  testGrid,
  gridSize = 50,
  maskVersion = 0,
  onSelectCorner,
  onMoveCorner,
}) => {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const warpProgramRef = useRef<WarpProgram | null>(null);
  const maskImgRef = useRef<HTMLImageElement | null>(null);
  const cornersRef = useRef(corners);
  cornersRef.current = corners;
  const draggingRef = useRef<CornerKey | null>(null);

  // Initialize WebGL once
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;
    const program = initWebGL(canvas);
    if (!program) return;
    warpProgramRef.current = program;
    return () => {
      program.destroy();
      warpProgramRef.current = null;
    };
  }, []);

  // Load mask image, re-load when maskVersion changes
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      maskImgRef.current = img;
      renderGL();
    };
    img.onerror = () => {
      maskImgRef.current = null;
      renderGL();
    };
    img.src = `/api/mask/current.png?v=${maskVersion}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maskVersion]);

  const renderGL = useCallback(() => {
    const program = warpProgramRef.current;
    if (!program) return;

    const source: HTMLImageElement | HTMLCanvasElement | null =
      testGrid && maskImgRef.current
        ? compositeGridOntoImage(maskImgRef.current, gridSize, CANVAS_W, CANVAS_H)
        : maskImgRef.current;

    const mesh = buildWarpMesh(cornersRef.current, CANVAS_W, CANVAS_H);
    program.render(mesh, source, CANVAS_W, CANVAS_H);
  }, [testGrid, gridSize]);

  const renderOverlay = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawWarpedOutline(ctx, cornersRef.current, CANVAS_W, CANVAS_H);
    drawCornerHandles(ctx, cornersRef.current, CANVAS_W, CANVAS_H, selectedCorner);
  }, [selectedCorner]);

  // Re-render WebGL when corners, testGrid, or gridSize change
  useEffect(() => {
    renderGL();
  }, [corners, testGrid, gridSize, renderGL]);

  // Re-render overlay when corners or selectedCorner change
  useEffect(() => {
    renderOverlay();
  }, [corners, selectedCorner, renderOverlay]);

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = overlayCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const hit = hitTestCorner(cornersRef.current, CANVAS_W, CANVAS_H, pos.x, pos.y);
    if (hit !== null) {
      draggingRef.current = hit;
      onSelectCorner(hit);
    } else {
      onSelectCorner(null);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingRef.current === null) return;
    e.preventDefault();
    const pos = getPos(e);
    const norm = pixelToNormalized(pos.x, pos.y, CANVAS_W, CANVAS_H);
    const clamped = { x: Math.max(0, Math.min(1, norm.x)), y: Math.max(0, Math.min(1, norm.y)) };
    const updated: ProjectionCorners = [...cornersRef.current] as unknown as ProjectionCorners;
    updated[draggingRef.current] = clamped;
    onMoveCorner(draggingRef.current, updated);
  };

  const handlePointerUp = () => {
    draggingRef.current = null;
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
    display: 'block',
  };

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      {/* WebGL layer — warped image + pre-warp grid */}
      <canvas
        ref={glCanvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={canvasStyle}
      />
      {/* Canvas 2D layer — corner handles + dashed outline */}
      <canvas
        ref={overlayCanvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ ...canvasStyle, touchAction: 'none', cursor: 'crosshair' }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
    </div>
  );
};
