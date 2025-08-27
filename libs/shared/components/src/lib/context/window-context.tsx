import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useMemo,
} from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { remToPixels } from '@jc/themes';

import { FileManager } from '../organisms/file-manager';
import { WindowMetaData, ItemPosition } from '../types';
import { findFileSystemItemByIdWithPath } from '../utils';
import {
  FileSystemItem,
  FileSystemNavigationManager,
  NavigationGroup,
} from '@jc/file-system';

interface DragRef {
  startX: number;
  startY: number;
  elementX: number;
  elementY: number;
  isDragging: boolean;
  lastUpdateTime: number;
  currentX: number; // Track current mouse position
  currentY: number; // Track current mouse position
}

// Window state to store previous dimensions before maximize/dock
interface WindowPreviousState {
  x: number;
  y: number;
  width: number;
  height: number;
  docked?: 'left' | 'right' | null; // Also store docked state
}

// Extended WindowMetaData to include animation states and previous state
interface AnimatedWindowMetaData extends WindowMetaData {
  isOpening?: boolean;
  isClosing?: boolean;
  animationState?:
    | 'normal'
    | 'opening'
    | 'closing'
    | 'minimizing'
    | 'maximizing'
    | 'docking';
  previousState?: WindowPreviousState;
  docked?: 'left' | 'right' | null;
}

interface WindowState {
  windows: AnimatedWindowMetaData[];
  draggedWindow: string | null;
  windowZIndex: number;
  desktopItemPositions: Record<string, ItemPosition>;
  draggedIcon: string | null;
  fileSystemItems: FileSystemItem[];
}

interface WindowActions {
  // Window management
  openWindow: (fsId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  bringToFront: (windowId: string) => void;
  updateWindowTitle: (windowId: string, name: string, icon: ReactNode) => void;

  // Window positioning/resizing
  updateWindow: (
    id: string,
    dimensions: { x: number; y: number; width: number; height: number }
  ) => void;
  handleWindowMouseDown: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    windowId: string
  ) => void;

  // Content replacement methods
  replaceWindowContent: (
    windowId: string,
    newContent: ReactNode,
    newTitle: string,
    newIcon: ReactNode,
    options?: {
      addToHistory?: boolean;
      metadata?: Record<string, any>;
    }
  ) => void;

  // Animation callbacks
  onWindowAnimationComplete: (windowId: string) => void;
  onWindowCloseAnimationComplete: (windowId: string) => void;

  // Icon management
  handleIconMouseDown: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    iconId: string
  ) => void;

  // State setters (for internal use)
  setWindows: React.Dispatch<React.SetStateAction<AnimatedWindowMetaData[]>>;
  setDesktopItemPositions: React.Dispatch<
    React.SetStateAction<Record<string, ItemPosition>>
  >;
  setDraggedWindow: React.Dispatch<React.SetStateAction<string | null>>;
  setDraggedIcon: React.Dispatch<React.SetStateAction<string | null>>;
  setWindowZIndex: React.Dispatch<React.SetStateAction<number>>;
}

const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

interface WindowContextValue extends WindowState, WindowActions {}

// Context
const WindowContext = createContext<WindowContextValue | null>(null);

