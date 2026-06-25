import { EvaluationConfig } from './evaluation-config';
import { BoardState, MovePosition, Player } from '../types';
import { isGameTied, validateGameState } from './game-logic';

// Written By Claude because this felt very tedious to write

interface EvaluateBoardProps {
  boardState: BoardState;
  depth: number;
  playerTurn: Player;
  opponent: Player;
  playerMove: MovePosition;
  matchesNeeded: number;
}

export const evaluateBoard = ({
  boardState,
  depth,
  playerMove,
  playerTurn,
  opponent,
  matchesNeeded,
  config,
}: EvaluateBoardProps & {
  config: EvaluationConfig;
}): number => {
  const { terminal, immediate, threeInRow, twoInRow, positional, penalties } =
    config;

  console.log('evaluateBoard');
  const gameState = { boardState, playerTurn, playerMove, matchesNeeded };
  const winner = validateGameState(gameState) === null ? null : playerTurn;

  console.log({ winner });

  // Check terminal states first (highest priority)
  if (winner === playerTurn) {
    return terminal.win - depth;
  } else if (winner === opponent) {
    return depth + terminal.loss; // terminal.loss is already negative
  }

  // Check if game is tied
  if (isGameTied(boardState)) {
    return terminal.tie;
  }

  let totalScore = 0;

  // 1. IMMEDIATE THREATS (highest priority after terminal states)

  // Check if AI can win immediately
  const aiThreats = findImmediateThreats(
    boardState,
    playerTurn,
    matchesNeeded
  );
  totalScore += aiThreats.length * immediate.canWin;

  // Check if AI must block opponent's immediate win
  const opponentThreats = findImmediateThreats(
    boardState,
    opponent,
    matchesNeeded
  );
  totalScore -= opponentThreats.length * immediate.mustBlock;

  // Check for multiple threats (fork opportunities)
  if (aiThreats.length > 1) {
    totalScore += immediate.forkOpportunity;
  }
  if (opponentThreats.length > 1) {
    totalScore -= immediate.forkOpportunity;
  }

  // 2. THREE-IN-A-ROW ANALYSIS (medium-high priority)

  const aiThreeSequences = findSequences(boardState, playerTurn, 3);
  const opponentThreeSequences = findSequences(boardState, opponent, 3);

  // Analyze AI's 3-in-a-row sequences
  for (const sequence of aiThreeSequences) {
    const directions: Array<
      'horizontal' | 'vertical' | 'diagonalLTR' | 'diagonalRTL'
    > = ['horizontal', 'vertical', 'diagonalLTR', 'diagonalRTL'];

    // Try each direction to find the correct one
    for (const direction of directions) {
      const openEnds = hasOpenEnds(boardState, sequence, direction);
      if (openEnds.totalOpenEnds > 0) {
        if (openEnds.totalOpenEnds === 2) {
          totalScore += threeInRow.bothEndsOpen;
        } else {
          totalScore += threeInRow.oneEndOpen;
        }
        break; // Found the direction, no need to check others
      }
    }
  }

  // Analyze opponent's 3-in-a-row sequences (subtract for blocking value)
  for (const sequence of opponentThreeSequences) {
    const directions: Array<
      'horizontal' | 'vertical' | 'diagonalLTR' | 'diagonalRTL'
    > = ['horizontal', 'vertical', 'diagonalLTR', 'diagonalRTL'];

    for (const direction of directions) {
      const openEnds = hasOpenEnds(boardState, sequence, direction);
      if (openEnds.totalOpenEnds > 0) {
        if (openEnds.totalOpenEnds === 2) {
          totalScore -= threeInRow.blockOpponentBothEnds;
        } else {
          totalScore -= threeInRow.blockOpponentOneEnd;
        }
        break;
      }
    }
  }

  // Split-gap 3-in-a-row (XX_X / X_XX inside a win-length window)
  const aiSplitGapWindows = findWinLineWindows(
    boardState,
    playerTurn,
    matchesNeeded
  ).filter((window) => window.isSplitGap);
  const opponentSplitGapWindows = findWinLineWindows(
    boardState,
    opponent,
    matchesNeeded
  ).filter((window) => window.isSplitGap);

  totalScore += aiSplitGapWindows.length * threeInRow.splitGap;
  totalScore -=
    opponentSplitGapWindows.length * threeInRow.blockOpponentSplitGap;

  // 3. TWO-IN-A-ROW ANALYSIS (medium priority)

  const aiTwoSequences = findSequences(boardState, playerTurn, 2);
  const opponentTwoSequences = findSequences(boardState, opponent, 2);

  // Analyze AI's 2-in-a-row sequences
  for (const sequence of aiTwoSequences) {
    const directions: Array<
      'horizontal' | 'vertical' | 'diagonalLTR' | 'diagonalRTL'
    > = ['horizontal', 'vertical', 'diagonalLTR', 'diagonalRTL'];

    for (const direction of directions) {
      const openEnds = hasOpenEnds(boardState, sequence, direction);
      if (openEnds.totalOpenEnds > 0) {
        // Base score for 2-in-a-row
        if (openEnds.totalOpenEnds === 2) {
          totalScore += twoInRow.bothEndsOpen;
        } else {
          totalScore += twoInRow.oneEndOpen;
        }

        // Bonus for center column 2-in-a-row
        const centerCols = [
          Math.floor(boardState[0].length / 2) - 1,
          Math.floor(boardState[0].length / 2),
        ];
        if (sequence.some((pos) => centerCols.includes(pos.col))) {
          totalScore += twoInRow.centerColumns;
        }
        break;
      }
    }
  }

  // Analyze opponent's 2-in-a-row sequences
  for (const sequence of opponentTwoSequences) {
    const directions: Array<
      'horizontal' | 'vertical' | 'diagonalLTR' | 'diagonalRTL'
    > = ['horizontal', 'vertical', 'diagonalLTR', 'diagonalRTL'];

    for (const direction of directions) {
      const openEnds = hasOpenEnds(boardState, sequence, direction);
      if (openEnds.totalOpenEnds > 0) {
        if (openEnds.totalOpenEnds === 2) {
          totalScore -= twoInRow.blockOpponentBothEnds;
        } else {
          totalScore -= twoInRow.blockOpponentOneEnd;
        }
        break;
      }
    }
  }

  // 4. POSITIONAL ANALYSIS (lower priority)

  // Get net positional advantage
  const aiPositionalValue = getPositionalValue(boardState, playerTurn, config);
  const opponentPositionalValue = getPositionalValue(
    boardState,
    opponent,
    config
  );
  const netPositionalAdvantage = aiPositionalValue - opponentPositionalValue;

  totalScore += netPositionalAdvantage;

  // 5. PENALTY ANALYSIS

  // Check for isolated pieces (pieces with no adjacent support)
  let aiIsolatedPieces = 0;
  let opponentIsolatedPieces = 0;

  for (let row = 0; row < boardState.length; row++) {
    for (let col = 0; col < boardState[0].length; col++) {
      if (boardState[row][col] === playerTurn) {
        if (!hasAdjacentPieces(boardState, row, col, playerTurn)) {
          aiIsolatedPieces++;
        }
      } else if (boardState[row][col] === opponent) {
        if (!hasAdjacentPieces(boardState, row, col, opponent)) {
          opponentIsolatedPieces++;
        }
      }
    }
  }

  totalScore += aiIsolatedPieces * penalties.isolatedPieces;
  totalScore -= opponentIsolatedPieces * penalties.isolatedPieces;

  // Check for edge column usage
  let aiEdgePieces = 0;
  let opponentEdgePieces = 0;

  for (let row = 0; row < boardState.length; row++) {
    // First column (left edge)
    if (boardState[row][0] === playerTurn) aiEdgePieces++;
    if (boardState[row][0] === opponent) opponentEdgePieces++;

    // Last column (right edge)
    const lastCol = boardState[0].length - 1;
    if (boardState[row][lastCol] === playerTurn) aiEdgePieces++;
    if (boardState[row][lastCol] === opponent) opponentEdgePieces++;
  }

  totalScore += aiEdgePieces * penalties.edgeColumns;
  totalScore -= opponentEdgePieces * penalties.edgeColumns;

  console.log('evaluateBoard result:', { totalScore, depth });
  return totalScore;
};

