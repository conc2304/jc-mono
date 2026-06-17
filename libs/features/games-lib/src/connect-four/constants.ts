export const PLAYER_TYPE = {
  HUMAN: 'human',
  COMPUTER: 'computer',
} as const;

export const DEFAULT_BOARD_DIMENSIONS = [7, 6] as const;

/** Minimum cell size in px — board will not shrink below this. */
export const MIN_CELL_SIZE_PX = 64;
