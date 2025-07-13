'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import {
  DesktopIcon,
  DesktopIconMetaData,
  Window,
  WindowMetaData,
} from '@jc/ui-components';

import { snapToGrid } from '../utils';
type DesktopOSProps = {
  desktopIcons?: DesktopIconMetaData[];
};

type IconPositions = Record<string, { x: number; y: number }>;

export const DesktopOS = ({ desktopIcons }: DesktopOSProps) => {
  const [windows, setWindows] = useState<WindowMetaData[]>([]);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [windowZIndex, setWindowZIndex] = useState(1000);
  const [iconPositions, setIconPositions] = useState<IconPositions>({
    folder: { x: 50, y: 150 },
    document: { x: 50, y: 250 },
    settings: { x: 50, y: 350 },
    calculator: { x: 50, y: 450 },
    image: { x: 50, y: 550 },
  });

  const desktopRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, elementX: 0, elementY: 0 });

  const TempContent = () => <Box>Temp Content</Box>;

  const handleIconMouseDown = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    iconId: string
  ) => {
    e.preventDefault();

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elementX: iconPositions[iconId].x,
      elementY: iconPositions[iconId].y,
    };

    setDraggedIcon(iconId);
  };

  const handleIconMouseUp = () => {
    if (draggedIcon) {
      const currentPos = iconPositions[draggedIcon];
      const snappedPos = snapToGrid(currentPos.x, currentPos.y);

      setIconPositions((prev) => ({
        ...prev,
        [draggedIcon]: snappedPos,
      }));

      setDraggedIcon(null);
    }
  };

  const handleIconMouseMove = (e) => {
    if (!draggedIcon) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    const newX = Math.max(0, dragRef.current.elementX + deltaX);
    const newY = Math.max(0, dragRef.current.elementY + deltaY);

    setIconPositions((prev) => ({
      ...prev,
      [draggedIcon]: { x: newX, y: newY },
    }));
  };

  const handleWindowMouseMove = (e: MouseEvent) => {
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
  };

  const handleWindowMouseUp = () => {
    setDraggedWindow(null);
  };

  const bringToFront = (windowId: string) => {
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
  };

  const openWindow = (iconId: string) => {
    console.log('Open WIndow', iconId);
    const icon = desktopIcons && desktopIcons.find((i) => i.id === iconId);
    if (!icon) return;

    const id = `window-${iconId}`;
    // check if window already open
    const currWindow = windows.find((window) => window.id === id);
    if (currWindow) {
      // bring it to the front and
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
        windowContent: <TempContent />, // todo add content prop to desktopIcon
        isActive: true,
      };

      setWindows((prev) => [
        ...prev.map((window) => ({ ...window, isActive: false })),
        newWindow,
      ]);
    }

    setWindowZIndex(windowZIndex + 1);
  };

  const closeWindow = (windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === windowId
          ? { ...window, minimized: !window.minimized, isActive: false }
          : window
      )
    );
  };

  const maximizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === windowId
          ? {
              ...window,
              maximized: !window.maximized,
              x: window.maximized ? 200 : 0,
              y: window.maximized ? 100 : 0,
              width: window.maximized ? 400 : window.innerWidth || 800,
              height: window.maximized ? 300 : window.innerHeight || 600,
            }
          : window
      )
    );
  };

  const handleWindowMouseDown = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    windowId: string
  ) => {
    e.preventDefault();
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
  };

  const updateWindow = (
    id: string,
    dimensions: { x: number; y: number; width: number; height: number }
  ) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? {
              ...window,
              ...dimensions,
              // minimized: false,
              // zIndex: windowZIndex + 1,
              // isActive: true,
            }
          : window
      )
    );

    return '';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
  }, [draggedIcon, draggedWindow, iconPositions]);

  return (
    <Box className="Desktop-OS--root">
      <Box>
        {desktopIcons &&
          desktopIcons.map((iconMeta) => (
            <DesktopIcon
              {...iconMeta}
              isDragging={iconMeta.id === draggedIcon}
              position={iconPositions[iconMeta.id]}
              onIconMouseDown={handleIconMouseDown}
              onOpenWindow={openWindow}
              key={iconMeta.id}
            />
          ))}
        {windows &&
          windows.map((windowMetaData) => (
            <Window
              {...windowMetaData}
              onWindowMouseDown={handleWindowMouseDown}
              bringToFront={bringToFront}
              minimizeWindow={minimizeWindow}
              maximizeWindow={maximizeWindow}
              closeWindow={closeWindow}
              onWindowResize={updateWindow}
              minWidth={300}
              minHeight={200}
              resizable
            />
          ))}
      </Box>
    </Box>
  );
};
