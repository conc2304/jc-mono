import { useCallback, useEffect, useRef, useState } from 'react';

import { PLAYER_TYPE } from '../constants';
import {
  BoardState,
  Color,
  Difficulty,
  GameState,
  MovePosition,
  Player,
  PlayerType,
} from '../types';
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

export interface UseConnectFourGameOptions {
  boardDimensions?: [number, number];
  matchesNeeded?: number;
  dropInterval?: number;
  defaultPlayerOneColor?: string;
  defaultPlayerTwoColor?: string;
}

export interface UseConnectFourGameReturn {
  boardState: BoardState;
  winningMatch: MovePosition[] | null;
  playerTurn: Player;
  isGameOver: boolean;
  gameIsPaused: boolean;
  playerOneColor: Color;
  playerTwoColor: Color;
  playerOneType: PlayerType;
  playerTwoType: PlayerType;
  playerOneConfig: EvaluationConfig;
  playerTwoConfig: EvaluationConfig;
  playerOneDifficulty: Difficulty;
  playerTwoDifficulty: Difficulty;
  handlePieceDrop: (row: number, col: number) => void;
  resetBoard: () => void;
  setGameIsPaused: (value: boolean) => void;
  handlePlayerOneTypeChange: (value: PlayerType) => void;
  handlePlayerTwoTypeChange: (value: PlayerType) => void;
  handlePlayerOneColorChange: (color: Color) => void;
  handlePlayerTwoColorChange: (color: Color) => void;
  handlePlayerOneConfigChange: (
    config: EvaluationConfig,
    difficulty: Difficulty
  ) => void;
  handlePlayerTwoConfigChange: (
    config: EvaluationConfig,
    difficulty: Difficulty
  ) => void;
  handlePauseChange: (value: boolean) => void;
}

const createInitialBoard = (
  boardDimensions: [number, number]
): BoardState =>
  Array(boardDimensions[1])
    .fill(null)
    .map(() => Array(boardDimensions[0]).fill(null));

