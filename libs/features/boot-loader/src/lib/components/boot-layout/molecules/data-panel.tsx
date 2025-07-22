import { Paper, PaperProps, styled, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

const DataPanelStyled = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  height: 128,
  borderRadius: 0,

  '&[data-augmented-ui]': {
    '--aug-bl': '0.5rem',
    '--aug-br': '0.5rem',
    '--aug-tl': '0.5rem',
    '--aug-tr': '0.5rem',
    '--aug-border-all': '1px',
    '--aug-border-bg': theme.palette.primary.main,
  },
}));

const DataPanelAugmented = (props: PaperProps) => (
  <DataPanelStyled
    data-augmented-ui="border bl-clip br-clip tl-2-clip-y tr-clip "
    {...props}
  />
);

export const DataPanel = () => {
  const [dataValues, setDataValues] = useState({
    temp: 23.7,
    pressure: 101.3,
    oxygen: 98.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDataValues((prev) => ({
        temp: 23.7 + Math.sin(Date.now() / 1000) * 0.5,
        pressure: 101.3 + Math.cos(Date.now() / 1500) * 0.2,
        oxygen: 98.2 + Math.sin(Date.now() / 2000) * 0.3,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <DataPanelAugmented elevation={0}>
      <Typography
        variant="caption"
        sx={{
          color: 'primary.main',
          mb: 1,
          display: 'block',
          textAlign: 'right',
        }}
      >
        SYS STATUS
      </Typography>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            TEMP:
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            {dataValues.temp.toFixed(1)}°
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            PRES:
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            {dataValues.pressure.toFixed(1)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            O2:
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            {dataValues.oxygen.toFixed(1)}%
          </Typography>
        </Box>
      </Box>
    </DataPanelAugmented>
  );
};