// Helper function to check if a piece has adjacent pieces
const hasAdjacentPieces = (
  boardState: BoardState,
  row: number,
  col: number,
  player: Player
): boolean => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // Top row
    [0, -1],
    [0, 1], // Same row
    [1, -1],
    [1, 0],
    [1, 1], // Bottom row
  ];

  return directions.some(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;
    return (
      newRow >= 0 &&
      newRow < boardState.length &&
      newCol >= 0 &&
      newCol < boardState[0].length &&
      boardState[newRow][newCol] === player
    );
  });
};

export const findSequences = (
  boardState: BoardState,
  player: Player,
  length: number
): MovePosition[][] => {
  // find all sequences of a given length for the specified player
  // returns array of sequences, where each sequence is an array of positions
  const sequences: MovePosition[][] = [];

  // Check horizontal sequences (left to right)
  for (let row = 0; row < boardState.length; row++) {
    for (let col = 0; col <= boardState[0].length - length; col++) {
      const sequence: MovePosition[] = [];
      let isValidSequence = true;

      // Check if we have 'length' consecutive pieces of the same player
      for (let i = 0; i < length; i++) {
        if (boardState[row][col + i] !== player) {
          isValidSequence = false;
          break;
        }
        sequence.push({ row, col: col + i });
      }

      if (isValidSequence) {
        sequences.push(sequence);
      }
    }
  }

  // Check vertical sequences (bottom to top)
  for (let col = 0; col < boardState[0].length; col++) {
    for (let row = 0; row <= boardState.length - length; row++) {
      const sequence: MovePosition[] = [];
      let isValidSequence = true;

      // Check if we have 'length' consecutive pieces of the same player
      for (let i = 0; i < length; i++) {
        if (boardState[row + i][col] !== player) {
          isValidSequence = false;
          break;
        }
        sequence.push({ row: row + i, col });
      }

      if (isValidSequence) {
        sequences.push(sequence);
      }
    }
  }

  // Check diagonal sequences (top-left to bottom-right)
  for (let row = 0; row <= boardState.length - length; row++) {
    for (let col = 0; col <= boardState[0].length - length; col++) {
      const sequence: MovePosition[] = [];
      let isValidSequence = true;

      // Check if we have 'length' consecutive pieces of the same player
      for (let i = 0; i < length; i++) {
        if (boardState[row + i][col + i] !== player) {
          isValidSequence = false;
          break;
        }
        sequence.push({ row: row + i, col: col + i });
      }

      if (isValidSequence) {
        sequences.push(sequence);
      }
    }
  }

  // Check anti-diagonal sequences (top-right to bottom-left)
  for (let row = 0; row <= boardState.length - length; row++) {
    for (let col = length - 1; col < boardState[0].length; col++) {
      const sequence: MovePosition[] = [];
      let isValidSequence = true;

      // Check if we have 'length' consecutive pieces of the same player
      for (let i = 0; i < length; i++) {
        if (boardState[row + i][col - i] !== player) {
          isValidSequence = false;
          break;
        }
        sequence.push({ row: row + i, col: col - i });
      }

      if (isValidSequence) {
        sequences.push(sequence);
      }
    }
  }

  return sequences;
};

