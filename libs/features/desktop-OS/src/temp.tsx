// @ts-expect-error  this is a temp file

import React, { useState, useRef, createContext, useContext } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Divider,
  Collapse,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  Code,
  Settings,
  Home,
  Download,
  Star,
  ChevronRight,
  ChevronDown,
  Grid3x3,
  List as ListIcon,
  LayoutGrid,
  ArrowUpDown,
  Filter,
  GripVertical,
  Info,
} from 'lucide-react';

// Types for the file system
interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  dateModified: Date;
  dateCreated: Date;
  extension?: string;
  mimeType?: string;
  path: string;
  parentId?: string;
  children?: FileSystemItem[];
  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
  metadata: {
    description?: string;
    tags: string[];
    favorite: boolean;
    thumbnail?: string;
    customProperties?: Record<string, any>;
  };
}

interface QuickAccessItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  type: 'folder' | 'application';
  category?: string;
}

type ViewMode = 'list' | 'details' | 'large-icons' | 'small-icons';
type SortBy = 'name' | 'date' | 'size' | 'type';
type SortOrder = 'asc' | 'desc';

// Context for file system operations
const FileSystemContext = createContext<{
  items: FileSystemItem[];
  currentPath: string;
  selectedItems: string[];
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;
  navigateToPath: (path: string) => void;
  selectItem: (id: string, multi?: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setSorting: (sortBy: SortBy, order: SortOrder) => void;
  moveItems: (itemIds: string[], targetPath: string) => void;
  draggedItems: string[];
  setDraggedItems: (items: string[]) => void;
} | null>(null);

// Mock data
const mockFileSystem: FileSystemItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    dateModified: new Date('2024-01-15'),
    dateCreated: new Date('2024-01-01'),
    path: '/Documents',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: [], favorite: true },
    children: [
      {
        id: '2',
        name: 'Resume.pdf',
        type: 'file',
        size: 245760,
        extension: 'pdf',
        mimeType: 'application/pdf',
        dateModified: new Date('2024-01-10'),
        dateCreated: new Date('2024-01-10'),
        path: '/Documents/Resume.pdf',
        parentId: '1',
        permissions: { read: true, write: true, execute: false },
        metadata: {
          tags: ['work', 'important'],
          favorite: true,
          description: 'Professional resume',
        },
      },
    ],
  },
  {
    id: '3',
    name: 'Pictures',
    type: 'folder',
    dateModified: new Date('2024-01-20'),
    dateCreated: new Date('2024-01-01'),
    path: '/Pictures',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: [], favorite: false },
    children: [],
  },
  {
    id: '4',
    name: 'Projects',
    type: 'folder',
    dateModified: new Date('2024-01-25'),
    dateCreated: new Date('2024-01-01'),
    path: '/Projects',
    permissions: { read: true, write: true, execute: true },
    metadata: { tags: ['development'], favorite: true },
    children: [],
  },
];

const quickAccessItems: QuickAccessItem[] = [
  {
    id: 'home',
    name: 'Home',
    icon: <Home size={16} />,
    path: '/',
    type: 'folder',
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: <FileText size={16} />,
    path: '/Documents',
    type: 'folder',
  },
  {
    id: 'pictures',
    name: 'Pictures',
    icon: <Image size={16} />,
    path: '/Pictures',
    type: 'folder',
  },
  {
    id: 'downloads',
    name: 'Downloads',
    icon: <Download size={16} />,
    path: '/Downloads',
    type: 'folder',
  },
  {
    id: 'favorites',
    name: 'Favorites',
    icon: <Star size={16} />,
    path: '/Favorites',
    type: 'folder',
  },
];

// File icon component
const FileIcon = ({
  item,
  size = 24,
}: {
  item: FileSystemItem;
  size?: number;
}) => {
  if (item.type === 'folder') {
    return <Folder size={size} color="#FFA726" />;
  }

  const iconMap: Record<string, React.ReactNode> = {
    pdf: <FileText size={size} color="#F44336" />,
    doc: <FileText size={size} color="#1976D2" />,
    docx: <FileText size={size} color="#1976D2" />,
    jpg: <Image size={size} color="#4CAF50" />,
    jpeg: <Image size={size} color="#4CAF50" />,
    png: <Image size={size} color="#4CAF50" />,
    mp3: <Music size={size} color="#9C27B0" />,
    mp4: <Video size={size} color="#FF5722" />,
    zip: <Archive size={size} color="#795548" />,
    js: <Code size={size} color="#FFC107" />,
    ts: <Code size={size} color="#2196F3" />,
    jsx: <Code size={size} color="#61DAFB" />,
    tsx: <Code size={size} color="#61DAFB" />,
  };

  return (
    iconMap[item.extension || ''] || <FileText size={size} color="#757575" />
  );
};

