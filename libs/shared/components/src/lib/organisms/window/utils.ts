import { ResizeDirection, ResizeState } from './resize-handle';

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

type ResizeArgs = {
  resizeState: ResizeState;
  deltaX: number;
  deltaY: number;
  maxHeight: number;
  minHeight: number;
  minWidth: number;
  maxWidth: number;
};
export const getResizeDimensions = ({
  resizeState,
  deltaX,
  deltaY,
  maxHeight,
  minHeight,
  minWidth,
  maxWidth,
}: ResizeArgs): {
  x: number;
  y: number;
  width: number;
  height: number;
} => {
  let newWidth = resizeState.startWidth;
  let newHeight = resizeState.startHeight;
  let newLeft = resizeState.startLeft;
  let newTop = resizeState.startTop;

  // Calculate new dimensions based on resize direction
  switch (resizeState.direction) {
    case 'n':
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeState.startHeight - deltaY)
      );
      newTop = resizeState.startTop + (resizeState.startHeight - newHeight);
      break;
    case 's':
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeState.startHeight + deltaY)
      );
      break;
    case 'e':
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizeState.startWidth + deltaX)
      );
      break;
    case 'w':
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizeState.startWidth - deltaX)
      );
      newLeft = resizeState.startLeft + (resizeState.startWidth - newWidth);
      break;
    case 'ne':
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeState.startHeight - deltaY)
      );
      newTop = resizeState.startTop + (resizeState.startHeight - newHeight);
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizeState.startWidth + deltaX)
      );
      break;
    case 'nw':
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeState.startHeight - deltaY)
      );
      newTop = resizeState.startTop + (resizeState.startHeight - newHeight);
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizeState.startWidth - deltaX)
      );
      newLeft = resizeState.startLeft + (resizeState.startWidth - newWidth);
      break;
    case 'se':
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeState.startHeight + deltaY)
      );
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizeState.startWidth + deltaX)
      );
      break;
    case 'sw':
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeState.startHeight + deltaY)
      );
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizeState.startWidth - deltaX)
      );
      newLeft = resizeState.startLeft + (resizeState.startWidth - newWidth);
      break;
  }

  // Ensure window doesn't go off-screen
  // newLeft = Math.max(0, Math.min(window.innerWidth - newWidth, newLeft));
  // newTop = Math.max(0, Math.min(window.innerHeight - newHeight, newTop));

  return {
    x: newLeft,
    y: newTop,
    width: newWidth,
    height: newHeight,
  };
};