export const hasOpenEnds = (
  boardState: BoardState,
  sequencePositions: MovePosition[],
  direction: 'horizontal' | 'vertical' | 'diagonalLTR' | 'diagonalRTL'
): { leftOpen: boolean; rightOpen: boolean; totalOpenEnds: number } => {
  if (sequencePositions.length === 0) {
    return { leftOpen: false, rightOpen: false, totalOpenEnds: 0 };
  }

  const boardHeight = boardState.length;
  const boardWidth = boardState[0].length;

  let leftOpen = false;
  let rightOpen = false;

  // Helper function to check if a position is valid and empty
  const isValidAndEmpty = (row: number, col: number): boolean => {
    return (
      row >= 0 &&
      row < boardHeight &&
      col >= 0 &&
      col < boardWidth &&
      boardState[row][col] === null
    );
  };

  // Helper function to check if a piece can be placed (considering gravity)
  const canPlacePiece = (row: number, col: number): boolean => {
    if (row < 0 || row >= boardHeight || col < 0 || col >= boardWidth) {
      return false;
    }

    // Position must be empty
    if (boardState[row][col] !== null) {
      return false;
    }

    // If it's the bottom row, piece can be placed
    if (row === boardHeight - 1) {
      return true;
    }

    // Otherwise, there must be a piece below it
    return boardState[row + 1][col] !== null;
  };

  switch (direction) {
    case 'horizontal': {
      // For horizontal sequences, check left and right ends
      const firstPos = sequencePositions[0];
      const lastPos = sequencePositions[sequencePositions.length - 1];

      // Check left end (position before the first piece)
      const leftEndCol = firstPos.col - 1;
      if (canPlacePiece(firstPos.row, leftEndCol)) {
        leftOpen = true;
      }

      // Check right end (position after the last piece)
      const rightEndCol = lastPos.col + 1;
      if (canPlacePiece(lastPos.row, rightEndCol)) {
        rightOpen = true;
      }
      break;
    }

    case 'vertical': {
      // For vertical sequences, only the top end matters (due to gravity)
      const topPos = sequencePositions[0]; // First position should be topmost
      const bottomPos = sequencePositions[sequencePositions.length - 1];

      // Check if we can place a piece above the sequence
      const topEndRow = topPos.row - 1;
      if (isValidAndEmpty(topEndRow, topPos.col)) {
        leftOpen = true; // Using leftOpen for "top" in vertical
      }

      // Bottom end is never useful in Connect 4 due to gravity
      rightOpen = false;
      break;
    }

    case 'diagonalLTR': {
      // For diagonal left-to-right (top-left to bottom-right)
      const firstPos = sequencePositions[0];
      const lastPos = sequencePositions[sequencePositions.length - 1];

      // Check upper-left end
      const leftEndRow = firstPos.row - 1;
      const leftEndCol = firstPos.col - 1;
      if (canPlacePiece(leftEndRow, leftEndCol)) {
        leftOpen = true;
      }

      // Check lower-right end
      const rightEndRow = lastPos.row + 1;
      const rightEndCol = lastPos.col + 1;
      if (canPlacePiece(rightEndRow, rightEndCol)) {
        rightOpen = true;
      }
      break;
    }

    case 'diagonalRTL': {
      // For diagonal right-to-left (top-right to bottom-left)
      const firstPos = sequencePositions[0];
      const lastPos = sequencePositions[sequencePositions.length - 1];

      // Check upper-right end
      const leftEndRow = firstPos.row - 1;
      const leftEndCol = firstPos.col + 1;
      if (canPlacePiece(leftEndRow, leftEndCol)) {
        leftOpen = true;
      }

      // Check lower-left end
      const rightEndRow = lastPos.row + 1;
      const rightEndCol = lastPos.col - 1;
      if (canPlacePiece(rightEndRow, rightEndCol)) {
        rightOpen = true;
      }
      break;
    }
  }

  const totalOpenEnds = (leftOpen ? 1 : 0) + (rightOpen ? 1 : 0);

  return { leftOpen, rightOpen, totalOpenEnds };
};

