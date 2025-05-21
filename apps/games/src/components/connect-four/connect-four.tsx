import { useState } from 'react';
import { clsx } from 'clsx';

import { BoardState, Color, Player, MovePosition } from './types';
import {
  getDropPosition,
  isGameTied,
  isMoveValid,
  validateDiagonal,
  validateHorizontal,
  validateVertical,
} from './utils';

export const ConnectFour = () => {
  const boardDimensions = [7, 6]; // 7 Wide and 6 Tall
  const initialBoardState: Array<Array<Player | null>> = Array(
    boardDimensions[1]
  )
    .fill(null)
    .map(() => Array(boardDimensions[0]).fill(null));

  const matchesNeeded = 4;

  const [playerTurn, setPlayerTurn] = useState<Player>(1);
  const [playerOneColor, setPlayerOneColor] = useState<Color>('bg-red-500');
  const [playerTwoColor, setPlayerTwoColor] = useState<Color>('bg-blue-500');
  const [isGameOver, setIsGameOver] = useState(false);
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [winningMatch, setWinningMatch] = useState<MovePosition[] | null>(null);

  const debugBoard = false;

  const playerColorMap = {
    1: playerOneColor,
    2: playerTwoColor,
  };

  const handleClick = (row: number, col: number) => {
    console.log('handleClick');
    // console.log(row, col);

    if (isGameOver) return;
    if (!isMoveValid(boardState, { row, col })) {
      console.log('invalid move');
      return;
    }

    const dropPos = getDropPosition(boardState, { row, col });

    const newState = boardState.map((row) => [...row]);
    newState[dropPos.row][dropPos.col] = playerTurn;
    setBoardState(newState);

    const winningMatchSet = validateGameState(newState, dropPos, playerTurn);

    if (winningMatchSet !== null) {
      // todo end the game
      setWinningMatch(winningMatchSet);
      setIsGameOver(true);
    }

    if (isGameTied(boardState)) {
      setIsGameOver(true);
    }

    setPlayerTurn(playerTurn === 1 ? 2 : 1);
  };

  const validateGameState = (
    boardState: BoardState,
    playerMove: MovePosition,
    playerTurn: Player
  ) => {
    const gameState = { boardState, playerMove, playerTurn, matchesNeeded };
    return (
      validateVertical(gameState) ||
      validateHorizontal(gameState) ||
      validateDiagonal(gameState)
    );
  };

  const resetBoard = () => {
    setBoardState(initialBoardState);
    setPlayerTurn(1);
    setWinningMatch(null);
    setIsGameOver(false);
  };

  return (
    <div>
      <h1>Connect 4</h1>
      <div id="game-container" className="flex flex-col items-center">
        <div id="player-info">Player {playerTurn} Turn </div>

        <div
          id="board"
          className="border-slate-500 border-2 bg-white rounded-md"
        >
          {boardState.map((row, rowIndex) => (
            <div key={rowIndex} className="flex" data-row={rowIndex}>
              {row.map((cell, colIndex) => (
                // Cell Slot
                <div
                  key={colIndex}
                  className="w-20 h-20 bg-slate-200 border-slate-100 border p-2 cursor-pointer"
                  onClick={() => handleClick(rowIndex, colIndex)}
                  data-value={boardState[rowIndex][colIndex]}
                  data-col={colIndex}
                >
                  {/* Game Piece Slot */}
                  <div
                    className={clsx(
                      'rounded-full size-full relative flex justify-center items-center',
                      boardState[rowIndex][colIndex] !== null
                        ? playerColorMap[boardState[rowIndex][colIndex]]
                        : 'bg-white',
                      winningMatch !== null &&
                        winningMatch.some(
                          (piece) =>
                            piece.row === rowIndex && piece.col === colIndex
                        )
                        ? 'border-4 bor border-green-400'
                        : ''
                    )}
                  >
                    {debugBoard && (
                      <p className="text-xs text-slate-300">
                        R: {rowIndex}, C: {colIndex}-{' '}
                        {boardState[rowIndex][colIndex]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          className="bg-orange-400 rounded-md p-2 mt-4 hover:bg-orange-300 transition-colors duration-1500"
          onClick={resetBoard}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};