// Provider
export const WindowProvider: React.FC<{
  children: React.ReactNode;
  fileSystemItems: FileSystemItem[];
  navigationGroups?: NavigationGroup[];
  defaultDesktopItemPositions?: Record<string, ItemPosition>;
}> = ({
  children,
  fileSystemItems,
  defaultDesktopItemPositions = {},
  navigationGroups = [],
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

  const [windows, setWindows] = useState<AnimatedWindowMetaData[]>([]);
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [windowZIndex, setWindowZIndex] = useState(theme.zIndex.window);
  const [desktopItemPositions, setDesktopItemPositions] = useState<
    Record<string, ItemPosition>
  >(defaultDesktopItemPositions);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);

  // Create navigation manager with provided groups
  const navigationManager = useMemo(() => {
    const manager = new FileSystemNavigationManager(fileSystemItems);

    // Register all provided navigation groups
    navigationGroups.forEach((group) => {
      manager.registerNavigationGroup(group);
    });

    return manager;
  }, [fileSystemItems, navigationGroups]);

  // Update navigation manager when fileSystemItems change
  useEffect(() => {
    navigationManager.updateFileSystemItems(fileSystemItems);
  }, [fileSystemItems, navigationManager]);

  // Updated getWindowContent function to use the navigation manager
  const getWindowContent = useCallback(
    (
      fsItem: FileSystemItem,
      fileSystemItems: FileSystemItem[],
      updateWindowCallback: (name: string, icon: ReactNode) => void,
      windowId?: string,
      replaceWindowContent?: (
        windowId: string,
        content: ReactNode,
        title: string,
        icon: ReactNode,
        options?: any
      ) => void
    ): ReactNode => {
      if (fsItem.type === 'folder') {
        // File Browser
        return (
          <FileManager
            windowId={windowId}
            initialPath={fsItem.path}
            folderContents={fsItem.children || []}
            fileSystemItems={fileSystemItems}
            updateWindowName={(name, icon) => updateWindowCallback(name, icon)}
            hasPreviewPanel
          />
        );
      } else if (fsItem.renderer) {
        // File with renderer - check if it supports navigation
        if (
          fsItem.renderer.navigationGroup &&
          fsItem.renderer.shouldNavigate &&
          windowId &&
          replaceWindowContent
        ) {
          // Use memoized navigation manager instead of creating a new one
          return navigationManager.renderNavigableFile(
            fsItem,
            windowId,
            replaceWindowContent
          );
        } else {
          // Regular file rendering without navigation
          const { component: Component, props = {} } = fsItem.renderer;
          return <Component {...fsItem.fileData} {...(props as any)} />;
        }
      }

      return null;
    },
    [navigationManager]
  );

  // Drag refs
  const windowDragRef = useRef<DragRef>({
    startX: 0,
    startY: 0,
    elementX: 0,
    elementY: 0,
    isDragging: false,
    lastUpdateTime: 0,
    currentX: 0,
    currentY: 0,
  });

  const iconDragRef = useRef<DragRef>({
    startX: 0,
    startY: 0,
    elementX: 0,
    elementY: 0,
    isDragging: false,
    lastUpdateTime: 0,
    currentX: 0,
    currentY: 0,
  });

  // Animation timeouts ref to cleanup if needed
  const animationTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Performance constants
  const THROTTLE_MS = 16; // ~60fps
  const ICON_THROTTLE_MS = 12; // Slightly faster for icons
  const DOCK_THRESHOLD = 50; // Distance from edge to trigger docking

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      animationTimeouts.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  // Snap to grid utility
  const snapToGrid = useCallback((x: number, y: number) => {
    const gridSize = 20;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  }, []);

  // Helper function to get docked position
  const getDockPosition = useCallback((side: 'left' | 'right') => {
    const halfWidth = window.innerWidth / 2;
    const fullHeight = window.innerHeight;

    return {
      x: side === 'left' ? 0 : halfWidth,
      y: 0,
      width: halfWidth,
      height: fullHeight,
    };
  }, []);

  // Helper function to detect docking zone
  const getDockZone = useCallback(
    (x: number, y: number): 'left' | 'right' | null => {
      if (x <= DOCK_THRESHOLD) return 'left';
      if (x >= window.innerWidth - DOCK_THRESHOLD) return 'right';
      return null;
    },
    []
  );

  // Animation callback handlers
  const onWindowAnimationComplete = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === windowId
          ? {
              ...window,
              isOpening: false,
              animationState: 'normal',
            }
          : window
      )
    );

    // Clear timeout if it exists
    const timeout = animationTimeouts.current.get(windowId);
    if (timeout) {
      clearTimeout(timeout);
      animationTimeouts.current.delete(windowId);
    }
  }, []);

  const onWindowCloseAnimationComplete = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));

    // Clear timeout if it exists
    const timeout = animationTimeouts.current.get(windowId);
    if (timeout) {
      clearTimeout(timeout);
      animationTimeouts.current.delete(windowId);
    }
  }, []);

  // Optimized icon drag handlers
  const handleIconMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, iconId: string) => {
      e.preventDefault();
      if (e.button === 2) return;

      iconDragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        elementX: desktopItemPositions[iconId]?.x || 0,
        elementY: desktopItemPositions[iconId]?.y || 0,
        isDragging: true,
        lastUpdateTime: 0,
        // currentX: undefined
      };

      // Immediate visual feedback
      const iconElement = e.currentTarget;
      if (iconElement) {
        iconElement.style.willChange = 'transform';
        iconElement.style.zIndex = '9999';
      }

      setDraggedIcon(iconId);
    },
    [desktopItemPositions]
  );

  const handleOptimizedIconMouseMove = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) return;
      if (!iconDragRef.current.isDragging || !draggedIcon) return;

      const now = performance.now();
      if (now - iconDragRef.current.lastUpdateTime < ICON_THROTTLE_MS) {
        return;
      }

      iconDragRef.current.lastUpdateTime = now;

      requestAnimationFrame(() => {
        if (!iconDragRef.current.isDragging) return;

        const deltaX = e.clientX - iconDragRef.current.startX;
        const deltaY = e.clientY - iconDragRef.current.startY;

        const iconWidth = remToPixels(theme.mixins.desktopIcon.width as string);
        const iconHeight = remToPixels(
          theme.mixins.desktopIcon.maxHeight as string
        );

        const newX = clamp(
          iconDragRef.current.elementX + deltaX,
          0,
          window.innerWidth - iconWidth
        );
        const newY = clamp(
          iconDragRef.current.elementY + deltaY,
          0,
          window.innerHeight - iconHeight
        );

        // Direct DOM manipulation for smooth dragging
        const iconElement = document.querySelector(
          `[data-icon-id="${draggedIcon}"]`
        ) as HTMLElement;
        if (iconElement) {
          const offsetX = newX - iconDragRef.current.elementX;
          const offsetY = newY - iconDragRef.current.elementY;
          iconElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
      });
    },
    [
      draggedIcon,
      theme.mixins.desktopIcon.width,
      theme.mixins.desktopIcon.maxHeight,
    ]
  );

  const handleIconMouseUp = useCallback(() => {
    if (!draggedIcon || !iconDragRef.current.isDragging) return;

    iconDragRef.current.isDragging = false;

    // Get final position from transform and update state
    const iconElement = document.querySelector(
      `[data-icon-id="${draggedIcon}"]`
    ) as HTMLElement;
    if (iconElement) {
      const transform = iconElement.style.transform;
      const matches = transform.match(
        /translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/
      );

      if (matches) {
        const deltaX = parseFloat(matches[1]);
        const deltaY = parseFloat(matches[2]);
        const newX = iconDragRef.current.elementX + deltaX;
        const newY = iconDragRef.current.elementY + deltaY;

        // Snap to grid
        const snappedPos = snapToGrid(newX, newY);

        // Single state update with final position
        setDesktopItemPositions((prev) => ({
          ...prev,
          [draggedIcon]: snappedPos,
        }));
      }

      // Reset styles
      iconElement.style.willChange = '';
      iconElement.style.transform = '';
      iconElement.style.zIndex = '';
    }

    setDraggedIcon(null);
  }, [draggedIcon, snapToGrid]);

  // Replace window content
  const replaceWindowContent = useCallback(
    (
      windowId: string,
      newContent: ReactNode,
      newTitle: string,
      newIcon: ReactNode,
      options: {
        addToHistory?: boolean;
        metadata?: Record<string, any>;
      } = {}
    ) => {
      setWindows((prev) =>
        prev.map((window) =>
          window.id === windowId
            ? {
                ...window,
                title: newTitle,
                icon: newIcon,
                windowContent: newContent,
              }
            : window
        )
      );
    },
    []
  );

  // Window management functions
  const bringToFront = useCallback((windowId: string) => {
    setWindowZIndex((prevZIndex) => {
      const newZIndex = prevZIndex + 1;

      setWindows((prev) =>
        prev.map((window) =>
          window.id === windowId
            ? { ...window, zIndex: newZIndex, isActive: true }
            : { ...window, isActive: false }
        )
      );

      return newZIndex;
    });
  }, []);

  const openWindow = useCallback(
    (itemId: string) => {
      const result = findFileSystemItemByIdWithPath(fileSystemItems, itemId);
      if (!result) return;

      const fsItem = result.item;
      const id = `window-${itemId}`;

      // Check if window already exists
      const currWindow = windows.find((window) => window.id === id);
      if (currWindow) {
        // Window exists - restore if minimized and bring to front
        setWindows((prev) =>
          prev.map((window) =>
            window.id === id
              ? {
                  ...window,
                  minimized: false,
                  zIndex: windowZIndex + 1,
                  isActive: true,
                  animationState: window.minimized ? 'opening' : 'normal',
                  // Preserve current dimensions - they may have been updated while minimized
                }
              : { ...window, isActive: false }
          )
        );
      } else {
        // Create new window with content (potentially with navigation)
        const maximized = fsItem.type !== 'folder' && !isXs;

        const x =
          fsItem.type === 'folder' && !isXs ? 200 + windows.length * 30 : 0;
        const y =
          fsItem.type === 'folder' && !isXs ? 100 + windows.length * 30 : 0;

        const maxHeight = window.innerHeight - y;
        const height =
          fsItem.type === 'folder' && !isXs
            ? Math.min(window.innerHeight * 0.5, maxHeight)
            : window.innerHeight;

        const maxWidth = window.innerWidth - x;
        const width =
          fsItem.type === 'folder' && !isXs
            ? Math.min(window.innerWidth * 0.66, maxWidth)
            : window.innerWidth;

        const newWindow: AnimatedWindowMetaData = {
          id,
          title: fsItem.name,
          icon: fsItem.icon,
          x,
          y,
          width,
          height,
          zIndex: windowZIndex + 1,
          minimized: false,
          maximized,
          windowContent: getWindowContent(
            fsItem,
            fileSystemItems,
            (name: string, icon: ReactNode) =>
              updateWindowTitle(id, name, icon),
            id, // Pass window ID
            replaceWindowContent // Pass replace function for navigation
          ),
          isActive: true,
          isOpening: true,
          animationState: 'opening',
          docked: null,
        };

        setWindows((prev) => [
          ...prev.map((window) => ({ ...window, isActive: false })),
          newWindow,
        ]);

        const timeout = setTimeout(() => {
          onWindowAnimationComplete(id);
        }, 350);

        animationTimeouts.current.set(id, timeout);
      }

      setWindowZIndex(windowZIndex + 1);
    },
    [
      fileSystemItems,
      windows,
      windowZIndex,
      onWindowAnimationComplete,
      replaceWindowContent,
      getWindowContent,
    ]
  );

  const closeWindow = useCallback(
    (windowId: string) => {
      // Start closing animation
      setWindows((prev) =>
        prev.map((window) =>
          window.id === windowId
            ? {
                ...window,
                isClosing: true,
                animationState: 'closing',
              }
            : window
        )
      );

      // Set timeout as fallback in case animation callback doesn't fire
      const timeout = setTimeout(() => {
        onWindowCloseAnimationComplete(windowId);
      }, 350);

      animationTimeouts.current.set(windowId, timeout);
    },
    [onWindowCloseAnimationComplete]
  );

  const minimizeWindow = useCallback(
    (windowId: string) => {
      const current = windows.find(({ id }) => windowId === id);
      const isRestoring = !!current?.minimized;

      setWindows((prev) =>
        prev.map((window) => {
          return window.id === windowId
            ? {
                ...window,
                minimized: !window.minimized,
                isActive: isRestoring,
                zIndex: isRestoring ? windowZIndex + 1 : window.zIndex,
                animationState: isRestoring ? 'opening' : 'minimizing',
              }
            : { ...window, isActive: isRestoring ? false : window.isActive };
        })
      );

      if (isRestoring) {
        setWindowZIndex(windowZIndex + 1);

        // Reset animation state after minimize/restore animation
        const timeout = setTimeout(() => {
          setWindows((prev) =>
            prev.map((window) =>
              window.id === windowId
                ? { ...window, animationState: 'normal' }
                : window
            )
          );
        }, 300);

        animationTimeouts.current.set(`${windowId}-minimize`, timeout);
      }
    },
    [windows, windowZIndex]
  );

  const maximizeWindow = useCallback(
    (windowId: string) => {
      const current = windows.find(({ id }) => windowId === id);
      if (!current) return;

      const isMaximizing = !current.maximized;

      setWindows((prev) =>
        prev.map((windowItem) => {
          if (windowItem.id !== windowId) return windowItem;

          if (isMaximizing) {
            // Store current state before maximizing (including docked state)
            const previousState: WindowPreviousState = {
              x: windowItem.x,
              y: windowItem.y,
              width: windowItem.width,
              height: windowItem.height,
              docked: windowItem.docked, // Store docked state
            };

            return {
              ...windowItem,
              maximized: true,
              x: 0,
              y: 0,
              width: window.innerWidth,
              height: window.innerHeight,
              zIndex: theme.zIndex.modal,
              animationState: 'maximizing',
              previousState,
              docked: null, // Clear docked state when maximizing
            };
          } else {
            // Restore to previous state
            const restoreState = windowItem.previousState || {
              x: !isXs ? 200 + windows.length * 30 : 0,
              y: !isXs ? 100 + windows.length * 30 : 0,
              width: !isXs ? window.innerWidth * 0.66 : window.innerWidth,
              height: !isXs ? window.innerHeight * 0.5 : window.innerHeight,
              docked: null,
            };

            return {
              ...windowItem,
              maximized: false,
              x: restoreState.x,
              y: restoreState.y,
              width: restoreState.width,
              height: restoreState.height,
              zIndex: windowZIndex + 1,
              animationState: 'maximizing',
              previousState: undefined, // Clear previous state
              docked: restoreState.docked, // Restore docked state
            };
          }
        })
      );

      if (!isMaximizing) setWindowZIndex(windowZIndex + 1);

      // Reset animation state after maximize animation
      const timeout = setTimeout(() => {
        setWindows((prev) =>
          prev.map((window) =>
            window.id === windowId
              ? { ...window, animationState: 'normal' }
              : window
          )
        );
      }, 300);

      animationTimeouts.current.set(`${windowId}-maximize`, timeout);
    },
    [windows, windowZIndex, theme.zIndex.modal, isXs]
  );

  const updateWindow = useCallback(
    (
      id: string,
      dimensions: { x: number; y: number; width: number; height: number }
    ) => {
      setWindows((prev) =>
        prev.map((window) => {
          if (window.id !== id) return window;

          // If window is maximized or docked, don't update dimensions directly
          // but clear previousState since the underlying window has changed
          if (window.maximized || window.docked) {
            return {
              ...window,
              previousState: undefined, // Clear previous state since window changed
            };
          }

          // Normal window update - clear previousState if it exists since the window
          // has been moved/resized and future maximize should capture these new dimensions
          return {
            ...window,
            ...dimensions,
            previousState: undefined, // Clear any existing previous state
          };
        })
      );
      return '';
    },
    []
  );

  const updateWindowTitle = useCallback(
    (id: string, name: string, icon: ReactNode) => {
      setWindows((prev) =>
        prev.map((window) =>
          window.id === id
            ? {
                ...window,
                title: name,
                icon,
              }
            : window
        )
      );
      return '';
    },
    []
  );

  // Optimized window drag handlers with docking support
  const handleWindowMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, windowId: string) => {
      e.preventDefault();

      if (e.button === 2) return;

      // Don't allow dragging during animations
      const window = windows.find((w) => w.id === windowId);
      if (window?.animationState && window.animationState !== 'normal') return;

      const windowElement = e.currentTarget;
      const rect = windowElement.getBoundingClientRect();

      windowDragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        elementX: rect.left,
        elementY: rect.top,
        isDragging: true,
        lastUpdateTime: 0,
        currentX: e.clientX,
        currentY: e.clientY,
      };

      // Immediate visual feedback
      const windowContainer = windowElement.closest(
        '[data-window-id]'
      ) as HTMLElement;
      if (windowContainer) {
        windowContainer.style.willChange = 'transform';
        windowContainer.style.zIndex = '9999';
      }

      setDraggedWindow(windowId);
      bringToFront(windowId);
    },
    [bringToFront, windows]
  );

  const handleOptimizedWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) return;
      if (!windowDragRef.current.isDragging || !draggedWindow) return;

      // Update current mouse position for dock detection
      windowDragRef.current.currentX = e.clientX;
      windowDragRef.current.currentY = e.clientY;

      const now = performance.now();
      if (now - windowDragRef.current.lastUpdateTime < THROTTLE_MS) {
        return;
      }

      windowDragRef.current.lastUpdateTime = now;

      requestAnimationFrame(() => {
        if (!windowDragRef.current.isDragging) return;

        const deltaX = e.clientX - windowDragRef.current.startX;
        const deltaY = e.clientY - windowDragRef.current.startY;

        const titlebarHeight = remToPixels(
          theme.mixins.window.titleBar.height as string
        );
        const overflowPadding = 20;

        const newX = clamp(
          windowDragRef.current.elementX + deltaX,
          0,
          window.innerWidth - overflowPadding * 3
        );
        const newY = clamp(
          windowDragRef.current.elementY + deltaY,
          0,
          window.innerHeight - titlebarHeight - overflowPadding
        );

        // Check for dock zones using current mouse position
        const dockZone = getDockZone(e.clientX, e.clientY);

        // Visual feedback for docking
        const windowElement = document.querySelector(
          `[data-window-id="${draggedWindow}"]`
        ) as HTMLElement;

        if (windowElement) {
          if (dockZone) {
            // Show dock preview
            const dockPos = getDockPosition(dockZone);
            windowElement.style.transform = `translate(${
              dockPos.x - windowDragRef.current.elementX
            }px, ${dockPos.y - windowDragRef.current.elementY}px)`;
            windowElement.style.opacity = '0.7';
          } else {
            // Normal drag
            const offsetX = newX - windowDragRef.current.elementX;
            const offsetY = newY - windowDragRef.current.elementY;
            windowElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            windowElement.style.opacity = '1';
          }
        }
      });
    },
    [
      draggedWindow,
      theme.mixins.window.titleBar.height,
      getDockZone,
      getDockPosition,
    ]
  );

  const handleWindowMouseUp = useCallback(() => {
    if (!draggedWindow || !windowDragRef.current.isDragging) return;

    windowDragRef.current.isDragging = false;

    // Get final position from transform and update state
    const windowElement = document.querySelector(
      `[data-window-id="${draggedWindow}"]`
    ) as HTMLElement;

    if (windowElement) {
      // Check if we should dock using the final mouse position
      const dockZone = getDockZone(
        windowDragRef.current.currentX,
        windowDragRef.current.currentY
      );

      if (dockZone) {
        // Dock the window
        const dockPos = getDockPosition(dockZone);
        const currentWindow = windows.find((w) => w.id === draggedWindow);

        // Store previous state before docking (if not already maximized/docked)
        const previousState =
          currentWindow && !currentWindow.maximized && !currentWindow.docked
            ? {
                x: currentWindow.x,
                y: currentWindow.y,
                width: currentWindow.width,
                height: currentWindow.height,
                docked: null,
              }
            : currentWindow?.previousState;

        setWindows((prev) =>
          prev.map((window) =>
            window.id === draggedWindow
              ? {
                  ...window,
                  ...dockPos,
                  maximized: false,
                  docked: dockZone,
                  animationState: 'docking',
                  previousState,
                }
              : window
          )
        );

        // Reset animation state after docking animation
        const timeout = setTimeout(() => {
          setWindows((prev) =>
            prev.map((window) =>
              window.id === draggedWindow
                ? { ...window, animationState: 'normal' }
                : window
            )
          );
        }, 300);

        animationTimeouts.current.set(`${draggedWindow}-dock`, timeout);
      } else {
        // Normal position update
        const transform = windowElement.style.transform;
        const matches = transform.match(
          /translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/
        );

        if (matches) {
          const deltaX = parseFloat(matches[1]);
          const deltaY = parseFloat(matches[2]);
          const newX = windowDragRef.current.elementX + deltaX;
          const newY = windowDragRef.current.elementY + deltaY;

          // Single state update with final position
          setWindows((prev) =>
            prev.map((window) =>
              window.id === draggedWindow
                ? { ...window, x: newX, y: newY, docked: null }
                : window
            )
          );
        }
      }

      // Reset styles
      windowElement.style.willChange = '';
      windowElement.style.transform = '';
      windowElement.style.zIndex = '';
      windowElement.style.opacity = '';
    }

    setDraggedWindow(null);
  }, [draggedWindow, getDockZone, getDockPosition, windows]);

  // Mouse event listeners with optimized handlers
  useEffect(() => {
    if (draggedIcon) {
      document.addEventListener('mousemove', handleOptimizedIconMouseMove, {
        passive: true,
      });
      document.addEventListener('mouseup', handleIconMouseUp, {
        passive: true,
      });
    }

    return () => {
      document.removeEventListener('mousemove', handleOptimizedIconMouseMove);
      document.removeEventListener('mouseup', handleIconMouseUp);
    };
  }, [draggedIcon, handleOptimizedIconMouseMove, handleIconMouseUp]);

  useEffect(() => {
    if (draggedWindow) {
      document.addEventListener('mousemove', handleOptimizedWindowMouseMove, {
        passive: true,
      });
      document.addEventListener('mouseup', handleWindowMouseUp, {
        passive: true,
      });
    }

    return () => {
      document.removeEventListener('mousemove', handleOptimizedWindowMouseMove);
      document.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggedWindow, handleOptimizedWindowMouseMove, handleWindowMouseUp]);

  const contextValue: WindowContextValue = {
    // State
    windows,
    draggedWindow,
    windowZIndex,
    desktopItemPositions,
    draggedIcon,
    fileSystemItems,

    // Actions
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updateWindowTitle,
    updateWindow,
    handleWindowMouseDown,
    handleIconMouseDown,
    onWindowAnimationComplete,
    onWindowCloseAnimationComplete,
    replaceWindowContent,

    // State setters
    setWindows,
    setDesktopItemPositions,
    setDraggedWindow,
    setDraggedIcon,
    setWindowZIndex,
  };

  return (
    <WindowContext.Provider value={contextValue}>
      {children}
    </WindowContext.Provider>
  );
};