export const useConnectFourGame = ({
  boardDimensions = [7, 6],
  matchesNeeded = 4,
  dropInterval = 300,
  defaultPlayerOneColor = '#ff0000',
  defaultPlayerTwoColor = '#ffea00',
}: UseConnectFourGameOptions = {}): UseConnectFourGameReturn => {
  const initialBoardState = createInitialBoard(boardDimensions);

  const [playerTurn, setPlayerTurn] = useState<Player>(1);
  const [playerOneColor, setPlayerOneColor] = useState<Color>(
    defaultPlayerOneColor
  );
  const [playerTwoColor, setPlayerTwoColor] = useState<Color>(
    defaultPlayerTwoColor
  );
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
  const [playerOneDifficulty, setPlayerOneDifficulty] =
    useState<Difficulty>('medium');
  const [playerTwoDifficulty, setPlayerTwoDifficulty] =
    useState<Difficulty>('medium');

  const pieceIsDropping = useRef(false);
  const lastMove = useRef<MovePosition>({ row: -1, col: -1 });
  const boardStateRef = useRef(boardState);
  const playerTurnRef = useRef(playerTurn);

  useEffect(() => {
    boardStateRef.current = boardState;
  }, [boardState]);

  useEffect(() => {
    playerTurnRef.current = playerTurn;
  }, [playerTurn]);

  const animateDrop = useCallback(
    async (dropPos: MovePosition, currentPlayer: Player) => {
      let tempBoard: BoardState = boardStateRef.current.map((row) => [
        ...row,
      ]);
      pieceIsDropping.current = true;

      for (let currentRow = 0; currentRow <= dropPos.row; currentRow++) {
        tempBoard = boardStateRef.current.map((row) => [...row]);
        if (currentRow > 0) {
          tempBoard[currentRow - 1][dropPos.col] = null;
        }
        tempBoard[currentRow][dropPos.col] = currentPlayer;
        setBoardState(tempBoard);
        await new Promise((resolve) => setTimeout(resolve, dropInterval));
      }

      return tempBoard;
    },
    [dropInterval]
  );

  const makeMove = useCallback(
    (
      currentBoardState: BoardState,
      { row, col }: MovePosition,
      currentPlayer: Player
    ) => {
      const dropPos = getDropPosition(currentBoardState, { row, col });

      animateDrop(dropPos, currentPlayer)
        .then((finalBoardState) => {
          const winningMatchSet = validateGameState({
            boardState: finalBoardState,
            playerMove: dropPos,
            playerTurn: currentPlayer,
            matchesNeeded,
          });

          if (winningMatchSet !== null) {
            setWinningMatch(winningMatchSet);
            setIsGameOver(true);
            return;
          }

          if (isGameTied(finalBoardState)) {
            setIsGameOver(true);
            return;
          }

          setPlayerTurn(currentPlayer === 1 ? 2 : 1);
        })
        .finally(() => {
          pieceIsDropping.current = false;
        });
    },
    [animateDrop, matchesNeeded]
  );

  useEffect(() => {
    if (playerTurn === 1 && playerOneType === PLAYER_TYPE.HUMAN) return;
    if (playerTurn === 2 && playerTwoType === PLAYER_TYPE.HUMAN) return;
    if (gameIsPaused) return;

    const gameState: GameState = {
      boardState: boardStateRef.current,
      playerMove: lastMove.current,
      playerTurn,
      matchesNeeded,
    };

    const playerConfig = playerTurn === 1 ? playerOneConfig : playerTwoConfig;
    const aiMove = calculateAiMove({ ...gameState, config: playerConfig });
    makeMove(boardStateRef.current, aiMove, playerTurn);
  }, [
    playerOneType,
    playerTwoType,
    playerTurn,
    gameIsPaused,
    playerOneConfig,
    playerTwoConfig,
    matchesNeeded,
    makeMove,
  ]);

  const handlePieceDrop = useCallback(
    (row: number, col: number): void => {
      if (pieceIsDropping.current) return;
      if (isGameOver) return;
      if (!isMoveValid(boardStateRef.current, { row, col })) return;

      lastMove.current = { row, col };
      makeMove(boardStateRef.current, { row, col }, playerTurnRef.current);
    },
    [isGameOver, makeMove]
  );

  const handlePlayerOneTypeChange = useCallback((value: PlayerType) => {
    setPlayerOneType(value);
  }, []);

  const handlePlayerOneConfigChange = useCallback(
    (config: EvaluationConfig, difficulty: Difficulty) => {
      setPlayerOneConfig(config);
      setPlayerOneDifficulty(difficulty);
    },
    []
  );

  const handlePlayerOneColorChange = useCallback((color: Color) => {
    setPlayerOneColor(color);
  }, []);

  const handlePlayerTwoTypeChange = useCallback((value: PlayerType) => {
    setPlayerTwoType(value);
  }, []);

  const handlePlayerTwoConfigChange = useCallback(
    (config: EvaluationConfig, difficulty: Difficulty) => {
      setPlayerTwoConfig(config);
      setPlayerTwoDifficulty(difficulty);
    },
    []
  );

  const handlePlayerTwoColorChange = useCallback((color: Color) => {
    setPlayerTwoColor(color);
  }, []);

  const handlePauseChange = useCallback((value: boolean) => {
    setGameIsPaused(value);
  }, []);

  const resetBoard = useCallback(() => {
    setBoardState(createInitialBoard(boardDimensions));
    setPlayerTurn(1);
    setWinningMatch(null);
    setIsGameOver(false);
    pieceIsDropping.current = false;
  }, [boardDimensions]);

  return {
    boardState,
    winningMatch,
    playerTurn,
    isGameOver,
    gameIsPaused,
    playerOneColor,
    playerTwoColor,
    playerOneType,
    playerTwoType,
    playerOneConfig,
    playerTwoConfig,
    playerOneDifficulty,
    playerTwoDifficulty,
    handlePieceDrop,
    resetBoard,
    setGameIsPaused,
    handlePlayerOneTypeChange,
    handlePlayerTwoTypeChange,
    handlePlayerOneColorChange,
    handlePlayerTwoColorChange,
    handlePlayerOneConfigChange,
    handlePlayerTwoConfigChange,
    handlePauseChange,
  };
};
