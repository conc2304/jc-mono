import React, { useState, useEffect } from 'react';
import { Box, Typography, alpha, useTheme, styled } from '@mui/material';
import {
  Folder,
  FileText,
  Settings,
  Image,
  Code,
  ChevronRight,
  Star,
  Clock,
  Terminal,
  Palette,
} from 'lucide-react';

// Base tile configuration interface
interface TileConfig {
  size: 'small' | 'medium' | 'large'; // 1x1, 1x2, 2x2
  gradient: {
    from: string;
    to: string;
  };
  showLiveContent?: boolean;
  updateInterval?: number; // ms for content rotation
}

// Tile renderer interface - similar to FileRenderer
interface TileRenderer<TData = {}, TProps = {}> {
  component: React.ComponentType<TileContentProps<TData> & TProps>;
  props?: TProps;
  config: TileConfig;
}

// Props passed to tile content components
interface TileContentProps<TData = {}> {
  name: string;
  icon?: React.ReactNode;
  tileData?: TData;
  children?: any[];
  metadata?: {
    tags?: string[];
    favorite?: boolean;
    description?: string;
    thumbnail?: any;
  };
  dateModified?: Date;
  size?: number;
  isLarge?: boolean;
  // Rotation state for live content
  currentIndex?: number;
  totalItems?: number;
}

// Main Live Tile Props
interface LiveTileProps<TData = {}, TProps = {}> {
  id: string;
  position: { x: number; y: number };
  isDragging?: boolean;
  icon: React.ReactNode;
  name: string;

  // Configurable renderer - like FileSystemItem
  tileRenderer?: TileRenderer<TData, TProps>;
  tileData?: TData;

  // Fallback props for backward compatibility
  children?: any[];
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

// Mock hooks for demo
const useIconDrag = () => ({
  handleIconMouseDown: (e: React.MouseEvent, id: string) =>
    console.log('Drag start:', id),
  draggedIcon: null as string | null,
});

const useWindowActions = () => ({
  openWindow: (id: string) => console.log('Opening window for:', id),
});

// Styled components for better MUI integration
const TileContainer = styled(Box)<{
  effectiveIsDragging: boolean;
  tileSize: { width: number; height: number };
  gradient: { from: string; to: string };
}>(({ theme, effectiveIsDragging, tileSize, gradient }) => ({
  position: 'absolute',
  cursor: 'pointer',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  width: tileSize.width,
  height: tileSize.height,
  background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,

  transition: !effectiveIsDragging
    ? theme.transitions.create(['transform', 'box-shadow'], {
        duration: theme.transitions.duration.standard,
      })
    : 'none',

  transform: effectiveIsDragging ? 'scale(1.05) rotate(2deg)' : 'scale(1)',

  boxShadow: effectiveIsDragging
    ? `0 20px 40px ${alpha(theme.palette.common.black, 0.3)}`
    : `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,

  '&:hover': !effectiveIsDragging
    ? {
        transform: 'scale(1.02)',
        boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.2)}`,
      }
    : {},

  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

const BackgroundPattern = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  opacity: 0.1,
  pointerEvents: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    background: alpha(theme.palette.common.white, 0.2),
    borderRadius: '50%',
    transform: 'translate(64px, -64px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 96,
    height: 96,
    background: alpha(theme.palette.common.white, 0.1),
    borderRadius: '50%',
    transform: 'translate(-48px, 48px)',
  },
}));

const IconContainer = styled(Box)<{ isLarge: boolean }>(
  ({ theme, isLarge }) => ({
    width: isLarge ? 40 : 32,
    height: isLarge ? 40 : 32,
    backgroundColor: alpha(theme.palette.common.white, 0.2),
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  })
);

const ContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Built-in tile content components

// Default/Simple tile content
const DefaultTileContent: React.FC<TileContentProps> = ({
  name,
  icon,
  size,
  dateModified,
  metadata,
  isLarge,
}) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      {!isLarge && (
        <>
          <Typography
            variant="caption"
            fontWeight="bold"
            color="white"
            noWrap
            sx={{ mb: 0.5 }}
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.8),
              fontSize: '0.65rem',
            }}
          >
            {size ? `${Math.round(size / 1024)} KB` : 'File'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.7),
              fontSize: '0.65rem',
              mt: 0.5,
            }}
          >
            {dateModified?.toLocaleDateString() || 'Recent'}
          </Typography>
        </>
      )}
      {metadata?.favorite && (
        <Star
          size={12}
          style={{ marginTop: 8, color: '#fbbf24' }}
          fill="currentColor"
        />
      )}
    </Box>
  );
};

// Projects folder tile content
const ProjectsTileContent: React.FC<
  TileContentProps<{ recentProjects?: any[] }>
