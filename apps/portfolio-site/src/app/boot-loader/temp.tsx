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
import { WindowMetaData, IconPosition } from '../types';
import { findFileSystemItemByIdWithPath } from '../utils';
import {
  FileSystemItem,
  FileSystemNavigationManager,
  NavigationGroup,
  PROJECT_NAVIGATION_GROUP, // Keep as default
} from '@jc/file-system';

// ... (keep all your existing interfaces unchanged)

// Updated WindowProvider with navigationGroups prop
export const WindowProvider: React.FC<{
  children: React.ReactNode;
  fileSystemItems: FileSystemItem[];
  defaultIconPositions?: Record<string, IconPosition>;
  // NEW: Add navigationGroups prop
  navigationGroups?: NavigationGroup[];
}> = ({
  children,
  fileSystemItems,
  defaultIconPositions = {},
  // NEW: Default to PROJECT_NAVIGATION_GROUP if none provided
  navigationGroups = [PROJECT_NAVIGATION_GROUP],
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));

  const taskbarHeight = remToPixels(theme.mixins.taskbar.height as string);

  // Your existing state (unchanged)
  const [windows, setWindows] = useState<AnimatedWindowMetaData[]>([]);
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [windowZIndex, setWindowZIndex] = useState(theme.zIndex.window);
  const [iconPositions, setIconPositions] =
    useState<Record<string, IconPosition>>(defaultIconPositions);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);

  // NEW: Create navigation manager with provided groups
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

  // ... (keep all your existing drag refs, performance constants, etc. unchanged)

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
          // NEW: Use the memoized navigation manager instead of creating a new one
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
  ); // Add navigationManager to dependencies

  // ... (keep all your existing functions unchanged: animation callbacks, drag handlers, etc.)

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
                }
              : { ...window, isActive: false }
          )
        );
      } else {
        // Create new window with content (potentially with navigation)
        const maximized = fsItem.type !== 'folder' && !isXs;
        const width =
          fsItem.type === 'folder' && !isXs ? 550 : window.innerWidth;
        const height =
          fsItem.type === 'folder' && !isXs
            ? 400
            : window.innerHeight - (isXs ? 0 : taskbarHeight);
        const x =
          fsItem.type === 'folder' && !isXs ? 200 + windows.length * 30 : 0;
        const y =
          fsItem.type === 'folder' && !isXs ? 100 + windows.length * 30 : 0;

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
      getWindowContent, // Add getWindowContent to dependencies
    ]
  );

  // ... (keep all your other existing functions unchanged)

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
    replaceWindowContent,

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

// ... (keep all your existing hooks unchanged)
