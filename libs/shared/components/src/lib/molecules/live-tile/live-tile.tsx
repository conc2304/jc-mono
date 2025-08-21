import { cloneElement, isValidElement, memo, useEffect, useState } from 'react';
import {
  alpha,
  Box,
  darken,
  lighten,
  Typography,
  useTheme,
} from '@mui/material';
import { useIconDrag, useWindowActions } from '../../context';
import {
  BackgroundPattern,
  IconContainer,
  TileContainer,
} from './styled-components';
import { TileRenderer } from '@jc/file-system';
import { DefaultTileContent } from './default-tile-content';
import { ChevronRight, Folder } from 'lucide-react';
import { Star } from '@mui/icons-material';

export interface TileContentProps<TData = {}> {
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

export const LiveTile = memo<LiveTileProps>(
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
    const isSm = theme.breakpoints.down('md');
    const { handleIconMouseDown, draggedIcon } = useIconDrag();
    const { openWindow } = useWindowActions();
    const [currentIndex, setCurrentIndex] = useState(0);

    const isThisIconDragging = draggedIcon === id;
    const effectiveIsDragging = isDragging || isThisIconDragging;

    const DefaultTileRenderer: TileRenderer = {
      component: DefaultTileContent,
      config: {
        size: 'small' as const,
        showLiveContent: false,
        color: theme.palette.primary.main,
      },
    };

    // Use provided renderer or fallback to default
    const renderer = tileRenderer || DefaultTileRenderer;
    const config = renderer.config;
    const ContentComponent = renderer.component;

    // Set up rotation for live content
    useEffect(() => {
      if (config.showLiveContent && ((children?.length || 0) > 1 || tileData)) {
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
          return { width: isSm ? 'calc(100% - 40px)' : 320, height: 340 };
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
        className="LiveTile--root"
        data-icon-id={id}
        effectiveIsDragging={effectiveIsDragging}
        tileSize={tileSize}
        gradient={{
          from: alpha(
            theme.palette.mode === 'dark'
              ? lighten(config.color, 0.2)
              : darken(config.color, 0.2),
            0.2
          ),
          to: alpha(config.color, 0.4),
        }}
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
            {/* <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.5 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <IconContainer isLarge={isLarge}>
                  {isValidElement(icon) ? (
                    cloneElement(icon as React.ReactElement, {
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
            </Box> */}
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

LiveTile.displayName = 'LiveTile';
