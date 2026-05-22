import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { ControlParam } from '@jc/of-control-protocol';
import { paramMatchesShowWhen } from './globalSettingsManifest';
import { ParamControl } from './ParamControl';

interface Props {
  categoryLabel: string;
  categoryDescription?: string;
  normal: ControlParam[];
  advanced: ControlParam[];
  values: Record<string, unknown>;
  onCommit: (id: string, value: unknown, immediate?: boolean) => void;
}

export const ParamGroup: React.FC<Props> = ({
  categoryLabel,
  categoryDescription,
  normal,
  advanced,
  values,
  onCommit,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (normal.length === 0 && advanced.length === 0) return null;

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
        sx={{ minHeight: 44, '& .MuiAccordionSummary-content': { my: 0.5 } }}
      >
        <Box>
          <Typography variant="overline" sx={{ lineHeight: 1.5, letterSpacing: 1 }}>
            {categoryLabel}
          </Typography>
          {categoryDescription && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ display: 'block', lineHeight: 1.3, mt: 0.25 }}
            >
              {categoryDescription}
            </Typography>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0.5, pb: 1.5, px: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {normal.map((p) => (
            <ConditionalParamRow key={p.id} param={p} values={values} onCommit={onCommit} />
          ))}
        </Box>

        {advanced.length > 0 && (
          <Box sx={{ mt: normal.length > 0 ? 1.5 : 0 }}>
            <Button
              size="small"
              variant="text"
              onClick={() => setShowAdvanced((v) => !v)}
              sx={{
                color: 'text.disabled',
                fontSize: '0.7rem',
                textTransform: 'none',
                px: 0,
                minHeight: 44,
                '&:hover': { color: 'text.secondary', backgroundColor: 'transparent' },
              }}
            >
              {showAdvanced ? 'Hide advanced' : `Show advanced (${advanced.length})`}
            </Button>

            <Collapse in={showAdvanced} timeout={150}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 0.5 }}>
                {advanced.map((p) => (
                  <ConditionalParamRow key={p.id} param={p} values={values} onCommit={onCommit} />
                ))}
              </Box>
            </Collapse>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

interface RowProps {
  param: ControlParam;
  values: Record<string, unknown>;
  onCommit: (id: string, value: unknown, immediate?: boolean) => void;
}

// Wraps each param in an animated Collapse so showWhen transitions are smooth.
// unmountOnExit keeps the DOM clean; the 150ms ease matches the advanced section.
const ConditionalParamRow: React.FC<RowProps> = ({ param, values, onCommit }) => {
  const visible = paramMatchesShowWhen(param, values);
  return (
    <Collapse in={visible} timeout={150} unmountOnExit>
      <ParamControl param={param} value={values[param.id]} onCommit={onCommit} />
    </Collapse>
  );
};
