import { Paper, Typography, Box, Chip, useTheme } from '@mui/material';

interface MobileTechnologiesProps {
  technologies?: string[];
}

export const MobileTechnologies: React.FC<MobileTechnologiesProps> = ({
  technologies,
}) => {
  const theme = useTheme();

  if (!technologies || technologies.length === 0) return null;

  return (
    <Paper
      sx={{
        border: `1px solid ${theme.palette.secondary.main}`,

        p: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ mb: 1.5, color: theme.palette.grey[300] }}
      >
        Technologies
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {technologies.map((tech, index) => (
          <Chip
            key={index}
            label={tech}
            size="small"
            sx={{
              backgroundColor: theme.palette.getInvertedMode('secondary'),
              color: theme.palette.getContrastText(
                theme.palette.getInvertedMode('secondary')
              ),
              border: `1px solid ${
                theme.palette.secondary[theme.palette.mode]
              }`,
              fontSize: '0.75rem',
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};
