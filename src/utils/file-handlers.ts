import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { pluginManager } from '@/plugins/plugin-manager';

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
 * Saves content to the specified file path with plugin processing.
 */
export async function saveToFile(path: string, content: string, projectDir?: string): Promise<void> {
  let processedContent = content;
  
  // Apply plugin transformations on save
  if (projectDir) {
    const result = await pluginManager.executeOnSave(content, path, projectDir);
    if (result.success) {
      processedContent = result.content;
    } else {
      console.warn('Plugin processing failed during save:', result.error);
      // Continue with original content if plugin fails
    }
  }
  
  await invoke('save_file', { path, content: processedContent });
}

/**
 * Gets the content of the specified file path with plugin processing.
 */
export async function getFileContent(path: string, projectDir?: string): Promise<string | null> {
  try {
    const content = await invoke<string>('open_file', { path });
    
    // Apply plugin transformations on load
    if (content && projectDir) {
      const result = await pluginManager.executeOnLoad(content, path, projectDir);
      if (result.success) {
        return result.content;
      } else {
        console.warn('Plugin processing failed during load:', result.error);
        // Return original content if plugin fails
        return content;
      }
    }
    
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
 * Creates a new file at the specified path with plugin processing.
 * If content is provided, it will be written to the file.
 */
export async function createFile(path: string, content = '', projectDir?: string): Promise<void> {
  let processedContent = content;
  
  // Apply plugin transformations on save for new files
  if (projectDir && content) {
    const result = await pluginManager.executeOnSave(content, path, projectDir);
    if (result.success) {
      processedContent = result.content;
    } else {
      console.warn('Plugin processing failed during file creation:', result.error);
      // Continue with original content if plugin fails
    }
  }
  
  await invoke('create_file', { path, content: processedContent });
}

/**
 * Creates a new folder at the specified path.
 */
export async function createFolder(path: string): Promise<void> {
  await invoke('create_folder', { path });
}

/**
 * Reads the contents of a directory and returns the entries.
 */
export async function readDirectory(path: string): Promise<DirectoryEntry[]> {
  return await invoke<DirectoryEntry[]>('read_directory', { path });
}

export interface DirectoryEntry {
  name: string;
  path: string;
  is_dir: boolean;
  size?: number;
}