> = ({ name, children, currentIndex = 0, isLarge, tileData }) => {
  const theme = useTheme();
  const projects = tileData?.recentProjects || children || [];
  const currentProject = projects[currentIndex];

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {isLarge && (
        <Box mb={2}>
          <Typography variant="h6" color="white" fontWeight="bold">
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: alpha(theme.palette.common.white, 0.8) }}
          >
            {projects.length} projects
          </Typography>
        </Box>
      )}

      {currentProject && isLarge && (
        <ContentContainer sx={{ mb: 2 }}>
          <Box textAlign="center">
            <IconContainer isLarge={false} sx={{ mx: 'auto', mb: 1 }}>
              {React.isValidElement(currentProject.icon) ? (
                React.cloneElement(currentProject.icon as React.ReactElement, {
                  size: 24,
                })
              ) : (
                <Code size={24} />
              )}
            </IconContainer>
            <Typography
              variant="body2"
              color="white"
              fontWeight="medium"
              noWrap
            >
              {currentProject.name?.replace('.proj', '') || 'Project'}
            </Typography>
            {currentProject.metadata?.favorite && (
              <Star
                size={12}
                style={{ marginTop: 4, color: '#fbbf24' }}
                fill="currentColor"
              />
            )}
          </Box>
        </ContentContainer>
      )}

      {!isLarge && (
        <Box textAlign="center">
          <Typography variant="caption" color="white" fontWeight="bold">
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha(theme.palette.common.white, 0.8),
              display: 'block',
            }}
          >
            {projects.length} projects
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Gallery tile content
const GalleryTileContent: React.FC<TileContentProps<{ images?: any[] }>> = ({
  name,
  children,
  currentIndex = 0,
  isLarge,
  tileData,
}) => {
  const theme = useTheme();
  const images = tileData?.images || children || [];
  const currentImage = images[currentIndex];

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box textAlign="center">
        <Typography
          variant={isLarge ? 'body2' : 'caption'}
          color="white"
          fontWeight="bold"
          sx={{ mb: 0.5 }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: alpha(theme.palette.common.white, 0.8) }}
        >
          {images.length} items
        </Typography>
      </Box>

      {currentImage && isLarge && (
        <ContentContainer sx={{ mt: 1 }}>
          <Box textAlign="center">
            <IconContainer
              isLarge={false}
              sx={{
                mx: 'auto',
                mb: 1,
                backgroundColor: alpha('#a855f7', 0.4),
              }}
            >
              <Image size={24} />
            </IconContainer>
            <Typography
              variant="body2"
              sx={{ color: alpha(theme.palette.common.white, 0.9) }}
            >
              {currentImage.name || 'Image'}
            </Typography>
          </Box>
        </ContentContainer>
      )}
    </Box>
  );
};

// Settings tile content
const SettingsTileContent: React.FC<
  TileContentProps<{ activeTheme?: string }>
> = ({ name, tileData, isLarge }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Typography
        variant={isLarge ? 'body2' : 'caption'}
        color="white"
        fontWeight="bold"
        sx={{ mb: 0.5 }}
      >
        {name}
      </Typography>
      <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
        <Palette
          size={12}
          style={{ color: alpha(theme.palette.common.white, 0.7) }}
        />
        <Typography
          variant="caption"
          sx={{ color: alpha(theme.palette.common.white, 0.7), ml: 0.5 }}
        >
          {tileData?.activeTheme || 'Themes'}
        </Typography>
      </Box>
    </Box>
  );
};

// Pre-configured tile renderers
export const TILE_RENDERERS = {
  projects: {
    component: ProjectsTileContent,
    config: {
      size: 'large' as const,
      gradient: { from: '#2563eb', to: '#0891b2' }, // blue-600 to cyan-600
      showLiveContent: true,
      updateInterval: 3000,
    },
  },

  resume: {
    component: DefaultTileContent,
    config: {
      size: 'small' as const,
      gradient: { from: '#10b981', to: '#059669' }, // green-500 to emerald-600
      showLiveContent: false,
    },
  },

  gallery: {
    component: GalleryTileContent,
    config: {
      size: 'small' as const,
      gradient: { from: '#8b5cf6', to: '#ec4899' }, // purple-500 to pink-600
      showLiveContent: true,
      updateInterval: 4000,
    },
  },

  settings: {
    component: SettingsTileContent,
    config: {
      size: 'small' as const,
      gradient: { from: '#4b5563', to: '#1f2937' }, // gray-600 to gray-800
      showLiveContent: false,
    },
  },

  // Default fallback
  default: {
    component: DefaultTileContent,
    config: {
      size: 'small' as const,
      gradient: { from: '#6366f1', to: '#8b5cf6' }, // indigo-500 to purple-600
      showLiveContent: false,
    },
  },
} as const;

