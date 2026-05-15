import React, { useRef, useEffect } from 'react';
import type { CanvasViewport } from '../../types';

export interface SelectionOverlayProps {
  width: number;
  height: number;
  opacity: number;
  maskView: boolean;
  renderFn: ((ctx: CanvasRenderingContext2D, viewport: CanvasViewport) => void) | null;
  viewport: CanvasViewport;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  width,
  height,
  opacity,
  maskView,
  renderFn,
  viewport,
  canvasRef: externalRef,
}) => {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalRef ?? internalRef;
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (renderFn) renderFn(ctx, viewport);
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [renderFn, viewport, canvasRef]);

  return (
    <canvas
      ref={canvasRef as React.RefObject<HTMLCanvasElement>}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: maskView ? 1 : opacity,
        touchAction: 'none',
        pointerEvents: 'none',
      }}
    />
  );
};
