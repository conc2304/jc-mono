// import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
// import {
//   IconPosition,
//   WindowMetaData,
//   FileSystemItem,
// } from '@jc/ui-components';

// import { defaultPositionGenerator } from '../utils';

// interface UseOptimizedDragSystemProps {
//   fileSystemItems?: FileSystemItem[];
//   defaultIconPositions?: Record<string, IconPosition>;
//   generateDefaultPositions?: (
//     items: FileSystemItem[]
//   ) => Record<string, IconPosition>;
// }

// export const useOptimizedDragSystem = ({
//   fileSystemItems = [],
//   defaultIconPositions,
//   generateDefaultPositions = defaultPositionGenerator,
// }: UseOptimizedDragSystemProps = {}) => {
//   // Generate initial icon positions from fileSystemItems
//   const initialIconPositions = useMemo(() => {
//     if (defaultIconPositions) {
//       return defaultIconPositions;
//     }

//     if (fileSystemItems.length > 0) {
//       return generateDefaultPositions(fileSystemItems);
//     }

//     return {};
//   }, [fileSystemItems, defaultIconPositions, generateDefaultPositions]);

//   // Get desktop icons (root-level items only)
//   const desktopIcons = useMemo(() => {
//     return fileSystemItems.filter((item) => !item.parentId);
//   }, [fileSystemItems]);

//   const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
//   const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
//   const [windows, setWindows] = useState<WindowMetaData[]>([]);
//   const [iconPositions, setIconPositions] =
//     useState<Record<string, IconPosition>>(initialIconPositions);

//   // Update icon positions when fileSystemItems change
//   useEffect(() => {
//     if (fileSystemItems.length > 0 && Object.keys(iconPositions).length === 0) {
//       setIconPositions(generateDefaultPositions(fileSystemItems));
//     }
//   }, [fileSystemItems, iconPositions, generateDefaultPositions]);

//   // Use refs for frequently updated values to avoid re-renders
//   const dragStateRef = useRef<{
//     startX: number;
//     startY: number;
//     elementX: number;
//     elementY: number;
//     isDragging: boolean;
//     lastUpdateTime: number;
//   }>({
//     startX: 0,
//     startY: 0,
//     elementX: 0,
//     elementY: 0,
//     isDragging: false,
//     lastUpdateTime: 0,
//   });

//   // Throttle updates to reduce frequency
//   const THROTTLE_MS = 16; // ~60fps

//   // Helper function to get current desktop bounds
//   const getDesktopBounds = useCallback(() => {
//     const taskbarHeight = 48; // Default taskbar height
//     const iconSize = 80; // Approximate icon size

//     return {
//       maxX: window.innerWidth - iconSize,
//       maxY: window.innerHeight - taskbarHeight - iconSize,
//       minX: 0,
//       minY: 0,
//     };
//   }, []);

//   // Snap to grid utility
//   const snapToGrid = useCallback(
//     (x: number, y: number) => {
//       const gridSize = 20;
//       const bounds = getDesktopBounds();

//       const snappedX = Math.round(x / gridSize) * gridSize;
//       const snappedY = Math.round(y / gridSize) * gridSize;

//       return {
//         x: Math.max(bounds.minX, Math.min(bounds.maxX, snappedX)),
//         y: Math.max(bounds.minY, Math.min(bounds.maxY, snappedY)),
//       };
//     },
//     [getDesktopBounds]
//   );

//   // Optimized mouse move handler with throttling and RAF
//   const handleOptimizedMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (!dragStateRef.current.isDragging) return;

//       const now = performance.now();
//       if (now - dragStateRef.current.lastUpdateTime < THROTTLE_MS) {
//         return; // Skip this update
//       }

//       dragStateRef.current.lastUpdateTime = now;

//       // Use requestAnimationFrame for smooth updates
//       requestAnimationFrame(() => {
//         if (!dragStateRef.current.isDragging) return;

//         const deltaX = e.clientX - dragStateRef.current.startX;
//         const deltaY = e.clientY - dragStateRef.current.startY;

//         const newX = Math.max(0, dragStateRef.current.elementX + deltaX);
//         const newY = Math.max(0, dragStateRef.current.elementY + deltaY);

//         if (draggedWindow) {
//           // Direct DOM manipulation for smooth dragging
//           const windowElement = document.querySelector(
//             `[data-window-id="${draggedWindow}"]`
//           ) as HTMLElement;
//           if (windowElement) {
//             const offsetX = newX - dragStateRef.current.elementX;
//             const offsetY = newY - dragStateRef.current.elementY;
//             windowElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
//           }
//         } else if (draggedIcon) {
//           // Direct DOM manipulation for icons with bounds checking
//           const iconElement = document.querySelector(
//             `[data-icon-id="${draggedIcon}"]`
//           ) as HTMLElement;
//           if (iconElement) {
//             const bounds = getDesktopBounds();
//             const constrainedX = Math.max(
//               bounds.minX,
//               Math.min(bounds.maxX, newX)
//             );
//             const constrainedY = Math.max(
//               bounds.minY,
//               Math.min(bounds.maxY, newY)
//             );

//             const offsetX = constrainedX - dragStateRef.current.elementX;
//             const offsetY = constrainedY - dragStateRef.current.elementY;
//             iconElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
//           }
//         }
//       });
//     },
//     [draggedWindow, draggedIcon, getDesktopBounds]
//   );

//   // Optimized window drag start
//   const handleWindowMouseDown = useCallback(
//     (e: React.MouseEvent<HTMLElement, MouseEvent>, windowId: string) => {
//       e.preventDefault();
//       if (e.button === 2) return;

