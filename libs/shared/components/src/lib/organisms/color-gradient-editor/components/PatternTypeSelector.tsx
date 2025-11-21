import { Box, Typography, Paper, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GradientPatternVisualizer } from './GradientPatternVisualizer';
import { GradientPatternType, InterpolationMode, ColorStop } from '../types';

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
              onClick={() => onPatternTypeSelect(pattern.type)}
              sx={{
                p: 1,
                cursor: 'pointer',
                border: `2px solid ${
                  selectedPatternType === pattern.type
                    ? theme.palette.primary.main
                    : theme.palette.divider
                }`,
                backgroundColor:
                  selectedPatternType === pattern.type
                    ? theme.palette.action.selected
                    : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor:
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
              <GradientPatternVisualizer
                type={pattern.type}
                interpolation={interpolation}
                stops={selectedGradientStops}
                width="100%"
                height={48}
              />
            </Paper>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};
