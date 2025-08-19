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
  capitalize,
  styled,
} from '@mui/material';
import { ProjectData } from '../../types';
import {
  Cases,
  Code,
  GitHub,
  People,
  Preview,
  Visibility,
} from '@mui/icons-material';

const DetailItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="caption"
        sx={(theme) => ({
          textTransform: 'uppercase',
          letterSpacing: 2,
          color: theme.palette.getInvertedMode('secondary'),
        })}
      >
        {capitalize(label)}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, textTransform: 'capitalize' }}
      >
        {value}
      </Typography>
    </Box>
  );
};

interface DesktopSidebarProps {
  data: ProjectData;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ data }) => {
  const theme = useTheme();

  const details = [
    { label: 'Type', value: data.basics.type },
    { label: 'Category', value: data.basics.category.replace('-', ' ') },
    { label: 'Timeline', value: data?.technical?.timeline?.duration },
    { label: 'Role', value: data?.technical?.myRole },
  ];

  const PaperStyled = styled(Paper)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.background.paper, 0.3),
    border: `1px solid ${theme.palette.secondary.main}`,
    padding: theme.spacing(3),
  }));

  const LinkStyled = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    color: theme.palette.getInvertedMode('secondary'),
    textDecoration: 'none',
    '&:hover': { color: theme.palette.secondary.main },
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Project Info */}
      <PaperStyled>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project Details
        </Typography>

        {details.map(({ label, value }) => {
          return (
            <DetailItem label={label} value={value || 'N/A'} key={label} />
          );
        })}
      </PaperStyled>

      {/* Technologies */}
      {data.technical?.technologies &&
        data.technical.technologies.length > 0 && (
          <PaperStyled>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Technologies
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.technical.technologies.map((tech, index) => (
                <Chip
                  key={index}
                  label={tech}
                  sx={{
                    backgroundColor: theme.palette.getInvertedMode('secondary'),
                    color: theme.palette.getContrastText(
                      theme.palette.getInvertedMode('secondary')
                    ),
                    border: `1px solid ${
                      theme.palette.secondary[theme.palette.mode]
                    }`,
                  }}
                />
              ))}
            </Box>
          </PaperStyled>
        )}

      {/* Links */}
      <PaperStyled>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Links
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {data.links?.liveDemo && (
            <LinkStyled
              href={data.links.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Preview />
              <Typography variant="body2">Live Demo</Typography>
            </LinkStyled>
          )}
          {data.links?.repository && (
            <LinkStyled
              href={data.links.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub />
              <Typography variant="body2">Source Code</Typography>
            </LinkStyled>
          )}
          {data.links?.caseStudy && (
            <LinkStyled
              href={data.links.caseStudy}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Cases />
              <Typography variant="body2">Case Study</Typography>
            </LinkStyled>
          )}
        </Box>
      </PaperStyled>

      {/* Collaborators */}
      {data.technical?.collaborators &&
        data.technical.collaborators.length > 0 && (
          <PaperStyled>
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
                    sx={{
                      fontSize: 16,
                      color: theme.palette.secondary[theme.palette.mode],
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.getInvertedMode('secondary'),
                      }}
                    >
                      {collaborator.name}
                    </Typography>
                    {collaborator.role && (
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {collaborator.role}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </PaperStyled>
        )}
    </Box>
  );
};
