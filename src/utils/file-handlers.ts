import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

/**
 * Opens a file picker and reads the content
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
 * Prompts user to save markdown content to file
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
