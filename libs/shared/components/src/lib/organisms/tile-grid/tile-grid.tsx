import { Box, Container, alpha } from '@mui/material';
import { InsertionZone } from './insertion-zone';
import { useResponsiveTileConfig } from './use-responsive-tile-config';
import { useEffect, useRef, useState } from 'react';
import { DragState, InsertionSide, Tile } from './types';
import { useTilePlacement } from './use-tile-placement';
import { BaseFileSystemItem } from '@jc/file-system';
import { TileComponent } from './tile-component';
import { RestartAlt, Shuffle } from '@mui/icons-material';
import { AugmentedIconButton } from '../../atoms';

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

  const { placedTiles, insertionZones } = useTilePlacement(
    tiles,
    config,
    containerWidth,
    tileOrder
  );

  // TODO - investigate why drag end gets called immediately when dragged from certain areas
  const handleDragStart = (tile: Tile): void => {
    console.log('DRAG START');
    setDragState({
      isDragging: true,
      draggedTile: tile,
      hoveredInsertionIndex: null,
      hoveredZoneSide: null,
    });
  };

  const handleDragEnd = (): void => {
    console.log('DRAG END');
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
          px: breakpoint === 'mobile' ? 0 : undefined,
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
            '--aug-border-all': '1px',
            '--aug-b': config.containerPadding / 2 + 'px',
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
            // overflowY: 'hidden',
          })}
        >
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              overflowY: 'auto',
              mr: 0.25,
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
              className="TileGrid--bottom-padding-spacer"
              sx={{
                position: 'absolute',
                top: placedTiles.reduce(
                  (prev, curr) => Math.max(prev, curr.y + curr.height),
                  0
                ),
                width: '100%',
                height: config.containerPadding,
              }}
            />
            <Box
              className="TileGrid--control-btns"
              sx={{
                position: 'absolute',
                bottom: '10px',
                right: '12.5%',
              }}
            >
              <AugmentedIconButton color="secondary" onClick={shuffleTiles}>
                <Shuffle />
              </AugmentedIconButton>
              <AugmentedIconButton color="secondary" onClick={resetTiles}>
                <RestartAlt />
              </AugmentedIconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