// Quick Access Panel
const QuickAccessPanel = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const context = useContext(FileSystemContext);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'folders',
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Box
      sx={{
        width: collapsed ? 48 : 250,
        height: '100%',
        borderRight: 1,
        borderColor: 'divider',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton onClick={onToggle} size="small">
          {collapsed ? <ChevronRight /> : <ChevronDown />}
        </IconButton>
        {!collapsed && (
          <Typography variant="subtitle2" component="span" sx={{ ml: 1 }}>
            Quick Access
          </Typography>
        )}
      </Box>

      {!collapsed && (
        <List dense>
          <ListItem button onClick={() => toggleCategory('folders')}>
            <ListItemIcon>
              {expandedCategories.includes('folders') ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </ListItemIcon>
            <ListItemText primary="Folders" />
          </ListItem>

          <Collapse in={expandedCategories.includes('folders')}>
            {quickAccessItems.map((item) => (
              <ListItem
                key={item.id}
                button
                sx={{ pl: 4 }}
                onClick={() => context?.navigateToPath(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </Collapse>
        </List>
      )}
    </Box>
  );
};

// Breadcrumb Navigation
const BreadcrumbNavigation = () => {
  const context = useContext(FileSystemContext);

  const pathSegments = context?.currentPath.split('/').filter(Boolean) || [];
  const segments = ['Home', ...pathSegments];

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Breadcrumbs separator={<ChevronRight size={16} />}>
        <Link
          component="button"
          variant="body2"
          onClick={() => context?.navigateToPath('/')}
          sx={{ textDecoration: 'none' }}
        >
          Home
        </Link>
        {pathSegments.map((segment, index) => {
          const path = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;

          return isLast ? (
            <Typography key={path} color="text.primary" variant="body2">
              {segment}
            </Typography>
          ) : (
            <Link
              key={path}
              component="button"
              variant="body2"
              onClick={() => context?.navigateToPath(path)}
              sx={{ textDecoration: 'none' }}
            >
              {segment}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

// View Controls
const ViewControls = () => {
  const context = useContext(FileSystemContext);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const viewModeIcons = {
    list: <ListIcon size={16} />,
    details: <LayoutGrid size={16} />,
    'large-icons': <Grid3x3 size={16} />,
    'small-icons': <Grid3x3 size={16} />,
  };

  return (
    <Box
      sx={{
        p: 1,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        gap: 1,
        alignItems: 'center',
      }}
    >
      <ButtonGroup size="small">
        {Object.entries(viewModeIcons).map(([mode, icon]) => (
          <IconButton
            key={mode}
            size="small"
            color={context?.viewMode === mode ? 'primary' : 'default'}
            onClick={() => context?.setViewMode(mode as ViewMode)}
          >
            {icon}
          </IconButton>
        ))}
      </ButtonGroup>

      <Divider orientation="vertical" flexItem />

      <IconButton
        size="small"
        onClick={(e) => setSortMenuAnchor(e.currentTarget)}
      >
        <ArrowUpDown size={16} />
      </IconButton>

      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        {(['name', 'date', 'size', 'type'] as SortBy[]).map((sortBy) => (
          <MenuItem
            key={sortBy}
            onClick={() => {
              context?.setSorting(sortBy, context.sortOrder);
              setSortMenuAnchor(null);
            }}
          >
            {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            context?.setSorting(
              context.sortBy,
              context.sortOrder === 'asc' ? 'desc' : 'asc'
            );
            setSortMenuAnchor(null);
          }}
        >
          {context?.sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </MenuItem>
      </Menu>
    </Box>
  );
};

// File List Views
const FileListView = ({ items }: { items: FileSystemItem[] }) => {
  const context = useContext(FileSystemContext);

  const handleItemClick = (item: FileSystemItem, event: React.MouseEvent) => {
    event.preventDefault();

    if (event.ctrlKey || event.metaKey) {
      context?.selectItem(item.id, true);
    } else {
      context?.selectItem(item.id, false);
      if (item.type === 'folder') {
        context?.navigateToPath(item.path);
      }
    }
  };

  const handleDragStart = (item: FileSystemItem) => {
    context?.setDraggedItems([item.id]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetItem: FileSystemItem, e: React.DragEvent) => {
    e.preventDefault();
    if (targetItem.type === 'folder' && context?.draggedItems) {
      context.moveItems(context.draggedItems, targetItem.path);
    }
  };

  if (context?.viewMode === 'details') {
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date Modified</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              hover
              selected={context?.selectedItems.includes(item.id)}
              onClick={(e) => handleItemClick(item, e)}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(item, e)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileIcon item={item} size={16} />
                  {item.name}
                  {item.metadata.favorite && <Star size={12} color="gold" />}
                </Box>
              </TableCell>
              <TableCell>{item.dateModified.toLocaleDateString()}</TableCell>
              <TableCell>
                {item.size ? `${Math.round(item.size / 1024)} KB` : '-'}
              </TableCell>
              <TableCell>
                {item.type === 'folder'
                  ? 'Folder'
                  : item.extension?.toUpperCase() || 'File'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (context?.viewMode === 'large-icons') {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        {items.map((item) => (
          <Grid item key={item.id}>
            <Card
              sx={{
                width: 120,
                cursor: 'pointer',
                border: context?.selectedItems.includes(item.id) ? 2 : 0,
                borderColor: 'primary.main',
              }}
              onClick={(e) => handleItemClick(item, e)}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(item, e)}
            >
              <CardContent sx={{ textAlign: 'center', p: 1 }}>
                <FileIcon item={item} size={48} />
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, wordBreak: 'break-word' }}
                >
                  {item.name}
                </Typography>
                {item.metadata.favorite && (
                  <Star size={12} color="gold" style={{ marginTop: 4 }} />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // List and small-icons view
  return (
    <List>
      {items.map((item) => (
        <ListItem
          key={item.id}
          button
          selected={context?.selectedItems.includes(item.id)}
          onClick={(e) => handleItemClick(item, e)}
          draggable
          onDragStart={() => handleDragStart(item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(item, e)}
          secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.metadata.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
              {item.metadata.favorite && <Star size={16} color="gold" />}
            </Box>
          }
        >
          <ListItemIcon>
            <FileIcon item={item} />
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            secondary={`Modified: ${item.dateModified.toLocaleDateString()}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

// Preview Panel
const PreviewPanel = () => {
  const context = useContext(FileSystemContext);
  const selectedItem =
    context?.selectedItems.length === 1
      ? mockFileSystem.find((item) => item.id === context.selectedItems[0])
      : null;

  if (!selectedItem) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Info size={48} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Select an item to preview
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <FileIcon item={selectedItem} size={64} />
      </Box>

      <Typography variant="h6" gutterBottom>
        {selectedItem.name}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Properties
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Type:
          </Typography>
          <Typography variant="body2">{selectedItem.type}</Typography>
        </Box>

        {selectedItem.size && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Size:
            </Typography>
            <Typography variant="body2">
              {Math.round(selectedItem.size / 1024)} KB
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Modified:
          </Typography>
          <Typography variant="body2">
            {selectedItem.dateModified.toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Created:
          </Typography>
          <Typography variant="body2">
            {selectedItem.dateCreated.toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {selectedItem.metadata.description && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2">
            {selectedItem.metadata.description}
          </Typography>
        </>
      )}

      {selectedItem.metadata.tags.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedItem.metadata.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

// Main File Manager Component
const FileManager = () => {
  const [quickAccessCollapsed, setQuickAccessCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [draggedItems, setDraggedItems] = useState<string[]>([]);

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setSelectedItems([]);
  };

  const selectItem = (id: string, multi = false) => {
    if (multi) {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedItems([id]);
    }
  };

  const setSorting = (newSortBy: SortBy, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const moveItems = (itemIds: string[], targetPath: string) => {
    console.log('Moving items:', itemIds, 'to:', targetPath);
    // Implementation would update the file system state
    setDraggedItems([]);
  };

  // Get current directory items
  const getCurrentItems = () => {
    // Filter items based on current path and sort them
    const items = mockFileSystem.filter((item) => {
      if (currentPath === '/') {
        return !item.parentId; // Root level items
      }
      return item.path.startsWith(currentPath) && item.path !== currentPath;
    });

    // Sort items
    items.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.dateModified.getTime() - b.dateModified.getTime();
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  };

  const contextValue = {
    items: getCurrentItems(),
    currentPath,
    selectedItems,
    viewMode,
    sortBy,
    sortOrder,
    navigateToPath,
    selectItem,
    setViewMode,
    setSorting,
    moveItems,
    draggedItems,
    setDraggedItems,
  };

  return (
    <FileSystemContext.Provider value={contextValue}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <BreadcrumbNavigation />
        <ViewControls />

        <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <QuickAccessPanel
            collapsed={quickAccessCollapsed}
            onToggle={() => setQuickAccessCollapsed(!quickAccessCollapsed)}
          />

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <FileListView items={getCurrentItems()} />
          </Box>

          <Box
            sx={{
              width: 300,
              borderLeft: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
            >
              Preview
            </Typography>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <PreviewPanel />
            </Box>
          </Box>
        </Box>
      </Box>
    </FileSystemContext.Provider>
  );
};

export default FileManager;