type SequenceDirection =
  | 'horizontal'
  | 'vertical'
  | 'diagonalLTR'
  | 'diagonalRTL';

const moveKey = (position: MovePosition): string =>
  `${position.row},${position.col}`;

export const canPlacePieceAt = (
  boardState: BoardState,
  row: number,
  col: number
): boolean => {
  const boardHeight = boardState.length;
  const boardWidth = boardState[0].length;

  if (row < 0 || row >= boardHeight || col < 0 || col >= boardWidth) {
    return false;
  }

  if (boardState[row][col] !== null) {
    return false;
  }

  if (row === boardHeight - 1) {
    return true;
  }

  return boardState[row + 1][col] !== null;
};

export interface WinLineWindow {
  direction: SequenceDirection;
  window: MovePosition[];
  piecePositions: MovePosition[];
  gapPositions: MovePosition[];
  isSplitGap: boolean;
}

const getNextWindowPosition = (
  position: MovePosition,
  direction: SequenceDirection
): MovePosition => {
  switch (direction) {
    case 'horizontal':
      return { row: position.row, col: position.col + 1 };
    case 'vertical':
      return { row: position.row + 1, col: position.col };
    case 'diagonalLTR':
      return { row: position.row + 1, col: position.col + 1 };
    case 'diagonalRTL':
      return { row: position.row + 1, col: position.col - 1 };
  }
};

const buildWindow = (
  start: MovePosition,
  direction: SequenceDirection,
  windowSize: number
): MovePosition[] => {
  const window: MovePosition[] = [start];
  let current = start;

  for (let i = 1; i < windowSize; i++) {
    current = getNextWindowPosition(current, direction);
    window.push(current);
  }

  return window;
};

