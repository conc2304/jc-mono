import React from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

export interface ControlColorPickerProps {
  id: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  onChange: (id: string, value: string) => void;
}

export const ControlColorPicker: React.FC<ControlColorPickerProps> = ({
  id,
  label,
  value,
  description,
  disabled = false,
  onChange,
}) => {
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchor);
  const color = value || '#ffffff';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Tooltip title={description ?? ''} placement="top-start" disableHoverListener={!description}>
        <Typography variant="caption" color="text.secondary" sx={{ userSelect: 'none' }}>
          {label}
        </Typography>
      </Tooltip>
      <IconButton
        size="small"
        disabled={disabled}
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-label={`Pick color for ${label}`}
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1,
          border: '2px solid',
          borderColor: 'divider',
          backgroundColor: color,
          '&:hover': { opacity: 0.85 },
        }}
      />
      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 1.5 }}>
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(id, e.target.value)}
            style={{ width: 140, height: 140, border: 'none', cursor: 'pointer', background: 'none' }}
            aria-label={label}
          />
        </Box>
      </Popover>
    </Box>
  );
};
