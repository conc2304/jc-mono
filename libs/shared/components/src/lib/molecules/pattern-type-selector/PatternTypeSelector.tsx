import { Box, Typography, Paper, Tooltip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { GradientPatternVisualizer } from '../../atoms/gradient-pattern-visualizer';
import {
  GradientPatternType,
  InterpolationMode,
  ColorStop,
} from '../../organisms/color-gradient-editor/types';

interface PatternTypeSelectorProps {
  selectedPatternType: GradientPatternType | null;
  interpolation: InterpolationMode;
  selectedGradientStops?: ColorStop[];
  onPatternTypeSelect: (type: GradientPatternType) => void;
}

const PATTERN_TYPES: Array<{
  type: GradientPatternType;
  label: string;
  description: string;
}> = [
  { type: 'horizontal', label: 'Horizontal', description: 'Left to right' },
  { type: 'vertical', label: 'Vertical', description: 'Top to bottom' },
  { type: 'radial', label: 'Radial', description: 'Center outward' },
  { type: 'circular', label: 'Circular', description: 'Rotating conic' },
];

export const PatternTypeSelector = ({
  selectedPatternType,
  interpolation,
  selectedGradientStops,
  onPatternTypeSelect,
}: PatternTypeSelectorProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={{ mb: 1.5 }}
      >
        Pattern Types
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 1,
        }}
      >
        {PATTERN_TYPES.map((pattern) => (
          <Tooltip key={pattern.type} title={pattern.description} arrow>
            <Paper
              data-augmented-ui="tl-2-clip-x tr-2-clip-x border"
              onClick={() => onPatternTypeSelect(pattern.type)}
              sx={{
                px: 1.25,
                py: 1,
                borderRadius: 'unset',
                cursor: 'pointer',
                '--aug-tr-extend1': '4px',
                '--aug-tl-extend2': '4px',

                '--aug-border-all': '2px',
                '--aug-border-bg':
                  selectedPatternType === pattern.type
                    ? theme.palette.primary.main
                    : theme.palette.divider,
                backgroundColor:
                  selectedPatternType === pattern.type
                    ? theme.palette.action.selected
                    : alpha(theme.palette.background.paper, 0.7),
                transition: 'all 0.2s',
                '&:hover': {
                  '--aug-border-bg':
                    selectedPatternType === pattern.type
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 0.5, display: 'block', textAlign: 'center' }}
              >
                {pattern.label}
              </Typography>
              <Box
                data-augmented-ui="tl-clip tr-clip border"
                sx={{
                  '--aug-border-all': '2px',
                  '--aug-border-bg': theme.palette.text.secondary,
                  '--aug-tl': theme.spacing(1),
                  '--aug-tr': theme.spacing(1),
                }}
              >
                <GradientPatternVisualizer
                  type={pattern.type}
                  interpolation={interpolation}
                  stops={selectedGradientStops}
                  width="100%"
                  height={48}
                />
              </Box>
            </Paper>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};
