import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RotateCcw } from 'lucide-react';
import { formatLabel } from '@jc/utils';

import {
  DIFFICULTY_CONFIGS,
  Difficulty,
  EvaluationConfig,
} from '@jc/games-lib';

interface ConnectFourAiPanelProps {
  config?: EvaluationConfig;
  difficulty?: Difficulty;
  onConfigChange?: (config: EvaluationConfig, difficulty: Difficulty) => void;
}

export const ConnectFourAiPanel = ({
  config: configProp,
  difficulty: difficultyProp,
  onConfigChange,
}: ConnectFourAiPanelProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(
    difficultyProp ?? 'medium'
  );
  const [config, setConfig] = useState<EvaluationConfig>(
    configProp ?? DIFFICULTY_CONFIGS.medium
  );
  const [expandedSection, setExpandedSection] = useState<string | false>(
    'terminal'
  );

  useEffect(() => {
    if (configProp) {
      setConfig(configProp);
    }
  }, [configProp]);

  useEffect(() => {
    if (difficultyProp) {
      setDifficulty(difficultyProp);
    }
  }, [difficultyProp]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    if (newDifficulty !== 'custom') {
      const newConfig = DIFFICULTY_CONFIGS[newDifficulty];
      setConfig(newConfig);
      onConfigChange?.(newConfig, newDifficulty);
    }
  };

  const updateConfig = (
    section: keyof EvaluationConfig,
    field: string,
    value: number
  ) => {
    const newConfig = {
      ...config,
      [section]: { ...config[section], [field]: value },
    };
    setConfig(newConfig);

    if (difficulty !== 'custom') {
      setDifficulty('custom');
    }
    onConfigChange?.(newConfig, 'custom');
  };

  const resetToDefault = () => {
    setConfig(DIFFICULTY_CONFIGS.medium);
    setDifficulty('medium');
    onConfigChange?.(DIFFICULTY_CONFIGS.medium, 'medium');
  };

  return (
    <Box sx={{ py: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" color="text.primary">
          AI Configuration
        </Typography>
        <Button
          size="small"
          startIcon={<RotateCcw size={16} />}
          onClick={resetToDefault}
          color="inherit"
        >
          Reset
        </Button>
      </Stack>

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Difficulty Level
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={difficulty}
          onChange={(_, value) => {
            if (value) handleDifficultyChange(value as Difficulty);
          }}
          sx={{ flexWrap: 'wrap' }}
        >
          {(['easy', 'medium', 'hard', 'custom'] as const).map((level) => (
            <ToggleButton key={level} value={level} sx={{ textTransform: 'capitalize' }}>
              {level}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Stack spacing={1}>
        {Object.entries(config).map(([sectionKey, sectionConfig]) => (
          <Accordion
            key={sectionKey}
            expanded={expandedSection === sectionKey}
            onChange={(_, isExpanded) =>
              setExpandedSection(isExpanded ? sectionKey : false)
            }
            disableGutters
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" fontWeight={600}>
                {formatLabel(sectionKey)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.5}>
                {Object.entries(sectionConfig as Record<string, number>).map(
                  ([field, value]) => (
                    <TextField
                      key={field}
                      label={formatLabel(field)}
                      type="number"
                      size="small"
                      value={value}
                      onChange={(e) =>
                        updateConfig(
                          sectionKey as keyof EvaluationConfig,
                          field,
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                    />
                  )
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
};
