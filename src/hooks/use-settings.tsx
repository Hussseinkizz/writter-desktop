import { useEffect, useRef, useState } from 'react';
import { load, Store } from '@tauri-apps/plugin-store';
import { Settings, settingsSchema, validateSettings } from '../lib/validation';
import { toast } from 'sonner';

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
  musicPlayer: {
    volume: 50,
    autoplay: false,
    loop: true,
    fadeInOut: true,
    customTracks: [],
    musicSource: 'streaming',
    localMusicDirectory: undefined
  }
};

export function useSettings() {
  const storeRef = useRef<Store | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);

  // Load store on mount
  useEffect(() => {
    (async () => {
      try {
        const store = await load('.settings.dat', {
          autoSave: true,
        });
        storeRef.current = store;

        // Load all settings with validation
        const savedSettings: Record<string, any> = {};
        for (const [key] of Object.entries(defaultSettings)) {
          const savedValue = await store.get<any>(key);
          if (savedValue !== null) {
            savedSettings[key] = savedValue;
          }
        }

        // Validate and merge with defaults
        const validationResult = validateSettings({ ...defaultSettings, ...savedSettings });
        if (validationResult.isValid && validationResult.data) {
          setSettingsState(validationResult.data);
        } else {
          console.warn('Invalid settings detected, using defaults:', validationResult.error);
          toast.error('Settings validation failed, using defaults');
          setSettingsState(defaultSettings);
        }

        setLoaded(true);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
        setSettingsState(defaultSettings);
        setLoaded(true);
      }
    })();
  }, []);

  const updateSetting = async <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): Promise<void> => {
    try {
      const newSettings = { ...settings, [key]: value };
      const validationResult = validateSettings(newSettings);
      
      if (!validationResult.isValid) {
        toast.error(`Invalid setting value: ${validationResult.error}`);
        return;
      }

      setSettingsState(validationResult.data!);
      if (storeRef.current) {
        await storeRef.current.set(key, value);
        await storeRef.current.save();
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
      toast.error('Failed to save setting');
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>): Promise<void> => {
    try {
      const mergedSettings = { ...settings, ...newSettings };
      const validationResult = validateSettings(mergedSettings);
      
      if (!validationResult.isValid) {
        toast.error(`Invalid settings: ${validationResult.error}`);
        return;
      }

      setSettingsState(validationResult.data!);
      if (storeRef.current) {
        for (const [key, value] of Object.entries(newSettings)) {
          await storeRef.current.set(key, value);
        }
        await storeRef.current.save();
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const resetSettings = async (): Promise<void> => {
    try {
      setSettingsState(defaultSettings);
      if (storeRef.current) {
        for (const [key, value] of Object.entries(defaultSettings)) {
          await storeRef.current.set(key, value);
        }
        await storeRef.current.save();
      }
      toast.success('Settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('Failed to reset settings');
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
