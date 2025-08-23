import { alpha, Box, useTheme } from '@mui/material';
import { InsertionSide, InsertionZone as InsertionZoneType } from './types';

interface InsertionZoneProps {
  zone: InsertionZoneType;
  isActive: boolean;
  onDrop: (insertIndex: number) => void;
  onHover: (insertIndex: number, zoneSide: InsertionSide) => void;
}

export const InsertionZone: React.FC<InsertionZoneProps> = ({
  zone,
  isActive,
  onDrop,
  onHover,
}) => {
  const theme = useTheme;
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    onHover(zone.insertIndex, zone.side);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    onDrop(zone.insertIndex);
  };

  return (
    <Box
      className="InsertionZone--root"
      sx={(theme) => ({
        position: 'absolute',
        transition: 'all 0.2s ease-in-out',
        pointerEvents: 'auto',
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
        zIndex: isActive ? 60 : 30,
        borderRadius: Math.min(zone.width, zone.height) / 2,

        ...(isActive
          ? {
              backgroundColor: 'success.main',
              boxShadow: `0 10px 15px -3px ${alpha(
                theme.palette.success.main,
                0.5
              )}, 0 4px 6px -2px ${alpha(
                theme.palette.getInvertedMode('success'),
                0.5
              )}`,
            }
          : {
              backgroundColor: theme.palette.getInvertedMode('secondary'),
              '&:hover': {
                backgroundColor: alpha(
                  theme.palette.getInvertedMode('secondary', true),
                  0.7
                ),
              },
            }),
      })}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      title={`Insert ${
        zone.side === 'left' ||
        zone.side === 'top' ||
        zone.side === 'before-all'
          ? 'before'
          : 'after'
      } tile`}
    />
  );
};
