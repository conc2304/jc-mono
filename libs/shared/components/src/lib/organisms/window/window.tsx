import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { darken, alpha } from '@mui/material/styles';
import { Maximize2, Minimize2, X } from 'lucide-react';

import { ResizeDirection, ResizeHandlers, ResizeState } from './resize-handle';
import { getCursorForDirection } from './utils';
import { AugmentedIconButton } from '../../atoms';
import { WindowMetaData } from '../../types';

interface WindowProps extends WindowMetaData {
  isActive: boolean;
  onWindowMouseDown: (event: any, id: string) => void;
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
      if (!resizeState.isResizing || !resizeState.direction) return;

      const deltaX = e.clientX - resizeState.startX;
      const deltaY = e.clientY - resizeState.startY;

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
      newLeft = Math.max(0, Math.min(window.innerWidth - newWidth, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - newHeight, newTop));

      onWindowResize?.(id, {
        x: newLeft,
        y: newTop,
        width: newWidth,
        height: newHeight,
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
  }, [resizeState.isResizing, handleResizeMove, handleResizeEnd]);

  // Resize handle component

  return (
    <Box
      ref={windowRef}
      className="Window--root"
      sx={{
        position: 'absolute',
        background: (theme) => theme.palette.background.paper,
        overflow: 'hidden',
        visibility: minimized ? 'hidden' : undefined,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        boxShadow: (theme) => theme.shadows[isActive ? 8 : 2],
        '&:focus': {
          outline: '2px solid',
          outlineColor: (theme) => theme.palette.primary.main,
          outlineOffset: -2,
        },
      }}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
        zIndex: zIndex,
      }}
      onClick={() => bringToFront(id)}
    >
      {/* Resize Handles */}
      {resizable && !maximized && (
        <ResizeHandlers onResizeStart={handleResizeStart} handleSize={2} />
      )}

      {/* Title Bar */}
      <Box
        className="Window--title-bar"
        sx={{
          background: (theme) =>
            isActive
              ? theme.palette.primary.dark
              : darken(theme.palette.primary.dark, 0.5),
          color: (theme) =>
            alpha(theme.palette.text.primary, isActive ? 1 : 0.5),
          p: 0.25,
        }}
      >
        <Box
          onMouseDown={(e) => onWindowMouseDown(e, id)}
          sx={{
            cursor: 'move',
            m: 0.1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <Box
            className="flex items-center space-x-2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 0.5,
            }}
          >
            {icon}
            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AugmentedIconButton
              color="info"
              size="small"
              shape="buttonRight"
              disableRipple
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(id);
              }}
            >
              <Minimize2 />
            </AugmentedIconButton>
            <AugmentedIconButton
              color="info"
              size="small"
              shape="buttonRight"
              disableRipple
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(id);
              }}
            >
              <Maximize2 />
            </AugmentedIconButton>
            <AugmentedIconButton
              color="error"
              size="small"
              shape="buttonRight"
              disableRipple
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(id);
              }}
            >
              <X />
            </AugmentedIconButton>
          </Box>
        </Box>
      </Box>

      {/* Window Content */}
      <Box
        sx={{
          height: 'calc(100% - 40px)', // Subtract title bar height
          overflow: 'auto',
        }}
      >
        {windowContent}
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
