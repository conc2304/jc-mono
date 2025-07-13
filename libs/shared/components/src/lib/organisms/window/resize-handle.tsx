import { alpha, Box, Typography } from '@mui/material';

import { getCursorForDirection } from './utils';

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface ResizeState {
  isResizing: boolean;
  direction: ResizeDirection | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
}

const ResizeHandle = ({
  direction,
  style,
  onResizeStart,
}: {
  direction: ResizeDirection;
  style: React.CSSProperties;
  resizable?: boolean;
  onResizeStart: (e: React.MouseEvent, direction: ResizeDirection) => void;
}) => (
  <Box
    sx={{
      position: 'absolute',
      ...style,
      cursor: getCursorForDirection(direction),
      '&:hover': {
        backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1),
      },
    }}
    onMouseDown={(e) => onResizeStart(e, direction)}
  />
);

export const ResizeHandlers = ({
  onResizeStart,
  handleSize = 4,
}: {
  handleSize?: number;
  onResizeStart: (e: React.MouseEvent, direction: ResizeDirection) => void;
}) => {
  return (
    <>
      {/* Edge handles */}
      <ResizeHandle
        direction="n"
        style={{
          top: 0,
          left: handleSize,
          right: handleSize,
          height: handleSize,
        }}
        onResizeStart={onResizeStart}
      />
      <ResizeHandle
        direction="s"
        style={{
          bottom: 0,
          left: handleSize,
          right: handleSize,
          height: handleSize,
        }}
        onResizeStart={onResizeStart}
      />
      <ResizeHandle
        direction="e"
        style={{
          right: 0,
          top: handleSize,
          bottom: handleSize,
          width: handleSize,
        }}
        onResizeStart={onResizeStart}
      />
      <ResizeHandle
        direction="w"
        style={{
          left: 0,
          top: handleSize,
          bottom: handleSize,
          width: handleSize,
        }}
        onResizeStart={onResizeStart}
      />

      {/* Corner handles */}
      <ResizeHandle
        direction="nw"
        style={{
          top: 0,
          left: 0,
          width: handleSize * 2,
          height: handleSize * 2,
        }}
        onResizeStart={onResizeStart}
      />
      <ResizeHandle
        direction="ne"
        style={{
          top: 0,
          right: 0,
          width: handleSize * 2,
          height: handleSize * 2,
        }}
        onResizeStart={onResizeStart}
      />
      <ResizeHandle
        direction="sw"
        style={{
          bottom: 0,
          left: 0,
          width: handleSize * 2,
          height: handleSize * 2,
        }}
        onResizeStart={onResizeStart}
      />
      <ResizeHandle
        direction="se"
        style={{
          bottom: 0,
          right: 0,
          width: handleSize * 2,
          height: handleSize * 2,
        }}
        onResizeStart={onResizeStart}
      />
    </>
  );
};
