import { Box, Typography } from '@mui/material';

import { FileSystemItem } from '../../types';

// Simple file type components
export const PDFViewer = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">PDF Viewer</Typography>
    <Typography>Viewing: {file.name}</Typography>
    {/* Your PDF viewer implementation */}
  </Box>
);

export const TextEditor = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">Text Editor</Typography>
    <Typography>Editing: {file.name}</Typography>
    {/* Your text editor implementation */}
  </Box>
);

export const ImageViewer = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">Image Viewer</Typography>
    <Typography>Viewing: {file.name}</Typography>
    {/* Your image viewer implementation */}
  </Box>
);

export const CodeEditor = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">Code Editor</Typography>
    <Typography>Editing: {file.name}</Typography>
    {/* Your code editor implementation */}
  </Box>
);

// Default file viewer
export const DefaultFileViewer = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">File: {file.name}</Typography>
    <Typography color="text.secondary">
      No specific viewer for .{file.extension} files
    </Typography>
  </Box>
);
