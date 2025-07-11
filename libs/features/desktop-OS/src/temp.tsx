import React, { useState, useRef, useEffect } from 'react';
import {
  Folder,
  FileText,
  Settings,
  Calculator,
  Image,
  Minimize2,
  Maximize2,
  X,
} from 'lucide-react';

const DesktopOS = () => {
  const [windows, setWindows] = useState([]);
  const [draggedIcon, setDraggedIcon] = useState(null);
  const [draggedWindow, setDraggedWindow] = useState(null);
  const [windowZIndex, setWindowZIndex] = useState(1000);
  const [iconPositions, setIconPositions] = useState({
    folder: { x: 50, y: 50 },
    document: { x: 50, y: 150 },
    settings: { x: 50, y: 250 },
    calculator: { x: 50, y: 350 },
    image: { x: 50, y: 450 },
  });

  const desktopRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, elementX: 0, elementY: 0 });

  const desktopIcons = [
    { id: 'folder', name: 'My Folder', icon: Folder, color: 'text-blue-500' },
    {
      id: 'document',
      name: 'Document',
      icon: FileText,
      color: 'text-green-500',
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      color: 'text-gray-500',
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: Calculator,
      color: 'text-purple-500',
    },
    { id: 'image', name: 'Images', icon: Image, color: 'text-pink-500' },
  ];

  const snapToGrid = (x, y) => {
    const gridSize = 20;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  };

  const handleIconMouseDown = (e, iconId) => {
    e.preventDefault();
    // const rect = e.currentTarget.getBoundingClientRect();
    // const desktopRect = desktopRef.current.getBoundingClientRect();

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elementX: iconPositions[iconId].x,
      elementY: iconPositions[iconId].y,
    };

    setDraggedIcon(iconId);
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

  const handleWindowMouseDown = (e, windowId) => {
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

  const handleWindowMouseMove = (e) => {
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

  const bringToFront = (windowId) => {
    const newZIndex = windowZIndex + 1;
    setWindowZIndex(newZIndex);
    setWindows((prev) =>
      prev.map((window) =>
        window.id === windowId ? { ...window, zIndex: newZIndex } : window
      )
    );
  };

  const openWindow = (iconId) => {
    const icon = desktopIcons.find((i) => i.id === iconId);
    if (!icon) return;

    const newWindow = {
      id: `window-${Date.now()}`,
      title: icon.name,
      icon: icon.icon,
      color: icon.color,
      x: 200 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: 400,
      height: 300,
      zIndex: windowZIndex + 1,
      minimized: false,
      maximized: false,
    };

    setWindows((prev) => [...prev, newWindow]);
    setWindowZIndex(windowZIndex + 1);
  };

  const closeWindow = (windowId) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  const minimizeWindow = (windowId) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === windowId
          ? { ...window, minimized: !window.minimized }
          : window
      )
    );
  };

  const maximizeWindow = (windowId) => {
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

  useEffect(() => {
    const handleMouseMove = (e) => {
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

  const renderWindowContent = (window) => {
    switch (window.title) {
      case 'Calculator':
        return (
          <div className="p-4">
            <div className="bg-gray-800 text-white p-2 rounded mb-2 text-right">
              0
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                '7',
                '8',
                '9',
                '/',
                '4',
                '5',
                '6',
                '*',
                '1',
                '2',
                '3',
                '-',
                '0',
                '.',
                '=',
                '+',
              ].map((btn) => (
                <button
                  key={btn}
                  className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span>Notifications</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>Sound</span>
                <input type="range" className="w-24" />
              </div>
            </div>
          </div>
        );
      case 'My Folder':
        return (
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                'File 1.txt',
                'File 2.doc',
                'Image.jpg',
                'Video.mp4',
                'Archive.zip',
              ].map((file) => (
                <div
                  key={file}
                  className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <FileText className="w-8 h-8 text-blue-500 mb-1" />
                  <span className="text-xs text-center">{file}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <p>This is the {window.title} application.</p>
            <p className="text-gray-600 mt-2">Content goes here...</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={desktopRef}
      className="w-full h-screen bg-gradient-to-br from-blue-400 to-purple-600 relative overflow-hidden select-none"
    >
      {/* Desktop Icons */}
      {desktopIcons.map((icon) => {
        const IconComponent = icon.icon;
        const position = iconPositions[icon.id];

        return (
          <div
            key={icon.id}
            className={`absolute cursor-pointer transition-all duration-200 ${
              draggedIcon === icon.id ? 'scale-110 shadow-lg' : ''
            }`}
            style={{
              left: position.x,
              top: position.y,
              zIndex: draggedIcon === icon.id ? 10000 : 1,
            }}
            onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
            onDoubleClick={() => openWindow(icon.id)}
          >
            <div className="flex flex-col items-center p-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all">
              <IconComponent className={`w-8 h-8 ${icon.color} mb-1`} />
              <span className="text-white text-xs font-medium text-center">
                {icon.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Windows */}
      {windows.map((window) => {
        const IconComponent = window.icon;

        return (
          <div
            key={window.id}
            className={`absolute bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-200 ${
              window.minimized ? 'hidden' : ''
            }`}
            style={{
              left: window.x,
              top: window.y,
              width: window.width,
              height: window.height,
              zIndex: window.zIndex,
            }}
            onClick={() => bringToFront(window.id)}
          >
            {/* Title Bar */}
            <div
              className="bg-gray-800 text-white p-2 flex items-center justify-between cursor-move"
              onMouseDown={(e) => handleWindowMouseDown(e, window.id)}
            >
              <div className="flex items-center space-x-2">
                <IconComponent className={`w-4 h-4 ${window.color}`} />
                <span className="text-sm font-medium">{window.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    minimizeWindow(window.id);
                  }}
                  className="hover:bg-gray-700 p-1 rounded"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    maximizeWindow(window.id);
                  }}
                  className="hover:bg-gray-700 p-1 rounded"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(window.id);
                  }}
                  className="hover:bg-red-600 p-1 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="h-full overflow-auto">
              {renderWindowContent(window)}
            </div>
          </div>
        );
      })}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-2 flex items-center space-x-2">
        <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
          Start
        </div>
        {windows.map((window) => (
          <button
            key={window.id}
            onClick={() => minimizeWindow(window.id)}
            className={`flex items-center space-x-2 px-3 py-1 rounded text-sm ${
              window.minimized
                ? 'bg-gray-600 text-gray-300'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <window.icon className="w-4 h-4" />
            <span>{window.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DesktopOS;
