// components/Desktop/DesktopSidebar.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Link,
  alpha,
  useTheme,
} from '@mui/material';
import { Visibility, People } from '@mui/icons-material';
import { ProjectData } from '../../types';

interface DesktopSidebarProps {
  data: ProjectData;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Project Info */}
      <Paper
        sx={{
          backgroundColor: alpha(theme.palette.grey[800], 0.3),
          border: `1px solid ${theme.palette.grey[700]}`,
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project Details
        </Typography>

        {data.basics?.type && (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 2,
                color: theme.palette.grey[400],
              }}
            >
              Type
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, textTransform: 'capitalize' }}
            >
              {data.basics.type}
            </Typography>
          </Box>
        )}

        {data.basics?.category && (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 2,
                color: theme.palette.grey[400],
              }}
            >
              Category
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, textTransform: 'capitalize' }}
            >
              {data.basics.category.replace('-', ' ')}
            </Typography>
          </Box>
        )}

        {data.technical?.timeline?.duration && (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 2,
                color: theme.palette.grey[400],
              }}
            >
              Duration
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {data.technical.timeline.duration}
            </Typography>
          </Box>
        )}

        {data.technical?.myRole && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 2,
                color: theme.palette.grey[400],
              }}
            >
              My Role
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {data.technical.myRole}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Technologies */}
      {data.technical?.technologies &&
        data.technical.technologies.length > 0 && (
          <Paper
            sx={{
              backgroundColor: alpha(theme.palette.grey[800], 0.3),
              border: `1px solid ${theme.palette.grey[700]}`,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Technologies
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.technical.technologies.map((tech, index) => (
                <Chip
                  key={index}
                  label={tech}
                  sx={{
                    backgroundColor: theme.palette.grey[700],
                    border: `1px solid ${theme.palette.grey[600]}`,
                  }}
                />
              ))}
            </Box>
          </Paper>
        )}

      {/* Links */}
      <Paper
        sx={{
          backgroundColor: alpha(theme.palette.grey[800], 0.3),
          border: `1px solid ${theme.palette.grey[700]}`,
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Links
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {data.links?.liveDemo && (
            <Link
              href={data.links.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': { color: theme.palette.primary.light },
              }}
            >
              <Typography variant="body2">Live Demo</Typography>
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
                gap: 1.5,
                color: theme.palette.grey[300],
                textDecoration: 'none',
                '&:hover': { color: theme.palette.common.white },
              }}
            >
              <Typography variant="body2">Source Code</Typography>
            </Link>
          )}
          {data.links?.caseStudy && (
            <Link
              href={data.links.caseStudy}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: theme.palette.grey[300],
                textDecoration: 'none',
                '&:hover': { color: theme.palette.common.white },
              }}
            >
              <Visibility sx={{ fontSize: 16 }} />
              <Typography variant="body2">Case Study</Typography>
            </Link>
          )}
        </Box>
      </Paper>

      {/* Collaborators */}
      {data.technical?.collaborators &&
        data.technical.collaborators.length > 0 && (
          <Paper
            sx={{
              backgroundColor: alpha(theme.palette.grey[800], 0.3),
              border: `1px solid ${theme.palette.grey[700]}`,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Team
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.technical.collaborators.map((collaborator, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                >
                  <People
                    sx={{ fontSize: 16, color: theme.palette.grey[400] }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {collaborator.name}
                    </Typography>
                    {collaborator.role && (
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.grey[400] }}
                      >
                        {collaborator.role}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
    </Box>
  );
};
