import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

import { BoardState, Color, Player, MovePosition, GameState } from './types';
import {
  getDropPosition,
  isGameTied,
  isMoveValid,
  validateDiagonal,
  validateGameState,
  validateHorizontal,
  validateVertical,
} from './utils';
import { ButtonGroup } from '../button-group';
import { calculateAiMove } from './ai-player';

export const ConnectFour = () => {
  const boardDimensions = [7, 6]; // 7 Wide and 6 Tall
  const initialBoardState: Array<Array<Player | null>> = Array(
    boardDimensions[1]
  )
    .fill(null)
    .map(() => Array(boardDimensions[0]).fill(null));

  const matchesNeeded = 4;
  const dropInterval = 300; // controls how fast the players pieces drops between each cell to the bottom

  const [playerTurn, setPlayerTurn] = useState<Player>(1);
  const [playerOneColor, setPlayerOneColor] = useState<Color>('#ff0000');
  const [playerTwoColor, setPlayerTwoColor] = useState<Color>('#0000ff');
  const [isGameOver, setIsGameOver] = useState(false);
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [winningMatch, setWinningMatch] = useState<MovePosition[] | null>(null);
  const pieceIsDropping = useRef(false);
  const lastMove = useRef<MovePosition>({ row: -1, col: -1 });
  const [aiPlayer, setAiPlayer] = useState<Player | null>(null);

  const aiPlayerOptions = [
    { label: 'None', value: null },
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
  ];

  const debugBoard = true;

  const playerColorMap = {
    1: playerOneColor,
    2: playerTwoColor,
  };

  useEffect(() => {
    if (playerTurn !== aiPlayer) return;

    const gameState: GameState = {
      boardState,
      playerMove: lastMove.current,
      playerTurn,
      matchesNeeded,
    };
    console.log('UseEffect');
    const aiMove = calculateAiMove(gameState);

    makeMove(boardState, aiMove, playerTurn);
  }, [aiPlayer, playerTurn]);

  const handleClick = (row: number, col: number): void => {
    if (pieceIsDropping.current) return;
    if (isGameOver) return;
    if (!isMoveValid(boardState, { row, col })) {
      console.log('invalid move');
      return;
    }
    lastMove.current = { row, col };
    makeMove(boardState, { row, col }, playerTurn);
  };

  const makeMove = (
    boardState: BoardState,
    { row, col }: MovePosition,
    playerTurn: Player
  ) => {
    const dropPos = getDropPosition(boardState, { row, col });

    // Run the animation
    animateDrop(dropPos)
      .then((boardState) => {
        // Assess Game State after final move
        const winningMatchSet = validateGameState({
          boardState,
          playerMove: dropPos,
          playerTurn,
          matchesNeeded,
        });

        if (winningMatchSet !== null) {
          // todo end the game
          setWinningMatch(winningMatchSet);
          setIsGameOver(true);
          return;
        }

        if (isGameTied(boardState)) {
          setIsGameOver(true);
          return;
        }

        setPlayerTurn(playerTurn === 1 ? 2 : 1);
      })
      .finally(() => {
        pieceIsDropping.current = false;
      });
  };

  // Animate piece dropping from top to bottom
  const animateDrop = async (dropPos: MovePosition) => {
    // Start from top row (0) and animate down to final position
    let tempBoard: BoardState = boardState.map((row) => [...row]);
    pieceIsDropping.current = true;

    for (let currentRow = 0; currentRow <= dropPos.row; currentRow++) {
      tempBoard = boardState.map((row) => [...row]);
      // Clear previous animation position
      if (currentRow > 0) {
        tempBoard[currentRow - 1][dropPos.col] = null;
      }
      // Set current animation position
      tempBoard[currentRow][dropPos.col] = playerTurn;
      setBoardState(tempBoard);
      // Delay between frames
      await new Promise((resolve) => setTimeout(resolve, dropInterval));
    }

    return tempBoard;
  };

  const resetBoard = () => {
    setBoardState(initialBoardState);
    setPlayerTurn(1);
    setWinningMatch(null);
    setIsGameOver(false);
    pieceIsDropping.current = false;
  };

  return (
    <div>
      <h1>Connect 4</h1>
      <div id="game-container" className="flex flex-col items-center">
        <div id="player-info" className="flex flex-col items-center">
          <h3>
            {isGameOver
              ? winningMatch == null
                ? 'Tied Game'
                : `Player ${playerTurn} Wins!`
              : `Player ${playerTurn} Turn`}
          </h3>

          <div
            id="player-color-picker"
            className="flex justify-between m-2 spa"
          >
            <label htmlFor="player1-color" className="mr-2">
              Player 1 Color
            </label>
            <input
              type="color"
              id="player1-color"
              value={playerOneColor}
              name="player1-color"
              onChange={(e) => setPlayerOneColor(e.target.value)}
              className="mr-5"
            />
            <label htmlFor="player2-color" className="mr-2">
              Player 2 Color
            </label>
            <input
              type="color"
              id="player2-color"
              value={playerTwoColor}
              name="player2-color"
              onChange={(e) => setPlayerTwoColor(e.target.value)}
            />
          </div>
          <div className="flex justify-start items-center">
            <strong>Select AI Player: </strong>
            <ButtonGroup
              value={aiPlayer}
              options={aiPlayerOptions}
              onChange={(value) => setAiPlayer(value as Player | null)}
            />
          </div>
        </div>

        <div
          id="board"
          className="border-slate-500 border-2 bg-white rounded-md"
        >
          {boardState.map((row, rowIndex) => (
            <div key={rowIndex} className="flex" data-row={rowIndex}>
              {row.map((_, colIndex) => (
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

        <button
          className="bg-orange-400 rounded-md p-2 mt-4 hover:bg-orange-300 transition-all duration-1500"
          onClick={resetBoard}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};
