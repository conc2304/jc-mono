import clsx from 'clsx';

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
  const debugBoard = true;

  const playerColorMap = {
    1: playerOneColor,
    2: playerTwoColor,
  };

  return (
    <div id="board" className="border-slate-500 border-2 bg-white rounded-md">
      {boardState.map((row, rowIndex) => (
        <div key={rowIndex} className="flex" data-row={rowIndex}>
          {row.map((_, colIndex) => (
            // Cell Slot
            <div
              key={colIndex}
              className="w-20 h-20 bg-slate-200 border-slate-100 border p-2 cursor-pointer"
              onClick={() => onPieceDrop(rowIndex, colIndex)}
              data-value={boardState[rowIndex][colIndex]}
              data-col={colIndex}
            >
              {/* Game Piece Slot */}
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
                    {/* {boardState[rowIndex][colIndex]} */}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
