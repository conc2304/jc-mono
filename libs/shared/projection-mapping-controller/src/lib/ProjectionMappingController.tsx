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
  ProjectionState,
} from '@jc/of-control-protocol';
import {
  defaultCorners,
  nudgeCorner,
  type CornerKey,
} from '@jc/shared/projection-warp';
import { useOFClient } from '@jc/shared/of-control-client';
import { ProjectionCanvas } from './ProjectionCanvas';

const CORNER_LABELS: Record<CornerKey, string> = {
  0: 'TL',
  1: 'TR',
  2: 'BR',
  3: 'BL',
};

interface Props {
  projection?: ProjectionState;
}

export const ProjectionMappingController: React.FC<Props> = ({
  projection,
}) => {
  const { client } = useOFClient();
  const [corners, setCorners] = useState<ProjectionCorners>(
    projection?.corners ?? defaultCorners()
  );
  const [selectedCorner, setSelectedCorner] = useState<CornerKey | null>(0);
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

  const sendCorners = useCallback(
    (c: ProjectionCorners) => {
      if (throttleRef.current) clearTimeout(throttleRef.current);
      throttleRef.current = setTimeout(() => {
        client.send({ type: 'setProjectionCorners', corners: c });
      }, 40);
    },
    [client]
  );

  const handleMove = useCallback(
    (corner: CornerKey, updated: ProjectionCorners) => {
      setCorners(updated);
      setDirty(true);
      sendCorners(updated);
    },
    [sendCorners]
  );

  const handleNudge = (dx: number, dy: number) => {
    if (selectedCorner === null) return;
    const updated = nudgeCorner(
      corners,
      selectedCorner,
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
      corners: savedCornersRef.current,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 1 }}>
          Projection Mapping
        </Typography>
        {dirty && (
          <Chip
            label="Unsaved"
            size="small"
            color="warning"
            variant="outlined"
          />
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          borderColor: 'primary',
          border: '1px solid',
        }}
      >
        <ProjectionCanvas
          corners={corners}
          selectedCorner={selectedCorner}
          testGrid={testGrid}
          imageUrl={projection ? undefined : undefined}
          onSelectCorner={setSelectedCorner}
          onMoveCorner={handleMove}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {([0, 1, 2, 3] as CornerKey[]).map((k) => (
          <Chip
            key={k}
            label={CORNER_LABELS[k]}
            size="small"
            onClick={() => setSelectedCorner(k)}
            color={selectedCorner === k ? 'primary' : 'default'}
            variant={selectedCorner === k ? 'filled' : 'outlined'}
          />
        ))}
        {selectedCorner !== null && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ alignSelf: 'center', ml: 'auto' }}
          >
            x: {corners[selectedCorner].x.toFixed(4)} y:{' '}
            {corners[selectedCorner].y.toFixed(4)}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 0.5,
          maxWidth: 180,
          mx: 'auto',
        }}
      >
        <Box />
        <IconButton
          size="small"
          onClick={() => handleNudge(0, -1)}
          disabled={selectedCorner === null}
        >
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
        <Box />
        <IconButton
          size="small"
          onClick={() => handleNudge(-1, 0)}
          disabled={selectedCorner === null}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: '0.6rem' }}
          >
            D-PAD
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={() => handleNudge(1, 0)}
          disabled={selectedCorner === null}
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
        <Box />
        <IconButton
          size="small"
          onClick={() => handleNudge(0, 1)}
          disabled={selectedCorner === null}
        >
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>
        <Box />
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Nudge amount: {nudgeAmount.toFixed(4)}
        </Typography>
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

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <GridOnIcon fontSize="small" color="action" />
          <Typography variant="caption">Test Grid</Typography>
        </Box>
        <Switch
          size="small"
          checked={testGrid}
          onChange={(e) => setTestGrid(e.target.checked)}
        />
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
