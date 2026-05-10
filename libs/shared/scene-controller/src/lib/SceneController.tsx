import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import type { ControlParam } from '@jc/of-control-protocol';
import { useOFStore, useSetParam } from '@jc/shared/of-control-client';
import { ModeSelector } from './ModeSelector';
import { ParamGroup } from './ParamGroup';

export const SceneController: React.FC = () => {
  const store = useOFStore();
  const setParam = useSetParam();

  const { schema, values, currentMode, connection } = store;

  const isConnected = connection.status === 'connected';
  const isConnecting = connection.status === 'connecting' || connection.status === 'reconnecting';

  const { globalParams, modeParams } = useMemo(() => {
    if (!schema) return { globalParams: [], modeParams: [] };

    const editable = schema.params.filter((p) => !p.readOnly);
    const global = editable.filter((p) => !p.mode);
    const forMode = currentMode
      ? editable.filter((p) => p.mode === currentMode)
      : [];

    return { globalParams: global, modeParams: forMode };
  }, [schema, currentMode]);

  const groupedGlobal = useMemo(() => groupByGroup(globalParams), [globalParams]);
  const groupedMode = useMemo(() => groupByGroup(modeParams), [modeParams]);

  const handleCommit = (id: string, value: unknown, immediate = false) => {
    setParam(id, value, immediate);
  };

  const handleModeChange = (mode: string) => {
    setParam('experienceMode', mode, true);
  };

  if (isConnecting && !schema) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 6 }}>
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">
          Connecting to fireplace…
        </Typography>
      </Box>
    );
  }

  if (!isConnected && !schema) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Not connected to the fireplace app. Make sure it's running on the local network.
      </Alert>
    );
  }

  if (!schema) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Loading parameter schema…
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {schema.modes.length > 0 && (
        <ModeSelector
          modes={schema.modes}
          currentMode={currentMode}
          onChange={handleModeChange}
        />
      )}

      {currentMode && groupedMode.size > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, display: 'block', mb: 0.5 }}>
            {currentMode} parameters
          </Typography>
          {Array.from(groupedMode.entries()).map(([group, params]) => (
            <ParamGroup
              key={group}
              group={group}
              params={params.normal}
              values={values}
              onCommit={handleCommit}
            />
          ))}
          {Array.from(groupedMode.entries()).some(([, { advanced }]) => advanced.length > 0) && (
            Array.from(groupedMode.entries()).map(([group, { advanced }]) =>
              advanced.length > 0 ? (
                <ParamGroup key={`${group}-adv`} group={group} params={advanced} values={values} advanced onCommit={handleCommit} />
              ) : null
            )
          )}
        </Box>
      )}

      {groupedGlobal.size > 0 && (
        <Box>
          {groupedGlobal.size > 0 && (
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, display: 'block', mb: 0.5 }}>
              Global
            </Typography>
          )}
          {Array.from(groupedGlobal.entries()).map(([group, { normal, advanced }]) => (
            <React.Fragment key={group}>
              <ParamGroup group={group} params={normal} values={values} onCommit={handleCommit} />
              {advanced.length > 0 && (
                <ParamGroup group={group} params={advanced} values={values} advanced onCommit={handleCommit} />
              )}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

function groupByGroup(params: ControlParam[]): Map<string, { normal: ControlParam[]; advanced: ControlParam[] }> {
  const map = new Map<string, { normal: ControlParam[]; advanced: ControlParam[] }>();
  for (const p of params) {
    const key = p.group || 'General';
    if (!map.has(key)) map.set(key, { normal: [], advanced: [] });
    if (p.advanced) map.get(key)!.advanced.push(p);
    else map.get(key)!.normal.push(p);
  }
  return map;
}
