import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export interface ControlSliderProps {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description?: string;
  disabled?: boolean;
  onChange: (id: string, value: number) => void;
  onChangeCommitted?: (id: string, value: number) => void;
}

export const ControlSlider: React.FC<ControlSliderProps> = ({
  id,
  label,
  value,
  min = 0,
  max = 1,
  step,
  unit,
  description,
  disabled = false,
  onChange,
  onChangeCommitted,
}) => {
  const displayValue = typeof value === 'number' ? value : 0;
  const computedStep = step ?? (max - min) / 100;

  const handleChange = (_: Event, newValue: number | number[]) => {
    onChange(id, newValue as number);
  };

  const handleCommitted = (
    _: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    onChangeCommitted?.(id, newValue as number);
  };

  const formatted =
    Number.isInteger(computedStep)
      ? displayValue.toFixed(0)
      : displayValue.toFixed(2);

  return (
    <Box sx={{ width: '100%', px: 0.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
        <Tooltip title={description ?? ''} placement="top-start" disableHoverListener={!description}>
          <Typography variant="caption" color="text.secondary" sx={{ userSelect: 'none' }}>
            {label}
          </Typography>
        </Tooltip>
        <Typography variant="caption" color="text.primary" sx={{ fontVariantNumeric: 'tabular-nums', ml: 1 }}>
          {formatted}{unit ? ` ${unit}` : ''}
        </Typography>
      </Box>
      <Slider
        size="small"
        value={displayValue}
        min={min}
        max={max}
        step={computedStep}
        disabled={disabled}
        onChange={handleChange}
        onChangeCommitted={handleCommitted}
        aria-label={label}
        sx={{ py: 0.5 }}
      />
    </Box>
  );
};