const isWindowInBounds = (
  boardState: BoardState,
  window: MovePosition[]
): boolean => {
  const boardHeight = boardState.length;
  const boardWidth = boardState[0].length;

  return window.every(
    ({ row, col }) =>
      row >= 0 && row < boardHeight && col >= 0 && col < boardWidth
  );
};

export const findWinLineWindows = (
  boardState: BoardState,
  player: Player,
  matchesNeeded: number
): WinLineWindow[] => {
  const windows: WinLineWindow[] = [];
  const boardHeight = boardState.length;
  const boardWidth = boardState[0].length;
  const directions: SequenceDirection[] = [
    'horizontal',
    'vertical',
    'diagonalLTR',
    'diagonalRTL',
  ];

  for (const direction of directions) {
    for (let row = 0; row < boardHeight; row++) {
      for (let col = 0; col < boardWidth; col++) {
        const window = buildWindow({ row, col }, direction, matchesNeeded);

        if (!isWindowInBounds(boardState, window)) {
          continue;
        }

        const piecePositions: MovePosition[] = [];
        const gapPositions: MovePosition[] = [];
        let opponentCount = 0;

        window.forEach((position) => {
          const cell = boardState[position.row][position.col];

          if (cell === player) {
            piecePositions.push(position);
          } else if (cell === null) {
            gapPositions.push(position);
          } else {
            opponentCount++;
          }
        });

        if (
          opponentCount > 0 ||
          piecePositions.length !== matchesNeeded - 1 ||
          gapPositions.length !== 1
        ) {
          continue;
        }

        const gapIndex = window.findIndex(
          (position) =>
            position.row === gapPositions[0].row &&
            position.col === gapPositions[0].col
        );
        const isSplitGap = gapIndex > 0 && gapIndex < matchesNeeded - 1;

        windows.push({
          direction,
          window,
          piecePositions,
          gapPositions,
          isSplitGap,
        });
      }
    }
  }

  return windows;
};

export interface ImmediateThreat {
  sequence: MovePosition[];
  winningMoves: MovePosition[];
  direction: 'horizontal' | 'vertical' | 'diagonalLTR' | 'diagonalRTL';
}

export const findImmediateThreats = (
  boardState: BoardState,
  player: Player,
  matchesNeeded = 4
): ImmediateThreat[] => {
  const windows = findWinLineWindows(boardState, player, matchesNeeded);
  const seenWinningMoves = new Set<string>();
  const threats: ImmediateThreat[] = [];

  for (const window of windows) {
    const winningMoves = window.gapPositions.filter((position) =>
      canPlacePieceAt(boardState, position.row, position.col)
    );

    if (winningMoves.length === 0) {
      continue;
    }

    const winningMoveKey = winningMoves.map(moveKey).sort().join('|');
    if (seenWinningMoves.has(winningMoveKey)) {
      continue;
    }
    seenWinningMoves.add(winningMoveKey);

    threats.push({
      sequence: window.piecePositions,
      winningMoves,
      direction: window.direction,
    });
  }

  return threats;
};

