import { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { Box } from 'lucide-react';

interface DataItemProps {
  icon?: ReactNode;
  value: string | number;
  label: string;
}
export const DataItem = ({ icon, value, label }: DataItemProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {/* <Keyboard sx={{ fontSize: 20, color: '#e91e63' }} /> */}
      {icon}
      <Box>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.primary', fontWeight: 500 }}
        >
          {/* {metrics.keystrokes.toLocaleString()} */}
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};
