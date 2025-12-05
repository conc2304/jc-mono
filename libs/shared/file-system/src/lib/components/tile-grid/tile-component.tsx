import {
  cloneElement,
  CSSProperties,
  isValidElement,
  memo,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  alpha,
  useTheme,
  Box,
  Typography,
  PaletteOptionName,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { Folder } from 'lucide-react';

import { AugmentedButton } from '@jc/ui-components';
import { getContextualImage } from '@jc/utils';

import { PlacedTile, ResponsiveBreakpointConfig, Tile } from './types';
import { useWindowActions } from '../../context';
import { TileRenderer } from '../../types';
import { DefaultTileContent, IconContainer, TileContainer } from '../live-tile';
import { useNavigate } from 'react-router-dom';

const textureImages = [
  'scratched-glass.jpg',
  'scratched-glass-with-scuffs.jpg',
  'scratched-glass-minimal.jpg',
  'scratched-glass-intense-medium-bottom-distressed.jpg',
  'scratched-glass-intense-medium.jpg',
];

const getRandomImgFn = () => Math.floor(Math.random() * textureImages.length);

// Image preloading utility
const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    if (url) {
      const img = new Image();
      img.src = url;
    }
  });
};

// Extract image URLs from tile data
const extractImageUrls = (tileData: any[], maxPreviews: number): string[] => {
  if (!tileData) return [];

  return tileData
    .slice(0, maxPreviews)
    .map((item) => item?.media?.thumbnail?.src || item?.media?.thumbnail?.url)
    .filter(Boolean);
};

interface TileComponentProps {
  tile: PlacedTile;
  tileConfig: ResponsiveBreakpointConfig;
  onDragStart: (tile: Tile) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isBeingReordered: boolean;
  maxPreviews?: number;
}

export const TileComponent = memo(
  ({
    tile,
    tileConfig,
    onDragStart,
    onDragEnd,
    isDragging,
    isBeingReordered,
    maxPreviews = 4,
  }: TileComponentProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { openWindow } = useWindowActions();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [imagesPreloaded, setImagesPreloaded] = useState(false);

    const DefaultTileRenderer: TileRenderer = {
      component: DefaultTileContent,
      config: {
        size: 'small' as const,
        showLiveContent: false,
        color: 'primary',
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
      id,
      type,
    } = tile.fileData;

    // Use provided renderer or fallback to default
    const renderer = tileRenderer || DefaultTileRenderer;
    const config = renderer.config;
    const ContentComponent = renderer.component;

    // Memoize texture background image
    const tileBackgroundImg = useMemo(
      () => textureImages[getRandomImgFn()],
      []
    );

    const bgTextureImgPath = useMemo(
      () =>
        getContextualImage(`textures/ui/${tileBackgroundImg}`, 'thumbnail').src,
      [tileBackgroundImg]
    );

    // Memoize tile color
    const tileColor = useMemo(
      () =>
        theme.palette?.[config.color as PaletteOptionName]?.main ||
        config.color,
      [theme.palette, config.color]
    );

    // Preload images when component mounts
    useEffect(() => {
      if (config.showLiveContent && tileData) {
        const imageUrls = extractImageUrls(tileData, maxPreviews);
        if (imageUrls.length > 0) {
          preloadImages(imageUrls);
          setImagesPreloaded(true);
        }
      }
    }, [tileData, config.showLiveContent]);

    // Set up rotation for live content
    useEffect(() => {
      if (config.showLiveContent && ((children?.length || 0) > 1 || tileData)) {
        const interval = setInterval(() => {
          // Only cycle through the first X projects
          const maxIndex = Math.min(
            children?.length || maxPreviews,
            maxPreviews
          );
          setCurrentIndex((prev) => (prev + 1) % maxIndex);
        }, config.updateInterval || 3000);
        return () => clearInterval(interval);
      }
      return;
    }, [
      children,
      tileData,
      config.showLiveContent,
      config.updateInterval,
      maxPreviews,
    ]);

    const handleDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>): void => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tile.id.toString());
        onDragStart(tile);
      },
      [tile, onDragStart]
    );

    const handleDragEnd = useCallback(
      (e: React.DragEvent<HTMLDivElement>): void => {
        onDragEnd();
      },
      [onDragEnd]
    );

    const handleOpenWindow = useCallback(() => {
      if (type === 'link' && metadata.customProperties?.linkUrl) {
        // TODO handle file system items that link to pages with react router
        navigate(metadata.customProperties?.linkUrl);
      } else {
        openWindow(id);
      }
    }, [openWindow, id]);

    // Memoize style objects
    const containerStyle = useMemo(
      () => ({
        left: tile.x,
        top: tile.y,
        width: tile.width,
        height: tile.height,
        padding: tileConfig.tilePadding,
        boxShadow: isDragging
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        transform: isBeingReordered ? 'scale(0.95)' : 'scale(1)',
      }),
      [
        tile.x,
        tile.y,
        tile.width,
        tile.height,
        tileConfig.tilePadding,
        isDragging,
        isBeingReordered,
      ]
    );

    return (
      <TileContainer
        className="TileComponent--root"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        effectiveIsDragging={isDragging}
        tileColor={tileColor}
        size={config.size}
        data-augmented-ui="t-clip border tl-clip tr-clip bl-clip br-clip"
        style={containerStyle}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundImage: `url('${bgTextureImgPath}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            mixBlendMode: 'screen',
            opacity: 0.2,
          }}
        />

        <Box
          sx={{
            width: '100%',
            height: '100%',
            p: 2,
            position: 'relative',
          }}
        >
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
                    cloneElement(
                      icon as React.ReactElement<{
                        size: number;
                        style: CSSProperties;
                      }>,
                      {
                        size: isLarge ? 24 : 20,
                        style: { color: theme.palette.common.white },
                      }
                    )
                  ) : (
                    <Folder
                      size={isLarge ? 24 : 20}
                      style={{ color: theme.palette.common.white }}
                    />
                  )}
                </IconContainer>
                {isLarge && children?.length && (
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
              {metadata?.favorite && (
                <Star
                  sx={{ marginTop: 1, color: 'warning.main' }}
                  fill="currentColor"
                  stroke={alpha(theme.palette.text.primary, 1)}
                  strokeWidth="0.5px"
                  opacity={0.9}
                />
              )}
            </Box>

            {/* Dynamic Content Area */}
            <AugmentedButton
              className="TileComponent--content-area"
              onClick={handleOpenWindow}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                cursor: 'pointer',
                pointerEvents: 'initial',
                p: 0,
              }}
              fullWidth
              variant="outlined"
              color="info"
            >
              <ContentComponent
                name={name}
                type={type}
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
            </AugmentedButton>

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

              <Box display="flex" alignItems="center" gap={1.5}>
                {config.showLiveContent && children && children.length > 1 && (
                  <Box display="flex" gap={0.5}>
                    {children.slice(0, maxPreviews).map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        sx={{
                          width: 8,
                          height: 8,
                          cursor: 'pointer',
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
