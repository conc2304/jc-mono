import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';

import { DesktopIconMetaData, WindowMetaData, IconPosition } from '../types';

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
  desktopIcons: DesktopIconMetaData[];
}

interface WindowActions {
  // Window management
  openWindow: (iconId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  bringToFront: (windowId: string) => void;

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

interface WindowContextValue extends WindowState, WindowActions {}

// Context
const WindowContext = createContext<WindowContextValue | null>(null);

// Provider
export const WindowProvider: React.FC<{
  children: React.ReactNode;
  desktopIcons: DesktopIconMetaData[];
  defaultIconPositions?: Record<string, IconPosition>;
}> = ({ children, desktopIcons, defaultIconPositions = {} }) => {
  const [windows, setWindows] = useState<WindowMetaData[]>([]);
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [windowZIndex, setWindowZIndex] = useState(1000);
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

      const newX = Math.max(0, dragRef.current.elementX + deltaX);
      const newY = Math.max(0, dragRef.current.elementY + deltaY);

      setIconPositions((prev) => ({
        ...prev,
        [draggedIcon]: { x: newX, y: newY },
      }));
    },
    [draggedIcon]
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
    []
  );

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) return; // ignore right click
      if (!draggedWindow) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const newX = Math.max(0, dragRef.current.elementX + deltaX);
      const newY = Math.max(0, dragRef.current.elementY + deltaY);

      setWindows((prev) =>
        prev.map((window) =>
          window.id === draggedWindow ? { ...window, x: newX, y: newY } : window
        )
      );
    },
    [draggedWindow]
  );

  const handleWindowMouseUp = useCallback(() => {
    setDraggedWindow(null);
  }, []);

  // Window management functions
  const bringToFront = useCallback(
    (windowId: string) => {
      console.log(windowId);
      const newZIndex = windowZIndex + 1;
      setWindowZIndex(newZIndex);
      setWindows((prev) =>
        prev.map(
          (window) =>
            window.id === windowId
              ? { ...window, zIndex: newZIndex, isActive: true } // this window
              : { ...window, isActive: false } // other windows
        )
      );
    },
    [windowZIndex]
  );

  const openWindow = useCallback(
    (iconId: string) => {
      console.log('Open Window', iconId);
      const icon = desktopIcons && desktopIcons.find((i) => i.id === iconId);
      if (!icon) return;

      const id = `window-${iconId}`;
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
          title: icon.name,
          icon: icon.icon,
          x: 200 + windows.length * 30,
          y: 100 + windows.length * 30,
          width: 400,
          height: 300,
          zIndex: windowZIndex + 1,
          minimized: false,
          maximized: false,
          windowContent: <div>Default Content</div>, // Replace with actual content
          isActive: true,
        };

        setWindows((prev) => [
          ...prev.map((window) => ({ ...window, isActive: false })),
          newWindow,
        ]);
      }

      setWindowZIndex(windowZIndex + 1);
    },
    [desktopIcons, windows, windowZIndex]
  );

  const closeWindow = useCallback((windowId: string) => {
    console.log('Close', windowId);

    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  }, []);

  const minimizeWindow = useCallback(
    (windowId: string) => {
      console.log('Minimize', windowId);
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
    console.log('Maximize', windowId);

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
    desktopIcons,

    // Actions
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
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
  } = useWindowManager();

  return {
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updateWindow,
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

// Component usage examples:

// DesktopOS.tsx
// export const DesktopOS = ({
//   desktopIcons,
// }: {
// }: {
//   desktopIcons: DesktopIcon[];
// }) => {
//   const defaultIconPositions = desktopIcons.reduce((acc, icon, index) => {
//     acc[icon.id] = { x: 50, y: 50 + index * 100 };
//     return acc;
//   }, {} as Record<string, IconPosition>);

//   return (
//     <WindowProvider
//       desktopIcons={desktopIcons}
//       defaultIconPositions={defaultIconPositions}
//     >
//       <div className="desktop">
//         <DesktopIcons />
//         <WindowRenderer />
//         <Taskbar />
//       </div>
//     </WindowProvider>
//   );
// };

// // WindowControls.tsx
// export const WindowControls = ({ windowId }: { windowId: string }) => {
//   const { minimizeWindow, maximizeWindow, closeWindow } = useWindowActions();

//   return (
//     <div className="window-controls">
//       <button onClick={() => minimizeWindow(windowId)}>
//         <Minimize2 />
//       </button>
//       <button onClick={() => maximizeWindow(windowId)}>
//         <Maximize2 />
//       </button>
//       <button onClick={() => closeWindow(windowId)}>
//         <X />
//       </button>
//     </div>
//   );
// };

// // DesktopIcon.tsx
// export const DesktopIcon = ({
//   iconId,
//   children,
// }: {
//   iconId: string;
//   children: React.ReactNode;
// }) => {
//   const { handleIconMouseDown, iconPositions, openWindow } = useWindowManager();
//   const position = iconPositions[iconId] || { x: 0, y: 0 };

//   return (
//     <div
//       style={{
//         position: 'absolute',
//         left: position.x,
//         top: position.y,
//         cursor: 'pointer',
//       }}
//       onMouseDown={(e) => handleIconMouseDown(e, iconId)}
//       onDoubleClick={() => openWindow(iconId)}
//     >
//       {children}
//     </div>
//   );
// };

// // Window.tsx - Updated to use context
// export const Window = ({ windowId }: { windowId: string }) => {
//   const { windows, handleWindowMouseDown, updateWindow } = useWindowManager();
//   const window = windows.find((w) => w.id === windowId);

//   if (!window || window.minimized) return null;

//   return (
//     <div
//       className="window"
//       style={{
//         position: 'absolute',
//         left: window.x,
//         top: window.y,
//         width: window.width,
//         height: window.height,
//         zIndex: window.zIndex,
//       }}
//     >
//       <div
//         className="title-bar"
//         onMouseDown={(e) => handleWindowMouseDown(e, windowId)}
//       >
//         <span>{window.title}</span>
//         <WindowControls windowId={windowId} />
//       </div>
//       <div className="window-content">{window.windowContent}</div>
//     </div>
//   );
// };
