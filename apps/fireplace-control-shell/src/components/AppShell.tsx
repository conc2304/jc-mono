import React, { useState, useRef, useEffect, Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AppHeader } from './AppHeader';
import { AppNav, type TabId } from './AppNav';
import { SceneController } from '@jc/shared/scene-controller';
import { ProjectionMappingController } from '@jc/shared/projection-mapping-controller';
import { MaskCapture } from '@jc/shared/mask-capture';
import { MaskEditor } from '@jc/shared/mask-editor';
import { SpawnEditor } from '@jc/shared/spawn-editor';
import { UnsavedChangesDialog } from '@jc/ui-components';

import { useOFStore } from '@jc/shared/of-control-client';

import { StatusView } from './StatusView';

const HEADER_HEIGHT = 48;
const NAV_HEIGHT = 56;

type UnsavedGuard = {
  hasUnsavedChanges: boolean;
  save?: () => Promise<void>;
  discard: () => void;
};

export const AppShell: React.FC = () => {
  const [tab, setTab] = useState<TabId>('scene');
  const [editorReferenceFile, setEditorReferenceFile] = useState<File | null>(
    null
  );
  const [guardDialogOpen, setGuardDialogOpen] = useState(false);
  const [guardError, setGuardError] = useState<string | null>(null);
  const [pendingTab, setPendingTab] = useState<TabId | null>(null);
  const unsavedGuardRef = useRef<UnsavedGuard | null>(null);
  const store = useOFStore();

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (unsavedGuardRef.current?.hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const registerUnsavedGuard = (guard: UnsavedGuard | null) => {
    unsavedGuardRef.current = guard;
  };

  const handleTabChange = async (nextTab: TabId) => {
    if (nextTab === tab) return;
    const handler = unsavedGuardRef.current;
    if (!handler?.hasUnsavedChanges) {
      setTab(nextTab);
      return;
    }

    setPendingTab(nextTab);
    setGuardError(null);
    setGuardDialogOpen(true);
  };

  const handleGuardSave = async () => {
    const handler = unsavedGuardRef.current;
    if (!handler) {
      setGuardDialogOpen(false);
      setPendingTab(null);
      return;
    }

    if (!handler.save) {
      setGuardDialogOpen(false);
      if (pendingTab) setTab(pendingTab);
      setPendingTab(null);
      return;
    }

    setGuardError(null);
    try {
      await handler.save();
      setGuardDialogOpen(false);
      if (pendingTab) setTab(pendingTab);
      setPendingTab(null);
    } catch (error) {
      setGuardError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleGuardDiscard = () => {
    const handler = unsavedGuardRef.current;
    handler?.discard();
    setGuardDialogOpen(false);
    if (pendingTab) setTab(pendingTab);
    setPendingTab(null);
  };

  const handleGuardCancel = () => {
    setGuardDialogOpen(false);
    setPendingTab(null);
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
        return (
          <MaskCapture
            onOpenEditor={() => {
              setEditorReferenceFile(null);
              setTab('editor');
            }}
            onOpenEditorWithReference={(file) => {
              setEditorReferenceFile(file);
              setTab('editor');
            }}
          />
        );
      case 'editor':
        return (
          <MaskEditor
            referenceFile={editorReferenceFile}
            onUploadSuccess={() => {
              setEditorReferenceFile(null);
              setTab('mask');
            }}
            onCancel={() => {
              setEditorReferenceFile(null);
              setTab('mask');
            }}
            onRegisterUnsavedChanges={registerUnsavedGuard}
          />
        );
      case 'spawn':
        return <SpawnEditor onRegisterUnsavedChanges={registerUnsavedGuard} />;
      case 'status':
        return <StatusView />;
      default:
        return null;
    }
  };

  const isEditor = tab === 'editor' || tab === 'projection' || tab === 'spawn';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        backgroundColor: 'background.default',
      }}
    >
      <AppHeader />

      {isEditor ? (
        /* Editor needs exact height — no scroll, no padding on main */
        <Box
          component="main"
          sx={{
            flex: 1,
            mt: `${HEADER_HEIGHT}px`,
            mb: `${NAV_HEIGHT}px`,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            px: 2,
            py: 1,
          }}
        >
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                <CircularProgress />
              </Box>
            }
          >
            {renderContent()}
          </Suspense>
        </Box>
      ) : (
        /* All other tabs scroll normally */
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
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                <CircularProgress />
              </Box>
            }
          >
            {renderContent()}
          </Suspense>
        </Box>
      )}

      <AppNav tab={tab} onChange={handleTabChange} />
      <UnsavedChangesDialog
        open={guardDialogOpen}
        title="You have unsaved changes"
        description="Navigate away and discard your unsaved work, or save it before switching tabs."
        error={guardError}
        onSave={handleGuardSave}
        onDiscard={handleGuardDiscard}
        onCancel={handleGuardCancel}
      />
    </Box>
  );
};
