import {
  cloneElement,
  CSSProperties,
  isValidElement,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { randomInt } from 'd3';

import { useWindowActions } from '../../context';
import { TileRenderer } from '@jc/file-system';
import { DefaultTileContent } from '../../molecules/live-tile/default-tile-content';
import {
  alpha,
  useTheme,
  Box,
  Typography,
  PaletteOptionName,
} from '@mui/material';
import {
  IconContainer,
  TileContainer,
} from '../../molecules/live-tile/styled-components';
import { Folder } from 'lucide-react';
import { PlacedTile, ResponsiveBreakpointConfig, Tile } from './types';
import { AugmentedButton, DiagonalLines } from '../../atoms';

const textureImages = [
  'scratched-glass.png',
  'scratched-glass-with-scuffs.png',
  'scratched-glass-minimal.png',
  'scratched-glass-intense-medium-bottom-distressed.png',
  'scratched-glass-intense-medium.png',
];

const getRandomImgFn = randomInt(textureImages.length);

interface TileComponentProps {
  tile: PlacedTile;
  tileConfig: ResponsiveBreakpointConfig;
  onDragStart: (tile: Tile) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isBeingReordered: boolean;
}

export const TileComponent = memo(
  ({
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
      const offsetX: number = e.clientX - rect.left / 2;
      const offsetY: number = e.clientY - rect.top / 2;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', tile.id.toString());

      // Create a custom drag image
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.opacity = '0.1';
      dragImage.style.transform = 'rotate(3deg)';
      dragImage.style.border = `1px solid ${theme.palette.secondary.main}`;
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);

      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);

      onDragStart(tile);
    };

    const tileColor =
      theme.palette?.[config.color as PaletteOptionName]?.main || config.color;

    const tileBackgroundImg = useMemo(
      () => textureImages[getRandomImgFn()],
      []
    );
    const bgImgPath = `/textures/${tileBackgroundImg}`;

    return (
      <TileContainer
        className="TileComponent--root"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        effectiveIsDragging={isDragging}
        tileColor={tileColor}
        size={config.size}
        data-augmented-ui="t-clip border tl-clip tr-clip bl-clip br-clip"
        style={{
          left: tile.x,
          top: tile.y,
          width: tile.width,
          height: tile.height,
          padding: tileConfig.tilePadding,
          boxShadow: isDragging
            ? '0 8px 32px rgba(0,0,0,0.3)'
            : '0 2px 8px rgba(0,0,0,0.1)',
          transform: isBeingReordered ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundImage: `url('${bgImgPath}')`,
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
            // pointerEvents: 'none',
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
            </Box>
            {/* Dynamic Content Area */}
            <AugmentedButton
              className="TileComponent--content-area"
              onClick={() => openWindow(id)}
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

              <Box display="flex" alignItems="center" gap={1}>
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

          <Box
            className="TileComponent--drag-handle"
            data-augmented-ui="border bl-clip br-clip"
            sx={{
              '--aug-border-top': '2px',
              '--aug-border-bottom': '0px',

              position: 'absolute',
              bottom: 0,
              left: '50%',
              right: '50%',
              transform: 'translateX(-50%)',
              width: '20%',
              height: '15px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <DiagonalLines
              height="100%"
              lineThickness={5}
              spacing={20}
              direction="diagonal"
              color={theme.palette.text.primary}
            />
            <DiagonalLines
              height="100%"
              lineThickness={5}
              spacing={20}
              direction="diagonal-alt"
              color={theme.palette.text.primary}
            />
          </Box>
        </Box>
      </TileContainer>
    );
  }
);
