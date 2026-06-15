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
        overflow: 'auto',
        p: 2,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Typography variant="h5" color="text.primary" fontWeight={700}>
          Connect Four
        </Typography>

        <Stack
          direction={isMobileLayout ? 'column' : 'row'}
          spacing={isMobileLayout ? 3 : 4}
          alignItems="center"
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          <ConnectFourPlayerConfig
            playerNumber={1}
            color={playerOneColor}
            onColorChange={handlePlayerOneColorChange}
            playerType={playerOneType}
            onPlayerTypeChange={handlePlayerOneTypeChange}
            onAiConfigChange={handlePlayerOneConfigChange}
            onPauseChange={handlePauseChange}
          />

          <ConnectFourBoard
            boardState={boardState}
            winningMatch={winningMatch}
            onPieceDrop={handlePieceDrop}
            playerOneColor={playerOneColor}
            playerTwoColor={playerTwoColor}
          />

          <ConnectFourPlayerConfig
            playerNumber={2}
            color={playerTwoColor}
            onColorChange={handlePlayerTwoColorChange}
            playerType={playerTwoType}
            onPlayerTypeChange={handlePlayerTwoTypeChange}
            onAiConfigChange={handlePlayerTwoConfigChange}
            onPauseChange={handlePauseChange}
          />
        </Stack>

        <Typography variant="h6" color="text.primary">
          {statusText}
        </Typography>

        <Stack direction="row" spacing={2}>
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
      </Stack>
    </Box>
  );
};
