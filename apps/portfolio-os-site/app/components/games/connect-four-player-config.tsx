import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import { Settings } from '@mui/icons-material';

import {
  Color,
  Difficulty,
  EvaluationConfig,
  PLAYER_TYPE,
  PlayerType,
} from '@jc/games-lib';

import { ConnectFourAiPanel } from './connect-four-ai-panel';

interface ConnectFourPlayerConfigProps {
  playerNumber: number;
  color: Color;
  onColorChange: (color: Color) => void;
  playerType: PlayerType;
  onPlayerTypeChange: (value: PlayerType) => void;
  aiConfig?: EvaluationConfig;
  aiDifficulty?: Difficulty;
  onAiConfigChange?: (config: EvaluationConfig, difficulty: Difficulty) => void;
  onPauseChange: (value: boolean) => void;
}

export const ConnectFourPlayerConfig = ({
  playerNumber,
  color,
  onColorChange,
  playerType,
  onPlayerTypeChange,
  aiConfig,
  aiDifficulty,
  onAiConfigChange,
  onPauseChange,
}: ConnectFourPlayerConfigProps) => {
  const theme = useTheme();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <>
      <Stack spacing={2} sx={{ minWidth: 160, maxWidth: 200 }}>
        <Typography
          variant="subtitle2"
          textAlign="center"
          color="text.primary"
          fontWeight={600}
        >
          Player {playerNumber}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Color
          </Typography>
          <Box
            component="input"
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            sx={{
              width: 32,
              height: 32,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              cursor: 'pointer',
              p: 0,
              bgcolor: 'transparent',
            }}
          />
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            Type
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={playerType}
            onChange={(_, value) => {
              if (value) onPlayerTypeChange(value as PlayerType);
            }}
            fullWidth
          >
            <ToggleButton value={PLAYER_TYPE.HUMAN}>Human</ToggleButton>
            <ToggleButton value={PLAYER_TYPE.COMPUTER}>Computer</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {playerType === PLAYER_TYPE.COMPUTER && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<Settings fontSize="small" />}
            onClick={() => {
              onPauseChange(true);
              setIsAiModalOpen(true);
            }}
          >
            AI Settings
          </Button>
        )}
      </Stack>

      <Dialog
        open={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setTimeout(() => onPauseChange(false), 300);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Player {playerNumber} AI Configuration</DialogTitle>
        <DialogContent>
          <ConnectFourAiPanel
            config={aiConfig}
            difficulty={aiDifficulty}
            onConfigChange={onAiConfigChange}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
