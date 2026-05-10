import React, { useState, Suspense, lazy } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AppHeader } from './AppHeader';
import { AppNav, type TabId } from './AppNav';
import { SceneController } from '@jc/shared/scene-controller';
import { ProjectionMappingController } from '@jc/shared/projection-mapping-controller';
import { MaskCapture } from '@jc/shared/mask-capture';
import { MaskEditor } from '@jc/shared/mask-editor';
import { StatusView } from './StatusView';
import { useOFStore } from '@jc/shared/of-control-client';

const HEADER_HEIGHT = 48;
const NAV_HEIGHT = 56;

export const AppShell: React.FC = () => {
  const [tab, setTab] = useState<TabId>('scene');
  const [maskEditFile, setMaskEditFile] = useState<File | undefined>(undefined);
  const store = useOFStore();

  const handleEditMask = (file: File) => {
    setMaskEditFile(file);
    setTab('editor');
  };

  const renderContent = () => {
    switch (tab) {
      case 'scene':
        return <SceneController />;
      case 'projection':
        return (
          <ProjectionMappingController
            projection={store.projection ?? undefined}
          />
        );
      case 'mask':
        return <MaskCapture onEdit={handleEditMask} />;
      case 'editor':
        return <MaskEditor sourceFile={maskEditFile} onUploadSuccess={() => setTab('mask')} />;
      case 'status':
        return <StatusView />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', backgroundColor: 'background.default' }}>
      <AppHeader />

      <Box
        component="main"
        sx={{
          flex: 1,
          mt: `${HEADER_HEIGHT}px`,
          mb: `${NAV_HEIGHT}px`,
          overflowY: 'auto',
          px: 2,
          py: 2,
        }}
      >
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress /></Box>}>
          {renderContent()}
        </Suspense>
      </Box>

      <AppNav tab={tab} onChange={setTab} />
    </Box>
  );
};