export const getPositionalValue = (
  boardState: BoardState,
  player: Player,
  config: EvaluationConfig
): number => {
  // Calculate the positional value of a given player's position
  // Returns the total positional score based on piece placement and board control
  let positionalValue = 0;
  const boardHeight = boardState.length;
  const boardWidth = boardState[0].length;

  // Define center columns (typically columns 3 and 4 in a 7-column board)
  const centerCols = [
    Math.floor(boardWidth / 2) - 1,
    Math.floor(boardWidth / 2),
  ];
  const nearCenterCols = [
    Math.floor(boardWidth / 2) - 2,
    Math.floor(boardWidth / 2) + 1,
  ].filter((col) => col >= 0 && col < boardWidth);

  // Helper function to check if position has adjacent pieces
  const hasAdjacentPieces = (row: number, col: number): boolean => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1], // Top row
      [0, -1],
      [0, 1], // Same row
      [1, -1],
      [1, 0],
      [1, 1], // Bottom row
    ];

    return directions.some(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      return (
        newRow >= 0 &&
        newRow < boardHeight &&
        newCol >= 0 &&
        newCol < boardWidth &&
        boardState[newRow][newCol] === player
      );
    });
  };

  // Helper function to count foundation strength (how supported a piece is)
  const getFoundationStrength = (row: number, col: number): number => {
    let strength = 0;

    // Bottom row pieces are automatically well-founded
    if (row === boardHeight - 1) {
      strength += 3;
    }

    // Add strength for pieces below
    for (let checkRow = row + 1; checkRow < boardHeight; checkRow++) {
      if (boardState[checkRow][col] !== null) {
        strength += 1;
      } else {
        break; // Stop if we hit an empty space
      }
    }

    return Math.min(strength, 5); // Cap the foundation bonus
  };

  // Analyze each piece on the board
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      if (boardState[row][col] === player) {
        // Center control bonus
        if (centerCols.includes(col)) {
          positionalValue += config.positional.centerControl;
        } else if (nearCenterCols.includes(col)) {
          positionalValue += config.positional.centerControl * 0.5; // Half bonus for near-center
        }

        // Foundation pieces bonus (lower rows are more valuable)
        const distanceFromBottom = boardHeight - 1 - row;
        if (distanceFromBottom <= 2) {
          // Bottom 3 rows
          positionalValue +=
            config.positional.foundationPieces * (3 - distanceFromBottom);
        }

        // Adjacent pieces bonus (pieces that connect to other pieces)
        if (hasAdjacentPieces(row, col)) {
          positionalValue += config.positional.adjacentToPieces;
        }

        // Foundation strength bonus
        const foundationStrength = getFoundationStrength(row, col);
        positionalValue += foundationStrength * 0.5;

        // Height advantage in center columns (pieces higher up in center can create more opportunities)
        if (centerCols.includes(col) && row < boardHeight / 2) {
          positionalValue += config.positional.centerControl * 0.3;
        }
      }
    }
  }

  // Analyze 1-in-a-row potential (single pieces with expansion potential)
  const oneInRowSequences = findSequences(boardState, player, 1);
  for (const sequence of oneInRowSequences) {
    const position = sequence[0]; // Single piece position

    // Only count isolated pieces or pieces at sequence ends
    if (!hasAdjacentPieces(position.row, position.col)) {
      if (centerCols.includes(position.col)) {
        positionalValue += config.positional.oneInRowCenter;
      } else {
        positionalValue += config.positional.oneInRowEdge;
      }
    }
  }

  // Analyze potential connections (empty spaces that could connect existing pieces)
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      if (boardState[row][col] === null) {
        // Check if this empty space could connect player's pieces
        let connectionValue = 0;

        // Check horizontal connections
        const leftPiece = col > 0 ? boardState[row][col - 1] : null;
        const rightPiece =
          col < boardWidth - 1 ? boardState[row][col + 1] : null;
        if (leftPiece === player || rightPiece === player) {
          connectionValue += 1;
        }

        // Check vertical connections (only pieces below matter due to gravity)
        const belowPiece =
          row < boardHeight - 1 ? boardState[row + 1][col] : null;
        if (belowPiece === player) {
          connectionValue += 1;
        }

        // Check diagonal connections
        const diagonalPositions = [
          [row - 1, col - 1],
          [row - 1, col + 1],
          [row + 1, col - 1],
          [row + 1, col + 1],
        ];

        for (const [dRow, dCol] of diagonalPositions) {
          if (
            dRow >= 0 &&
            dRow < boardHeight &&
            dCol >= 0 &&
            dCol < boardWidth
          ) {
            if (boardState[dRow][dCol] === player) {
              connectionValue += 0.5;
            }
          }
        }

        // Add small bonus for positions that could connect pieces
        if (connectionValue > 0) {
          positionalValue += connectionValue * 0.5;
        }
      }
    }
  }

  // Apply penalties for edge-heavy play
  let edgePieces = 0;
  for (let row = 0; row < boardHeight; row++) {
    if (boardState[row][0] === player) edgePieces++;
    if (boardState[row][boardWidth - 1] === player) edgePieces++;
  }

  if (edgePieces > boardHeight / 2) {
    // If more than half the pieces are on edges
    positionalValue += config.penalties.edgeColumns * edgePieces;
  }

  return Math.round(positionalValue * 10) / 10; // Round to 1 decimal place
};
