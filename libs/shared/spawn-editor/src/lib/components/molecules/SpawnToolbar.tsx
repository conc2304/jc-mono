import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NearMeIcon from '@mui/icons-material/NearMe';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';
import type { SpawnConfig, SpawnRegion, SpawnDrawMode, SpawnSaveStatus, SpawnActivateStatus } from '../../models/types';

interface Props {
  configs: SpawnConfig[];
  activeConfigId: string | null;
  onSelectConfig: (id: string | null) => void;
  onAddConfig: () => void;
  onDeleteConfig: (id: string) => void;
  drawMode: SpawnDrawMode;
  onDrawModeChange: (mode: SpawnDrawMode) => void;
  selectedRegion: SpawnRegion | null;
  onDeleteRegion: () => void;
  onToggleRegion: () => void;
  onActivate: (id: string) => void;
  saveStatus: SpawnSaveStatus;
  activateStatus: SpawnActivateStatus;
  loading: boolean;
  /** Compact layout for xs screens */
  compact?: boolean;
}

function configLabel(cfg: SpawnConfig, index: number): string {
  return cfg.name?.trim() || `Config ${index + 1}`;
}

export const SpawnToolbar: React.FC<Props> = ({
  configs,
  activeConfigId,
  onSelectConfig,
  onAddConfig,
  onDeleteConfig,
  drawMode,
  onDrawModeChange,
  selectedRegion,
  onDeleteRegion,
  onToggleRegion,
  onActivate,
  saveStatus,
  activateStatus,
  loading,
  compact = false,
}) => {
  const activeConfig = configs.find(c => c.id === activeConfigId);
  const activeIndex = configs.findIndex(c => c.id === activeConfigId);

  const saveChip = saveStatus === 'saving'
    ? <Chip size="small" label="Saving…" sx={{ fontSize: '0.6rem' }} />
    : saveStatus === 'saved'
    ? <Chip size="small" label="Saved" color="success" sx={{ fontSize: '0.6rem' }} />
    : saveStatus === 'error'
    ? <Chip size="small" label="Save failed" color="error" sx={{ fontSize: '0.6rem' }} />
    : null;

  const activateLabel = activateStatus === 'activating' ? 'Activating…'
    : activateStatus === 'done' ? 'Active!'
    : 'Activate';

  const activateColor = activateStatus === 'done' ? 'success' : activateStatus === 'error' ? 'error' : 'primary';

  if (compact) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Config row */}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          <Select
            size="small"
            value={activeConfigId ?? ''}
            onChange={e => onSelectConfig(e.target.value || null)}
            displayEmpty
            disabled={loading || configs.length === 0}
            sx={{ minWidth: 110, fontSize: '0.75rem', height: 32 }}
          >
            {configs.length === 0 && (
              <MenuItem value="" disabled>No configs</MenuItem>
            )}
            {configs.map((cfg, i) => (
              <MenuItem key={cfg.id} value={cfg.id} sx={{ fontSize: '0.8rem' }}>
                {configLabel(cfg, i)}
              </MenuItem>
            ))}
          </Select>

          <Tooltip title="Add config">
            <IconButton size="small" onClick={onAddConfig}><AddIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete config">
            <span>
              <IconButton size="small" disabled={!activeConfig} onClick={() => activeConfigId && onDeleteConfig(activeConfigId)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {saveChip}

          <Box sx={{ flex: 1 }} />

          <Button
            size="small"
            variant="contained"
            color={activateColor as 'primary' | 'success' | 'error'}
            startIcon={<PlayArrowIcon />}
            disabled={!activeConfig || activateStatus === 'activating'}
            onClick={() => activeConfigId && onActivate(activeConfigId)}
            sx={{ flexShrink: 0, fontSize: '0.7rem', height: 32 }}
          >
            {activateLabel}
          </Button>
        </Stack>

        {/* Tool row */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title="Select / Move (V)">
            <IconButton
              size="small"
              color={drawMode === 'select' ? 'primary' : 'default'}
              onClick={() => onDrawModeChange('select')}
            >
              <NearMeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Draw region (D)">
            <IconButton
              size="small"
              color={drawMode === 'draw' ? 'warning' : 'default'}
              onClick={() => onDrawModeChange('draw')}
              disabled={!activeConfig}
            >
              <RectangleOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {selectedRegion && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
              <Tooltip title={selectedRegion.enabled ? 'Disable region' : 'Enable region'}>
                <IconButton size="small" onClick={onToggleRegion}>
                  {selectedRegion.enabled ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete region">
                <IconButton size="small" color="error" onClick={onDeleteRegion}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          {drawMode === 'draw' && (
            <Typography variant="caption" color="warning.main" sx={{ ml: 1, fontSize: '0.65rem' }}>
              Drag to draw • Esc to cancel
            </Typography>
          )}
        </Stack>
      </Box>
    );
  }

  // Full toolbar (sm+)
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
        {/* Config selector */}
        <Select
          size="small"
          value={activeConfigId ?? ''}
          onChange={e => onSelectConfig(e.target.value || null)}
          displayEmpty
          disabled={loading || configs.length === 0}
          sx={{ minWidth: 130, fontSize: '0.8rem' }}
        >
          {configs.length === 0 && (
            <MenuItem value="" disabled>No configs yet</MenuItem>
          )}
          {configs.map((cfg, i) => (
            <MenuItem key={cfg.id} value={cfg.id}>{configLabel(cfg, i)}</MenuItem>
          ))}
        </Select>

        <Tooltip title="Add config">
          <IconButton size="small" onClick={onAddConfig}><AddIcon /></IconButton>
        </Tooltip>
        <Tooltip title="Delete config">
          <span>
            <IconButton
              size="small"
              disabled={!activeConfig}
              onClick={() => activeConfigId && onDeleteConfig(activeConfigId)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>

        {activeIndex >= 0 && (
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
            ({activeConfig?.regions.length ?? 0} region{activeConfig?.regions.length !== 1 ? 's' : ''})
          </Typography>
        )}

        {saveChip}

        <Divider orientation="vertical" flexItem />

        {/* Tool mode */}
        <Tooltip title="Select / Move (V)">
          <IconButton
            size="small"
            color={drawMode === 'select' ? 'primary' : 'default'}
            onClick={() => onDrawModeChange('select')}
            sx={{ border: drawMode === 'select' ? '1px solid' : '1px solid transparent' }}
          >
            <NearMeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Draw region (D)">
          <span>
            <IconButton
              size="small"
              color={drawMode === 'draw' ? 'warning' : 'default'}
              onClick={() => onDrawModeChange('draw')}
              disabled={!activeConfig}
              sx={{ border: drawMode === 'draw' ? '1px solid' : '1px solid transparent' }}
            >
              <RectangleOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        {drawMode === 'draw' && (
          <Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
            Click &amp; drag to draw a region — Esc to cancel
          </Typography>
        )}

        {/* Region actions (visible when a region is selected) */}
        {selectedRegion && (
          <>
            <Divider orientation="vertical" flexItem />
            <Tooltip title={selectedRegion.enabled ? 'Disable region' : 'Enable region'}>
              <IconButton size="small" onClick={onToggleRegion}>
                {selectedRegion.enabled ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete selected region">
              <IconButton size="small" color="error" onClick={onDeleteRegion}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Box sx={{ flex: 1 }} />

        {/* Activate */}
        <Button
          size="small"
          variant="contained"
          color={activateColor as 'primary' | 'success' | 'error'}
          startIcon={<PlayArrowIcon />}
          disabled={!activeConfig || activateStatus === 'activating'}
          onClick={() => activeConfigId && onActivate(activeConfigId)}
          sx={{ flexShrink: 0 }}
        >
          {activateLabel}
        </Button>
      </Stack>
    </Box>
  );
};
