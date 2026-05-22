import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { ControlParam, GradientStop } from '@jc/shared/of-control-protocol';
import {
  ControlSlider,
  ControlToggle,
  ControlSelect,
  ControlNumberInput,
  ControlColorPicker,
  ControlGradientEditor,
} from '@jc/shared/fireplace-control-shared-ui';
import { normalizeControlKind, precisionFromStep } from './globalSettingsManifest';

interface Props {
  param: ControlParam;
  value: unknown;
  onCommit: (id: string, value: unknown, immediate?: boolean) => void;
}

export const ParamControl: React.FC<Props> = ({ param, value, onCommit }) => {
  const { id, label, type, min, max, step, options, description, ui } = param;
  const [descOpen, setDescOpen] = useState(false);

  const controlKind = normalizeControlKind(ui?.control, type);
  const precision = ui?.precision ?? precisionFromStep(step);

  const control = renderControl({ id, label, type, min, max, step, options, ui, controlKind, precision, value, onCommit });

  if (!description) return control;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>{control}</Box>
        <IconButton
          size="small"
          aria-label={`About ${label}`}
          aria-expanded={descOpen}
          onClick={() => setDescOpen((v) => !v)}
          sx={{
            flexShrink: 0,
            mt: 0.25,
            color: descOpen ? 'text.secondary' : 'text.disabled',
            '&:hover': { color: 'text.secondary' },
            width: 28,
            height: 28,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: '0.95rem' }} />
        </IconButton>
      </Box>
      <Collapse in={descOpen}>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: 'block', mt: 0.5, lineHeight: 1.4, pl: 0.5 }}
        >
          {description}
        </Typography>
      </Collapse>
    </Box>
  );
};

interface RenderControlArgs {
  id: string;
  label: string;
  type: ControlParam['type'];
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string | number | boolean }>;
  ui?: ControlParam['ui'];
  controlKind: ReturnType<typeof normalizeControlKind>;
  precision: number;
  value: unknown;
  onCommit: (id: string, value: unknown, immediate?: boolean) => void;
}

function renderControl({
  id, label, type, min, max, step, options, ui, controlKind, precision, value, onCommit,
}: RenderControlArgs): React.ReactElement | null {
  switch (controlKind) {
    case 'slider':
      return (
        <ControlSlider
          id={id}
          label={label}
          value={typeof value === 'number' ? value : (min ?? 0)}
          min={min}
          max={max}
          step={step}
          unit={ui?.unit}
          precision={precision}
          onChange={(id, v) => onCommit(id, v, false)}
          onChangeCommitted={(id, v) => onCommit(id, v, true)}
        />
      );

    case 'toggle':
      return (
        <ControlToggle
          id={id}
          label={label}
          value={!!value}
          onChange={(id, v) => onCommit(id, v, true)}
        />
      );

    case 'select':
      return (
        <ControlSelect
          id={id}
          label={label}
          value={value as string | number | boolean}
          options={options ?? []}
          onChange={(id, v) => onCommit(id, v, true)}
        />
      );

    case 'number':
      return (
        <ControlNumberInput
          id={id}
          label={label}
          value={typeof value === 'number' ? value : (min ?? 0)}
          min={min}
          max={max}
          step={step ?? (type === 'int' ? 1 : undefined)}
          unit={ui?.unit}
          onChange={(id, v) => onCommit(id, v, true)}
        />
      );

    case 'color':
      return (
        <ControlColorPicker
          id={id}
          label={label}
          value={typeof value === 'string' ? value : '#ffffff'}
          onChange={(id, v) => onCommit(id, v, true)}
        />
      );

    case 'gradient':
      return (
        <ControlGradientEditor
          id={id}
          label={label}
          value={Array.isArray(value) ? (value as GradientStop[]) : []}
          onChange={(id, v) => onCommit(id, v, false)}
        />
      );

    default:
      return null;
  }
}

// Re-export for use in other components that need precision formatting
export { precisionFromStep };
