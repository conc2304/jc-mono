import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { ControlParam } from '@jc/of-control-protocol';
import { ParamControl } from './ParamControl';

interface Props {
  group: string;
  params: ControlParam[];
  values: Record<string, unknown>;
  advanced?: boolean;
  onCommit: (id: string, value: unknown, immediate?: boolean) => void;
}

export const ParamGroup: React.FC<Props> = ({ group, params, values, advanced = false, onCommit }) => {
  const [expanded, setExpanded] = useState(!advanced);

  if (params.length === 0) return null;

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
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
        <Typography variant="overline" sx={{ lineHeight: 1.5, letterSpacing: 1 }}>
          {group}
          {advanced && (
            <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
              advanced
            </Typography>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0.5, pb: 1.5, px: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {params.map((p) => (
            <ParamControl key={p.id} param={p} value={values[p.id]} onCommit={onCommit} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
