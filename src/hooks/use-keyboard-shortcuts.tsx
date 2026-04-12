import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';

type ShortcutHandlers = {
  onSave: () => void;
  onTogglePreview: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onShowShortcuts: () => void;
};

export function useKeyboardShortcuts({
  onSave,
  onTogglePreview,
  onNewFile,
  onNewFolder,
  onShowShortcuts,
}: ShortcutHandlers) {
  useEffect(() => {
    // Allow hotkeys to fire even when the Ace editor textarea is focused
    hotkeys.filter = () => true;

    hotkeys('ctrl+s,command+s', (e) => {
      e.preventDefault();
      onSave();
    });

    hotkeys('ctrl+p,command+p', (e) => {
      e.preventDefault();
      onTogglePreview();
    });

    hotkeys('ctrl+n,command+n', (e) => {
      e.preventDefault();
      onNewFile();
    });

    hotkeys('ctrl+shift+n', (e) => {
      e.preventDefault();
      onNewFolder();
    });

    hotkeys('ctrl+shift+?,ctrl+shift+/', (e) => {
      e.preventDefault();
      onShowShortcuts();
    });

    return () => {
      hotkeys.unbind('ctrl+s,command+s');
      hotkeys.unbind('ctrl+p,command+p');
      hotkeys.unbind('ctrl+n,command+n');
      hotkeys.unbind('ctrl+shift+n');
      hotkeys.unbind('ctrl+shift+?,ctrl+shift+/');
    };
  }, [onSave, onTogglePreview, onNewFile, onNewFolder, onShowShortcuts]);
}
