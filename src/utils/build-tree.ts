import { invoke } from '@tauri-apps/api/core';

export type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  size?: number;
  modified?: string;
  created?: string;
  extension?: string;
  isReadOnly?: boolean;
  children?: FileNode[];
};

export interface DirectoryEntry {
  name: string;
  path: string;
  is_dir: boolean;
  size?: number;
}

export async function buildFileTree(dir: string): Promise<FileNode[]> {
  try {
    const entries = await invoke<DirectoryEntry[]>('read_directory', { path: dir });
    return await processEntriesRecursively(entries);
  } catch (error) {
    console.error('Failed to read directory:', error);
    return [];
  }
}

async function processEntriesRecursively(
  entries: DirectoryEntry[]
): Promise<FileNode[]> {
  const nodes: FileNode[] = [];

  for (const entry of entries) {
    const { name, path, is_dir, size } = entry;
    if (!name) continue;

    // For files, only include markdown and text files
    if (!is_dir && !name.match(/\.(md|txt)$/)) continue;

    const node: FileNode = {
      name,
      path,
      isDir: is_dir,
      size,
      extension: name.split('.').pop(),
    };

    if (is_dir) {
      try {
        const childEntries = await invoke<DirectoryEntry[]>('read_directory', { path });
        node.children = await processEntriesRecursively(childEntries);
      } catch (error) {
        console.warn(`Failed to read directory ${path}:`, error);
        node.children = [];
      }
    }

    nodes.push(node);
  }

  // folders first then files
  nodes.sort((a, b) => {
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.name.localeCompare(b.name);
  });

  return nodes;
}
