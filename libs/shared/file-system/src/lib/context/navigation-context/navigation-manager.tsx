import { ReactNode } from 'react';

import { FileSystemItem, NavigationContext } from '../../types';
import {
  getFileSystemItemByIdRecursive,
  searchFileSystemRecursive,
} from '../../utils';

// Navigation group configuration
export interface NavigationGroup {
  id: string;
  name: string;
  filter: (item: FileSystemItem) => boolean;
  sortBy?: (a: FileSystemItem, b: FileSystemItem) => number;
  metadata?: Record<string, any>;
}

// Navigation configuration at the file system level
export class FileSystemNavigationManager {
  private navigationGroups: Map<string, NavigationGroup> = new Map();
  private fileSystemItems: FileSystemItem[] = [];

  constructor(items: FileSystemItem[]) {
    this.fileSystemItems = items;
  }

  // Register a navigation group
  registerNavigationGroup(group: NavigationGroup): void {
    this.navigationGroups.set(group.id, group);
  }

  // Get all items in a navigation group
  getNavigationGroupItems(groupId: string): FileSystemItem[] {
    const group = this.navigationGroups.get(groupId);
    if (!group) return [];

    const items = searchFileSystemRecursive(
      this.fileSystemItems,
      (item) =>
        item.renderer?.navigationGroup === groupId &&
        item.renderer?.shouldNavigate !== false &&
        group.filter(item)
    );
    // const items = this.fileSystemItems.filter(
    //   (item) =>
    //     item.renderer?.navigationGroup === groupId &&
    //     item.renderer?.shouldNavigate !== false &&
    //     group.filter(item)
    // );

    // Apply custom sorting if defined
    if (group.sortBy) {
      items.sort(group.sortBy);
    }

    return items;
  }

  // Get navigation context for a specific item
  getNavigationContext(
    itemId: string,
    windowId: string,
    replaceWindowContent: (
      windowId: string,
      content: ReactNode,
      title: string,
      icon: ReactNode,
      options?: any
    ) => void
  ): NavigationContext {
    const currentItem = getFileSystemItemByIdRecursive(
      itemId,
      this.fileSystemItems
    );
    if (!currentItem?.renderer?.navigationGroup) {
      return {};
    }

    const groupItems = this.getNavigationGroupItems(
      currentItem.renderer.navigationGroup
    );
    const currentIndex = groupItems.findIndex((item) => item.id === itemId);

    if (currentIndex === -1) {
      return {};
    }

    const navigateToItem = (targetIndex: number) => {
      // Handle wrap-around logic
      let wrappedIndex = targetIndex;

      if (targetIndex >= groupItems.length) {
        // Wrap to beginning
        wrappedIndex = 0;
      } else if (targetIndex < 0) {
        // Wrap to end
        wrappedIndex = groupItems.length - 1;
      }

      const targetItem = groupItems[wrappedIndex];
      const content = this.renderNavigableFile(
        targetItem,
        windowId,
        replaceWindowContent
      );

      if (content) {
        replaceWindowContent(
          windowId,
          content,
          targetItem.name,
          targetItem.icon,
          {
            addToHistory: true,
            metadata: {
              navigationGroup: currentItem.renderer?.navigationGroup,
              itemId: targetItem.id,
              itemIndex: wrappedIndex,
              type: 'navigation',
            },
          }
        );
      }
    };

    return {
      onNext: () => navigateToItem(currentIndex + 1),
      onPrevious: () => navigateToItem(currentIndex - 1),
      onSelectItem: (id: string) => {
        const targetIndex = groupItems.findIndex((item) => item.id === id);
        if (targetIndex !== -1) {
          navigateToItem(targetIndex);
        }
      },
      navigationInfo: {
        currentIndex,
        totalItems: groupItems.length,
        items: groupItems.map((item) => ({ id: item.id, name: item.name })),
        hasNext: true,
        hasPrevious: true,
      },
    };
  }

  // Render a navigable file with its navigation context
  renderNavigableFile(
    item: FileSystemItem,
    windowId: string,
    replaceWindowContent: (
      windowId: string,
      content: ReactNode,
      title: string,
      icon: ReactNode,
      options?: any
    ) => void
  ): ReactNode {
    if (!item.fileData || !item.renderer) {
      return null;
    }

    const { component: Component, props = {} } = item.renderer;
    const navigationContext = this.getNavigationContext(
      item.id,
      windowId,
      replaceWindowContent
    );

    return (
      <Component
        {...item.fileData}
        {...(props as any)}
        {...navigationContext}
      />
    );
  }

  // Update the file system items
  updateFileSystemItems(items: FileSystemItem[]): void {
    this.fileSystemItems = items;
  }
}

// Utility function to create navigation groups
export const createNavigationGroup = (
  id: string,
  name: string,
  filter: (item: FileSystemItem) => boolean,
  options?: {
    sortBy?: (a: FileSystemItem, b: FileSystemItem) => number;
    metadata?: Record<string, any>;
  }
): NavigationGroup => ({
  id,
  name,
  filter,
  sortBy: options?.sortBy,
  metadata: options?.metadata,
});

// // Pre-defined navigation groups
// export const PROJECT_NAVIGATION_GROUP = createNavigationGroup(
//   'projects',
//   'Portfolio Projects',
//   (item) => item.name.endsWith('.proj') && item.type === 'file',
//   {
//     sortBy: (a, b) => {
//       // Sort by favorite first, then by date modified
//       const aFavorite = a.metadata.favorite ? 1 : 0;
//       const bFavorite = b.metadata.favorite ? 1 : 0;

//       if (aFavorite !== bFavorite) {
//         return bFavorite - aFavorite; // Favorites first
//       }

//       return b.dateModified.getTime() - a.dateModified.getTime(); // Newest first
//     },
//   }
// );

// // Hook to use navigation manager in components
// export const useFileSystemNavigation = (
//   items: FileSystemItem[],
//   navigationGroups?: NavigationGroup[]
// ) => {
//   const manager = new FileSystemNavigationManager(items);

//   // Register default navigation groups
//   manager.registerNavigationGroup(PROJECT_NAVIGATION_GROUP);

//   // Register custom navigation groups
//   navigationGroups?.forEach((group) => {
//     manager.registerNavigationGroup(group);
//   });

//   return manager;
// };
