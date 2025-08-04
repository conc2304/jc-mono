import { FileSystemItem } from '@jc/ui-components';

export function setFileSystemHierarchy<T = any, P = any>(
  items: FileSystemItem<T, P>[],
  parentPath: string = '',
  parentId: string | null = null
): FileSystemItem<T, P>[] {
  return items.map((item) => {
    // Calculate the new path for this item
    const newPath = parentPath ? `${parentPath}/${item.name}` : `/${item.name}`;

    // Create the updated item with new path and parentId
    const updatedItem: FileSystemItem<T, P> = {
      ...item,
      path: newPath,
      parentId: parentId,
    };

    // If this item has children, recursively update them
    if (item.children && item.children.length > 0) {
      updatedItem.children = setFileSystemHierarchy(
        item.children,
        newPath,
        item.id
      );
    }

    return updatedItem;
  });
}
