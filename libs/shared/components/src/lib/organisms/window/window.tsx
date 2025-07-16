import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, darken, Fade } from '@mui/material';

import {
  ResizeDirection,
  ResizeHandle,
  ResizeHandlers,
  ResizeState,
} from './resize-handle';
import { getCursorForDirection, getResizeDimensions } from './utils';
import { useWindowManager } from '../../context';
import { WindowTitleBar } from '../../molecules';
import { WindowMetaData } from '../../types';

// Extended interface to include animation properties
interface WindowProps extends WindowMetaData {
  isActive: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  // Animation properties from the updated context
  isOpening?: boolean;
  isClosing?: boolean;
  animationState?:
    | 'normal'
    | 'opening'
    | 'closing'
    | 'minimizing'
    | 'maximizing';
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
  minWidth = 200,
  minHeight = 150,
  maxWidth = window.innerWidth,
  maxHeight = window.innerHeight,
  resizable = true,
  isOpening = false,
  isClosing = false,
  animationState = 'normal',
}: WindowProps) => {
  const {
    updateWindow,
    bringToFront,
    onWindowAnimationComplete,
    onWindowCloseAnimationComplete,
  } = useWindowManager();

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
  const isAnimating = animationState !== 'normal';
  const shouldDisableInteraction = animationState === 'closing' || isAnimating;

  // Handle animation completion
  useEffect(() => {
    if (animationState === 'opening') {
      const timer = setTimeout(() => {
        onWindowAnimationComplete?.(id);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (animationState === 'closing') {
      const timer = setTimeout(() => {
        onWindowCloseAnimationComplete?.(id);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (animationState === 'minimizing') {
      const timer = setTimeout(() => {
        // Reset animation state after minimize animation completes
        onWindowAnimationComplete?.(id);
      }, 250); // Match the minimizing animation duration
      return () => clearTimeout(timer);
    }

    if (animationState === 'maximizing') {
      const timer = setTimeout(() => {
        // Reset animation state after maximize animation completes
        onWindowAnimationComplete?.(id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [
    animationState,
    id,
    onWindowAnimationComplete,
    onWindowCloseAnimationComplete,
  ]);

  // Get animation styles based on current state
  const getAnimationStyles = () => {
    const baseTransition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    switch (animationState) {
      case 'opening':
        return {
          transform: 'scale(1)',
          opacity: 1,
          transition: baseTransition,
          animation: 'windowOpen 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        };
      case 'closing':
        return {
          transform: 'scale(0.8)',
          opacity: 0,
          transition: baseTransition,
        };
      case 'minimizing':
        return {
          transform: 'scale(0.3) translateY(50vh)',
          opacity: 0.3,
          transition: 'all 0.25s ease-in-out',
        };
      case 'maximizing':
        return {
          transition: baseTransition,
        };
      default:
        return {
          transform: 'scale(1)',
          opacity: 1,
          transition: 'none',
        };
    }
  };

  // Handle resize start - disabled during animations
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: ResizeDirection) => {
      if (e.button === 2) return; // ignore right click
      if (!resizable || maximized || isAnimating) return;

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
    [resizable, maximized, isAnimating, bringToFront, id, width, height, x, y]
  );

  // Handle resize move
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) return; // ignore right click
      if (!resizeState.isResizing || !resizeState.direction || isAnimating)
        return;

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

      updateWindow?.(id, {
        x: newLeft,
        y: newTop,
        width,
        height,
      });
    },
    [
      resizeState,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      updateWindow,
      id,
      isAnimating,
    ]
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

  // Handle window click - disabled during animations
  const handleWindowClick = useCallback(() => {
    if (!shouldDisableInteraction) {
      bringToFront(id);
    }
  }, [bringToFront, id, shouldDisableInteraction]);

  // Special visibility handling for animations
  const getVisibility = () => {
    if (animationState === 'closing') return 'visible'; // Keep visible during closing animation
    if (animationState === 'minimizing') return 'visible'; // Keep visible during minimizing animation
    if (minimized) return 'hidden'; // Hide when minimized and not animating
    return 'visible';
  };

  return (
    <>
      {/* Add keyframes CSS */}
      <style>
        {`
          @keyframes windowOpen {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>

      <Box
        ref={windowRef}
        className="Window--root"
        sx={{
          position: 'absolute',
          background: 'transparent',
          overflow: 'hidden',
          visibility: getVisibility(),
          pointerEvents: shouldDisableInteraction ? 'none' : 'auto',

          height: (theme) =>
            !maximized
              ? undefined
              : `calc(100% - ${theme.mixins.taskbar.height} - 0.25rem)`,

          // Apply animation styles
          ...getAnimationStyles(),
        }}
        style={{
          left: x,
          top: y,
          width: maximized ? '100%' : width,
          height: !maximized ? height : undefined,
          zIndex: zIndex,
        }}
        onClick={handleWindowClick}
      >
        <WindowTitleBar title={title} id={id} isActive={isActive} icon={icon} />

        <Fade
          in={!minimized || animationState === 'minimizing'}
          timeout={animationState === 'minimizing' ? 250 : 300}
        >
          <Box
            className="WindowContent--root"
            data-augmented-ui="border tl-clip bl-clip b-clip-x br-clip"
            sx={{
              height: ({ mixins }) =>
                `calc(100% - ${mixins.window.titlebar.height})`,
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
            <Box
              sx={{
                height: '100%',
              }}
              className="Window--content"
            >
              {/* Only render content when not minimized or during minimize animation */}
              {(!minimized || animationState === 'minimizing') && windowContent}
            </Box>

            {/* Only show resize handles when not animating and resizable */}
            {resizable && !maximized && !isAnimating && (
              <>
                <ResizeHandlers
                  onResizeStart={handleResizeStart}
                  handleSize={3}
                />
                <ResizeHandle
                  direction="s"
                  style={{
                    bottom: 6,
                    left: '25%',
                    right: '25%',
                    height: '4px',
                  }}
                  onResizeStart={(e) => handleResizeStart(e, 's')}
                />
              </>
            )}
          </Box>
        </Fade>
      </Box>
    </>
  );
};
