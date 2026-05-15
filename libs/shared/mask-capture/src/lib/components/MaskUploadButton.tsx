import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import UploadIcon from '@mui/icons-material/Upload';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const ACCEPTED_ATTR = ACCEPTED_TYPES.join(',');

interface Props {
  onUpload: (file: File) => Promise<void>;
}

export const MaskUploadButton: React.FC<Props> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a PNG, JPEG, or WebP image.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setError(null);
    setUploading(true);
    try {
      await onUpload(file);
    } catch {
      setError('Could not upload mask.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_ATTR}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <Button
        variant="outlined"
        startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        fullWidth
        size="small"
      >
        {uploading ? 'Uploading…' : 'Upload New Mask'}
      </Button>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </div>
  );
};
