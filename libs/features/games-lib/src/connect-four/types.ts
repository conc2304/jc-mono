import { PLAYER_TYPE } from './constants';

export type Player = 1 | 2;
export type Color = string;
export type BoardState = Array<Array<Player | null>>;
export type MovePosition = { row: number; col: number };
export type PlayerType = (typeof PLAYER_TYPE)[keyof typeof PLAYER_TYPE];
export type GameState = {
  boardState: BoardState;
  playerMove: MovePosition;
  playerTurn: Player;
  matchesNeeded: number;
};

export type BestMove = { move: MovePosition; score: number };
export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';
