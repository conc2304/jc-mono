import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { useTheme } from '@mui/material';
import { remToPixels } from '@jc/themes';

import { FileManager } from '../organisms/file-manager';
import { WindowMetaData, IconPosition, FileSystemItem } from '../types';

interface DragRef {
  startX: number;
  startY: number;
  elementX: number;
  elementY: number;
}

// Extended WindowMetaData to include animation states
interface AnimatedWindowMetaData extends WindowMetaData {
  isOpening?: boolean;
  isClosing?: boolean;
  animationState?:
    | 'normal'
    | 'opening'
    | 'closing'
    | 'minimizing'
    | 'maximizing';
}

interface WindowState {
  windows: AnimatedWindowMetaData[];
  draggedWindow: string | null;
  windowZIndex: number;
  iconPositions: Record<string, IconPosition>;
  draggedIcon: string | null;
  fileSystemItems: FileSystemItem[];
}

interface WindowActions {
  // Window management
  openWindow: (iconId: string) => void;
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
  setIconPositions: React.Dispatch<
    React.SetStateAction<Record<string, IconPosition>>
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
  defaultIconPositions?: Record<string, IconPosition>;
}> = ({ children, fileSystemItems, defaultIconPositions = {} }) => {
  const theme = useTheme();

  const [windows, setWindows] = useState<AnimatedWindowMetaData[]>([]);
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [windowZIndex, setWindowZIndex] = useState(theme.zIndex.window);
  const [iconPositions, setIconPositions] =
    useState<Record<string, IconPosition>>(defaultIconPositions);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);

  const dragRef = useRef<DragRef>({
    startX: 0,
    startY: 0,
    elementX: 0,
    elementY: 0,
  });

  // Animation timeouts ref to cleanup if needed
  const animationTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

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

  // Icon drag handlers (unchanged)
  const handleIconMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, iconId: string) => {
      e.preventDefault();
      if (e.button === 2) return;

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        elementX: iconPositions[iconId]?.x || 0,
        elementY: iconPositions[iconId]?.y || 0,
      };

      setDraggedIcon(iconId);
    },
    [iconPositions]
  );

  const handleIconMouseUp = useCallback(() => {
    if (draggedIcon) {
      const currentPos = iconPositions[draggedIcon];
      if (currentPos) {
        const snappedPos = snapToGrid(currentPos.x, currentPos.y);

        setIconPositions((prev) => ({
          ...prev,
          [draggedIcon]: snappedPos,
        }));
      }

      setDraggedIcon(null);
    }
  }, [draggedIcon, iconPositions, snapToGrid]);

  const handleIconMouseMove = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) return;
      if (!draggedIcon) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const iconWidth = remToPixels(theme.mixins.desktopIcon.width as string);
      const iconHeight = remToPixels(
        theme.mixins.desktopIcon.maxHeight as string
      );
      const taskbarHeight = remToPixels(theme.mixins.taskbar.height as string);
      const newX = clamp(
        dragRef.current.elementX + deltaX,
        0,
        window.innerWidth - iconWidth
      );
      const newY = clamp(
        dragRef.current.elementY + deltaY,
        0,
        window.innerHeight - taskbarHeight - iconHeight
      );

      setIconPositions((prev) => ({
        ...prev,
        [draggedIcon]: { x: newX, y: newY },
      }));
    },
    [
      draggedIcon,
      theme.mixins.desktopIcon.width,
      theme.mixins.desktopIcon.maxHeight,
      theme.mixins.taskbar.height,
    ]
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
      const fsItem =
        fileSystemItems && fileSystemItems.find((i) => i.id === itemId);
      if (!fsItem) return;

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
                }
              : { ...window, isActive: false }
          )
        );
      } else {
        // Create new window with opening animation
        const newWindow: AnimatedWindowMetaData = {
          id,
          title: fsItem.name,
          icon: fsItem.icon,
          x: 200 + windows.length * 30,
          y: 100 + windows.length * 30,
          width: 400,
          height: 300,
          zIndex: windowZIndex + 1,
          minimized: false,
          maximized: false,
          windowContent: getWindowContent(
            fsItem,
            fileSystemItems,
            (name: string, icon: ReactNode) => updateWindowTitle(id, name, icon)
          ),
          isActive: true,
          isOpening: true,
          animationState: 'opening',
        };

        setWindows((prev) => [
          ...prev.map((window) => ({ ...window, isActive: false })),
          newWindow,
        ]);

        // Set timeout as fallback in case animation callback doesn't fire
        const timeout = setTimeout(() => {
          onWindowAnimationComplete(id);
        }, 350); // Slightly longer than animation duration

        animationTimeouts.current.set(id, timeout);
      }

      setWindowZIndex(windowZIndex + 1);
    },
    [fileSystemItems, windows, windowZIndex, onWindowAnimationComplete]
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
      }, 350); // Slightly longer than animation duration

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

  const maximizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              maximized: !w.maximized,
              x: w.maximized ? 200 : 0,
              y: w.maximized ? 100 : 0,
              width: w.maximized ? 400 : window.innerWidth || 800,
              height: w.maximized ? 300 : (window.innerHeight || 600) - 100,
              animationState: 'maximizing',
            }
          : w
      )
    );

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
  }, []);

  const updateWindow = useCallback(
    (
      id: string,
      dimensions: { x: number; y: number; width: number; height: number }
    ) => {
      setWindows((prev) =>
        prev.map((window) =>
          window.id === id
            ? {
                ...window,
                ...dimensions,
              }
            : window
        )
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

  // Window drag handlers
  const handleWindowMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, windowId: string) => {
      e.preventDefault();
      if (e.button === 2) return;

      // Don't allow dragging during animations
      const window = windows.find((w) => w.id === windowId);
      if (window?.animationState && window.animationState !== 'normal') return;

      const windowElement = e.currentTarget;
      const rect = windowElement.getBoundingClientRect();

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        elementX: rect.left,
        elementY: rect.top,
      };

      setDraggedWindow(windowId);
      bringToFront(windowId);
    },
    [bringToFront, windows]
  );

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) return;
      if (!draggedWindow) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      const taskbarHeight = remToPixels(theme.mixins.taskbar.height as string);
      const titlebarHeight = remToPixels(
        theme.mixins.window.titleBar.height as string
      );
      const overflowPadding = 20;

      const newX = clamp(
        dragRef.current.elementX + deltaX,
        0,
        window.innerWidth - overflowPadding * 3
      );
      const newY = clamp(
        dragRef.current.elementY + deltaY,
        0,
        window.innerHeight - taskbarHeight - titlebarHeight - overflowPadding
      );

      setWindows((prev) =>
        prev.map((w: AnimatedWindowMetaData) =>
          w.id === draggedWindow ? { ...w, x: newX, y: newY } : w
        )
      );
    },
    [
      draggedWindow,
      theme.mixins.taskbar.height,
      theme.mixins.window.titleBar.height,
    ]
  );

  const handleWindowMouseUp = useCallback(() => {
    setDraggedWindow(null);
  }, []);

  // Mouse event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.button === 2) return;

      if (draggedIcon) {
        handleIconMouseMove(e);
      }
      if (draggedWindow) {
        handleWindowMouseMove(e);
      }
    };

    const handleMouseUp = () => {
      handleIconMouseUp();
      handleWindowMouseUp();
    };

    if (draggedIcon || draggedWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    draggedIcon,
    draggedWindow,
    handleIconMouseMove,
    handleWindowMouseMove,
    handleIconMouseUp,
    handleWindowMouseUp,
  ]);

  const contextValue: WindowContextValue = {
    // State
    windows,
    draggedWindow,
    windowZIndex,
    iconPositions,
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

    // State setters
    setWindows,
    setIconPositions,
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
  const { windows, draggedWindow, windowZIndex, iconPositions, draggedIcon } =
    useWindowManager();
  return { windows, draggedWindow, windowZIndex, iconPositions, draggedIcon };
};

export const useIconDrag = () => {
  const { handleIconMouseDown, iconPositions, draggedIcon } =
    useWindowManager();
  return { handleIconMouseDown, iconPositions, draggedIcon };
};

export const useWindowDrag = () => {
  const { handleWindowMouseDown, draggedWindow } = useWindowManager();
  return { handleWindowMouseDown, draggedWindow };
};

const getWindowContent = (
  fsItem: FileSystemItem,
  fileSystemItems: FileSystemItem[],
  updateWindowCallback: (name: string, icon: ReactNode) => void
): ReactNode => {
  if (fsItem.type === 'folder') {
    return (
      <FileManager
        initialPath={fsItem.path}
        folderContents={fsItem.children || []}
        fileSystemItems={fileSystemItems}
        updateWindowName={(name, icon) => updateWindowCallback(name, icon)}
      />
    );
  } else {
    return <div>DEFAULT FILE CONTENT</div>;
  }
};
