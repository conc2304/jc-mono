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
import {
  // DesktopIconMetaData,
  WindowMetaData,
  IconPosition,
  FileSystemItem,
} from '../types';

interface DragRef {
  startX: number;
  startY: number;
  elementX: number;
  elementY: number;
}

interface WindowState {
  windows: WindowMetaData[];
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

  // Icon management
  handleIconMouseDown: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    iconId: string
  ) => void;

  // State setters (for internal use)
  setWindows: React.Dispatch<React.SetStateAction<WindowMetaData[]>>;
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

  const [windows, setWindows] = useState<WindowMetaData[]>([]);
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

  // Snap to grid utility
  const snapToGrid = useCallback((x: number, y: number) => {
    const gridSize = 20;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  }, []);

  // Icon drag handlers
  const handleIconMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, iconId: string) => {
      e.preventDefault();
      if (e.button === 2) return; // ignore right click

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
      if (e.button === 2) return; // ignore right click
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
    [draggedIcon]
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
      // check if window already open
      const currWindow = windows.find((window) => window.id === id);
      if (currWindow) {
        // bring it to the front
        setWindows((prev) =>
          prev.map((window) =>
            window.id === id
              ? {
                  ...window,
                  minimized: false,
                  zIndex: windowZIndex + 1,
                  isActive: true,
                }
              : { ...window, isActive: false }
          )
        );
      } else {
        const newWindow: WindowMetaData = {
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
        };

        setWindows((prev) => [
          ...prev.map((window) => ({ ...window, isActive: false })),
          newWindow,
        ]);
      }

      setWindowZIndex(windowZIndex + 1);
    },
    [fileSystemItems, windows, windowZIndex]
  );

  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  }, []);

  const minimizeWindow = useCallback(
    (windowId: string) => {
      const current = windows.find(({ id }) => windowId === id);
      const isOpening = !!current?.minimized;

      setWindows((prev) =>
        prev.map((window) => {
          return window.id === windowId
            ? {
                ...window,
                minimized: !window.minimized,
                isActive: isOpening,
                zIndex: isOpening ? windowZIndex + 1 : window.zIndex,
              }
            : { ...window, isActive: isOpening ? false : window.isActive };
        })
      );

      if (isOpening) {
        setWindowZIndex(windowZIndex + 1);
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
              height: w.maximized ? 300 : (window.innerHeight || 600) - 100, // subtract taskbar height
            }
          : w
      )
    );
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
      if (e.button === 2) return; // ignore right click

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
    [bringToFront]
  );

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) return; // ignore right click
      if (!draggedWindow) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      const taskbarHeight = remToPixels(theme.mixins.taskbar.height as string);
      const titlebarHeight = remToPixels(
        theme.mixins.window.titlebar.height as string
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
        window.innerHeight - taskbarHeight - titlebarHeight - overflowPadding // just a little extra padding
      );

      setWindows((prev) =>
        prev.map((w: WindowMetaData) =>
          w.id === draggedWindow ? { ...w, x: newX, y: newY } : w
        )
      );
    },
    [draggedWindow]
  );

  const handleWindowMouseUp = useCallback(() => {
    setDraggedWindow(null);
  }, []);

  // Mouse event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.button === 2) return; // ignore right click

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

// Convenience hooks for specific functionality
export const useWindowActions = () => {
  const {
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updateWindow,
    updateWindowTitle,
  } = useWindowManager();

  return {
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updateWindow,
    updateWindowTitle,
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
    // For folders: render FileManager with folder contents
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
