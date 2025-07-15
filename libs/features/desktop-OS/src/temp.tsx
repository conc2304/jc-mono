import React from 'react';
import { Box, Typography } from '@mui/material';

// Simple file type components
const PDFViewer = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">PDF Viewer</Typography>
    <Typography>Viewing: {file.name}</Typography>
    {/* Your PDF viewer implementation */}
  </Box>
);

const TextEditor = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">Text Editor</Typography>
    <Typography>Editing: {file.name}</Typography>
    {/* Your text editor implementation */}
  </Box>
);

const ImageViewer = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">Image Viewer</Typography>
    <Typography>Viewing: {file.name}</Typography>
    {/* Your image viewer implementation */}
  </Box>
);

const CodeEditor = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">Code Editor</Typography>
    <Typography>Editing: {file.name}</Typography>
    {/* Your code editor implementation */}
  </Box>
);

// Default file viewer
const DefaultFileViewer = ({ file }: { file: FileSystemItem }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6">File: {file.name}</Typography>
    <Typography color="text.secondary">
      No specific viewer for .{file.extension} files
    </Typography>
  </Box>
);

// File type registry - map extensions to components
const FILE_TYPE_COMPONENTS: Record<
  string,
  React.ComponentType<{ file: FileSystemItem }>
> = {
  pdf: PDFViewer,
  txt: TextEditor,
  md: TextEditor,
  jpg: ImageViewer,
  jpeg: ImageViewer,
  png: ImageViewer,
  gif: ImageViewer,
  js: CodeEditor,
  ts: CodeEditor,
  jsx: CodeEditor,
  tsx: CodeEditor,
  css: CodeEditor,
  html: CodeEditor,
};

// Simple content creator function
export const createWindowContent = (
  fsItem: FileSystemItem,
  fileSystemItems: FileSystemItem[]
) => {
  if (fsItem.type === 'folder') {
    // For folders: render FileManager with folder contents
    return (
      <FileManager
        initialPath={fsItem.path}
        folderContents={fsItem.children || []}
        fileSystemItems={fileSystemItems}
      />
    );
  } else {
    // For files: render the appropriate component
    const FileComponent =
      FILE_TYPE_COMPONENTS[fsItem.extension || ''] || DefaultFileViewer;
    return <FileComponent file={fsItem} />;
  }
};

// Updated FileManager props to accept folder contents
interface FileManagerProps {
  initialPath: string;
  folderContents: FileSystemItem[];
  fileSystemItems: FileSystemItem[]; // For navigation context
}

// Your simplified openWindow function
export const createOpenWindowFunction = (
  fileSystemItems: FileSystemItem[],
  windows: WindowMetaData[],
  windowZIndex: number,
  setWindows: React.Dispatch<React.SetStateAction<WindowMetaData[]>>,
  setWindowZIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  return useCallback(
    (itemId: string) => {
      const fsItem = fileSystemItems?.find((i) => i.id === itemId);
      if (!fsItem) return;

      const id = `window-${itemId}`;
      const currWindow = windows.find((window) => window.id === id);

      if (currWindow) {
        // Restore existing window
        setWindows((prev) =>
          prev.map((window) =>
            window.id === id
              ? {
                  ...window,
                  minimized: false,
                  zIndex: windowZIndex + 1,
                  isActive: true,
                }
              : { ...window, isActive: false }
          )
        );
      } else {
        // Create new window
        const newWindow: WindowMetaData = {
          id,
          title: fsItem.name,
          icon: fsItem.icon,
          x: 200 + windows.length * 30,
          y: 100 + windows.length * 30,
          width: fsItem.type === 'folder' ? 800 : 600,
          height: fsItem.type === 'folder' ? 600 : 400,
          zIndex: windowZIndex + 1,
          minimized: false,
          maximized: false,
          windowContent: createWindowContent(fsItem, fileSystemItems),
          isActive: true,
        };

        setWindows((prev) => [
          ...prev.map((window) => ({ ...window, isActive: false })),
          newWindow,
        ]);
      }

      setWindowZIndex(windowZIndex + 1);
    },
    [fileSystemItems, windows, windowZIndex]
  );
};

// Usage example in your component:
export const ExampleUsage = () => {
  const [windows, setWindows] = useState<WindowMetaData[]>([]);
  const [windowZIndex, setWindowZIndex] = useState(1000);

  const openWindow = createOpenWindowFunction(
    mockFileSystem,
    windows,
    windowZIndex,
    setWindows,
    setWindowZIndex
  );

  return (
    <div>
      {/* Your desktop icons */}
      {mockFileSystem.map((item) => (
        <DesktopIcon key={item.id} onDoubleClick={() => openWindow(item.id)}>
          {item.icon}
          {item.name}
        </DesktopIcon>
      ))}
    </div>
  );
};
