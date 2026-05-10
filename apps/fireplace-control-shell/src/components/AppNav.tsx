import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GridOnIcon from '@mui/icons-material/GridOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BrushIcon from '@mui/icons-material/Brush';
import InfoIcon from '@mui/icons-material/Info';

export type TabId = 'scene' | 'projection' | 'mask' | 'editor' | 'status';

interface Props {
  tab: TabId;
  onChange: (tab: TabId) => void;
}

export const AppNav: React.FC<Props> = ({ tab, onChange }) => {
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}
      elevation={0}
    >
      <BottomNavigation
        value={tab}
        onChange={(_, v) => onChange(v)}
        showLabels
      >
        <BottomNavigationAction label="Scene" value="scene" icon={<LocalFireDepartmentIcon />} />
        <BottomNavigationAction label="Projection" value="projection" icon={<GridOnIcon />} />
        <BottomNavigationAction label="Mask" value="mask" icon={<PhotoCameraIcon />} />
        <BottomNavigationAction label="Editor" value="editor" icon={<BrushIcon />} />
        <BottomNavigationAction label="Status" value="status" icon={<InfoIcon />} />
      </BottomNavigation>
    </Paper>
  );
};
