import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { PLAYER_TYPE, useConnectFourGame } from '@jc/games-lib';

import { ConnectFourBoard } from './connect-four-board';
import { ConnectFourPlayerConfig } from './connect-four-player-config';

const CONNECT_FOUR_SETTINGS_KEY = 'connect-four-player-settings';

export const ConnectFourThemed = () => {
  const theme = useTheme();
  const isMobileLayout = useMediaQuery(theme.breakpoints.down('md'));

  const {
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
  } = useConnectFourGame({
    defaultPlayerOneColor: theme.palette.primary.main,
    defaultPlayerTwoColor: theme.palette.secondary.main,
    settingsStorageKey: CONNECT_FOUR_SETTINGS_KEY,
  });

  const statusText = isGameOver
    ? winningMatch == null
      ? 'Tied Game'
      : `Player ${playerTurn} Wins!`
    : `Player ${playerTurn}'s Turn`;

  const hasComputerPlayer = [playerOneType, playerTwoType].includes(
    PLAYER_TYPE.COMPUTER
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 2,
      }}
    >
      <Typography
        variant="h5"
        color="text.primary"
        fontWeight={700}
        textAlign="center"
        sx={{ flexShrink: 0 }}
      >
        Connect Four
      </Typography>

      <Stack
        direction={isMobileLayout ? 'column' : 'row'}
        spacing={isMobileLayout ? 2 : 3}
        alignItems={isMobileLayout ? 'center' : 'stretch'}
        justifyContent="center"
        sx={{ flex: 1, minHeight: 0, width: '100%', mt: 2, overflow: 'auto' }}
      >
        <Box sx={{ flexShrink: 0, alignSelf: isMobileLayout ? 'center' : 'center' }}>
          <ConnectFourPlayerConfig
            playerNumber={1}
            color={playerOneColor}
            onColorChange={handlePlayerOneColorChange}
            playerType={playerOneType}
            onPlayerTypeChange={handlePlayerOneTypeChange}
            aiConfig={playerOneConfig}
            aiDifficulty={playerOneDifficulty}
            onAiConfigChange={handlePlayerOneConfigChange}
            onPauseChange={handlePauseChange}
          />
        </Box>

        <ConnectFourBoard
          boardState={boardState}
          winningMatch={winningMatch}
          onPieceDrop={handlePieceDrop}
          playerOneColor={playerOneColor}
          playerTwoColor={playerTwoColor}
        />

        <Box sx={{ flexShrink: 0, alignSelf: isMobileLayout ? 'center' : 'center' }}>
          <ConnectFourPlayerConfig
            playerNumber={2}
            color={playerTwoColor}
            onColorChange={handlePlayerTwoColorChange}
            playerType={playerTwoType}
            onPlayerTypeChange={handlePlayerTwoTypeChange}
            aiConfig={playerTwoConfig}
            aiDifficulty={playerTwoDifficulty}
            onAiConfigChange={handlePlayerTwoConfigChange}
            onPauseChange={handlePauseChange}
          />
        </Box>
      </Stack>

      <Box sx={{ flexShrink: 0, textAlign: 'center', mt: 2 }}>
        <Typography variant="h6" color="text.primary">
          {statusText}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={resetBoard}>
            Restart Game
          </Button>

          {hasComputerPlayer && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setGameIsPaused(!gameIsPaused)}
            >
              {gameIsPaused ? 'Play' : 'Pause'}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
