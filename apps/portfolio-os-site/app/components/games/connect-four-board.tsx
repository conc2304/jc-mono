import { alpha, Box, useTheme } from '@mui/material';

import { BoardState, Color, MovePosition, useBoardCellSize } from '@jc/games-lib';

interface ConnectFourBoardProps {
  boardState: BoardState;
  winningMatch: MovePosition[] | null;
  onPieceDrop: (row: number, col: number) => void;
  playerOneColor: Color;
  playerTwoColor: Color;
}

export const ConnectFourBoard = ({
  boardState,
  winningMatch,
  onPieceDrop,
  playerOneColor,
  playerTwoColor,
}: ConnectFourBoardProps) => {
  const theme = useTheme();
  const columns = boardState[0]?.length ?? 7;
  const rows = boardState.length;
  const { containerRef, cellSize } = useBoardCellSize(columns, rows);

  const playerColorMap: Record<1 | 2, Color> = {
    1: playerOneColor,
    2: playerTwoColor,
  };

  const isWinningCell = (rowIndex: number, colIndex: number) =>
    winningMatch?.some(
      (piece) => piece.row === rowIndex && piece.col === colIndex
    ) ?? false;

  const boardWidth = columns * cellSize;
  const boardHeight = rows * cellSize;

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
      }}
    >
      <Box
        sx={{
          width: boardWidth,
          height: boardHeight,
          bgcolor: theme.palette.paper,
          border: `2px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {boardState.map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ display: 'flex' }}>
            {row.map((cell, colIndex) => {
              const pieceColor =
                cell !== null ? playerColorMap[cell] : theme.palette.paper;

              return (
                <Box
                  key={colIndex}
                  onClick={() => onPieceDrop(rowIndex, colIndex)}
                  sx={{
                    width: cellSize,
                    height: cellSize,
                    p: 1,
                    cursor: 'pointer',
                    bgcolor: theme.palette.paper,
                    boxSizing: 'border-box',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      bgcolor:
                        cell !== null
                          ? pieceColor
                          : alpha(theme.palette.action.hover, 0.35),
                      border: isWinningCell(rowIndex, colIndex)
                        ? `3px solid ${theme.palette.success.main}`
                        : '3px solid transparent',
                      boxSizing: 'border-box',
                      transition: 'background-color 0.15s ease',
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
