import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UploadIcon from '@mui/icons-material/Upload';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const ACCEPTED_ATTR = ACCEPTED_TYPES.join(',');

interface Props {
  onFileSelect: (file: File) => void;
}

export const MaskUploadButton: React.FC<Props> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a PNG, JPEG, or WebP image.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setError(null);
    onFileSelect(file);
    if (inputRef.current) inputRef.current.value = '';
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
        startIcon={<UploadIcon />}
        onClick={() => inputRef.current?.click()}
        fullWidth
        size="small"
      >
        Upload New Mask
      </Button>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </div>
  );
};
