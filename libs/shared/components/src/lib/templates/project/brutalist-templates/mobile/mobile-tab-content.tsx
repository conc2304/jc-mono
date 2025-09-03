// components/Mobile/MobileTabContent.tsx
import React from 'react';
import { Paper, Typography, alpha, useTheme } from '@mui/material';

interface MobileTabContentProps {
  activeTab: string;
  content?: string | string[];
  renderContent: (content?: string | string[]) => React.ReactNode;
}

export const MobileTabContent: React.FC<MobileTabContentProps> = ({
  activeTab,
  content,
  renderContent,
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        border: `2px solid ${theme.palette.primary.main}`,
        p: 2,
        mb: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          textTransform: 'capitalize',
          color: theme.palette.primary.main,
        }}
      >
        {activeTab}
      </Typography>
      {content && renderContent(content)}
    </Paper>
  );
};
