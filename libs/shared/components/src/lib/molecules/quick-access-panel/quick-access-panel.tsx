import { useContext, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { ChevronDown, ChevronRight, List } from 'lucide-react';

import { quickAccessItems } from './mockData';
import { FileSystemContext } from '../../context';

interface QuickAccessPanelProps {
  collapsed: boolean;
  onToggle: () => void;
}
export const QuickAccessPanel = ({
  collapsed,
  onToggle,
}: QuickAccessPanelProps) => {
  const context = useContext(FileSystemContext);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'folders',
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Box
      sx={{
        width: collapsed ? 48 : 250,
        height: '100%',
        borderRight: 1,
        borderColor: 'divider',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton onClick={onToggle} size="small">
          {collapsed ? <ChevronRight /> : <ChevronDown />}
        </IconButton>
        {!collapsed && (
          <Typography variant="subtitle2" component="span" sx={{ ml: 1 }}>
            Quick Access
          </Typography>
        )}
      </Box>

      {!collapsed && (
        <List>
          <ListItem onClick={() => toggleCategory('folders')}>
            <ListItemIcon>
              {expandedCategories.includes('folders') ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </ListItemIcon>
            <ListItemText primary="Folders" />
          </ListItem>

          <Collapse in={expandedCategories.includes('folders')}>
            {quickAccessItems.map((item) => (
              <ListItem
                key={item.id}
                sx={{ pl: 4 }}
                onClick={() => context?.navigateToPath(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </Collapse>
        </List>
      )}
    </Box>
  );
};
