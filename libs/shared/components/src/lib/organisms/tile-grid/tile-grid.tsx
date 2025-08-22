import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { InsertionZone } from './insertion-zone';
import { useResponsiveTileConfig } from './use-responsive-tile-config';
import { useEffect, useRef, useState } from 'react';
import { DragState, InsertionSide, Tile, TileSize } from './types';
import { useTilePlacement } from './use-tile-placement';

export const TileGrid = ({ gridTiles = [] }: { gridTiles: Tile[] }) => {
  const { config, breakpoint } = useResponsiveTileConfig();
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [tiles, setTiles] = useState<Tile[]>(gridTiles);
  const [tileOrder, setTileOrder] = useState<number[]>(
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
    const currentIds: number[] = tiles.map((tile) => tile.id);
    const newOrder: number[] = tileOrder.filter((id) =>
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

    const draggedId: number = dragState.draggedTile.id;
    const currentIndex: number = tileOrder.indexOf(draggedId);

    if (currentIndex === -1) return;

    const newOrder: number[] = [...tileOrder];

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
    const shuffled: number[] = [...tileOrder].sort(() => Math.random() - 0.5);
    setTileOrder(shuffled);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'grey.900',
        p: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, textAlign: 'center' }}>
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
          ref={containerRef}
          sx={{
            position: 'relative',
            width: '100%',
            backgroundColor: 'grey.800',
            borderRadius: 1,
            height: gridHeight,
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
            <Box key={tile.id} onDoubleClick={() => console.log(tile.id)}>
              <TileComponent
                tile={tile}
                config={config}
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
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'grey.400', mb: 0.5 }}>
            Drag tiles to the colored insertion zones around each tile to
            reorder them.
          </Typography>

          <Typography variant="body2" sx={{ color: 'grey.400', mb: 0.5 }}>
            🟢 Green (top) • 🔵 Blue (bottom) • 🟣 Purple (left) • 🟠 Orange
            (right)
          </Typography>

          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            Numbers show current order. Double-click to remove tiles.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
