import {
  Box,
  Container,
  IconButton,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { InsertionZone } from './insertion-zone';
import { useResponsiveTileConfig } from './use-responsive-tile-config';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { DragState, InsertionSide, Tile } from './types';
import { useTilePlacement } from './use-tile-placement';
import { BaseFileSystemItem } from '@jc/file-system';
import { TileComponent } from './tile-component';
import { RestartAlt, Shuffle } from '@mui/icons-material';
import { ColorModeSwitcher } from '@jc/themes';

export const TileGrid = ({
  gridTiles = [],
  footer,
}: {
  gridTiles: BaseFileSystemItem[];
  footer?: ReactNode;
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const { config, breakpoint } = useResponsiveTileConfig();
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [tiles, setTiles] = useState<BaseFileSystemItem[]>(gridTiles);
  const [tileOrder, setTileOrder] = useState<string[]>(
    gridTiles.map((tile) => tile.id)
  );

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTile: null,
    hoveredInsertionIndex: null,
    hoveredZoneSide: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const updateWidth = (): void => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };

      updateWidth();

      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  // Update tile order when tiles change (add/remove)
  useEffect(() => {
    const currentIds: string[] = tiles.map((tile) => tile.id);
    const newOrder: string[] = tileOrder.filter((id) =>
      currentIds.includes(id)
    );

    // Add any new tiles to the end
    currentIds.forEach((id) => {
      if (!newOrder.includes(id)) {
        newOrder.push(id);
      }
    });

    // Only update if the order actually changed (to avoid infinite loops)
    if (
      newOrder.length !== tileOrder.length ||
      !newOrder.every((id, index) => id === tileOrder[index])
    ) {
      setTileOrder(newOrder);
    }
  }, [tiles]);

  const { placedTiles, insertionZones } = useTilePlacement(
    tiles,
    config,
    containerWidth,
    tileOrder
  );

  const handleDragStart = (tile: Tile): void => {
    setDragState({
      isDragging: true,
      draggedTile: tile,
      hoveredInsertionIndex: null,
      hoveredZoneSide: null,
    });
  };

  const handleDragEnd = (): void => {
    setDragState({
      isDragging: false,
      draggedTile: null,
      hoveredInsertionIndex: null,
      hoveredZoneSide: null,
    });
  };

  const handleInsertionZoneHover = (
    insertIndex: number,
    zoneSide: InsertionSide
  ): void => {
    setDragState((prev) => ({
      ...prev,
      hoveredInsertionIndex: insertIndex,
      hoveredZoneSide: zoneSide,
    }));
  };

  const handleInsertionDrop = (insertIndex: number): void => {
    if (!dragState.draggedTile) return;

    const draggedId: string = dragState.draggedTile.id;
    const currentIndex: number = tileOrder.indexOf(draggedId);

    if (currentIndex === -1) return;

    const newOrder: string[] = [...tileOrder];

    // Remove the dragged tile from its current position
    newOrder.splice(currentIndex, 1);

    // Adjust insert index if we removed an item before it
    const adjustedInsertIndex: number =
      insertIndex > currentIndex ? insertIndex - 1 : insertIndex;

    // Insert the tile at the new position
    newOrder.splice(adjustedInsertIndex, 0, draggedId);

    setTileOrder(newOrder);
    handleDragEnd();
  };

  const resetTiles = (): void => {
    setTiles(gridTiles);
    setTileOrder(gridTiles.map((tile) => tile.id));
  };

  const shuffleTiles = (): void => {
    const shuffled: string[] = [...tileOrder].sort(() => Math.random() - 0.5);
    setTileOrder(shuffled);
  };

  return (
    <Box
      className="TileGrid--root"
      sx={{
        width: '100%',
        height: '100%',
        p: breakpoint === 'mobile' ? 0 : 2,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          height: '100%',
          // px: breakpoint === 'mobile' ? 1 : undefined,
          p: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          data-augmented-ui="border br-2-clip-x tr-2-clip-x bl-2-clip-x tl-2-clip-x b-clip"
          className="TileGrid--tile-container"
          ref={containerRef}
          sx={(theme) => ({
            '--aug-border-bg': theme.palette.secondary.main,
            '--aug-border-all': '1.5px',
            '--aug-b': config.containerPadding + 'px',
            '--aug-br': config.containerPadding / 2 + 'px',
            '--aug-bl': config.containerPadding / 2 + 'px',
            '--aug-tl': config.containerPadding / 2 + 'px',
            '--aug-tl-extend2': '12.5%',
            '--aug-tr-extend1': '12.5%',
            '--aug-tr': config.containerPadding / 2 + 'px',
            '--aug-b-extend1': '50%',

            position: 'relative',
            width: '100%',
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            flexGrow: 1,
          })}
        >
          {/* Scroll Container */}
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              width: '99%',
              overflowY: 'auto',

              p: config.containerPadding / 2 + 'px',
              mr: 0.25,

              // For some reason the Augmented Border flashes when there is overflow
              '&::-webkit-scrollbar:horizontal': {
                display: 'none',
              },
            }}
          >
            {/* Insertion zones */}
            {dragState.isDragging &&
              insertionZones.map((zone) => (
                <InsertionZone
                  key={zone.id}
                  zone={zone}
                  isActive={
                    dragState.hoveredInsertionIndex === zone.insertIndex &&
                    dragState.hoveredZoneSide === zone.side
                  }
                  onDrop={handleInsertionDrop}
                  onHover={handleInsertionZoneHover}
                />
              ))}

            {/* Tiles */}
            {placedTiles.map((tile) => (
              <TileComponent
                key={tile.id}
                tile={tile}
                tileConfig={config}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={
                  dragState.isDragging && dragState.draggedTile?.id === tile.id
                }
                isBeingReordered={
                  dragState.isDragging && dragState.draggedTile?.id !== tile.id
                }
              />
            ))}
            <Box
              // Add empty padding after the last tile's end to increase natural container size
              className="TileGrid--bottom-padding-spacer"
              sx={{
                position: 'absolute',
                height: config.containerPadding,
                width: '100%',
                top: placedTiles.reduce(
                  (prev, curr) => Math.max(prev, curr.y + curr.height),
                  0
                ),
              }}
            />
          </Box>

          {/* Color Mode Switcher */}
          {!isSm && (
            <>
              {/* Tile Placement Controls */}
              <Box
                className="TileGrid--control-btns"
                sx={{
                  position: 'absolute',
                  bottom: '5px',
                  left: `calc(((${config.containerPadding * 2}px) + 25%) / 2)`, // matches/compliments the spacing of the augmented bottom border
                  transform: 'translateX(-50%)',
                }}
              >
                <IconButton
                  color="secondary"
                  onClick={shuffleTiles}
                  data-augmented-ui="tr-clip"
                  sx={{
                    '--aug-tr': '0.75rem',
                  }}
                >
                  <Shuffle />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={resetTiles}
                  data-augmented-ui="tr-clip"
                  sx={{
                    '--aug-tr': '0.75rem',
                  }}
                >
                  <RestartAlt />
                </IconButton>
              </Box>

              <Box
                className="TileGrid--color-mode-switcher-wrapper"
                sx={{
                  position: 'absolute',
                  bottom: '5px',
                  right: `calc(((${config.containerPadding * 2}px) + 25%) / 2)`, // matches/compliments the spacing of the augmented bottom border
                  transform: 'translateX(60%)',
                }}
              >
                <ColorModeSwitcher />
              </Box>
            </>
          )}
        </Box>

        {!isSm && footer && (
          <Box
            sx={{
              position: 'absolute',
              bottom: isMd ? '0' : '0.5rem',
              left: '50%',
              right: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {footer}
          </Box>
        )}

        {isSm && (
          <Box
            width="100%"
            position={'relative'}
            flexShrink={0}
            display="flex"
            p={1}
            justifyContent={'space-between'}
          >
            {/* Tile Placement Controls */}
            <Box className="TileGrid--control-btns">
              <IconButton
                color="secondary"
                onClick={shuffleTiles}
                data-augmented-ui="tr-clip"
                sx={{
                  '--aug-tr': '0.75rem',
                }}
              >
                <Shuffle />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={resetTiles}
                data-augmented-ui="tr-clip"
                sx={{
                  '--aug-tr': '0.75rem',
                }}
              >
                <RestartAlt />
              </IconButton>
            </Box>

            {/* Footer */}
            {footer && <Box>{footer}</Box>}

            <Box className="TileGrid--color-mode-switcher-wrapper">
              <ColorModeSwitcher />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};