// Hook
export const useWindowManager = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowProvider');
  }
  return context;
};

// Updated convenience hooks
export const useWindowActions = () => {
  const {
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updateWindow,
    updateWindowTitle,
    onWindowAnimationComplete,
    onWindowCloseAnimationComplete,
  } = useWindowManager();

  return {
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updateWindow,
    updateWindowTitle,
    onWindowAnimationComplete,
    onWindowCloseAnimationComplete,
  };
};

export const useWindowState = () => {
  const {
    windows,
    draggedWindow,
    windowZIndex,
    desktopItemPositions,
    draggedIcon,
  } = useWindowManager();
  return {
    windows,
    draggedWindow,
    windowZIndex,
    desktopItemPositions,
    draggedIcon,
  };
};

export const useIconDrag = () => {
  const { handleIconMouseDown, desktopItemPositions, draggedIcon } =
    useWindowManager();
  return { handleIconMouseDown, desktopItemPositions, draggedIcon };
};

export const useWindowDrag = () => {
  const { handleWindowMouseDown, draggedWindow } = useWindowManager();
  return { handleWindowMouseDown, draggedWindow };
};

export const useWindowContentActions = () => {
  const { replaceWindowContent } = useWindowManager();
  return { replaceWindowContent };
};

// Utility function to render a file
export function renderFile<TData = {}, TProps = {}>(
  file: FileSystemItem<TData, TProps>
): ReactNode | null {
  if (!file.fileData || !file.renderer) {
    return null;
  }

  const { component: Component, props = {} } = file.renderer;
  return <Component {...file.fileData} {...(props as TProps)} />;
}
