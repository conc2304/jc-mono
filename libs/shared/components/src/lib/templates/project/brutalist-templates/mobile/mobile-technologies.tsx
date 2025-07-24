import { Paper, Typography, Box, Chip, alpha, useTheme } from '@mui/material';

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
        backgroundColor: alpha(theme.palette.grey[800], 0.5),
        border: `1px solid ${theme.palette.grey[700]}`,
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
              backgroundColor: theme.palette.grey[700],
              border: `1px solid ${theme.palette.grey[600]}`,
              fontSize: '0.75rem',
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};
