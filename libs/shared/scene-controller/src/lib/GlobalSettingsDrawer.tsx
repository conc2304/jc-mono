import React, { useMemo } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import type { UiParam } from './globalSettingsManifest';
import { groupIntoCategories, paramMatchesShowWhen } from './globalSettingsManifest';
import { ParamControl } from './ParamControl';

interface Props {
  open: boolean;
  params: UiParam[];
  values: Record<string, unknown>;
  onCommit: (id: string, value: unknown, immediate?: boolean) => void;
  onClose: () => void;
}

export const GlobalSettingsDrawer: React.FC<Props> = ({
  open,
  params,
  values,
  onCommit,
  onClose,
}) => {
  // Same grouping pipeline as SceneController — categories, order, advanced split.
  const groups = useMemo(() => groupIntoCategories(params), [params]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 'min(440px, 100vw)',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle2" sx={{ letterSpacing: 0.5 }}>
          Global Settings
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close global settings">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
        {groups.map((group, i) => {
          const fullParams = group.normal.filter((p) => p.layout !== 'compact');
          const compactParams = group.normal.filter((p) => p.layout === 'compact');

          return (
            <Box key={group.category} sx={{ mb: 2 }}>
              {i > 0 && <Divider sx={{ mb: 2 }} />}

              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5, letterSpacing: 1, lineHeight: 1.5 }}
              >
                {group.categoryLabel}
              </Typography>

              {group.categoryDescription && (
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ display: 'block', mb: 1, lineHeight: 1.4 }}
                >
                  {group.categoryDescription}
                </Typography>
              )}

              {fullParams.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    mb: compactParams.length > 0 ? 1.5 : 0,
                  }}
                >
                  {fullParams.map((p) => (
                    <Collapse key={p.id} in={paramMatchesShowWhen(p, values)} timeout={150} unmountOnExit>
                      <ParamControl param={p} value={values[p.id]} onCommit={onCommit} />
                    </Collapse>
                  ))}
                </Box>
              )}

              {compactParams.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 1,
                    '@media (max-width: 400px)': { gridTemplateColumns: '1fr' },
                  }}
                >
                  {compactParams.map((p) => (
                    <Collapse key={p.id} in={paramMatchesShowWhen(p, values)} timeout={150} unmountOnExit>
                      <Box
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <ParamControl param={p} value={values[p.id]} onCommit={onCommit} />
                      </Box>
                    </Collapse>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
};
