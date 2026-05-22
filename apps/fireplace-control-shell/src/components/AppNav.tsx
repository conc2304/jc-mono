import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GridOnIcon from '@mui/icons-material/GridOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BrushIcon from '@mui/icons-material/Brush';
import InfoIcon from '@mui/icons-material/Info';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import MenuIcon from '@mui/icons-material/Menu';

export type TabId = 'scene' | 'projection' | 'mask' | 'editor' | 'spawn' | 'status';

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ReactElement;
}

const TABS: TabDef[] = [
  { id: 'scene',      label: 'Scene',      icon: <LocalFireDepartmentIcon /> },
  { id: 'projection', label: 'Projection', icon: <GridOnIcon /> },
  { id: 'mask',       label: 'Mask',       icon: <PhotoCameraIcon /> },
  { id: 'editor',     label: 'Editor',     icon: <BrushIcon /> },
  { id: 'spawn',      label: 'Spawn',      icon: <ScatterPlotIcon /> },
  { id: 'status',     label: 'Status',     icon: <InfoIcon /> },
];

// Minimum px width each tab needs to render without wrapping
const MIN_TAB_WIDTH = 72;
// The "More" button itself needs one slot
const MORE_BTN_WIDTH = 72;

interface Props {
  tab: TabId;
  onChange: (tab: TabId) => void;
}

export const AppNav: React.FC<Props> = ({ tab, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(TABS.length);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const measure = useCallback(() => {
    const width = containerRef.current?.offsetWidth ?? 0;
    if (width === 0) return;

    // How many tabs fit without a More button?
    const allFit = Math.floor(width / MIN_TAB_WIDTH) >= TABS.length;
    if (allFit) {
      setVisibleCount(TABS.length);
      return;
    }

    // Reserve one slot for the More button
    const slots = Math.max(1, Math.floor((width - MORE_BTN_WIDTH) / MIN_TAB_WIDTH));
    setVisibleCount(Math.min(slots, TABS.length - 1));
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const visibleTabs = TABS.slice(0, visibleCount);
  const overflowTabs = TABS.slice(visibleCount);
  const hasOverflow = overflowTabs.length > 0;

  // If the active tab is hidden in overflow, show it as selected in the More button
  const activeIsOverflowed = hasOverflow && overflowTabs.some((t) => t.id === tab);
  // BottomNavigation value: use tab if visible, otherwise use '__more__' sentinel so More lights up
  const navValue = activeIsOverflowed ? '__more__' : tab;

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleOverflowSelect = (id: TabId) => {
    closeMenu();
    onChange(id);
  };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}
      elevation={0}
    >
      <BottomNavigation
        ref={containerRef}
        value={navValue}
        onChange={(_, v) => {
          if (v !== '__more__') onChange(v as TabId);
        }}
        showLabels
      >
        {visibleTabs.map((t) => (
          <BottomNavigationAction
            key={t.id}
            label={t.label}
            value={t.id}
            icon={t.icon}
            sx={{ minWidth: MIN_TAB_WIDTH, px: 0 }}
          />
        ))}

        {hasOverflow && (
          <BottomNavigationAction
            label="More"
            value="__more__"
            icon={<MenuIcon />}
            onClick={openMenu}
            sx={{ minWidth: MORE_BTN_WIDTH, px: 0 }}
          />
        )}
      </BottomNavigation>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {overflowTabs.map((t) => (
          <MenuItem
            key={t.id}
            selected={t.id === tab}
            onClick={() => handleOverflowSelect(t.id)}
          >
            <ListItemIcon>{t.icon}</ListItemIcon>
            <ListItemText>{t.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};
