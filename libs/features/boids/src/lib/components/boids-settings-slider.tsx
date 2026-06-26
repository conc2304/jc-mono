import { Box, Slider, Typography } from '@mui/material';

const controlSliderSx = {
  color: 'common.white',
  '& .MuiSlider-thumb': { width: 14, height: 14 },
  '& .MuiSlider-rail': { opacity: 0.3 },
};

export function BoidsSettingsSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <Box data-boids-control sx={{ width: '100%', minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          opacity: 0.8,
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}: {value.toFixed(step < 0.1 ? 2 : 1)}
      </Typography>
      <Slider
        data-boids-control
        size="small"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        onChange={(_, next) => onChange(next as number)}
        sx={{ ...controlSliderSx, width: '100%', boxSizing: 'border-box' }}
      />
    </Box>
  );
}
