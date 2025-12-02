import { Box, Typography } from '@mui/material';

export const TestComponent = () => {
  return (
    <Box
      sx={{
        m: 2,
        backgroundColor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.text.primary}`,
        p: 2,
      }}
    >
      <Typography color="textPrimary">Test</Typography>
      <Typography color="textSecondary">Test</Typography>
    </Box>
  );
};
