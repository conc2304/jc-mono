import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useOFStore, useSetParam } from '@jc/shared/of-control-client';
import { ParamGroup } from './ParamGroup';
import { PresetSection } from './PresetSection';
import { GlobalSettingsLauncher } from './GlobalSettingsLauncher';
import { GlobalSettingsDrawer } from './GlobalSettingsDrawer';
import { buildUiParams, groupIntoCategories } from './globalSettingsManifest';

export const SceneController: React.FC = () => {
  const store = useOFStore();
  const setParam = useSetParam();
  const [globalSettingsOpen, setGlobalSettingsOpen] = useState(false);

  const { schema, values, currentMode, connection, settingsManifest } = store;

  const isConnected = connection.status === 'connected';
  const isConnecting = connection.status === 'connecting' || connection.status === 'reconnecting';

  // showWhen filtering is intentionally omitted here — it happens at render time
  // in ParamGroup so that conditional controls animate in/out smoothly.
  const uiParams = useMemo(() => {
    if (!schema) return [];
    const merged = buildUiParams(schema.params, settingsManifest ?? []);
    return merged.filter((p) => {
      if (p.readOnly) return false;
      if (p.placement === 'hidden') return false;
      if (p.modes.length > 0 && currentMode !== null && !p.modes.includes(currentMode)) return false;
      return true;
    });
  }, [schema, settingsManifest, currentMode]);

  const globalParams = useMemo(
    () => uiParams.filter((p) => p.placement === 'globalDrawer'),
    [uiParams]
  );
  const mainParams = useMemo(
    () => uiParams.filter((p) => p.placement === 'modeDrawer'),
    [uiParams]
  );

  const categoryGroups = useMemo(() => groupIntoCategories(mainParams), [mainParams]);

  const handleCommit = (id: string, value: unknown, immediate = false) => {
    setParam(id, value, immediate);
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
      <GlobalSettingsLauncher
        params={globalParams}
        values={values}
        onOpen={() => setGlobalSettingsOpen(true)}
      />

      <GlobalSettingsDrawer
        open={globalSettingsOpen}
        params={globalParams}
        values={values}
        onCommit={handleCommit}
        onClose={() => setGlobalSettingsOpen(false)}
      />

      <PresetSection activeMode={currentMode} />

      {categoryGroups.map((group) => (
        <ParamGroup
          key={group.category}
          categoryLabel={group.categoryLabel}
          categoryDescription={group.categoryDescription}
          normal={group.normal}
          advanced={group.advanced}
          values={values}
          onCommit={handleCommit}
        />
      ))}
    </Box>
  );
};
