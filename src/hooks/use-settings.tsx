import { useEffect, useRef, useState } from 'react';
import { load, Store } from '@tauri-apps/plugin-store';

type Settings = {
  lastProjectDir: string | null;
  autoSave: boolean;
  autoSaveInterval: number; // in milliseconds
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  fontFamily: string;
  wordWrap: boolean;
  showLineNumbers: boolean;
  tabSize: number;
  enableVimMode: boolean;
  enableSpellCheck: boolean;
  previewPosition: 'right' | 'bottom' | 'hidden';
  showWordCount: boolean;
  maxRecentFiles: number;
};

const defaultSettings: Settings = {
  lastProjectDir: null,
  autoSave: true,
  autoSaveInterval: 5000, // 5 seconds
  theme: 'dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
  wordWrap: true,
  showLineNumbers: false,
  tabSize: 2,
  enableVimMode: false,
  enableSpellCheck: false,
  previewPosition: 'right',
  showWordCount: true,
  maxRecentFiles: 10,
};

export function useSettings() {
  const storeRef = useRef<Store | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);

  // Load store on mount
  useEffect(() => {
    (async () => {
      const store = await load('.settings.dat', {
        autoSave: true,
      });
      storeRef.current = store;

      // Load all settings with defaults
      const savedSettings: Partial<Settings> = {};
      for (const [key, defaultValue] of Object.entries(defaultSettings)) {
        const savedValue = await store.get<any>(key);
        savedSettings[key as keyof Settings] = savedValue !== null ? savedValue : defaultValue;
      }

      setSettingsState({ ...defaultSettings, ...savedSettings });
      setLoaded(true);
    })();
  }, []);

  const updateSetting = async <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): Promise<void> => {
    setSettingsState(prev => ({ ...prev, [key]: value }));
    if (storeRef.current) {
      await storeRef.current.set(key, value);
      await storeRef.current.save();
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>): Promise<void> => {
    setSettingsState(prev => ({ ...prev, ...newSettings }));
    if (storeRef.current) {
      for (const [key, value] of Object.entries(newSettings)) {
        await storeRef.current.set(key, value);
      }
      await storeRef.current.save();
    }
  };

  const resetSettings = async (): Promise<void> => {
    setSettingsState(defaultSettings);
    if (storeRef.current) {
      for (const [key, value] of Object.entries(defaultSettings)) {
        await storeRef.current.set(key, value);
      }
      await storeRef.current.save();
    }
  };

  // Backward compatibility getters
  const lastProjectDir = settings.lastProjectDir;
  const autoSave = settings.autoSave;

  // Backward compatibility setters
  const setLastProjectDir = (dir: string) => updateSetting('lastProjectDir', dir);
  const setAutoSave = (value: boolean) => updateSetting('autoSave', value);

  return {
    loaded,
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    // Backward compatibility
    lastProjectDir,
    autoSave,
    setLastProjectDir,
    setAutoSave,
  };
}
