import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  alpha,
  Box,
  darken,
  Fade,
  useMediaQuery,
  useTheme,
} from '@mui/material';

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

// Extended interface with animation properties and docking
interface WindowProps extends WindowMetaData {
  isActive: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  animationState?:
    | 'normal'
    | 'opening'
    | 'closing'
    | 'minimizing'
    | 'maximizing'
    | 'docking';
  docked?: 'left' | 'right' | null;
}

export const Window = React.memo(
  ({
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
    minWidth = 500,
    minHeight = 250,
    maxWidth = window.innerWidth,
    maxHeight = window.innerHeight,
    resizable = true,
    animationState = 'normal',
    docked = null,
  }: WindowProps) => {
    const {
      updateWindow,
      bringToFront,
      onWindowAnimationComplete,
      onWindowCloseAnimationComplete,
      draggedWindow,
      handleWindowMouseDown,
      windowAnimationType,
    } = useWindowManager();

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('md'));

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
    const shouldDisableInteraction =
      animationState === 'closing' || isAnimating;
    const isDragging = draggedWindow === id;

    // Handle screen resize for maximized windows
    useEffect(() => {
      if (!maximized) return;

      const handleScreenResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        updateWindow?.(id, {
          x: 0,
          y: 0,
          width: newWidth,
          height: newHeight,
        });
      };

      let resizeTimeout: NodeJS.Timeout;
      const debouncedHandleScreenResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleScreenResize, 100);
      };

      window.addEventListener('resize', debouncedHandleScreenResize);

      return () => {
        window.removeEventListener('resize', debouncedHandleScreenResize);
        clearTimeout(resizeTimeout);
      };
    }, [maximized, id, updateWindow, isXs]);

    // Handle screen resize for docked windows
    useEffect(() => {
      if (!docked) return;

      const handleScreenResize = () => {
        const halfWidth = window.innerWidth / 2;
        const fullHeight = window.innerHeight;

        updateWindow?.(id, {
          x: docked === 'left' ? 0 : halfWidth,
          y: 0,
          width: halfWidth,
          height: fullHeight,
        });
      };

      let resizeTimeout: NodeJS.Timeout;
      const debouncedHandleScreenResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleScreenResize, 100);
      };

      window.addEventListener('resize', debouncedHandleScreenResize);

      return () => {
        window.removeEventListener('resize', debouncedHandleScreenResize);
        clearTimeout(resizeTimeout);
      };
    }, [docked, id, updateWindow]);

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
          onWindowAnimationComplete?.(id);
        }, 250);
        return () => clearTimeout(timer);
      }

      if (animationState === 'maximizing') {
        const timer = setTimeout(() => {
          onWindowAnimationComplete?.(id);
        }, 300);
        return () => clearTimeout(timer);
      }

      if (animationState === 'docking') {
        const timer = setTimeout(() => {
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

    // Get animation styles based on current state and animation type
    const getAnimationStyles = () => {
      const baseTransition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      const fadeTransition = 'opacity 0.3s ease-in-out';

      // Use fade animations
      if (windowAnimationType === 'fade') {
        switch (animationState) {
          case 'opening':
            return {
              opacity: 1,
              transition: fadeTransition,
            };
          case 'closing':
            return {
              opacity: 0,
              transition: fadeTransition,
            };
          case 'minimizing':
            return {
              opacity: 0,
              transition: 'opacity 0.25s ease-in-out',
            };
          case 'maximizing':
          case 'docking':
            return {
              transition: baseTransition,
            };
          default:
            return {
              opacity: 1,
              transition: isDragging ? 'none' : undefined,
            };
        }
      }

      // Use transform animations (default)
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
        case 'docking':
          return {
            transition: baseTransition,
          };
        default:
          return {
            transform: 'scale(1)',
            opacity: 1,
            transition: isDragging ? 'none' : undefined,
          };
      }
    };

    // Handle resize start - disabled during animations and when docked/maximized
    const handleResizeStart = useCallback(
      (e: React.MouseEvent, direction: ResizeDirection) => {
        if (e.button === 2) return;
        if (!resizable || maximized || docked || isAnimating) return;

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
      [
        resizable,
        maximized,
        docked,
        isAnimating,
        bringToFront,
        id,
        width,
        height,
        x,
        y,
      ]
    );

    // Handle resize move
    const handleResizeMove = useCallback(
      (e: MouseEvent) => {
        if (e.button === 2) return;
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
    useEffect(() => {
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
      if (animationState === 'closing') return 'visible';
      if (animationState === 'minimizing') return 'visible';
      if (minimized) return 'hidden';
      return 'visible';
    };

    // Determine if window should show resize handles
    const shouldShowResizeHandles =
      resizable && !maximized && !docked && !isAnimating;

    return (
      <>
        {/* Keyframes CSS - only needed for transform animations */}
        {windowAnimationType === 'transform' && (
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
        )}

        <Box
          ref={windowRef}
          className="Window--root"
          data-window-id={id}
          sx={(theme) => ({
            position: 'absolute',
            background: 'transparent',
            overflow: 'hidden',
            visibility: getVisibility(),

            pointerEvents: shouldDisableInteraction ? 'none' : 'auto',
            willChange: isDragging ? 'transform' : 'auto',
            contain: 'layout style paint',
            height: maximized ? `calc(100% - 0.25rem)` : undefined,

            // Apply animation styles based on type
            ...getAnimationStyles(),
          })}
          style={{
            left: x,
            top: y,
            width: maximized ? '100%' : width,
            height: !maximized ? height : undefined,
            zIndex: zIndex,
          }}
          onClick={handleWindowClick}
        >
          <WindowTitleBar
            title={title}
            id={id}
            isActive={isActive}
            icon={icon}
            onMouseDown={handleWindowMouseDown}
            windowMaximized={maximized}
            windowDocked={docked}
          />

          <Fade
            in={!minimized || animationState === 'minimizing'}
            timeout={animationState === 'minimizing' ? 250 : 300}
          >
            <Box
              className="WindowContent--root"
              data-augmented-ui="border tl-clip bl-clip b-clip-x br-clip"
              sx={(theme) => ({
                height: `calc(100% - ${theme.mixins.window.titleBar.height})`,
                p: 0.5,
                pt: 0,
                m: 0,
                backdropFilter: 'blur(14px)',

                background: alpha(
                  theme.palette.background.paper,
                  Number(theme.mixins.paper.opacity) || 1
                ),
                '&[data-augmented-ui]': {
                  '--aug-tl': theme.spacing(2),
                  '--aug-bl': '8px',
                  '--aug-br': '8px',
                  '--aug-b': '6px',
                  '--aug-b-extend1': '50%',
                  '--aug-border-all': '1px',
                  '--aug-border-bg': isActive
                    ? theme.palette.primary.light
                    : darken(theme.palette.primary.light, 0.5),
                },
              })}
            >
              <Box
                className="Window--content"
                sx={{
                  height: '100%',
                  pointerEvents: isDragging ? 'none' : 'auto',
                  overflow: 'hidden',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {(!minimized || animationState === 'minimizing') &&
                  windowContent}
              </Box>

              {shouldShowResizeHandles && (
                <>
                  <ResizeHandlers
                    onResizeStart={handleResizeStart}
                    handleSize={6}
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
  }
);

Window.displayName = 'Window';
