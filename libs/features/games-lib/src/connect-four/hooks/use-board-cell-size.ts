import { useEffect, useRef, useState } from 'react';

import { MIN_CELL_SIZE_PX } from '../constants';

export function useBoardCellSize(
  columns: number,
  rows: number,
  minCellSize = MIN_CELL_SIZE_PX
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(minCellSize);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;

      const sizeFromWidth = width / columns;
      const sizeFromHeight = height / rows;
      setCellSize(
        Math.max(minCellSize, Math.min(sizeFromWidth, sizeFromHeight))
      );
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [columns, rows, minCellSize]);

  return { containerRef, cellSize };
}
