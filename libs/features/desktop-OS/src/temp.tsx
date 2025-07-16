import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, darken, Fade, Grow, Slide } from '@mui/material';

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

interface WindowProps extends WindowMetaData {
  isActive: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  isOpening?: boolean; // Add this prop to track if window is opening
  onAnimationComplete?: () => void; // Callback when animation completes
}

// Window state type for animations
type WindowAnimationState =
  | 'opening'
  | 'normal'
  | 'minimizing'
  | 'maximizing'
  | 'closing';

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
  onAnimationComplete,
}: WindowProps) => {
  const { updateWindow, bringToFront } = useWindowManager();

  // Animation state management
  const [animationState, setAnimationState] =
    useState<WindowAnimationState>('normal');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWindow, setShowWindow] = useState(!isOpening);

  // Store previous state for restore animations
  const previousState = useRef({ x, y, width, height });

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

  // Handle window opening animation
  useEffect(() => {
    if (isOpening) {
      setAnimationState('opening');
      setIsAnimating(true);
      setShowWindow(true);

      const timer = setTimeout(() => {
        setAnimationState('normal');
        setIsAnimating(false);
        onAnimationComplete?.();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpening, onAnimationComplete]);

  // Handle minimize/maximize state changes with animations
  useEffect(() => {
    if (minimized && animationState !== 'minimizing') {
      // Store current state before minimizing
      previousState.current = { x, y, width, height };
      setAnimationState('minimizing');
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 250);

      return () => clearTimeout(timer);
    } else if (maximized && animationState !== 'maximizing') {
      // Store current state before maximizing
      if (animationState === 'normal') {
        previousState.current = { x, y, width, height };
      }
      setAnimationState('maximizing');
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setAnimationState('normal');
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    } else if (
      !minimized &&
      !maximized &&
      (animationState === 'minimizing' || animationState === 'maximizing')
    ) {
      // Restore from minimized/maximized
      setAnimationState('normal');
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [minimized, maximized, animationState, x, y, width, height]);

  // Get animation styles based on current state
  const getAnimationStyles = () => {
    const baseTransition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    switch (animationState) {
      case 'opening':
        return {
          transform: 'scale(0.8)',
          opacity: 0,
          transition: baseTransition,
          animation: 'windowOpen 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        };
      case 'minimizing':
        return {
          transform: 'scale(0.3) translateY(50vh)',
          opacity: 0.7,
          transition: 'all 0.25s ease-in-out',
        };
      case 'maximizing':
        return {
          transition: baseTransition,
        };
      case 'closing':
        return {
          transform: 'scale(0.8)',
          opacity: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        };
      default:
        return {
          transform: 'scale(1)',
          opacity: 1,
          transition: isAnimating ? baseTransition : 'none',
        };
    }
  };

  // Handle resize start
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

  // Method to close window with animation
  const closeWindow = useCallback(() => {
    setAnimationState('closing');
    setIsAnimating(true);

    setTimeout(() => {
      // Call your window manager's close function here
      // closeWindow(id);
    }, 300);
  }, [id]);

  if (!showWindow) return null;

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
          visibility:
            minimized && animationState !== 'minimizing' ? 'hidden' : 'visible',
          pointerEvents:
            isAnimating && animationState !== 'normal' ? 'none' : 'auto',

          height: (theme) =>
            !maximized
              ? undefined
              : `calc(100% - ${theme.mixins.taskbar.height} - 0.25rem)`,

          // Add animation styles
          ...getAnimationStyles(),
        }}
        style={{
          left: x,
          top: y,
          width: maximized ? '100%' : width,
          height: !maximized ? height : undefined,
          zIndex: zIndex,
        }}
        onClick={() => !isAnimating && bringToFront(id)}
      >
        <WindowTitleBar
          title={title}
          id={id}
          isActive={isActive}
          icon={icon}
          onClose={closeWindow} // Pass the animated close function
        />

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
              {windowContent}
            </Box>

            {resizable && !maximized && (
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
