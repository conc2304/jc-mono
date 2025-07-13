import { ResizeDirection } from './resize-handle';

// Get cursor style for resize direction
export const getCursorForDirection = (direction: ResizeDirection): string => {
  const cursors = {
    n: 'n-resize',
    s: 's-resize',
    e: 'e-resize',
    w: 'w-resize',
    ne: 'ne-resize',
    nw: 'nw-resize',
    se: 'se-resize',
    sw: 'sw-resize',
  };
  return cursors[direction];
};
