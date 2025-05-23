import { useEffect, useRef, useState } from 'react';

import { PlayerConfig } from './player-config';
import { PLAYER_TYPE } from '../constants';
import {
  BoardState,
  Color,
  Player,
  MovePosition,
  GameState,
  PlayerType,
  Difficulty,
} from '../types';
import { Board } from './board';
import { calculateAiMove } from '../utils/ai-player';
import {
  DEFAULT_EVAL_CONFIG,
  EvaluationConfig,
} from '../utils/evaluation-config';
import {
  getDropPosition,
  isGameTied,
  isMoveValid,
  validateGameState,
} from '../utils/game-logic';

interface ConnectFourProps {
  boardDimensions?: [number, number]; // X wide by Y tall
  matchesNeeded?: number;
  dropInterval?: number; // controls how fast the players pieces drops between each cell to the bottom
}

export const ConnectFour = ({
  boardDimensions = [7, 6],
  matchesNeeded = 4,
  dropInterval = 300,
}: ConnectFourProps) => {
  const initialBoardState: Array<Array<Player | null>> = Array(
    boardDimensions[1]
  )
    .fill(null)
    .map(() => Array(boardDimensions[0]).fill(null));

  const [playerTurn, setPlayerTurn] = useState<Player>(1);
  const [playerOneColor, setPlayerOneColor] = useState<Color>('#ff0000'); // red
  const [playerTwoColor, setPlayerTwoColor] = useState<Color>('#0000ff'); // blue
  const [isGameOver, setIsGameOver] = useState(false);
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [winningMatch, setWinningMatch] = useState<MovePosition[] | null>(null);
  const [gameIsPaused, setGameIsPaused] = useState(false);
  const [playerOneType, setPlayerOneType] = useState<PlayerType>(
    PLAYER_TYPE.HUMAN
  );
  const [playerTwoType, setPlayerTwoType] = useState<PlayerType>(
    PLAYER_TYPE.HUMAN
  );

  const [playerOneConfig, setPlayerOneConfig] =
    useState<EvaluationConfig>(DEFAULT_EVAL_CONFIG);
  const [playerTwoConfig, setPlayerTwoConfig] =
    useState<EvaluationConfig>(DEFAULT_EVAL_CONFIG);

  const pieceIsDropping = useRef(false);
  const lastMove = useRef<MovePosition>({ row: -1, col: -1 });

  useEffect(() => {
    if (playerTurn === 1 && playerOneType === PLAYER_TYPE.HUMAN) return;
    if (playerTurn === 2 && playerTwoType === PLAYER_TYPE.HUMAN) return;
    if (gameIsPaused) return;

    const gameState: GameState = {
      boardState,
      playerMove: lastMove.current,
      playerTurn,
      matchesNeeded,
    };

    const playerConfig = playerTurn === 1 ? playerOneConfig : playerTwoConfig;
    const aiMove = calculateAiMove({ ...gameState, config: playerConfig });
    makeMove(boardState, aiMove, playerTurn);
  }, [playerOneType, playerTwoType, playerTurn, gameIsPaused]);

  const handlePieceDrop = (row: number, col: number): void => {
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
    setPlayerOneConfig(DEFAULT_EVAL_CONFIG);
    setPlayerTwoConfig(DEFAULT_EVAL_CONFIG);
    setPlayerOneType(PLAYER_TYPE.HUMAN);
    setPlayerTwoType(PLAYER_TYPE.HUMAN);
    pieceIsDropping.current = false;
  };

  return (
    <div>
      <h1 className="text-center text-xl mb-4">Connect 4</h1>
      <div id="game-container" className="flex flex-col items-center">
        <div id="game-info" className="flex flex-col items-center mb-4">
          <h3>
            {isGameOver
              ? winningMatch == null
                ? 'Tied Game'
                : `Player ${playerTurn} Wins!`
              : `Player ${playerTurn} Turn`}
          </h3>
        </div>
        <div
          id="game-wrapper"
          className="flex justify-around items-center w-full"
        >
          <PlayerConfig
            playerNumber={1}
            color={playerOneColor}
            onColorChange={setPlayerOneColor}
            playerType={playerOneType}
            onPlayerTypeChange={(value) => setPlayerOneType(value)}
            onAiConfigChange={(config) => setPlayerOneConfig(config)}
            onPauseChange={(value) => setGameIsPaused(value)}
          />

          <Board
            boardState={boardState}
            winningMatch={winningMatch}
            onPieceDrop={handlePieceDrop}
            playerOneColor={playerOneColor}
            playerTwoColor={playerTwoColor}
          />

          <PlayerConfig
            playerNumber={2}
            color={playerTwoColor}
            onColorChange={setPlayerTwoColor}
            playerType={playerTwoType}
            onPlayerTypeChange={(value) => setPlayerTwoType(value)}
            onAiConfigChange={(config) => setPlayerTwoConfig(config)}
            onPauseChange={(value) => setGameIsPaused(value)}
          />
        </div>
        <button
          className="bg-orange-400 rounded-md p-2 mt-4 hover:bg-orange-300 transition-all duration-1500"
          onClick={resetBoard}
        >
          Restart Game
        </button>

        {[playerOneType, playerTwoType].includes(PLAYER_TYPE.COMPUTER) && (
          <button
            className="bg-orange-400 rounded-md p-2 mt-4 hover:bg-orange-300 transition-all duration-1500"
            onClick={() => setGameIsPaused(!gameIsPaused)}
          >
            {gameIsPaused ? 'Play' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  );
};
