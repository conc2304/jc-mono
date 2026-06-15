import { alpha, Box, useTheme } from '@mui/material';

import { BoardState, Color, MovePosition } from '@jc/games-lib';

interface ConnectFourBoardProps {
  boardState: BoardState;
  winningMatch: MovePosition[] | null;
  onPieceDrop: (row: number, col: number) => void;
  playerOneColor: Color;
  playerTwoColor: Color;
}

const CELL_SIZE = 64;

export const ConnectFourBoard = ({
  boardState,
  winningMatch,
  onPieceDrop,
  playerOneColor,
  playerTwoColor,
}: ConnectFourBoardProps) => {
  const theme = useTheme();

  const playerColorMap: Record<1 | 2, Color> = {
    1: playerOneColor,
    2: playerTwoColor,
  };

  const isWinningCell = (rowIndex: number, colIndex: number) =>
    winningMatch?.some(
      (piece) => piece.row === rowIndex && piece.col === colIndex
    ) ?? false;

  return (
    <Box
      sx={{
        bgcolor: theme.palette.paper,
        border: `2px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: 'hidden',
        display: 'inline-block',
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
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  p: 1,
                  cursor: 'pointer',
                  bgcolor: theme.palette.paper,
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    bgcolor: cell !== null ? pieceColor : alpha(theme.palette.action.hover, 0.35),
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
  );
};
