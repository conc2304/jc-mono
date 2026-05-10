import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface ControlSelectProps {
  id: string;
  label: string;
  value: string | number | boolean;
  options: SelectOption[];
  description?: string;
  disabled?: boolean;
  onChange: (id: string, value: string | number | boolean) => void;
}

export const ControlSelect: React.FC<ControlSelectProps> = ({
  id,
  label,
  value,
  options,
  description,
  disabled = false,
  onChange,
}) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    const raw = e.target.value;
    const matched = options.find((o) => String(o.value) === raw);
    onChange(id, matched ? matched.value : raw);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {description && (
        <Tooltip title={description} placement="top-start">
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, userSelect: 'none' }}>
            {label}
          </Typography>
        </Tooltip>
      )}
      <FormControl fullWidth size="small" disabled={disabled}>
        {!description && <InputLabel id={`${id}-label`}>{label}</InputLabel>}
        <Select
          labelId={`${id}-label`}
          id={id}
          value={String(value)}
          label={!description ? label : undefined}
          onChange={handleChange}
        >
          {options.map((opt) => (
            <MenuItem key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
