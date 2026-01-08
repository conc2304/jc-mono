import { Box, Paper, Modal, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

import { AugmentedButton } from '../../atoms';
import { ColorStop, Gradient } from '@jc/utils';
import { ColorGradientEditor, GradientData } from '../../organisms';

interface CustomGradientEditorModalProps {
  isOpen: boolean;
  customGradientStops: ColorStop[];
  editingGradient?: Gradient | null;
  onClose: () => void;
  onGradientChange: (gradientData: GradientData) => void;
  onSaveGradient: () => void;
  onUpdateGradient?: (gradientId: string) => void;
}

export const CustomGradientEditorModal = ({
  isOpen,
  customGradientStops,
  editingGradient = null,
  onClose,
  onGradientChange,
  onSaveGradient,
  onUpdateGradient,
}: CustomGradientEditorModalProps) => {
  const theme = useTheme();

  const isEditMode = editingGradient !== null;
  const isDefaultGradient = editingGradient?.isDefault === true;
  const canOverwrite = isEditMode && !isDefaultGradient;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          p: 3,
          maxWidth: 800,
          width: '100%',
          mx: 0,
          height: { sm: '100vh', md: '90vh' },
          overflow: 'auto',
          outline: 'none',
          bg: alpha(theme.palette.background.paper, 0.7),
          borderRadius: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {isEditMode ? 'Edit Gradient' : 'Create Custom Gradient'}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Gradient Editor */}
        <ColorGradientEditor
          initialStops={customGradientStops}
          onGradientChange={onGradientChange}
          showTitle={false}
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {canOverwrite && onUpdateGradient && (
            <AugmentedButton
              fullWidth
              variant="contained"
              shape="asymmetricLeft"
              onClick={() => {
                onUpdateGradient(editingGradient.id);
                onClose();
              }}
            >
              Update Gradient
            </AugmentedButton>
          )}
          <AugmentedButton
            fullWidth
            variant="contained"
            shape="asymmetricRight"
            onClick={onSaveGradient}
          >
            {isEditMode ? 'Save as New' : 'Save & Apply Gradient'}
          </AugmentedButton>
          <AugmentedButton
            variant="outlined"
            color="secondary"
            onClick={onClose}
          >
            <CloseIcon />
          </AugmentedButton>
        </Box>
      </Paper>
    </Modal>
  );
};
