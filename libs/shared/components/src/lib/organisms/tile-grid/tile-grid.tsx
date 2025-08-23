import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { InsertionZone } from './insertion-zone';
import { useResponsiveTileConfig } from './use-responsive-tile-config';
import { useEffect, useRef, useState } from 'react';
import { DragState, InsertionSide, Tile, TileSize } from './types';
import { useTilePlacement } from './use-tile-placement';
import { BaseFileSystemItem } from '@jc/file-system';
import { TileComponent } from './tile-component';

export const TileGrid = ({
  gridTiles = [],
}: {
  gridTiles: BaseFileSystemItem[];
}) => {
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
  }, [tiles]); // Removed tileOrder from dependencies to prevent shuffle resets

  const { placedTiles, gridHeight, insertionZones } = useTilePlacement(
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
        // minHeight: '100vh',
        // overflowY:
        height: '100%',
        backgroundColor: 'grey.900',
        p: breakpoint === 'mobile' ? 0 : 2,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          height: '100%',
          px: breakpoint === 'mobile' ? 0 : undefined,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          className="TileGrid--control-btns"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              onClick={shuffleTiles}
              variant="contained"
              sx={{
                backgroundColor: '#9c27b0',
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                },
              }}
            >
              Shuffle
            </Button>

            <Button
              onClick={resetTiles}
              variant="contained"
              sx={{
                backgroundColor: 'grey.600',
                '&:hover': {
                  backgroundColor: 'grey.700',
                },
              }}
            >
              Reset
            </Button>
          </Stack>
        </Box>

        <Box
          className="TileGrid--tile-container"
          ref={containerRef}
          sx={{
            position: 'relative',
            width: '100%',
            backgroundColor: 'grey.800',
            borderRadius: 1,
            // height: gridHeight,
            flexGrow: 1,
            // height: '100%',
            overflowY: 'auto',
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
            <Box
              key={tile.id}
              onDoubleClick={() => console.log(tile.id, tile.y)}
            >
              <TileComponent
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
            </Box>
          ))}
          <Box
            className="TileGrid--bottom-spacer"
            sx={{
              position: 'absolute',
              top: placedTiles.reduce(
                (prev, curr, i, arr) => Math.max(prev, curr.y + curr.height),
                0
              ),
              // border: '1px solid',
              width: '100%',
              height: config.containerPadding,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};
