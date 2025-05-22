import { DEFAULT_EVAL_CONFIG } from './evaluation-config';
import { evaluateBoard } from './evaluations';
import { BestMove, BoardState, GameState, MovePosition, Player } from './types';
import { isGameTied, makeMove } from './utils';

export const calculateAiMove = ({
  boardState,
  playerMove,
  playerTurn,
  matchesNeeded,
}: GameState): MovePosition => {
  console.log('calculateAiMove');
  const aiPlayer = playerTurn;
  const bestMoves = findBestMoves(boardState, aiPlayer, matchesNeeded);

  console.log({ ...bestMoves });
  const bestMove = bestMoves.reduce((best, current) => {
    return best.score > current.score ? best : current;
  });

  return bestMove.move;
};

export const getAvailablePositions = (boardState: BoardState) => {
  const availablePositions: MovePosition[] = [];

  // go from left to right across columns,
  for (let col = 0; col <= boardState[0].length - 1; col++) {
    // then from bottom up,
    for (let row = boardState.length - 1; row >= 0; row--) {
      // and get the row, col of first empty cell
      if (boardState[row][col] === null) {
        availablePositions.push({ row, col });
        break;
      }
    }
  }

  return availablePositions;
};

export const findBestMoves = (
  boardState: BoardState,
  playerTurn: Player,
  matchesNeeded: number
): BestMove[] => {
  //
  console.log('findBestMoves');
  const availablePositions = getAvailablePositions(boardState);
  const bestMoves: BestMove[] = [];
  const opponent = playerTurn === 1 ? 2 : 1;

  // for each available position, check if it is a winning move
  for (const position of availablePositions) {
    const newBoardState = makeMove(boardState, position, playerTurn);
    const moveScore = miniMax(
      newBoardState,
      0,
      false,
      playerTurn,
      opponent,
      position,
      matchesNeeded
    );
    bestMoves.push({ move: position, score: moveScore });
  }

  console.log({ ...bestMoves });

  return bestMoves;
};

export const miniMax = (
  boardState: BoardState,
  depth: number,
  isMax: boolean,
  aiPlayer: Player,
  opponent: Player, // opponent is the player that is not the ai player
  playerMove: MovePosition,
  matchesNeeded: number,
  depthLimit = 3
): number => {
  // if the game is over, return the score
  console.log('miniMax');
  const score = evaluateBoard({
    boardState,
    depth,
    playerTurn: aiPlayer,
    playerMove,
    matchesNeeded,
    opponent,
    config: DEFAULT_EVAL_CONFIG,
  });

  console.log('MM @ evaluateBoard', { score });

  if (score !== 0) return score;
  if (isGameTied(boardState)) return 0;
  if (depth >= depthLimit) return score;

  if (isMax) {
    console.log('MM @ isMax');
    let bestScore = -1000;
    for (const position of getAvailablePositions(boardState)) {
      const newBoardState = makeMove(boardState, position, aiPlayer);
      const moveValue = miniMax(
        newBoardState,
        depth + 1,
        !isMax,
        aiPlayer,
        opponent,
        position,
        matchesNeeded
      );
      bestScore = Math.max(bestScore, moveValue);
    }
    console.log('MM @ isMax @ return', { bestScore });
    return bestScore;
  } else {
    console.log('MM @ isMin');
    let bestScore = 1000;
    for (const position of getAvailablePositions(boardState)) {
      const newBoardState = makeMove(boardState, position, opponent);
      const moveValue = miniMax(
        newBoardState,
        depth + 1,
        !isMax,
        aiPlayer,
        opponent,
        position,
        matchesNeeded
      );

      bestScore = Math.min(bestScore, moveValue);
    }
    console.log('MM @ isMin @ return', { bestScore });
    return bestScore;
  }
};
