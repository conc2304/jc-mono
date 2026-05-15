import type { ControlParam } from '@jc/of-control-protocol';

export interface GlobalGroupMeta {
  category: string;
  placement: 'globalDrawer' | 'mainPanel';
  order: number;
}

export const GLOBAL_SETTINGS_GROUP_MAP: Record<string, GlobalGroupMeta> = {
  Global: { category: 'Appearance', placement: 'globalDrawer', order: 10 },
  Layers: { category: 'View Overlays', placement: 'globalDrawer', order: 20 },
  Render: { category: 'Rendering', placement: 'globalDrawer', order: 30 },
  Interface: { category: 'Advanced', placement: 'globalDrawer', order: 40 },
} as const;

export const GLOBAL_DRAWER_GROUPS = new Set(Object.keys(GLOBAL_SETTINGS_GROUP_MAP));

export function isGlobalDrawerParam(param: ControlParam): boolean {
  return GLOBAL_DRAWER_GROUPS.has(param.group);
}

export function getGroupMeta(group: string): GlobalGroupMeta {
  return (
    GLOBAL_SETTINGS_GROUP_MAP[group] ?? {
      category: group,
      placement: 'globalDrawer',
      order: 99,
    }
  );
}

export interface SummaryField {
  id: string;
  label: string;
  formattedValue: string;
}

export function formatSummaryValue(param: ControlParam, value: unknown): string {
  if (param.type === 'bool') return value ? 'On' : 'Off';
  if (param.type === 'float' || param.type === 'int') {
    return typeof value === 'number' ? value.toFixed(2).replace(/\.?0+$/, '') : '—';
  }
  if (param.type === 'enum') {
    const match = param.options?.find((o) => o.value === value);
    return match ? match.label : String(value ?? '—');
  }
  return String(value ?? '—');
}

const SUMMARY_PARAM_IDS = new Set([
  'experienceMode',
  'brightness',
  'showMask',
  'glowEnabled',
  'glowIntensity',
]);

export function getSummaryFields(
  params: ControlParam[],
  values: Record<string, unknown>
): SummaryField[] {
  return params
    .filter((p) => SUMMARY_PARAM_IDS.has(p.id))
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      label: p.label,
      formattedValue: formatSummaryValue(p, values[p.id]),
    }));
}
