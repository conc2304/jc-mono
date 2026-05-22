import type { ControlParam, SettingsManifestEntry, ShowWhenRule } from '@jc/of-control-protocol';

// ---------------------------------------------------------------------------
// Legacy group-based helpers (kept for GlobalSettingsLauncher backward compat)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Control normalization
// ---------------------------------------------------------------------------

export type NormalizedControlKind =
  | 'slider'
  | 'toggle'
  | 'select'
  | 'number'
  | 'color'
  | 'gradient';

export function normalizeControlKind(
  raw: unknown,
  paramType: ControlParam['type']
): NormalizedControlKind {
  if (raw === 'boolean' || raw === 'toggle') return 'toggle';
  if (raw === 'slider') return 'slider';
  if (raw === 'number') return 'number';
  if (raw === 'select') return 'select';
  if (raw === 'color') return 'color';
  if (raw === 'gradient') return 'gradient';
  switch (paramType) {
    case 'bool': return 'toggle';
    case 'enum': return 'select';
    case 'color': return 'color';
    case 'gradient': return 'gradient';
    case 'int': return 'number';
    case 'float':
    default: return 'slider';
  }
}

export function precisionFromStep(step?: number): number {
  if (!step || !Number.isFinite(step)) return 2;
  const text = String(step);
  if (text.includes('e-')) return Number(text.split('e-')[1]);
  const decimals = text.includes('.') ? text.split('.')[1]?.length ?? 0 : 0;
  return Math.min(Math.max(decimals, 0), 4);
}

// ---------------------------------------------------------------------------
// UiParam — render-ready enriched parameter
// ---------------------------------------------------------------------------

/**
 * Render-ready UI param: ControlParam enriched with manifest metadata.
 * Runtime fields (value, type, min, max, step, options, modes) always come
 * from the live paramSchema entry.
 */
export interface UiParam extends ControlParam {
  path?: string;
  scope?: 'global' | 'mode';
  category: string;
  categoryLabel: string;
  categoryDescription?: string;
  categoryOrder: number;
  order: number;
  placement: 'globalDrawer' | 'modeDrawer' | 'hidden';
  layout: 'full' | 'compact';
  controlKind: NormalizedControlKind;
}

export function mergeParamWithManifest(
  param: ControlParam,
  entry: SettingsManifestEntry | undefined,
  fallbackPlacement: 'globalDrawer' | 'modeDrawer'
): UiParam {
  const category = entry?.category ?? param.group ?? 'general';
  const categoryLabel = entry?.categoryLabel ?? param.group ?? 'General';
  const categoryDescription = entry?.categoryDescription;
  const categoryOrder = entry?.categoryOrder ?? 999;
  const order = entry?.order ?? 999;
  const placement = entry?.placement ?? fallbackPlacement;
  const layout = entry?.layout ?? (param.type === 'bool' ? 'compact' : 'full');
  const controlKind = normalizeControlKind(
    entry?.control ?? param.ui?.control,
    param.type
  );

  return {
    ...param,
    // UI enrichment from manifest; live runtime fields explicitly preserved below
    description: entry?.description ?? param.description,
    advanced: entry?.advanced ?? param.advanced ?? false,
    showWhen: entry?.showWhen ?? param.showWhen,
    defaultValue: entry?.defaultValue ?? param.defaultValue,
    // Runtime fields preserved from live paramSchema (not overwritten by manifest)
    value: param.value,
    type: param.type,
    min: param.min,
    max: param.max,
    step: param.step,
    options: param.options,
    modes: param.modes,
    // Resolved UI fields
    path: entry?.id ?? entry?.path ?? param.id,
    category,
    categoryLabel,
    categoryDescription,
    categoryOrder,
    order,
    placement,
    layout,
    controlKind,
  };
}

export function buildUiParams(
  params: ControlParam[],
  manifest: SettingsManifestEntry[]
): UiParam[] {
  const byId = new Map<string, SettingsManifestEntry>();
  const byPath = new Map<string, SettingsManifestEntry>();
  for (const entry of manifest) {
    if (entry.id) byId.set(entry.id, entry);
    if (entry.path) byPath.set(entry.path, entry);
  }

  return params.map((param) => {
    const entry = byId.get(param.id) ?? byPath.get(param.id);
    const fallback: 'globalDrawer' | 'modeDrawer' = isGlobalDrawerParam(param)
      ? 'globalDrawer'
      : 'modeDrawer';
    return mergeParamWithManifest(param, entry, fallback);
  });
}

// ---------------------------------------------------------------------------
// Grouping — shared pipeline used by both SceneController and GlobalSettingsDrawer
// ---------------------------------------------------------------------------

/**
 * Render-ready category group. Both the main scene panel and the global drawer
 * consume this structure so layout and sorting logic lives exactly once.
 */
export interface RenderableGroup {
  category: string;
  categoryLabel: string;
  categoryDescription?: string;
  categoryOrder: number;
  normal: UiParam[];
  advanced: UiParam[];
}

/**
 * Groups an already-filtered UiParam[] into sorted RenderableGroups.
 * Filtering (mode, placement, readOnly) must happen before calling this.
 * showWhen is intentionally NOT evaluated here — it is evaluated at render
 * time so that conditional controls can animate in/out with CSS transitions.
 */
export function groupIntoCategories(params: UiParam[]): RenderableGroup[] {
  const map = new Map<string, RenderableGroup>();

  for (const p of params) {
    const key = p.category;
    if (!map.has(key)) {
      map.set(key, {
        category: key,
        categoryLabel: p.categoryLabel,
        categoryDescription: p.categoryDescription,
        categoryOrder: p.categoryOrder,
        normal: [],
        advanced: [],
      });
    }
    const group = map.get(key)!;
    if (p.advanced) group.advanced.push(p);
    else group.normal.push(p);
  }

  for (const group of map.values()) {
    group.normal.sort((a, b) => a.order - b.order);
    group.advanced.sort((a, b) => a.order - b.order);
  }

  return [...map.values()].sort((a, b) => a.categoryOrder - b.categoryOrder);
}

/**
 * Evaluates showWhen rules for a single param against the current value map.
 * AND semantics: all rules must match for the param to be visible.
 */
export function paramMatchesShowWhen(
  param: ControlParam,
  values: Record<string, unknown>
): boolean {
  return (param.showWhen ?? []).every((rule: ShowWhenRule) => values[rule.path] === rule.equals);
}

// ---------------------------------------------------------------------------
// Backward-compat aliases
// ---------------------------------------------------------------------------

/** @deprecated Use RenderableGroup instead */
export type CategoryGroup = RenderableGroup;

/** @deprecated Use groupIntoCategories instead */
export function groupByCategory(params: UiParam[]): Map<string, RenderableGroup> {
  const groups = groupIntoCategories(params);
  return new Map(groups.map((g) => [g.category, g]));
}

/** @deprecated Use paramMatchesShowWhen instead */
export function isVisible(
  param: UiParam,
  valuesById: Record<string, unknown>
): boolean {
  return paramMatchesShowWhen(param, valuesById);
}
