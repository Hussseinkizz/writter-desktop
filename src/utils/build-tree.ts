import { readDir, BaseDirectory, DirEntry, stat } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';

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

export async function buildFileTree(
  dir: string,
  baseDir: BaseDirectory = BaseDirectory.AppLocalData
): Promise<FileNode[]> {
  const entries = await readDir(dir, { baseDir });
  return await processEntriesRecursively(dir, entries, baseDir);
}

async function processEntriesRecursively(
  parentPath: string,
  entries: DirEntry[],
  baseDir: BaseDirectory
): Promise<FileNode[]> {
  const nodes: FileNode[] = [];

  for (const entry of entries) {
    const { name, isDirectory } = entry;
    if (!name) continue;

    const fullPath = await join(parentPath, name);

    if (!isDirectory && !name.match(/\.(md|txt)$/)) continue;

    const stats = await stat(fullPath, { baseDir });

    const node: FileNode = {
      name,
      path: fullPath,
      isDir: !!isDirectory,
      size: stats?.size,
      modified: stats?.mtime ? stats.mtime.toISOString() : undefined,
      created: stats?.birthtime ? stats.birthtime.toISOString() : undefined,
      isReadOnly: stats?.readonly,
      extension: name.split('.').pop(),
    };

    if (isDirectory) {
      const childEntries = await readDir(fullPath, { baseDir });
      node.children = await processEntriesRecursively(
        fullPath,
        childEntries,
        baseDir
      );
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
