import React, { useMemo } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import type { ControlParam } from '@jc/of-control-protocol';
import { ParamControl } from './ParamControl';
import { getGroupMeta } from './globalSettingsManifest';

interface Props {
  open: boolean;
  params: ControlParam[];
  values: Record<string, unknown>;
  onCommit: (id: string, value: unknown, immediate?: boolean) => void;
  onClose: () => void;
}

interface Section {
  category: string;
  order: number;
  fullParams: ControlParam[];
  compactParams: ControlParam[];
}

function getLayout(param: ControlParam): 'full' | 'compact' {
  if (param.type === 'bool') return 'compact';
  return 'full';
}

function buildSections(params: ControlParam[]): Section[] {
  const map = new Map<string, Section>();

  for (const p of params) {
    const meta = getGroupMeta(p.group);
    if (!map.has(meta.category)) {
      map.set(meta.category, {
        category: meta.category,
        order: meta.order,
        fullParams: [],
        compactParams: [],
      });
    }
    const section = map.get(meta.category)!;
    if (getLayout(p) === 'compact') section.compactParams.push(p);
    else section.fullParams.push(p);
  }

  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

export const GlobalSettingsDrawer: React.FC<Props> = ({
  open,
  params,
  values,
  onCommit,
  onClose,
}) => {
  const sections = useMemo(() => buildSections(params), [params]);

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
        {sections.map((section, i) => (
          <Box key={section.category} sx={{ mb: 2 }}>
            {i > 0 && <Divider sx={{ mb: 2 }} />}
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'block', mb: 1, letterSpacing: 1, lineHeight: 1.5 }}
            >
              {section.category}
            </Typography>

            {section.fullParams.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: section.compactParams.length > 0 ? 1.5 : 0 }}>
                {section.fullParams.map((p) => (
                  <ParamControl
                    key={p.id}
                    param={p}
                    value={values[p.id]}
                    onCommit={onCommit}
                  />
                ))}
              </Box>
            )}

            {section.compactParams.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 1,
                  '@media (max-width: 400px)': {
                    gridTemplateColumns: '1fr',
                  },
                }}
              >
                {section.compactParams.map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <ParamControl
                      param={p}
                      value={values[p.id]}
                      onCommit={onCommit}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};
