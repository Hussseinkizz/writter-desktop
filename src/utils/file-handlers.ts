import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

/**
 * Opens a file picker and reads the content.
 */
export async function handleOpen(): Promise<string | null> {
  const selected = await open({
    multiple: false,
    filters: [{ name: 'Text', extensions: ['md', 'txt'] }],
  });

  if (!selected || typeof selected !== 'string') return null;

  const content = await invoke<string>('open_file', { path: selected });
  return content;
}

/**
 * Prompts user to save markdown/text content to a file via dialog.
 */
export async function handleSave(content: string): Promise<void> {
  const filePath = await save({
    filters: [{ name: 'note', extensions: ['md', 'txt'] }],
  });

  if (filePath) {
    await invoke('save_file', {
      path: filePath,
      content,
    });
  }
}

/**
 * Saves content to the specified file path.
 */
export async function saveToFile(path: string, content: string): Promise<void> {
  await invoke('save_file', { path, content });
}

/**
 * Gets the content of the specified file path.
 */
export async function getFileContent(path: string): Promise<string | null> {
  try {
    const content = await invoke<string>('open_file', { path });
    return content;
  } catch {
    return null;
  }
}

/**
 * Deletes the file at the specified path.
 */
export async function deleteFile(path: string): Promise<void> {
  await invoke('delete_file', { path });
}

/**
 * Renames or moves a file from oldPath to newPath.
 */
export async function renameFile(
  oldPath: string,
  newPath: string
): Promise<void> {
  await invoke('rename_file', { oldPath, newPath });
}

/**
 * Moves a file from one directory to another.
 * Equivalent to renameFile, but with clearer intent.
 */
export async function moveFile(
  fromPath: string,
  toPath: string
): Promise<void> {
  await renameFile(fromPath, toPath);
}

/**
 * Creates a new file at the specified path.
 * If content is provided, it will be written to the file.
 */
export async function createFile(path: string, content = ''): Promise<void> {
  await invoke('create_file', { path, content });
}
