import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Tooltip,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { RestartAlt, Shuffle } from '@mui/icons-material';

import {
  ColorModeSwitcher,
  ColorModeSwitcherSpeedDial,
} from '@jc/theme-components';
import { SciFiBackground } from '@jc/ui-components';

import { InsertionZone } from './insertion-zone';
import { TileComponent } from './tile-component';
import { DragState, InsertionSide, Tile } from './types';
import { useResponsiveTileConfig } from './use-responsive-tile-config';
import { useTilePlacement } from './use-tile-placement';
import { BaseFileSystemItem } from '../../types';

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
      <Box
        className="Scifi-background"
        sx={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        <SciFiBackground />
      </Box>
      <Container
        maxWidth="xl"
        sx={{
          height: '100%',
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
            '--aug-br-extend2': isMd ? '12.5%' : undefined,
            '--aug-bl-extend1': isMd ? '12.5%' : undefined,
            '--aug-tl': config.containerPadding / 2 + 'px',
            '--aug-tl-extend2': '12.5%',
            '--aug-tr-extend1': '12.5%',
            '--aug-tr': config.containerPadding / 2 + 'px',
            '--aug-b-extend1': isSm ? '25%' : '50%',

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
          {!isMd && (
            <>
              {/* Tile Placement Controls */}
              <Box
                className="TileGrid--control-btns"
                sx={{
                  position: 'absolute',
                  bottom: '5px',
                  left: `calc( ((25% - ${config.containerPadding}px) + ${
                    config.containerPadding * 2
                  }px) / 2 )`, // matches/compliments the spacing of the augmented bottom border to center in the left divot
                  transform: 'translateX(-50%)',
                }}
              >
                <Tooltip title="Shuffle Tiles">
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
                </Tooltip>
                <Tooltip title="Reset Tiles">
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
                </Tooltip>
              </Box>

              <Box
                className="TileGrid--color-mode-switcher-wrapper"
                sx={{
                  zIndex: 0,
                  position: 'absolute',
                  bottom: '5px',
                  right: `calc( ((25% - ${config.containerPadding}px) + ${
                    config.containerPadding * 2
                  }px) / 2 )`, // matches/compliments the spacing of the augmented bottom border to center in the right divot
                  transform: 'translate(50%, 0%)',
                }}
              >
                <ColorModeSwitcher />
              </Box>
            </>
          )}
        </Box>

        {!isMd && footer && (
          <Box
            sx={{
              position: 'absolute',
              // p: 1,
              bottom: 0,
              // bottom: '5px',
              left: '50%',
              right: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {footer}
          </Box>
        )}

        {isMd && (
          <Box height={isSm ? 40 : 20}>
            <Grid
              container
              sx={{
                width: '100%',
                position: 'absolute',
                height: '60px',
                bottom: 0,
                left: 0,
                right: 0,
                flexShrink: 0,
                p: 1,
                zIndex: 0,
                alignItems: 'center',
              }}
              columns={3}
            >
              {/* Tile Placement Controls */}
              <Grid size={{ xs: 1 }}>
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
              </Grid>

              <Grid
                size={{ xs: 1 }}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                {footer}
              </Grid>

              <Grid
                size={{ xs: 1 }}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Box className="TileGrid--color-mode-switcher-wrapper">
                  <ColorModeSwitcherSpeedDial
                    arcStartDegree={270}
                    arcEndDegree={360}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};
