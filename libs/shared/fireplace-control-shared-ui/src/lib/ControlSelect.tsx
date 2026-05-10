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
  value?: string | number | boolean;
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
  // Resolve each option's effective value: use opt.value if present, else fall back to opt.label.
  // This handles OF sending options as [{label: "water"}, ...] with no value field.
  const optionValue = (opt: SelectOption) =>
    opt.value != null ? String(opt.value) : opt.label;

  const handleChange = (e: SelectChangeEvent<string>) => {
    const raw = e.target.value;
    const matched = options.find((o) => optionValue(o) === raw);
    onChange(id, matched ? (matched.value ?? matched.label) : raw);
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
          value={value != null ? String(value) : ''}
          label={!description ? label : undefined}
          onChange={handleChange}
          displayEmpty
          renderValue={(v) => {
            const matched = options.find((o) => optionValue(o) === v);
            return matched ? matched.label : String(v);
          }}
        >
          {options.map((opt, i) => {
            const v = optionValue(opt);
            return (
              <MenuItem key={`${v}-${i}`} value={v}>
                {opt.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
