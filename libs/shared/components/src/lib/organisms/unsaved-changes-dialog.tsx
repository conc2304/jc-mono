import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
  open: boolean;
  title: string;
  description: string;
  saving?: boolean;
  error?: string | null;
  onSave?: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  saveLabel?: string;
  discardLabel?: string;
  cancelLabel?: string;
  showSave?: boolean;
}

export const UnsavedChangesDialog: React.FC<Props> = ({
  open,
  title,
  description,
  saving = false,
  error = null,
  onSave,
  onDiscard,
  onCancel,
  saveLabel = 'Save changes',
  discardLabel = 'Discard changes',
  cancelLabel = 'Keep editing',
  showSave = true,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={saving}>
          {cancelLabel}
        </Button>
        <Button onClick={onDiscard} color="error" disabled={saving}>
          {discardLabel}
        </Button>
        {showSave && onSave ? (
          <Button
            onClick={onSave}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            {saveLabel}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};
