import { useEffect, useRef, useState } from 'react';
import { load, Store } from '@tauri-apps/plugin-store';

type Settings = {
  lastProjectDir: string | null;
  autoSave: boolean;
};

export function useSettings() {
  const storeRef = useRef<Store | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [lastProjectDir, setLastProjectDirState] = useState<string | null>(
    null
  );
  const [autoSave, setAutoSaveState] = useState<boolean>(false);

  // Load store on mount
  useEffect(() => {
    (async () => {
      const store = await load('.settings.dat', {
        autoSave: true,
      });
      storeRef.current = store;

      const savedDir = await store.get<string>('lastProjectDir');
      const savedAutoSave = await store.get<boolean>('autoSave');

      if (savedDir && savedAutoSave) {
        setLastProjectDirState(savedDir);
        setAutoSaveState(savedAutoSave);
      }
      setLoaded(true);
    })();
  }, []);

  const setLastProjectDir = async (dir: string) => {
    setLastProjectDirState(dir);
    if (storeRef.current) {
      await storeRef.current.set('lastProjectDir', dir);
      await storeRef.current.save();
    }
  };

  const setAutoSave = async (value: boolean) => {
    setAutoSaveState(value);
    if (storeRef.current) {
      await storeRef.current.set('autoSave', value);
      await storeRef.current.save();
    }
  };

  return {
    loaded,
    lastProjectDir,
    autoSave,
    setLastProjectDir,
    setAutoSave,
  };
}
