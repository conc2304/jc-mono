import React, { useState, useRef, useCallback } from 'react';
import { Box, darken } from '@mui/material';

import {
  ResizeDirection,
  ResizeHandle,
  ResizeHandlers,
  ResizeState,
} from './resize-handle';
import { getCursorForDirection, getResizeDimensions } from './utils';
import { WindowTitleBar } from '../../molecules';
import { WindowMetaData } from '../../types';

interface WindowProps extends WindowMetaData {
  isActive: boolean;
  onWindowMouseDown: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => void;
  onWindowResize?: (
    id: string,
    newDimensions: { x: number; y: number; width: number; height: number }
  ) => void;
  bringToFront: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
}

export const Window = ({
  id,
  title,
  icon,
  x,
  y,
  width,
  height,
  zIndex,
  minimized,
  maximized,
  isActive = true,
  windowContent,
  onWindowMouseDown,
  onWindowResize,
  bringToFront,
  minimizeWindow,
  maximizeWindow,
  closeWindow,
  minWidth = 200,
  minHeight = 150,
  maxWidth = window.innerWidth,
  maxHeight = window.innerHeight,
  resizable = true,
}: WindowProps) => {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    direction: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      if (e.button === 2) return; // ignore right click
      if (!resizable || maximized) return;

      e.preventDefault();
      e.stopPropagation();

      bringToFront(id);

      setResizeState({
        isResizing: true,
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: width,
        startHeight: height,
        startLeft: x,
        startTop: y,
      });
    },
    [resizable, maximized, bringToFront, id, width, height, x, y]
  );

  // Handle resize move
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) return; // ignore right click
      if (!resizeState.isResizing || !resizeState.direction) return;

      const deltaX = e.clientX - resizeState.startX;
      const deltaY = e.clientY - resizeState.startY;

      const { x, y, width, height } = getResizeDimensions({
        resizeState,
        deltaX,
        deltaY,
        minHeight,
        maxHeight,
        minWidth,
        maxWidth,
      });

      // Ensure window doesn't go off-screen
      const newLeft = Math.max(0, Math.min(window.innerWidth - width, x));
      const newTop = Math.max(0, Math.min(window.innerHeight - height, y));

      onWindowResize?.(id, {
        x: newLeft,
        y: newTop,
        width,
        height,
      });
    },
    [resizeState, minWidth, minHeight, maxWidth, maxHeight, onWindowResize, id]
  );

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setResizeState((prev) => ({
      ...prev,
      isResizing: false,
      direction: null,
    }));
  }, []);

  // Add event listeners for resize
  React.useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = getCursorForDirection(
        resizeState.direction!
      );
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [
    resizeState.isResizing,
    resizeState.direction,
    handleResizeMove,
    handleResizeEnd,
  ]);

  return (
    <Box
      ref={windowRef}
      className="Window--root"
      sx={{
        position: 'absolute',
        background: 'transparent',
        overflow: 'hidden',
        visibility: minimized ? 'hidden' : undefined,

        height: (theme) =>
          !maximized
            ? undefined
            : `calc(100% - ${theme.mixins.taskbar.height} - 0.25rem)`, // Subtract taskbar height and some extra for padding
      }}
      style={{
        left: x,
        top: y,
        width: maximized ? '100%' : width,
        height: !maximized ? height : undefined,
        zIndex: zIndex,
      }}
      onClick={() => bringToFront(id)}
    >
      <WindowTitleBar
        title={title}
        id={id}
        isActive={isActive}
        icon={icon}
        onWindowMouseDown={onWindowMouseDown}
        minimizeWindow={minimizeWindow}
        maximizeWindow={maximizeWindow}
        closeWindow={closeWindow}
      />

      <Box
        data-augmented-ui="border tl-clip bl-clip b-clip-x br-clip"
        sx={{
          height: ({ mixins }) =>
            `calc(100% - ${mixins.window.titlebar.height})`, // Subtract title bar height
          overflow: 'auto',
          padding: '8px',
          m: 0,
          background: (theme) => theme.palette.background.paper,
          '&[data-augmented-ui]': {
            '--aug-tl': (theme) => theme.spacing(2),
            '--aug-bl': '8px',
            '--aug-br': '8px',
            '--aug-b': '6px',
            '--aug-b-extend1': '50%',
            '--aug-border-all': '1px',
            '--aug-border-bg': (theme) =>
              isActive
                ? theme.palette.primary.light
                : darken(theme.palette.primary.light, 0.5),
          },
        }}
      >
        {windowContent}

        <ResizeHandlers onResizeStart={handleResizeStart} handleSize={3} />
        {/* for the Augmented Notch at bottom  */}
        <ResizeHandle
          direction="s"
          style={{
            bottom: 6,
            left: '25%',
            right: '25%',
            height: '4px',
          }}
          onResizeStart={handleResizeStart}
        />
      </Box>
    </Box>
  );
};

// Hook for managing window dimensions
export const useWindowResize = () => {
  const [windows, setWindows] = useState<Map<string, WindowMetaData>>(
    new Map()
  );

  const updateWindowDimensions = useCallback(
    (
      id: string,
      dimensions: { x: number; y: number; width: number; height: number }
    ) => {
      setWindows((prev) => {
        const newWindows = new Map(prev);
        const window = newWindows.get(id);
        if (window) {
          newWindows.set(id, { ...window, ...dimensions });
        }
        return newWindows;
      });
    },
    []
  );

  return {
    windows,
    updateWindowDimensions,
    setWindows,
  };
};
