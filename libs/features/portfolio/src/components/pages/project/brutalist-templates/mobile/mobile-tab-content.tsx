import React from 'react';
import { Paper, Typography, useTheme, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface MobileTabContentProps {
  activeTab: string;
  content?: string | string[];
  renderContent: (content?: string | string[]) => React.ReactNode;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const MobileTabContent: React.FC<MobileTabContentProps> = ({
  activeTab,
  content,
  renderContent,
  onMenuClick,
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        border: `2px solid ${theme.palette.primary.main}`,
        p: 2,
        mb: 3,
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            textTransform: 'capitalize',
            color: theme.palette.primary.main,
          }}
        >
          {activeTab}
        </Typography>
        <IconButton
          onClick={onMenuClick}
          sx={{
            color: theme.palette.primary.main,
            p: 0.5,
            mt: -0.5,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      {content && renderContent(content)}
    </Paper>
  );
};
