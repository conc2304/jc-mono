import { Box, useTheme } from '@mui/material';
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
  const theme = useTheme();

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

  const getZoneColor = (): string => {
    // switch (zone.side) {
    //   case 'top':
    //   case 'before-all':
    //     return isActive
    //       ? 'bg-green-500 shadow-lg shadow-green-500/50'
    //       : 'bg-green-300/50 hover:bg-green-400/70';
    //   case 'bottom':
    //   case 'after-all':
    //     return isActive
    //       ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
    //       : 'bg-blue-300/50 hover:bg-blue-400/70';
    //   case 'left':
    //     return isActive
    //       ? 'bg-purple-500 shadow-lg shadow-purple-500/50'
    //       : 'bg-purple-300/50 hover:bg-purple-400/70';
    //   case 'right':
    //     return isActive
    //       ? 'bg-orange-500 shadow-lg shadow-orange-500/50'
    //       : 'bg-orange-300/50 hover:bg-orange-400/70';
    //   default:
    //     return isActive
    //       ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
    //       : 'bg-blue-300/50 hover:bg-blue-400/70';
    // }

    return isActive
      ? theme.palette.action.selected
      : theme.palette.action.active;
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        transition: 'all 200 ease-in-out',
        pointerEvents: 'auto',
      }}
      style={{
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
        zIndex: isActive ? 60 : 30,
        color: getZoneColor(),
      }}
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