// Main configurable Live Tile component
export const ConfigurableLiveTile = React.memo<LiveTileProps>(
  ({
    id,
    position,
    isDragging = false,
    icon,
    name,
    tileRenderer,
    tileData,
    children,
    metadata,
    dateModified,
    size,
    type = 'file',
  }) => {
    const theme = useTheme();
    const { handleIconMouseDown, draggedIcon } = useIconDrag();
    const { openWindow } = useWindowActions();
    const [currentIndex, setCurrentIndex] = useState(0);

    const isThisIconDragging = draggedIcon === id;
    const effectiveIsDragging = isDragging || isThisIconDragging;

    // Use provided renderer or fallback to default
    const renderer = tileRenderer || TILE_RENDERERS.default;
    const config = renderer.config;
    const ContentComponent = renderer.component;

    // Set up rotation for live content
    useEffect(() => {
      if (config.showLiveContent && (children?.length > 1 || tileData)) {
        const interval = setInterval(() => {
          const maxIndex = children?.length || 4;
          setCurrentIndex((prev) => (prev + 1) % maxIndex);
        }, config.updateInterval || 3000);
        return () => clearInterval(interval);
      }
    }, [children, tileData, config.showLiveContent, config.updateInterval]);

    // Get tile dimensions based on size
    const getTileSize = () => {
      switch (config.size) {
        case 'large':
          return { width: 320, height: 240 };
        case 'medium':
          return { width: 240, height: 150 };
        case 'small':
          return { width: 150, height: 150 };
        default:
          return { width: 150, height: 150 };
      }
    };

    const tileSize = getTileSize();
    const isLarge = config.size === 'large';

    return (
      <TileContainer
        data-icon-id={id}
        effectiveIsDragging={effectiveIsDragging}
        tileSize={tileSize}
        gradient={config.gradient}
        sx={{
          left: position.x,
          top: position.y,
          zIndex: effectiveIsDragging ? 10000 : 1,
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
      >
        <Box sx={{ width: '100%', height: '100%', p: 2, position: 'relative' }}>
          <BackgroundPattern />

          <Box
            sx={{
              position: 'relative',
              zIndex: 10,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.5 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <IconContainer isLarge={isLarge}>
                  {React.isValidElement(icon) ? (
                    React.cloneElement(icon as React.ReactElement, {
                      size: isLarge ? 24 : 20,
                      style: { color: theme.palette.common.white },
                    })
                  ) : (
                    <Folder
                      size={isLarge ? 24 : 20}
                      style={{ color: theme.palette.common.white }}
                    />
                  )}
                </IconContainer>
              </Box>
              <ChevronRight
                size={16}
                style={{ color: alpha(theme.palette.common.white, 0.6) }}
              />
            </Box>

            {/* Dynamic Content Area */}
            <Box display="flex" flexDirection="column" flex={1}>
              <ContentComponent
                name={name}
                icon={icon}
                tileData={tileData}
                children={children}
                metadata={metadata}
                dateModified={dateModified}
                size={size}
                isLarge={isLarge}
                currentIndex={currentIndex}
                totalItems={children?.length || 0}
                {...(renderer.props || {})}
              />
            </Box>

            {/* Footer */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: alpha(theme.palette.common.white, 0.7),
                  fontSize: '0.65rem',
                }}
              >
                {dateModified?.toLocaleDateString() || 'Recent'}
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                {metadata?.favorite && (
                  <Star
                    size={12}
                    style={{ color: '#fbbf24' }}
                    fill="currentColor"
                  />
                )}
                {config.showLiveContent && children && children.length > 1 && (
                  <Box display="flex" gap={0.5}>
                    {children.slice(0, 4).map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor:
                            index === currentIndex
                              ? theme.palette.common.white
                              : alpha(theme.palette.common.white, 0.4),
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </TileContainer>
    );
  }
);

ConfigurableLiveTile.displayName = 'ConfigurableLiveTile';

// Demo showing different configurations
const ConfigurableTileDemo = () => {
  const mockTiles = [
    {
      id: 'projects',
      name: 'Projects',
      icon: <Folder />,
      position: { x: 50, y: 50 },
      tileRenderer: TILE_RENDERERS.projects,
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
      tileRenderer: TILE_RENDERERS.resume,
      size: 245760,
      dateModified: new Date('2024-01-10'),
    },
    {
      id: 'gallery',
      name: 'Gallery',
      icon: <Image />,
      position: { x: 580, y: 50 },
      tileRenderer: TILE_RENDERERS.gallery,
      children: [
        { id: '4', name: 'landscape.jpg' },
        { id: '5', name: 'portrait.png' },
        { id: '6', name: 'abstract.svg' },
      ],
      dateModified: new Date('2024-01-20'),
      metadata: { favorite: true },
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings />,
      position: { x: 50, y: 320 },
      tileRenderer: TILE_RENDERERS.settings,
      tileData: { activeTheme: 'Dark' },
      dateModified: new Date('2024-01-22'),
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0 }}>
        {mockTiles.map((tileData) => (
          <ConfigurableLiveTile key={tileData.id} {...tileData} />
        ))}
      </Box>
    </Box>
  );
};

export default ConfigurableTileDemo;
