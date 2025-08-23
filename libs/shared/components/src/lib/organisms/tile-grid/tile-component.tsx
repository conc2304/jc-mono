import { cloneElement, isValidElement, useEffect, useState } from 'react';
import { useWindowActions } from '../../context';
import { TileRenderer } from '@jc/file-system';
import { DefaultTileContent } from '../../molecules/live-tile/default-tile-content';
import {
  alpha,
  darken,
  lighten,
  useTheme,
  Box,
  Typography,
} from '@mui/material';
import {
  BackgroundPattern,
  IconContainer,
  TileContainer,
} from '../../molecules/live-tile/styled-components';
import { ChevronRight, Folder } from 'lucide-react';
import { PlacedTile, ResponsiveBreakpointConfig, Tile } from './types';
interface TileComponentProps {
  tile: PlacedTile;
  tileConfig: ResponsiveBreakpointConfig;
  onDragStart: (tile: Tile) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isBeingReordered: boolean;
}
export const TileComponent = ({
  tile,
  tileConfig,
  onDragStart,
  onDragEnd,
  isDragging,
  isBeingReordered,
}: TileComponentProps) => {
  const theme = useTheme();
  const { openWindow } = useWindowActions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const DefaultTileRenderer: TileRenderer = {
    component: DefaultTileContent,
    config: {
      size: 'small' as const,
      showLiveContent: false,
      color: theme.palette.primary.main,
    },
  };
  const isLarge = tile.size === 'large';

  const {
    tileRenderer,
    tileData,
    children,
    icon,
    metadata,
    dateModified,
    size,
    name,
  } = tile.fileData;
  // Use provided renderer or fallback to default
  const renderer = tileRenderer || DefaultTileRenderer;
  const config = renderer.config;
  const ContentComponent = renderer.component;

  // Set up rotation for live content
  useEffect(() => {
    if (config.showLiveContent && ((children?.length || 0) > 1 || tileData)) {
      const interval = setInterval(() => {
        const maxIndex = Math.min(children?.length || 4, 4); // only cycle through the first 4 projects (is this a good idea)
        setCurrentIndex((prev) => (prev + 1) % maxIndex);
      }, config.updateInterval || 3000);
      return () => clearInterval(interval);
    }
    return;
  }, [children, tileData, config.showLiveContent, config.updateInterval]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX: number = e.clientX - rect.left;
    const offsetY: number = e.clientY - rect.top;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tile.id.toString());

    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(3deg)';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);

    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);

    onDragStart(tile);
  };

  return (
    <TileContainer
      className="TileComponent--root"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      effectiveIsDragging={isDragging}
      gradient={{
        from: alpha(
          theme.palette.mode === 'dark'
            ? lighten(config.color, 0.2)
            : darken(config.color, 0.2),
          0.2
        ),
        to: alpha(config.color, 0.4),
      }}
      style={{
        left: tile.x,
        top: tile.y,
        width: tile.width,
        height: tile.height,
        backgroundColor: tile.color,
        padding: tileConfig.tilePadding,
        borderRadius: '8px',
        boxShadow: isDragging
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        transform: isBeingReordered ? 'scale(0.95)' : 'scale(1)',
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
              {isLarge && (
                <Box>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: alpha(theme.palette.common.white, 0.8) }}
                  >
                    {children?.length ? `${children.length} items` : 'Folder'}
                  </Typography>
                </Box>
              )}
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
              {/* {metadata?.favorite && (
                        <Star
                          size={12}
                          style={{ color: '#fbbf24' }}
                          fill="currentColor"
                        />
                      )} */}
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
};
