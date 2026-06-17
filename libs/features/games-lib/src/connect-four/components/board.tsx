import clsx from 'clsx';

import { useBoardCellSize } from '../hooks/use-board-cell-size';
import { BoardState, Color, MovePosition } from '../types';

interface BoardProps {
  boardState: BoardState;
  winningMatch: MovePosition[] | null;
  onPieceDrop: (row: number, col: number) => void;
  playerOneColor: Color;
  playerTwoColor: Color;
}
export const Board = ({
  boardState,
  winningMatch,
  onPieceDrop,
  playerOneColor,
  playerTwoColor,
}: BoardProps) => {
  const debugBoard = false;
  const columns = boardState[0]?.length ?? 7;
  const rows = boardState.length;
  const { containerRef, cellSize } = useBoardCellSize(columns, rows, 80);

  const playerColorMap = {
    1: playerOneColor,
    2: playerTwoColor,
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-1 min-w-0 min-h-0 items-center justify-center self-stretch"
      style={{
        minWidth: columns * cellSize,
        minHeight: rows * cellSize,
      }}
    >
      <div
        id="board"
        className="border-slate-500 border-2 bg-white rounded-md overflow-hidden"
        style={{
          width: columns * cellSize,
          height: rows * cellSize,
        }}
      >
        {boardState.map((row, rowIndex) => (
          <div key={rowIndex} className="flex" data-row={rowIndex}>
            {row.map((_, colIndex) => (
              <div
                key={colIndex}
                className="bg-blue-200 p-2 cursor-pointer"
                style={{ width: cellSize, height: cellSize }}
                onClick={() => onPieceDrop(rowIndex, colIndex)}
                data-value={boardState[rowIndex][colIndex]}
                data-col={colIndex}
              >
                <div
                  className={clsx(
                    'rounded-full size-full relative flex justify-center items-center',
                    winningMatch !== null &&
                      winningMatch.some(
                        (piece) =>
                          piece.row === rowIndex && piece.col === colIndex
                      )
                      ? 'border-4 bor border-green-400'
                      : ''
                  )}
                  style={{
                    backgroundColor:
                      boardState[rowIndex][colIndex] !== null
                        ? playerColorMap[boardState[rowIndex][colIndex]]
                        : 'white',
                  }}
                >
                  {debugBoard && (
                    <p className="text-xs text-slate-300 text-center">
                      R: {rowIndex}, C: {colIndex}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
