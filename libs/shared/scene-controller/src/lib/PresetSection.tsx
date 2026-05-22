import React, { useMemo, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { PresetSummary } from '@jc/of-control-protocol';
import { usePresets } from '@jc/of-control-client';

type BrowseMode = 'current' | 'all';

interface PresetSectionProps {
  activeMode: string | null;
}

export const PresetSection: React.FC<PresetSectionProps> = ({ activeMode }) => {
  const [expanded, setExpanded] = useState(true);
  const [browseMode, setBrowseMode] = useState<BrowseMode>('current');

  const {
    presets,
    currentPreset,
    optimisticMode,
    presetLoadingId,
    presetError,
    loadPreset,
    getPresets,
    clearPresetError,
  } = usePresets();

  // The mode we filter/display against — optimistic until canonical catches up
  const visibleMode = optimisticMode ?? activeMode;

  const handleSelect = async (preset: PresetSummary) => {
    const isCrossMode = preset.mode && preset.mode !== activeMode;
    await loadPreset(preset.id, { switchMode: isCrossMode ? true : undefined });
    setExpanded(false);
  };

  // Current-mode view: matching mode + global (no mode)
  const currentModePresets = useMemo(
    () => presets.filter((p) => !p.mode || p.mode === '' || p.mode === visibleMode),
    [presets, visibleMode]
  );

  // All-modes view: grouped by mode, globals last
  const modeGroups = useMemo(() => {
    const groups = new Map<string, PresetSummary[]>();
    for (const p of presets) {
      const key = p.mode && p.mode !== '' ? p.mode : '__global__';
      const arr = groups.get(key) ?? [];
      arr.push(p);
      groups.set(key, arr);
    }
    // Bubble current (or optimistic) mode to top
    const entries = [...groups.entries()];
    entries.sort(([a], [b]) => {
      if (a === visibleMode) return -1;
      if (b === visibleMode) return 1;
      if (a === '__global__') return 1;
      if (b === '__global__') return -1;
      return a.localeCompare(b);
    });
    return entries;
  }, [presets, visibleMode]);

  if (presets.length === 0) return null;

  const showToggle = browseMode === 'all' || presets.some((p) => p.mode && p.mode !== visibleMode);

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, e) => setExpanded(e)}
      disableGutters
      elevation={0}
      sx={{
        '&:before': { display: 'none' },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        '&.Mui-expanded': { mb: 1 },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ minHeight: 44, '& .MuiAccordionSummary-content': { my: 0.5, alignItems: 'center' } }}
      >
        <Typography variant="overline" sx={{ lineHeight: 1.5, letterSpacing: 1, flexGrow: 1 }}>
          Presets
        </Typography>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); getPresets(); }}
          sx={{ mr: 0.5, color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}
          aria-label="Refresh presets"
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0, pb: 1.5, px: 1 }}>
        {presetError && (
          <Alert severity="error" onClose={clearPresetError} sx={{ mb: 1, fontSize: '0.75rem' }}>
            {presetError}
          </Alert>
        )}

        {/* Browse toggle — only render when other-mode presets exist */}
        {showToggle && (
          <Box sx={{ mb: 1 }}>
            <ToggleButtonGroup
              value={browseMode}
              exclusive
              onChange={(_, v) => { if (v) setBrowseMode(v); }}
              size="small"
              fullWidth
            >
              <ToggleButton value="current" sx={{ fontSize: '0.7rem', textTransform: 'none', py: 0.5 }}>
                Current Mode
              </ToggleButton>
              <ToggleButton value="all" sx={{ fontSize: '0.7rem', textTransform: 'none', py: 0.5 }}>
                All Modes
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {browseMode === 'current' ? (
          <CurrentModeList
            presets={currentModePresets}
            currentPreset={currentPreset}
            presetLoadingId={presetLoadingId}
            activeMode={activeMode}
            visibleMode={visibleMode}
            onSelect={handleSelect}
          />
        ) : (
          <AllModesView
            groups={modeGroups}
            currentPreset={currentPreset}
            presetLoadingId={presetLoadingId}
            activeMode={activeMode}
            visibleMode={visibleMode}
            onSelect={handleSelect}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

// ─── Current-mode list ────────────────────────────────────────────────────────

interface CurrentModeListProps {
  presets: PresetSummary[];
  currentPreset: string | null;
  presetLoadingId: string | undefined;
  activeMode: string | null;
  visibleMode: string | null;
  onSelect: (preset: PresetSummary) => void;
}

const CurrentModeList: React.FC<CurrentModeListProps> = ({
  presets,
  currentPreset,
  presetLoadingId,
  activeMode,
  visibleMode,
  onSelect,
}) => {
  if (presets.length === 0) {
    return (
      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', px: 0.5, py: 1 }}>
        No presets for {visibleMode ?? 'this mode'} yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {presets.map((p) => (
        <PresetRow
          key={p.id}
          preset={p}
          isActive={p.id === currentPreset}
          isLoading={p.id === presetLoadingId}
          isCrossMode={false}
          showModeChip={false}
          activeMode={activeMode}
          onSelect={() => onSelect(p)}
        />
      ))}
    </Box>
  );
};

// ─── All-modes grouped view ───────────────────────────────────────────────────

interface AllModesViewProps {
  groups: [string, PresetSummary[]][];
  currentPreset: string | null;
  presetLoadingId: string | undefined;
  activeMode: string | null;
  visibleMode: string | null;
  onSelect: (preset: PresetSummary) => void;
}

const AllModesView: React.FC<AllModesViewProps> = ({
  groups,
  currentPreset,
  presetLoadingId,
  activeMode,
  visibleMode,
  onSelect,
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    {groups.map(([modeKey, modePresets]) => {
      const label = modeKey === '__global__' ? 'Global' : capitalize(modeKey);
      const isCurrent = modeKey === visibleMode || modeKey === activeMode;

      return (
        <Box key={modeKey}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              fontSize: '0.6rem',
              letterSpacing: 1,
              color: isCurrent ? 'primary.main' : 'text.disabled',
              mb: 0.5,
              px: 0.5,
            }}
          >
            {label}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {modePresets.map((p) => {
              const cross = !!p.mode && p.mode !== activeMode;
              return (
                <PresetRow
                  key={p.id}
                  preset={p}
                  isActive={p.id === currentPreset}
                  isLoading={p.id === presetLoadingId}
                  isCrossMode={cross}
                  showModeChip={false}
                  activeMode={activeMode}
                  onSelect={() => onSelect(p)}
                />
              );
            })}
          </Box>
        </Box>
      );
    })}
  </Box>
);

// ─── Preset row ───────────────────────────────────────────────────────────────

interface PresetRowProps {
  preset: PresetSummary;
  isActive: boolean;
  isLoading: boolean;
  isCrossMode: boolean;
  showModeChip: boolean;
  activeMode: string | null;
  onSelect: () => void;
}

const PresetRow: React.FC<PresetRowProps> = ({
  preset,
  isActive,
  isLoading,
  isCrossMode,
  showModeChip,
  onSelect,
}) => (
  <Box
    component="button"
    onClick={isLoading ? undefined : onSelect}
    disabled={isLoading}
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      width: '100%',
      minHeight: 44,
      px: 1.5,
      py: 1,
      border: '1px solid',
      borderColor: isActive ? 'primary.main' : 'transparent',
      borderRadius: 1,
      backgroundColor: isActive ? 'action.selected' : 'transparent',
      cursor: isLoading ? 'default' : 'pointer',
      textAlign: 'left',
      transition: 'background-color 150ms, border-color 150ms',
      '&:hover:not(:disabled)': {
        backgroundColor: isActive ? 'action.selected' : 'action.hover',
      },
      '&:disabled': { opacity: 0.6 },
    }}
  >
    {/* Active / loading indicator column */}
    <Box
      sx={{
        width: 20,
        height: 20,
        mt: 0.25,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoading ? (
        <CircularProgress size={14} thickness={5} />
      ) : isActive ? (
        <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />
      ) : null}
    </Box>

    {/* Content */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Label row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: isActive ? 600 : 400,
            lineHeight: 1.4,
            color: isActive ? 'primary.main' : 'text.primary',
          }}
        >
          {preset.label}
        </Typography>

        {isLoading && isCrossMode && preset.mode && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Switching to {capitalize(preset.mode)}…
          </Typography>
        )}

        {preset.piSafe && (
          <Chip
            label="Pi Safe"
            size="small"
            sx={{
              height: 16,
              fontSize: '0.6rem',
              letterSpacing: 0.5,
              backgroundColor: 'success.dark',
              color: 'success.contrastText',
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        )}

        {showModeChip && preset.mode && (
          <Chip
            label={capitalize(preset.mode)}
            size="small"
            variant="outlined"
            sx={{
              height: 16,
              fontSize: '0.6rem',
              '& .MuiChip-label': { px: 0.75 },
              borderColor: 'divider',
              color: 'text.disabled',
            }}
          />
        )}
      </Box>

      {/* Description */}
      {preset.description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            mt: 0.25,
          }}
        >
          {preset.description}
        </Typography>
      )}

      {/* Tags */}
      {preset.tags && preset.tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
          {preset.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                height: 16,
                fontSize: '0.6rem',
                '& .MuiChip-label': { px: 0.75 },
                borderColor: 'divider',
                color: 'text.disabled',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  </Box>
);

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
