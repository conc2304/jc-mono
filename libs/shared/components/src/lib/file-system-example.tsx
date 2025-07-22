// Example implementations

import { ComponentType, ReactNode } from 'react';
import { FileData, FileSystemItem } from './types';

// 1. Image file data
interface ImageFileData extends FileData {
  content: string;
  imgUrl: string;
  altText?: string;
}

interface ImageRendererProps {
  dense: boolean;
  showAltText?: boolean;
}

const ImageComponent: ComponentType<ImageFileData & ImageRendererProps> = ({
  id,
  fileName,
  content,
  imgUrl,
  altText,
  dense,
  showAltText = false,
}) => (
  <div className={dense ? 'dense' : 'regular'}>
    <h1>{fileName}</h1>
    <img src={imgUrl} alt={altText || fileName} />
    <p>{content}</p>
    {showAltText && altText && <small>{altText}</small>}
  </div>
);

// 2. Document file data
interface DocumentFileData extends FileData {
  content: string;
  wordCount: number;
  lastEditedBy: string;
}

interface DocumentRendererProps {
  showMetadata: boolean;
  maxLength?: number;
}

const DocumentComponent: ComponentType<
  DocumentFileData & DocumentRendererProps
> = ({
  fileName,
  content,
  wordCount,
  lastEditedBy,
  showMetadata,
  maxLength,
}) => (
  <div>
    <h2>{fileName}</h2>
    <p>{maxLength ? content.slice(0, maxLength) + '...' : content}</p>
    {showMetadata && (
      <div className="metadata">
        <span>Words: {wordCount}</span>
        <span>Last edited by: {lastEditedBy}</span>
      </div>
    )}
  </div>
);

// Usage examples
const imageFile: FileSystemItem<ImageFileData, ImageRendererProps> = {
  id: 'img-1',
  name: 'vacation-photo.jpg',
  type: 'file',
  icon: <span>📷</span>,
  // ... other base properties
  dateModified: new Date(),
  dateCreated: new Date(),
  path: '/photos/vacation-photo.jpg',
  permissions: { read: true, write: true, execute: false },
  metadata: { tags: [], favorite: false },

  fileData: {
    id: 'img-1',
    fileName: 'vacation-photo.jpg',
    content: 'A beautiful sunset from our vacation',
    imgUrl: '/images/vacation-photo.jpg',
    altText: 'Sunset over mountains',
  },

  renderer: {
    component: ImageComponent,
    props: {
      dense: false,
      showAltText: true,
    },
  },
};

const documentFile: FileSystemItem<DocumentFileData, DocumentRendererProps> = {
  id: 'doc-1',
  name: 'meeting-notes.md',
  type: 'file',
  icon: <span>📄</span>,
  // ... other base properties
  dateModified: new Date(),
  dateCreated: new Date(),
  path: '/documents/meeting-notes.md',
  permissions: { read: true, write: true, execute: false },
  metadata: { tags: ['meeting', 'notes'], favorite: true },

  fileData: {
    id: 'doc-1',
    fileName: 'meeting-notes.md',
    content: "Meeting notes from today's standup...",
    wordCount: 150,
    lastEditedBy: 'john.doe@example.com',
  },

  renderer: {
    component: DocumentComponent,
    props: {
      showMetadata: true,
      maxLength: 200,
    },
  },
};

// Regular folder (no data or renderer)
const folder: FileSystemItem = {
  id: 'folder-1',
  name: 'Documents',
  type: 'folder',
  icon: <span>📁</span>,
  dateModified: new Date(),
  dateCreated: new Date(),
  path: '/Documents',
  permissions: { read: true, write: true, execute: true },
  metadata: { tags: [], favorite: false },
  children: [documentFile],
};
