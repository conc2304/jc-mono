import { PLAYER_TYPE } from '../constants';
import { Color, Difficulty, PlayerType } from '../types';
import {
  DEFAULT_EVAL_CONFIG,
  EvaluationConfig,
} from './evaluation-config';

export interface ConnectFourPersistedSettings {
  playerOneColor: Color;
  playerTwoColor: Color;
  playerOneType: PlayerType;
  playerTwoType: PlayerType;
  playerOneConfig: EvaluationConfig;
  playerTwoConfig: EvaluationConfig;
  playerOneDifficulty: Difficulty;
  playerTwoDifficulty: Difficulty;
}

export const createDefaultPlayerSettings = ({
  playerOneColor,
  playerTwoColor,
}: {
  playerOneColor: Color;
  playerTwoColor: Color;
}): ConnectFourPersistedSettings => ({
  playerOneColor,
  playerTwoColor,
  playerOneType: PLAYER_TYPE.HUMAN,
  playerTwoType: PLAYER_TYPE.HUMAN,
  playerOneConfig: DEFAULT_EVAL_CONFIG,
  playerTwoConfig: DEFAULT_EVAL_CONFIG,
  playerOneDifficulty: 'medium',
  playerTwoDifficulty: 'medium',
});

export const readPlayerSettings = (
  key: string,
  defaults: ConnectFourPersistedSettings
): ConnectFourPersistedSettings | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (!item) {
      return null;
    }

    const parsed = JSON.parse(item) as Partial<ConnectFourPersistedSettings>;

    return {
      ...defaults,
      ...parsed,
      playerOneConfig: {
        ...defaults.playerOneConfig,
        ...parsed.playerOneConfig,
      },
      playerTwoConfig: {
        ...defaults.playerTwoConfig,
        ...parsed.playerTwoConfig,
      },
    };
  } catch {
    return null;
  }
};

export const writePlayerSettings = (
  key: string,
  settings: ConnectFourPersistedSettings
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(settings));
  } catch {
    // Ignore quota / privacy errors
  }
};
