import { useContext, useState } from 'react';
import {
  Box,
  ButtonGroup,
  capitalize,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
  ListIcon,
  PanelBottom,
} from 'lucide-react';

import { SortBy, ViewMode } from '@jc/ui-components';

import { FileSystemContext } from '../../context';

export const ViewControls = () => {
  const context = useContext(FileSystemContext);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const viewModeIcons = {
    details: <ListIcon size={16} />,
    list: <LayoutList size={16} />,
    icons: <LayoutGrid size={16} />,
    cards: <PanelBottom size={16} />,
  };

  return (
    <Box
      sx={{
        p: 1,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        gap: 1,
        alignItems: 'center',
      }}
    >
      <ButtonGroup size="small">
        {Object.entries(viewModeIcons).map(([mode, icon]) => (
          <Tooltip
            key={mode}
            title={`${capitalize(mode)} View`}
            placement="bottom"
          >
            <IconButton
              key={mode}
              size="small"
              color={context?.viewMode === mode ? 'primary' : 'default'}
              onClick={() => context?.setViewMode(mode as ViewMode)}
            >
              {icon}
            </IconButton>
          </Tooltip>
        ))}
      </ButtonGroup>

      <Divider orientation="vertical" flexItem />

      <IconButton
        size="small"
        onClick={(e) => setSortMenuAnchor(e.currentTarget)}
      >
        <ArrowUpDown size={16} />
      </IconButton>

      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        {(['name', 'date', 'size', 'type'] as SortBy[]).map((sortBy) => (
          <MenuItem
            key={sortBy}
            onClick={() => {
              context?.setSorting(sortBy, context.sortOrder);
              setSortMenuAnchor(null);
            }}
          >
            {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            context?.setSorting(
              context.sortBy,
              context.sortOrder === 'asc' ? 'desc' : 'asc'
            );
            setSortMenuAnchor(null);
          }}
        >
          {context?.sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </MenuItem>
      </Menu>
    </Box>
  );
};