//       const windowElement = e.currentTarget;
//       const rect = windowElement.getBoundingClientRect();

//       dragStateRef.current = {
//         startX: e.clientX,
//         startY: e.clientY,
//         elementX: rect.left,
//         elementY: rect.top,
//         isDragging: true,
//         lastUpdateTime: 0,
//       };

//       setDraggedWindow(windowId);

//       // Immediate visual feedback
//       const windowContainer = windowElement.closest(
//         '[data-window-id]'
//       ) as HTMLElement;
//       if (windowContainer) {
//         windowContainer.style.willChange = 'transform';
//         windowContainer.style.pointerEvents = 'none';
//         windowContainer.style.zIndex = '9999';
//       }
//     },
//     []
//   );

//   // Optimized icon drag start
//   const handleIconMouseDown = useCallback(
//     (e: React.MouseEvent<HTMLElement, MouseEvent>, iconId: string) => {
//       e.preventDefault();
//       if (e.button === 2) return;

//       const currentPos = iconPositions[iconId] || { x: 0, y: 0 };

//       dragStateRef.current = {
//         startX: e.clientX,
//         startY: e.clientY,
//         elementX: currentPos.x,
//         elementY: currentPos.y,
//         isDragging: true,
//         lastUpdateTime: 0,
//       };

//       setDraggedIcon(iconId);

//       // Immediate visual feedback
//       const iconElement = e.currentTarget;
//       if (iconElement) {
//         iconElement.style.willChange = 'transform';
//         iconElement.style.pointerEvents = 'none';
//         iconElement.style.zIndex = '9999';
//       }
//     },
//     [iconPositions]
//   );

//   // Optimized drag end with batch state update
//   const handleDragEnd = useCallback(() => {
//     if (!dragStateRef.current.isDragging) return;

//     dragStateRef.current.isDragging = false;

//     // Batch state updates at the end
//     if (draggedWindow) {
//       const windowElement = document.querySelector(
//         `[data-window-id="${draggedWindow}"]`
//       ) as HTMLElement;
//       if (windowElement) {
//         const transform = windowElement.style.transform;
//         const matches = transform.match(
//           /translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/
//         );

//         if (matches) {
//           const deltaX = parseFloat(matches[1]);
//           const deltaY = parseFloat(matches[2]);
//           const newX = dragStateRef.current.elementX + deltaX;
//           const newY = dragStateRef.current.elementY + deltaY;

//           // Single state update with final position
//           setWindows((prev) =>
//             prev.map((window) =>
//               window.id === draggedWindow
//                 ? { ...window, x: newX, y: newY }
//                 : window
//             )
//           );
//         }

//         // Reset styles
//         windowElement.style.willChange = '';
//         windowElement.style.pointerEvents = '';
//         windowElement.style.transform = '';
//         windowElement.style.zIndex = '';
//       }
//     }

//     if (draggedIcon) {
//       const iconElement = document.querySelector(
//         `[data-icon-id="${draggedIcon}"]`
//       ) as HTMLElement;
//       if (iconElement) {
//         const transform = iconElement.style.transform;
//         const matches = transform.match(
//           /translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/
//         );

//         if (matches) {
//           const deltaX = parseFloat(matches[1]);
//           const deltaY = parseFloat(matches[2]);
//           const newX = dragStateRef.current.elementX + deltaX;
//           const newY = dragStateRef.current.elementY + deltaY;

//           // Snap to grid with bounds checking
//           const snappedPos = snapToGrid(newX, newY);

//           // Single state update with final position
//           setIconPositions((prev) => ({
//             ...prev,
//             [draggedIcon]: snappedPos,
//           }));
//         }

//         // Reset styles
//         iconElement.style.willChange = '';
//         iconElement.style.pointerEvents = '';
//         iconElement.style.transform = '';
//         iconElement.style.zIndex = '';
//       }
//     }

//     setDraggedWindow(null);
//     setDraggedIcon(null);
//   }, [draggedWindow, draggedIcon, snapToGrid]);

//   // Event listeners with passive option for better performance
//   useEffect(() => {
//     if (draggedWindow || draggedIcon) {
//       document.addEventListener('mousemove', handleOptimizedMouseMove, {
//         passive: true,
//       });
//       document.addEventListener('mouseup', handleDragEnd, { passive: true });
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleOptimizedMouseMove);
//       document.removeEventListener('mouseup', handleDragEnd);
//     };
//   }, [draggedWindow, draggedIcon, handleOptimizedMouseMove, handleDragEnd]);

//   // Helper function to reset all icon positions
//   const resetIconPositions = useCallback(() => {
//     if (fileSystemItems.length > 0) {
//       setIconPositions(generateDefaultPositions(fileSystemItems));
//     }
//   }, [fileSystemItems, generateDefaultPositions]);

//   // Helper function to add new icon at specific position
//   const addIconAtPosition = useCallback(
//     (iconId: string, position: IconPosition) => {
//       setIconPositions((prev) => ({
//         ...prev,
//         [iconId]: position,
//       }));
//     },
//     []
//   );

//   return {
//     // State
//     draggedWindow,
//     draggedIcon,
//     windows,
//     iconPositions,
//     desktopIcons,
//     fileSystemItems,

//     // Drag handlers
//     handleWindowMouseDown,
//     handleIconMouseDown,

//     // State setters
//     setWindows,
//     setIconPositions,

//     // Helper functions
//     resetIconPositions,
//     addIconAtPosition,
//     snapToGrid,
//     getDesktopBounds,
//   };
// };
