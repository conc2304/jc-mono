import React, { useState, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
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
import type { ProjectionCorners, ProjectionState } from '@jc/of-control-protocol';
import { defaultCorners, nudgeCorner, type CornerKey } from '@jc/shared/projection-warp';
import { useOFClient } from '@jc/shared/of-control-client';
import { ProjectionCanvas } from './ProjectionCanvas';

const CORNER_LABELS: Record<CornerKey, string> = {
  topLeft: 'TL',
  topRight: 'TR',
  bottomRight: 'BR',
  bottomLeft: 'BL',
};

interface Props {
  projection?: ProjectionState;
}

export const ProjectionMappingController: React.FC<Props> = ({ projection }) => {
  const { client } = useOFClient();
  const [corners, setCorners] = useState<ProjectionCorners>(projection?.corners ?? defaultCorners());
  const [selectedCorner, setSelectedCorner] = useState<CornerKey | null>('topLeft');
  const [nudgeAmount, setNudgeAmount] = useState(0.005);
  const [testGrid, setTestGrid] = useState(projection?.testGridEnabled ?? false);
  const [dirty, setDirty] = useState(false);
  const savedCornersRef = useRef<ProjectionCorners>(projection?.corners ?? defaultCorners());
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendCorners = useCallback((c: ProjectionCorners) => {
    if (throttleRef.current) clearTimeout(throttleRef.current);
    throttleRef.current = setTimeout(() => {
      client.send({ type: 'setProjectionCorners', corners: c });
    }, 40);
  }, [client]);

  const handleMove = useCallback((corner: CornerKey, updated: ProjectionCorners) => {
    setCorners(updated);
    setDirty(true);
    sendCorners(updated);
  }, [sendCorners]);

  const handleNudge = (dx: number, dy: number) => {
    if (!selectedCorner) return;
    const updated = nudgeCorner(corners, selectedCorner, dx * nudgeAmount, dy * nudgeAmount);
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
    client.send({ type: 'setProjectionCorners', corners: savedCornersRef.current });
  };

  const handleTestGrid = (enabled: boolean) => {
    setTestGrid(enabled);
    client.send({ type: 'setProjectionGrid', enabled });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="overline" sx={{ letterSpacing: 1 }}>Projection Mapping</Typography>
        {dirty && <Chip label="Unsaved" size="small" color="warning" variant="outlined" />}
      </Box>

      <ProjectionCanvas
        corners={corners}
        selectedCorner={selectedCorner}
        imageUrl={projection ? undefined : undefined}
        onSelectCorner={setSelectedCorner}
        onMoveCorner={handleMove}
      />

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {(Object.keys(CORNER_LABELS) as CornerKey[]).map((k) => (
          <Chip
            key={k}
            label={CORNER_LABELS[k]}
            size="small"
            onClick={() => setSelectedCorner(k)}
            color={selectedCorner === k ? 'primary' : 'default'}
            variant={selectedCorner === k ? 'filled' : 'outlined'}
          />
        ))}
        {selectedCorner && (
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 'auto' }}>
            x: {corners[selectedCorner].x.toFixed(4)} y: {corners[selectedCorner].y.toFixed(4)}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0.5, maxWidth: 180, mx: 'auto' }}>
        <Box />
        <IconButton size="small" onClick={() => handleNudge(0, -1)} disabled={!selectedCorner}><ArrowUpwardIcon fontSize="small" /></IconButton>
        <Box />
        <IconButton size="small" onClick={() => handleNudge(-1, 0)} disabled={!selectedCorner}><ArrowBackIcon fontSize="small" /></IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>D-PAD</Typography>
        </Box>
        <IconButton size="small" onClick={() => handleNudge(1, 0)} disabled={!selectedCorner}><ArrowForwardIcon fontSize="small" /></IconButton>
        <Box />
        <IconButton size="small" onClick={() => handleNudge(0, 1)} disabled={!selectedCorner}><ArrowDownwardIcon fontSize="small" /></IconButton>
        <Box />
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">Nudge amount: {nudgeAmount.toFixed(4)}</Typography>
        <Slider
          size="small"
          min={0.001}
          max={0.05}
          step={0.001}
          value={nudgeAmount}
          onChange={(_, v) => setNudgeAmount(v as number)}
          sx={{ mt: 0.5 }}
        />
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <GridOnIcon fontSize="small" color="action" />
          <Typography variant="caption">Test Grid</Typography>
        </Box>
        <Switch size="small" checked={testGrid} onChange={(e) => handleTestGrid(e.target.checked)} />
      </Box>

      <Stack direction="row" spacing={1}>
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
          <Button size="small" variant="outlined" startIcon={<RestoreIcon />} onClick={handleRevert} fullWidth>
            Revert
          </Button>
        </Tooltip>
        <Tooltip title="Reset to default corners">
          <Button size="small" variant="outlined" color="error" onClick={handleReset} fullWidth>
            Reset
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
};
