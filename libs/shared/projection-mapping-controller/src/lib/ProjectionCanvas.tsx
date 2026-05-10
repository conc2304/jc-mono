import React, { useRef, useEffect, useCallback } from 'react';
import type { ProjectionCorners } from '@jc/of-control-protocol';
import {
  drawWarpedOutline,
  drawCornerHandles,
  hitTestCorner,
  pixelToNormalized,
  type CornerKey,
} from '@jc/shared/projection-warp';

interface Props {
  corners: ProjectionCorners;
  selectedCorner: CornerKey | null;
  imageUrl?: string;
  onSelectCorner: (corner: CornerKey | null) => void;
  onMoveCorner: (corner: CornerKey, corners: ProjectionCorners) => void;
}

export const ProjectionCanvas: React.FC<Props> = ({
  corners,
  selectedCorner,
  imageUrl,
  onSelectCorner,
  onMoveCorner,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const draggingRef = useRef<CornerKey | null>(null);
  const cornersRef = useRef(corners);
  cornersRef.current = corners;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    if (imageRef.current?.complete) {
      ctx.drawImage(imageRef.current, 0, 0, width, height);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255,107,53,0.08)';
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          if ((Math.floor(x / gridSize) + Math.floor(y / gridSize)) % 2 === 0) {
            ctx.fillRect(x, y, gridSize, gridSize);
          }
        }
      }
    }

    drawWarpedOutline(ctx, cornersRef.current, width, height);
    drawCornerHandles(ctx, cornersRef.current, width, height, selectedCorner);
  }, [selectedCorner]);

  useEffect(() => {
    draw();
  }, [corners, selectedCorner, draw]);

  useEffect(() => {
    if (!imageUrl) { imageRef.current = null; draw(); return; }
    const img = new Image();
    img.onload = () => { imageRef.current = img; draw(); };
    img.src = imageUrl;
  }, [imageUrl, draw]);

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
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
    const canvas = canvasRef.current!;
    const pos = getPos(e);
    const hit = hitTestCorner(cornersRef.current, canvas.width, canvas.height, pos.x, pos.y);
    if (hit) {
      draggingRef.current = hit;
      onSelectCorner(hit);
    } else {
      onSelectCorner(null);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current!;
    const pos = getPos(e);
    const norm = pixelToNormalized(pos.x, pos.y, canvas.width, canvas.height);
    const clamped = { x: Math.max(0, Math.min(1, norm.x)), y: Math.max(0, Math.min(1, norm.y)) };
    const updated: ProjectionCorners = { ...cornersRef.current, [draggingRef.current]: clamped };
    onMoveCorner(draggingRef.current, updated);
  };

  const handlePointerUp = () => {
    draggingRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{ width: '100%', height: 'auto', touchAction: 'none', cursor: 'crosshair', borderRadius: 8, display: 'block' }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    />
  );
};
