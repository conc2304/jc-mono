import React, { useState, useCallback, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import GridOnIcon from '@mui/icons-material/GridOn';
import type {
  ProjectionCorners,
  ProjectionCornersWire,
  ProjectionState,
} from '@jc/of-control-protocol';
import {
  defaultCorners,
  nudgeCorner,
  type CornerKey,
} from '@jc/projection-warp';
import { useOFClient, useOFStore } from '@jc/of-control-client';
import { ProjectionCanvas } from './ProjectionCanvas';

const CORNER_LABELS: Record<CornerKey, string> = {
  0: 'TL',
  1: 'TR',
  2: 'BR',
  3: 'BL',
};

const PANEL_SX = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  p: 1,
} as const;

interface Props {
  projection?: ProjectionState;
}

export const ProjectionMappingController: React.FC<Props> = ({
  projection,
}) => {
  const { client } = useOFClient();
  const store = useOFStore();
  const maskVersion = store.maskVersion;
  const gridSize = store.projection?.gridSize ?? 50;
  const [corners, setCorners] = useState<ProjectionCorners>(
    projection?.corners ?? defaultCorners()
  );
  const [selectedCornerIndex, setSelectedCornerIndex] =
    useState<CornerKey | null>(0);
  const [nudgeAmount, setNudgeAmount] = useState(0.005);
  const [testGrid, setTestGrid] = useState(false);
  const [dirty, setDirty] = useState(false);
  const savedCornersRef = useRef<ProjectionCorners>(
    projection?.corners ?? defaultCorners()
  );
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    client.send({ type: 'setProjectionCalibration', enabled: true });
    return () => {
      client.send({ type: 'setProjectionCalibration', enabled: false });
    };
  }, [client]);

  const toWire = (c: ProjectionCorners): ProjectionCornersWire => ({
    topLeft: c[0],
    topRight: c[1],
    bottomRight: c[2],
    bottomLeft: c[3],
  });

  const sendCorners = useCallback(
    (c: ProjectionCorners) => {
      if (throttleRef.current) clearTimeout(throttleRef.current);
      throttleRef.current = setTimeout(() => {
        client.send({ type: 'setProjectionCorners', corners: toWire(c) });
      }, 40);
    },
    [client]
  );

  const handleMove = useCallback(
    (_corner: CornerKey, updated: ProjectionCorners) => {
      setCorners(updated);
      setDirty(true);
      sendCorners(updated);
    },
    [sendCorners]
  );

  const handleNudge = (dx: number, dy: number) => {
    if (selectedCornerIndex === null) return;
    const updated = nudgeCorner(
      corners,
      selectedCornerIndex,
      dx * nudgeAmount,
      dy * nudgeAmount
    );
    setCorners(updated);
    setDirty(true);
    sendCorners(updated);
  };

  const handleSave = () => {
    savedCornersRef.current = corners;
    client.send({ type: 'saveProjection' });
    setDirty(false);
  };

  const handleReset = () => {
    const reset = defaultCorners();
    setCorners(reset);
    setDirty(true);
    client.send({ type: 'resetProjection' });
  };

  const handleRevert = () => {
    setCorners(savedCornersRef.current);
    setDirty(false);
    client.send({
      type: 'setProjectionCorners',
      corners: toWire(savedCornersRef.current),
    });
  };

  const selectedCoords = selectedCornerIndex !== null ? corners[selectedCornerIndex] : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>

      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ flexShrink: 0 }}>
        <Typography variant="overline" sx={{ letterSpacing: 1 }}>
          Projection Mapping
        </Typography>
        {dirty && (
          <Chip label="Unsaved" size="small" color="warning" variant="outlined" />
        )}
      </Stack>

      {/* Canvas — fills remaining height, canvas is centered at natural size */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...PANEL_SX,
        }}
      >
        <ProjectionCanvas
          corners={corners}
          selectedCorner={selectedCornerIndex}
          testGrid={testGrid}
          gridSize={gridSize}
          maskVersion={maskVersion}
          onSelectCorner={setSelectedCornerIndex}
          onMoveCorner={handleMove}
        />
      </Box>

      {/* Controls row: D-pad panel | Nudge+Grid panel */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 1,
          flexShrink: 0,
        }}
      >
        {/* Left panel: compact D-pad + corner selector + coordinates */}
        <Box sx={{ ...PANEL_SX, display: 'flex', gap: 1.5, alignItems: 'center' }}>

          {/* Compact D-pad — 3×3 grid of 28px cells */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 28px)',
              gridTemplateRows: 'repeat(3, 28px)',
              gap: '2px',
              flexShrink: 0,
            }}
          >
            <Box />
            <IconButton size="small" sx={{ p: 0 }} onClick={() => handleNudge(0, -1)} disabled={selectedCornerIndex === null}>
              <ArrowUpwardIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Box />
            <IconButton size="small" sx={{ p: 0 }} onClick={() => handleNudge(-1, 0)} disabled={selectedCornerIndex === null}>
              <ArrowBackIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ fontSize: '0.5rem', color: 'text.disabled', lineHeight: 1 }}>
                D
              </Typography>
            </Box>
            <IconButton size="small" sx={{ p: 0 }} onClick={() => handleNudge(1, 0)} disabled={selectedCornerIndex === null}>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Box />
            <IconButton size="small" sx={{ p: 0 }} onClick={() => handleNudge(0, 1)} disabled={selectedCornerIndex === null}>
              <ArrowDownwardIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Box />
          </Box>

          {/* Corner selector + coordinate readout */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
              {([0, 1, 2, 3] as CornerKey[]).map((k) => (
                <Chip
                  key={k}
                  label={CORNER_LABELS[k]}
                  size="small"
                  onClick={() => setSelectedCornerIndex(k)}
                  color={selectedCornerIndex === k ? 'primary' : 'default'}
                  variant={selectedCornerIndex === k ? 'filled' : 'outlined'}
                  sx={{ fontSize: '0.65rem', height: 20 }}
                />
              ))}
            </Stack>
            {selectedCoords ? (
              <Typography
                variant="caption"
                sx={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'text.secondary' }}
              >
                x {selectedCoords.x.toFixed(4)} &nbsp; y {selectedCoords.y.toFixed(4)}
              </Typography>
            ) : (
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>
                — select corner —
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right panel: Nudge slider + Test Grid toggle — max 200px */}
        <Box
          sx={{
            ...PANEL_SX,
            width: 180,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 0.75,
          }}
        >
          {/* Header row: nudge value + grid toggle */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.65rem' }}>
              NUDGE &nbsp;{nudgeAmount.toFixed(4)}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.25}>
              <GridOnIcon sx={{ fontSize: 13, color: 'action.active' }} />
              <Switch
                size="small"
                checked={testGrid}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  setTestGrid(enabled);
                  client.send({ type: 'setProjectionGrid', enabled });
                }}
                sx={{ ml: 0.25 }}
              />
            </Stack>
          </Stack>

          <Slider
            size="small"
            min={0.001}
            max={0.05}
            step={0.001}
            value={nudgeAmount}
            onChange={(_, v) => setNudgeAmount(v as number)}
          />
        </Box>
      </Box>

      <Divider sx={{ flexShrink: 0 }} />

      {/* Action buttons */}
      <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        <Tooltip title="Save calibration to OF app">
          <Button
            size="small"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!dirty}
            fullWidth
          >
            Save
          </Button>
        </Tooltip>
        <Tooltip title="Revert to last saved">
          <Button
            size="small"
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={handleRevert}
            fullWidth
          >
            Revert
          </Button>
        </Tooltip>
        <Tooltip title="Reset to default corners">
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleReset}
            fullWidth
          >
            Reset
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
};
