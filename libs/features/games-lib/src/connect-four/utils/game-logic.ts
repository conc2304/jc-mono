import { BoardState, GameState, MovePosition, Player } from '../types';

export const makeMove = (
  boardState: BoardState,
  playerMove: MovePosition,
  playerTurn: Player
) => {
  const newBoardState = boardState.map((row) => [...row]);
  newBoardState[playerMove.row][playerMove.col] = playerTurn;
  return newBoardState;
};

export const validateVertical = ({
  boardState,
  playerMove,
  playerTurn,
  matchesNeeded,
}: GameState) => {
  const startRowPos = Math.min(
    playerMove.row + matchesNeeded,
    boardState.length - 1
  );

  let matchPos: MovePosition[] = [];
  let matchCount = 0;
  //  Traverse up the column starting from the number of matchesNeeded moves away
  for (let rowIndex = startRowPos; rowIndex >= 0; rowIndex--) {
    if (boardState[rowIndex][playerMove.col] === playerTurn) {
      matchCount++;
      matchPos.push({ row: rowIndex, col: playerMove.col });
    } else {
      matchCount = 0;
      matchPos = [];
    }
    if (matchCount >= matchesNeeded) return matchPos;
  }

  return null;
};

export const validateHorizontal = ({
  boardState,
  playerMove,
  playerTurn,
  matchesNeeded,
}: GameState) => {
  const startColPos = Math.min(
    playerMove.col + matchesNeeded - 1,
    boardState[0].length - 1
  );
  let matchPos: MovePosition[] = [];

  let matchCount = 0;
  //  Traverse up the column starting from the number of matchesNeeded moves away

  for (let colIndex = startColPos; colIndex >= 0; colIndex--) {
    if (boardState[playerMove.row][colIndex] === playerTurn) {
      matchCount++;
      matchPos.push({ row: playerMove.row, col: colIndex });
    } else {
      matchCount = 0;
      matchPos = [];
    }
    if (matchCount >= matchesNeeded) return matchPos;
  }

  return null;
};

export const validateDiagonal = ({
  boardState,
  playerMove,
  playerTurn,
  matchesNeeded,
}: GameState) => {
  const { startPosLTR, startPosRTL } = getDiagonalStartPos(
    boardState,
    playerMove
  );

  let matchCount = 0;
  let matchPos: MovePosition[] = [];

  //  Diagonal from bottom left to top right
  for (
    let currPos = { ...startPosLTR };
    currPos.row >= 0 && currPos.col <= boardState[0].length - 1;
    currPos.row--, currPos.col++ // move up the board and to the right
  ) {
    if (currPos.col > boardState[0].length - 1) break;
    if (currPos.row < 0) break;

    if (boardState[currPos.row][currPos.col] === playerTurn) {
      matchCount++;
      matchPos.push({ row: currPos.row, col: currPos.col });
    } else {
      matchCount = 0;
      matchPos = [];
    }
    if (matchCount >= matchesNeeded) return matchPos;
  }

  //  Diagonal from bottom right to top left
  for (
    let currPos = { ...startPosRTL };
    currPos.row >= 0 && currPos.col >= 0;
    currPos.row--, currPos.col-- // move up the board and to the left
  ) {
    if (currPos.col < 0) break;
    if (currPos.row < 0) break;

    if (boardState[currPos.row][currPos.col] === playerTurn) {
      matchCount++;
      matchPos.push({ row: currPos.row, col: currPos.col });
    } else {
      matchCount = 0;
      matchPos = [];
    }
    if (matchCount >= matchesNeeded) return matchPos;
  }

  return null;
};

export const validateGameState = ({
  boardState,
  playerMove,
  playerTurn,
  matchesNeeded,
}: GameState): MovePosition[] | null => {
  const gameState = { boardState, playerMove, playerTurn, matchesNeeded };
  return (
    validateVertical(gameState) ||
    validateHorizontal(gameState) ||
    validateDiagonal(gameState)
  );
};

const getDiagonalStartPos = (
  boardState: BoardState,
  playerMove: MovePosition
): { startPosLTR: MovePosition; startPosRTL: MovePosition } => {
  // find the distance from the player move to the bottom of the board
  const distanceToBottom = boardState.length - 1 - playerMove.row;
  const distanceToLeft = playerMove.col;
  const distanceToRight = boardState[0].length - 1 - playerMove.col;

  // Find the start position for the diagonal for LTR and RTL
  const startDistanceLTR = Math.min(distanceToBottom, distanceToLeft);
  const startDistanceRTL = Math.min(distanceToBottom, distanceToRight);

  const startPosLTR = {
    row: playerMove.row + startDistanceLTR,
    col: playerMove.col - startDistanceLTR,
  };

  const startPosRTL = {
    row: playerMove.row + startDistanceRTL,
    col: playerMove.col + startDistanceRTL,
  };

  return { startPosLTR, startPosRTL };
};

export const isGameTied = (boardState: BoardState) => {
  return boardState.every((row) => row.every((cell) => cell !== null));
};

export const isMoveValid = (
  boardState: BoardState,
  playerMove: MovePosition
) => {
  // move is invalid if the column is full
  // col is full if top is full
  return boardState[0][playerMove.col] === null;
};

export const getDropPosition = (
  boardState: BoardState,
  playerMove: MovePosition
) => {
  // Drop the player's piece to the bottom of the board
  const returnVal = playerMove;
  // start from bottom and go up
  for (let i = boardState.length - 1; i >= 0; i--) {
    // if bottom row is null it drops there
    if (boardState[i][playerMove.col] === null) {
      returnVal.row = i;
      return returnVal;
    }
  }
  return returnVal;
};

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
