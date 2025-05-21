export type Player = 1 | 2;
export type Color = string;
export type BoardState = Array<Array<Player | null>>;
export type MovePosition = { row: number; col: number };

export type GameState = {
  boardState: BoardState;
  playerMove: MovePosition;
  playerTurn: Player;
  matchesNeeded: number;
};
