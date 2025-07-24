import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Link,
  alpha,
  useTheme,
} from '@mui/material';
import { ProjectData } from '../../types';

interface MobileProjectDetailsProps {
  data: ProjectData;
}

export const MobileProjectDetails: React.FC<MobileProjectDetailsProps> = ({
  data,
}) => {
  const theme = useTheme();

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 6 }}>
        <Paper
          sx={{
            backgroundColor: alpha(theme.palette.grey[800], 0.5),
            border: `1px solid ${theme.palette.grey[700]}`,
            p: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, color: theme.palette.grey[300] }}
          >
            Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.basics?.type && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.grey[400] }}
                >
                  Type:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ ml: 1, textTransform: 'capitalize' }}
                >
                  {data.basics.type}
                </Typography>
              </Box>
            )}
            {data.technical?.timeline?.duration && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.grey[400] }}
                >
                  Duration:
                </Typography>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {data.technical.timeline.duration}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 6 }}>
        <Paper
          sx={{
            backgroundColor: alpha(theme.palette.grey[800], 0.5),
            border: `1px solid ${theme.palette.grey[700]}`,
            p: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, color: theme.palette.grey[300] }}
          >
            Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.links?.liveDemo && (
              <Link
                href={data.links.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  '&:hover': { color: theme.palette.primary.light },
                }}
              >
                Demo
              </Link>
            )}
            {data.links?.repository && (
              <Link
                href={data.links.repository}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: theme.palette.grey[300],
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  '&:hover': { color: theme.palette.common.white },
                }}
              >
                Code
              </Link>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
