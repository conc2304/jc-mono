import { FileSystemItem } from '@jc/file-system';

export function nameToSlug(name: string): string {
  const withoutExtension = name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name;
  return withoutExtension.toLowerCase().replace(/\s+/g, '-');
}

export function slugMatchesItem(slug: string, item: FileSystemItem): boolean {
  return nameToSlug(item.name) === slug;
}

export function buildFlatIndex(fileSystem: FileSystemItem[]): Map<string, FileSystemItem> {
  const index = new Map<string, FileSystemItem>();

  function traverse(items: FileSystemItem[]): void {
    for (const item of items) {
      index.set(item.id, item);
      if (item.children && item.children.length > 0) {
        traverse(item.children as FileSystemItem[]);
      }
    }
  }

  traverse(fileSystem);
  return index;
}

export function resolvePathSlugs(slugs: string[], fileSystem: FileSystemItem[]): FileSystemItem[] {
  const resolved: FileSystemItem[] = [];
  let currentLevel: FileSystemItem[] = fileSystem;

  for (const slug of slugs) {
    const match = currentLevel.find((item) => slugMatchesItem(slug, item));
    if (!match) break;
    resolved.push(match);
    currentLevel = (match.children as FileSystemItem[] | undefined) ?? [];
  }

  return resolved;
}

export function itemToPathSlugs(item: FileSystemItem, fileSystem: FileSystemItem[]): string[] {
  const index = buildFlatIndex(fileSystem);
  const chain: FileSystemItem[] = [];

  let current: FileSystemItem | undefined = item;
  while (current) {
    chain.unshift(current);
    const parentId = current.parentId;
    current = parentId ? index.get(parentId) : undefined;
  }

  return chain.map((i) => nameToSlug(i.name));
}
