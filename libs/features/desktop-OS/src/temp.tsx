import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Settings,
  Image,
  Code,
  ChevronRight,
  Star,
  Clock,
} from 'lucide-react';

// Type definitions to match your existing structure
interface DesktopIconMetaData {
  id: string;
  icon: React.ReactNode;
  name: string;
  // Add other properties as needed
}

interface DesktopIconProps extends DesktopIconMetaData {
  position: { x: number; y: number };
  isDragging?: boolean;
  // Add any additional props your tiles might need
  fileSystemItem?: any; // Your file system item data
  children?: any[]; // For folders with children
  metadata?: {
    tags?: string[];
    favorite?: boolean;
    description?: string;
    thumbnail?: any;
  };
  dateModified?: Date;
  size?: number;
  type?: 'file' | 'folder' | 'app';
}

// Mock hooks for demo - replace with your actual hooks
const useIconDrag = () => ({
  handleIconMouseDown: (e, id) => console.log('Drag start:', id),
  draggedIcon: null,
});

const useWindowActions = () => ({
  openWindow: (id) => console.log('Opening window for:', id),
});

// Live Tile component that replaces DesktopIcon
export const LiveTileDesktopIcon = React.memo<DesktopIconProps>(
  ({
    id,
    position,
    isDragging = false,
    icon,
    name,
    fileSystemItem,
    children,
    metadata,
    dateModified,
    size,
    type = 'file',
  }) => {
    const { handleIconMouseDown, draggedIcon } = useIconDrag();
    const { openWindow } = useWindowActions();
    const [currentChildIndex, setCurrentChildIndex] = useState(0);

    // Check if this specific icon is being dragged
    const isThisIconDragging = draggedIcon === id;
    const effectiveIsDragging = isDragging || isThisIconDragging;

    // Rotate through children for folders
    useEffect(() => {
      if (children && children.length > 1) {
        const interval = setInterval(() => {
          setCurrentChildIndex(
            (prev) => (prev + 1) % Math.min(children.length, 4)
          );
        }, 3000);
        return () => clearInterval(interval);
      }
    }, [children]);

    // Determine tile type and styling based on name/type
    const getTileConfig = () => {
      const name_lower = name.toLowerCase();

      if (
        name_lower.includes('project') ||
        (type === 'folder' && children?.length > 0)
      ) {
        return {
          gradient: 'from-blue-600 to-cyan-600',
          size: 'large', // 2x2
          showLiveContent: true,
        };
      } else if (name_lower.includes('resume') || name_lower.includes('.pdf')) {
        return {
          gradient: 'from-green-500 to-emerald-600',
          size: 'small', // 1x1
          showLiveContent: false,
        };
      } else if (
        name_lower.includes('picture') ||
        name_lower.includes('gallery') ||
        name_lower.includes('art')
      ) {
        return {
          gradient: 'from-purple-500 to-pink-600',
          size: 'small', // 1x1
          showLiveContent: true,
        };
      } else if (name_lower.includes('setting')) {
        return {
          gradient: 'from-gray-600 to-gray-800',
          size: 'small', // 1x1
          showLiveContent: false,
        };
      } else {
        return {
          gradient: 'from-indigo-500 to-purple-600',
          size: 'small',
          showLiveContent: false,
        };
      }
    };

    const config = getTileConfig();
    const isLarge = config.size === 'large';

    // Get size based on tile configuration
    const tileSize = isLarge
      ? { width: 320, height: 240 }
      : { width: 150, height: 150 };

    const currentChild =
      children && children.length > 0 ? children[currentChildIndex] : null;

    return (
      <div
        className="LiveTileDesktopIcon--root absolute cursor-pointer transition-all duration-200 rounded-3xl overflow-hidden"
        data-icon-id={id}
        style={{
          left: position.x,
          top: position.y,
          zIndex: effectiveIsDragging ? 10000 : 1,
          width: tileSize.width,
          height: tileSize.height,
          transform: effectiveIsDragging
            ? 'scale(1.05) rotate(2deg)'
            : 'scale(1)',
          boxShadow: effectiveIsDragging
            ? '0 20px 40px rgba(0, 0, 0, 0.3)'
            : '0 8px 24px rgba(0, 0, 0, 0.15)',
        }}
        onMouseDown={(e) => handleIconMouseDown(e, id)}
        onDoubleClick={() => openWindow(id)}
        onTouchEnd={() => openWindow(id)}
        tabIndex={0}
        role="button"
        aria-label={`${name} tile`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openWindow(id);
          }
        }}
        onMouseEnter={(e) => {
          if (!effectiveIsDragging) {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (!effectiveIsDragging) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
          }
        }}
      >
        <div
          className={`w-full h-full bg-gradient-to-br ${config.gradient} text-white p-4 relative overflow-hidden`}
        >
          {/* Background pattern for visual interest */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`${
                    isLarge ? 'w-10 h-10' : 'w-8 h-8'
                  } bg-white/20 rounded-lg flex items-center justify-center`}
                >
                  {React.isValidElement(icon) ? (
                    React.cloneElement(icon as React.ReactElement, {
                      size: isLarge ? 24 : 20,
                      className: 'text-white',
                    })
                  ) : (
                    <Folder size={isLarge ? 24 : 20} className="text-white" />
                  )}
                </div>
                {isLarge && (
                  <div>
                    <h3 className="font-bold text-sm">{name}</h3>
                    <p className="text-white/80 text-xs">
                      {children?.length ? `${children.length} items` : 'Folder'}
                    </p>
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="text-white/60" />
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center">
              {!isLarge && (
                <div className="text-center">
                  <h3 className="font-bold text-xs mb-1 truncate">{name}</h3>
                  <p className="text-white/80 text-xs">
                    {size
                      ? `${Math.round(size / 1024)} KB`
                      : children?.length
                      ? `${children.length} items`
                      : 'File'}
                  </p>
                </div>
              )}

              {/* Large tile live content */}
              {isLarge && config.showLiveContent && currentChild && (
                <div className="bg-white/10 rounded-xl p-3 mb-3 flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      {React.isValidElement(currentChild.icon) ? (
                        React.cloneElement(
                          currentChild.icon as React.ReactElement,
                          {
                            size: 24,
                            className: 'text-white',
                          }
                        )
                      ) : (
                        <Code size={24} className="text-white" />
                      )}
                    </div>
                    <p className="text-white font-medium text-sm truncate">
                      {currentChild.name?.replace('.proj', '') || 'Project'}
                    </p>
                    {currentChild.metadata?.favorite && (
                      <Star
                        size={12}
                        className="mx-auto mt-1 text-yellow-300 fill-current"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/70 truncate">
                {dateModified?.toLocaleDateString() || 'Recent'}
              </span>
              {metadata?.favorite && (
                <Star size={12} className="text-yellow-300 fill-current ml-2" />
              )}
              {isLarge && children && children.length > 1 && (
                <div className="flex space-x-1 ml-2">
                  {children.slice(0, 4).map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentChildIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LiveTileDesktopIcon.displayName = 'LiveTileDesktopIcon';

// Demo component showing the tiles
const LiveTileDemo = () => {
  const mockIcons = [
    {
      id: 'projects',
      name: 'Projects',
      icon: <Folder />,
      position: { x: 50, y: 50 },
      type: 'folder' as const,
      children: [
        {
          id: '1',
          name: 'React App.proj',
          icon: <Code />,
          metadata: { favorite: true },
        },
        {
          id: '2',
          name: 'Portfolio.proj',
          icon: <Code />,
          metadata: { favorite: false },
        },
        {
          id: '3',
          name: 'Mobile App.proj',
          icon: <Code />,
          metadata: { favorite: true },
        },
      ],
      dateModified: new Date('2024-01-15'),
    },
    {
      id: 'resume',
      name: 'Resume.pdf',
      icon: <FileText />,
      position: { x: 400, y: 50 },
      type: 'file' as const,
      size: 245760,
      dateModified: new Date('2024-01-10'),
      metadata: { favorite: false },
    },
    {
      id: 'gallery',
      name: 'Art Gallery',
      icon: <Image />,
      position: { x: 580, y: 50 },
      type: 'folder' as const,
      children: [
        { id: '4', name: 'landscape.jpg', icon: <Image /> },
        { id: '5', name: 'portrait.png', icon: <Image /> },
      ],
      dateModified: new Date('2024-01-20'),
      metadata: { favorite: true },
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings />,
      position: { x: 50, y: 320 },
      type: 'app' as const,
      dateModified: new Date('2024-01-22'),
    },
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        {mockIcons.map((iconData) => (
          <LiveTileDesktopIcon key={iconData.id} {...iconData} />
        ))}
      </div>
    </div>
  );
};

export default LiveTileDemo;
