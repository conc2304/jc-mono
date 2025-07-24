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
        backgroundColor: alpha(theme.palette.grey[900], 0.5),
        border: `1px solid ${theme.palette.grey[700]}`,
        p: 2,
        mb: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 'bold', textTransform: 'capitalize' }}
      >
        {activeTab}
      </Typography>
      {content && renderContent(content)}
    </Paper>
  );
};
