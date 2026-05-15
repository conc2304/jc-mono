import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import { useMasks } from './hooks/useMasks';
import { MaskGrid } from './components/MaskGrid';
import { MaskUploadButton } from './components/MaskUploadButton';
import type { Mask } from './hooks/useMasks';

interface Props {
  baseUrl?: string;
  maskVersion?: number;
  onOpenEditor?: () => void;
}

export const MaskCapture: React.FC<Props> = ({ baseUrl = '', onOpenEditor }) => {
  const { masks, loading, error, uploadMask, activateMask, deleteMask } = useMasks(baseUrl);
  const [pendingDelete, setPendingDelete] = useState<Mask | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleActivate = async (id: string) => {
    try {
      await activateMask(id);
    } catch {
      setActionError('Could not activate mask.');
    }
  };

  const handleUpload = async (file: File) => {
    await uploadMask(file);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteMask(target);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not delete mask.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="overline" sx={{ letterSpacing: 1 }}>
        Mask Library
      </Typography>

      <MaskGrid
        masks={masks}
        loading={loading}
        error={error}
        onActivate={handleActivate}
        onDeleteRequest={setPendingDelete}
      />

      <MaskUploadButton onUpload={handleUpload} />

      <Button variant="contained" startIcon={<EditIcon />} onClick={onOpenEditor} fullWidth>
        Open Mask Editor
      </Button>

      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Delete Mask</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &ldquo;{pendingDelete?.name}&rdquo;? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!actionError}
        autoHideDuration={4000}
        onClose={() => setActionError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      </Snackbar>
    </Box>
  );
};
