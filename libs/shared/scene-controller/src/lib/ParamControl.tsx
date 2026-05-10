import React from 'react';
import type { ControlParam } from '@jc/of-control-protocol';
import {
  ControlSlider,
  ControlToggle,
  ControlSelect,
  ControlNumberInput,
  ControlColorPicker,
} from '@jc/fireplace-control-shared-ui';

interface Props {
  param: ControlParam;
  value: unknown;
  onCommit: (id: string, value: unknown, immediate?: boolean) => void;
}

export const ParamControl: React.FC<Props> = ({ param, value, onCommit }) => {
  const { id, label, type, min, max, step, options, description, ui } = param;

  const controlHint = ui?.control ?? inferControl(type);

  switch (controlHint) {
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
          description={description}
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
          description={description}
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
          description={description}
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
          step={step}
          unit={ui?.unit}
          description={description}
          onChange={(id, v) => onCommit(id, v, true)}
        />
      );

    case 'color':
      return (
        <ControlColorPicker
          id={id}
          label={label}
          value={typeof value === 'string' ? value : '#ffffff'}
          description={description}
          onChange={(id, v) => onCommit(id, v, true)}
        />
      );

    default:
      return null;
  }
};

function inferControl(type: ControlParam['type']): string {
  switch (type) {
    case 'float': return 'slider';
    case 'int':   return 'number';
    case 'bool':  return 'toggle';
    case 'enum':  return 'select';
    case 'color': return 'color';
    default:      return 'slider';
  }
}
