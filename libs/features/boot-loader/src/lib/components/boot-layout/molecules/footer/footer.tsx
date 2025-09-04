import { DiagonalLines } from '@jc/ui-components';
import { useTheme, Box, alpha } from '@mui/material';

export const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      sx={(theme) => ({
        borderTop: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
      })}
    >
      <DiagonalLines
        direction="diagonal-alt"
        height="40px"
        width="100%"
        spacing={20}
        lineThickness={2}
        color={alpha(theme.palette.primary.main, 0.5)}
        style={{ borderBottom: `1px solid ${theme.palette.primary.main}` }}
      />
    </Box>
  );
};
