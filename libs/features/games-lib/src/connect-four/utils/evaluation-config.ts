// Connect 4 AI Evaluation Configuration
// Adjust these values to fine-tune AI behavior

export interface EvaluationConfig {
  // Terminal states (highest priority)
  terminal: {
    win: number;
    loss: number;
    tie: number;
  };

  // Immediate threats and opportunities (high priority)
  immediate: {
    canWin: number;
    mustBlock: number;
    createMultipleThreats: number;
    forkOpportunity: number; // Creating two ways to win
  };

  // 3-in-a-row scenarios (medium-high priority)
  threeInRow: {
    bothEndsOpen: number;
    oneEndOpen: number;
    splitGap: number; // XX_X / X_XX — three pieces with an internal gap
    blockOpponentBothEnds: number;
    blockOpponentOneEnd: number;
    blockOpponentSplitGap: number;
  };

  // 2-in-a-row scenarios (medium priority)
  twoInRow: {
    bothEndsOpen: number;
    oneEndOpen: number;
    centerColumns: number; // Bonus for 2-in-a-row in center
    blockOpponentBothEnds: number;
    blockOpponentOneEnd: number;
  };

  // Positional control and 1-in-a-row (lower priority)
  positional: {
    centerControl: number;
    foundationPieces: number; // Lower row pieces
    oneInRowCenter: number;
    oneInRowEdge: number;
    adjacentToPieces: number; // Pieces next to existing pieces
  };

  // Penalty values (negative scores)
  penalties: {
    edgeColumns: number; // Small penalty for edge play
    isolatedPieces: number; // Pieces with no adjacent support
    blockingOwnSequence: number; // Accidentally blocking your own potential wins
  };
}

// Default configuration - adjust these values based on testing
export const DEFAULT_EVAL_CONFIG: EvaluationConfig = {
  terminal: {
    win: 10000, // Guaranteed win
    loss: -10000, // Guaranteed loss
    tie: 0, // Draw game
  },

  immediate: {
    canWin: 2000, // AI can win on next move
    mustBlock: 1800, // Block opponent's immediate win
    createMultipleThreats: 800, // Create multiple winning opportunities
    forkOpportunity: 750, // Set up unavoidable win scenario
  },

  threeInRow: {
    bothEndsOpen: 350, // 3-in-a-row with both ends available
    oneEndOpen: 175, // 3-in-a-row with one end blocked
    splitGap: 325, // XX_X / X_XX offensive threat
    blockOpponentBothEnds: 950, // Block opponent's 3-in-a-row (both ends) — nearly as urgent as mustBlock
    blockOpponentOneEnd: 500, // Block opponent's 3-in-a-row (one end)
    blockOpponentSplitGap: 900, // Block opponent's split-gap 3-in-a-row
  },

  twoInRow: {
    bothEndsOpen: 50, // 2-in-a-row with both ends available
    oneEndOpen: 25, // 2-in-a-row with one end blocked
    centerColumns: 10, // Bonus for 2-in-a-row in center columns
    blockOpponentBothEnds: 120, // Block opponent's 2-in-a-row (both ends) — lower priority than 3-in-a-row
    blockOpponentOneEnd: 30, // Block opponent's 2-in-a-row (one end)
  },

  positional: {
    centerControl: 10, // Control center columns (3, 4)
    foundationPieces: 5, // Pieces in bottom rows
    oneInRowCenter: 3, // Single pieces in center columns
    oneInRowEdge: 1, // Single pieces in edge columns
    adjacentToPieces: 2, // Pieces connected to existing pieces
  },

  penalties: {
    edgeColumns: -2, // Small penalty for outer columns
    isolatedPieces: -3, // Pieces with no adjacent support
    blockingOwnSequence: -50, // Penalty for blocking own potential wins
  },
};

// Helper function to create custom configurations
export const createEvalConfig = (
  overrides: Partial<EvaluationConfig>
): EvaluationConfig => {
  return {
    terminal: { ...DEFAULT_EVAL_CONFIG.terminal, ...overrides.terminal },
    immediate: { ...DEFAULT_EVAL_CONFIG.immediate, ...overrides.immediate },
    threeInRow: { ...DEFAULT_EVAL_CONFIG.threeInRow, ...overrides.threeInRow },
    twoInRow: { ...DEFAULT_EVAL_CONFIG.twoInRow, ...overrides.twoInRow },
    positional: { ...DEFAULT_EVAL_CONFIG.positional, ...overrides.positional },
    penalties: { ...DEFAULT_EVAL_CONFIG.penalties, ...overrides.penalties },
  };
};

// Predefined difficulty configurations
export const DIFFICULTY_CONFIGS = {
  easy: createEvalConfig({
    immediate: {
      canWin: 500, // Less likely to see immediate wins
      mustBlock: 450, // Less likely to block
      createMultipleThreats: 300,
      forkOpportunity: 250,
    },
    threeInRow: {
      bothEndsOpen: 200,
      oneEndOpen: 100,
      splitGap: 150,
      blockOpponentBothEnds: 250,
      blockOpponentOneEnd: 125,
      blockOpponentSplitGap: 200,
    },
    twoInRow: {
      bothEndsOpen: 50,
      oneEndOpen: 25,
      centerColumns: 10,
      blockOpponentBothEnds: 60,
      blockOpponentOneEnd: 15,
    },
  }),

  medium: DEFAULT_EVAL_CONFIG,

  hard: createEvalConfig({
    immediate: {
      canWin: 2200, // More aggressive about winning
      mustBlock: 2000, // Better at blocking immediate wins
      createMultipleThreats: 1200,
      forkOpportunity: 1000,
    },
    positional: {
      centerControl: 15, // Better positional understanding
      foundationPieces: 8,
      oneInRowCenter: 5,
      oneInRowEdge: 1,
      adjacentToPieces: 4,
    },
    threeInRow: {
      bothEndsOpen: 400,
      oneEndOpen: 200,
      splitGap: 375,
      blockOpponentBothEnds: 1100, // Strongest 3-in-a-row defense
      blockOpponentOneEnd: 600,
      blockOpponentSplitGap: 1050,
    },
    twoInRow: {
      bothEndsOpen: 50,
      oneEndOpen: 25,
      centerColumns: 10,
      blockOpponentBothEnds: 150,
      blockOpponentOneEnd: 40,
    },
  }),
};

// Usage example:
// const config = DIFFICULTY_CONFIGS.medium;
// const customConfig = createEvalConfig({
//   immediate: { canWin: 1200 },
//   positional: { centerControl: 15 }
// });
