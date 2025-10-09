import React from 'react';
import { Menu, MenuItem, Box, Chip, alpha, useTheme } from '@mui/material';

interface TabData {
  key: string;
  label: string;
}

interface MobileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  tabs: TabData[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  status?: string;
  getStatusColor: (
    status?: string
  ) => 'success' | 'warning' | 'default' | 'primary';
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  anchorEl,
  onClose,
  tabs,
  activeTab,
  onTabChange,
  status,
  getStatusColor,
}) => {
  const theme = useTheme();

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${theme.palette.grey[800]}`,
          minWidth: 200,
        },
      }}
    >
      {status && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Chip
            label={status.replace('-', ' ').toUpperCase()}
            color={getStatusColor(status)}
            size="small"
          />
        </Box>
      )}
      {tabs.map((tab) => (
        <MenuItem
          key={tab.key}
          onClick={() => {
            onTabChange(tab.key);
            onClose();
          }}
          selected={activeTab === tab.key}
          sx={{ color: 'primary.main' }}
        >
          {tab.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
