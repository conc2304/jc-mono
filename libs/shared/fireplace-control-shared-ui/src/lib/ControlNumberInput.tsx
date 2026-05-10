import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export interface ControlNumberInputProps {
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
}

export const ControlNumberInput: React.FC<ControlNumberInputProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  description,
  disabled = false,
  onChange,
}) => {
  const [draft, setDraft] = React.useState<string>(String(value));

  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const parsed = parseFloat(draft);
    if (!isNaN(parsed)) {
      const clamped = min !== undefined && parsed < min ? min : max !== undefined && parsed > max ? max : parsed;
      onChange(id, clamped);
      setDraft(String(clamped));
    } else {
      setDraft(String(value));
    }
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
      <TextField
        fullWidth
        size="small"
        type="number"
        label={!description ? label : undefined}
        value={draft}
        disabled={disabled}
        inputProps={{ min, max, step, 'aria-label': label }}
        InputProps={{ endAdornment: unit ? <Typography variant="caption" color="text.secondary">{unit}</Typography> : undefined }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
      />
    </Box>
  );
};
