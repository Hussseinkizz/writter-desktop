import { describe, it, expect } from 'vitest';
import {
  urlSchema,
  filePathSchema,
  musicTrackSchema,
  musicPlayerSettingsSchema,
  settingsSchema,
  validateUrl,
  validateFilePath,
  validateMusicTrack,
  validateSettings
} from '../lib/validation';

describe('Validation Schemas', () => {
  describe('urlSchema', () => {
    it('should validate HTTP URLs', () => {
      expect(() => urlSchema.parse('http://example.com/music.mp3')).not.toThrow();
      expect(() => urlSchema.parse('https://example.com/music.mp3')).not.toThrow();
    });

    it('should validate file URLs', () => {
      expect(() => urlSchema.parse('file:///path/to/music.mp3')).not.toThrow();
    });

    it('should reject invalid URLs', () => {
      expect(() => urlSchema.parse('not-a-url')).toThrow();
      expect(() => urlSchema.parse('ftp://example.com/file')).toThrow();
      expect(() => urlSchema.parse('')).toThrow();
    });
  });

  describe('filePathSchema', () => {
    it('should validate basic file paths', () => {
      expect(() => filePathSchema.parse('/path/to/file.mp3')).not.toThrow();
      expect(() => filePathSchema.parse('C:\\Music\\song.mp3')).not.toThrow();
      expect(() => filePathSchema.parse('./relative/path.mp3')).not.toThrow();
    });

    it('should reject empty paths', () => {
      expect(() => filePathSchema.parse('')).toThrow();
    });

    it('should reject paths with invalid characters', () => {
      expect(() => filePathSchema.parse('/path/with<bracket')).toThrow();
      expect(() => filePathSchema.parse('/path/with>bracket')).toThrow();
    });
  });

  describe('musicTrackSchema', () => {
    const validTrack = {
      id: 'test-track',
      name: 'Test Track',
      description: 'A test music track',
      url: 'https://example.com/music.mp3',
      category: 'nature' as const,
      duration: '5:00',
      isLocal: false
    };

    it('should validate a complete valid track', () => {
      expect(() => musicTrackSchema.parse(validTrack)).not.toThrow();
    });

    it('should validate track with minimal required fields', () => {
      const minimalTrack = {
        id: 'minimal',
        name: 'Minimal',
        description: 'Minimal track',
        url: 'https://example.com/music.mp3',
        category: 'lofi' as const
      };
      expect(() => musicTrackSchema.parse(minimalTrack)).not.toThrow();
    });

    it('should reject track with missing required fields', () => {
      expect(() => musicTrackSchema.parse({ ...validTrack, id: '' })).toThrow();
      expect(() => musicTrackSchema.parse({ ...validTrack, name: '' })).toThrow();
      expect(() => musicTrackSchema.parse({ ...validTrack, description: '' })).toThrow();
    });

    it('should reject track with invalid category', () => {
      expect(() => musicTrackSchema.parse({ 
        ...validTrack, 
        category: 'invalid' 
      })).toThrow();
    });

    it('should default isLocal to false', () => {
      const track = musicTrackSchema.parse({
        id: 'test',
        name: 'Test',
        description: 'Test',
        url: 'https://example.com/music.mp3',
        category: 'nature' as const
      });
      expect(track.isLocal).toBe(false);
    });
  });

  describe('musicPlayerSettingsSchema', () => {
    it('should validate complete settings', () => {
      const settings = {
        volume: 75,
        autoplay: true,
        loop: false,
        fadeInOut: true,
        customTracks: [],
        musicSource: 'streaming' as const,
        localMusicDirectory: '/music'
      };
      expect(() => musicPlayerSettingsSchema.parse(settings)).not.toThrow();
    });

    it('should apply defaults for missing fields', () => {
      const settings = musicPlayerSettingsSchema.parse({});
      expect(settings.volume).toBe(50);
      expect(settings.autoplay).toBe(false);
      expect(settings.loop).toBe(true);
      expect(settings.fadeInOut).toBe(true);
      expect(settings.customTracks).toEqual([]);
      expect(settings.musicSource).toBe('streaming');
    });

    it('should reject invalid volume values', () => {
      expect(() => musicPlayerSettingsSchema.parse({ volume: -1 })).toThrow();
      expect(() => musicPlayerSettingsSchema.parse({ volume: 101 })).toThrow();
    });

    it('should reject invalid musicSource values', () => {
      expect(() => musicPlayerSettingsSchema.parse({ 
        musicSource: 'invalid' 
      })).toThrow();
    });
  });

  describe('settingsSchema', () => {
    it('should validate complete settings', () => {
      const settings = {
        lastProjectDir: '/projects',
        autoSave: true,
        autoSaveInterval: 10000,
        theme: 'dark' as const,
        fontSize: 16,
        fontFamily: 'Arial',
        wordWrap: true,
        showLineNumbers: true,
        tabSize: 4,
        enableVimMode: false,
        enableSpellCheck: true,
        previewPosition: 'right' as const,
        showWordCount: true,
        maxRecentFiles: 15,
        musicPlayer: {
          volume: 50,
          autoplay: false,
          loop: true,
          fadeInOut: true,
          customTracks: [],
          musicSource: 'streaming' as const
        }
      };
      expect(() => settingsSchema.parse(settings)).not.toThrow();
    });

    it('should apply defaults for missing fields', () => {
      const settings = settingsSchema.parse({});
      expect(settings.lastProjectDir).toBeNull();
      expect(settings.autoSave).toBe(true);
      expect(settings.theme).toBe('dark');
      expect(settings.fontSize).toBe(14);
      expect(settings.musicPlayer.volume).toBe(50);
    });

    it('should reject invalid theme values', () => {
      expect(() => settingsSchema.parse({ theme: 'invalid' })).toThrow();
    });

    it('should reject invalid fontSize values', () => {
      expect(() => settingsSchema.parse({ fontSize: 5 })).toThrow();
      expect(() => settingsSchema.parse({ fontSize: 50 })).toThrow();
    });

    it('should reject invalid autoSaveInterval values', () => {
      expect(() => settingsSchema.parse({ autoSaveInterval: 500 })).toThrow();
      expect(() => settingsSchema.parse({ autoSaveInterval: 70000 })).toThrow();
    });
  });
});

describe('Validation Helper Functions', () => {
  describe('validateUrl', () => {
    it('should return valid for HTTP URLs', () => {
      const result = validateUrl('https://example.com/music.mp3');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for malformed URLs', () => {
      const result = validateUrl('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateFilePath', () => {
    it('should return valid for proper file paths', () => {
      const result = validateFilePath('/path/to/file.mp3');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty paths', () => {
      const result = validateFilePath('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateMusicTrack', () => {
    it('should return valid for correct track data', () => {
      const track = {
        id: 'test',
        name: 'Test Track',
        description: 'Test description',
        url: 'https://example.com/music.mp3',
        category: 'nature' as const,
        isLocal: false
      };
      const result = validateMusicTrack(track);
      expect(result.isValid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for malformed track data', () => {
      const track = {
        id: '',
        name: 'Test Track',
        description: 'Test description',
        url: 'invalid-url',
        category: 'invalid'
      };
      const result = validateMusicTrack(track);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateSettings', () => {
    it('should return valid for correct settings', () => {
      const settings = {
        autoSave: true,
        theme: 'dark' as const,
        fontSize: 14
      };
      const result = validateSettings(settings);
      expect(result.isValid).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should return invalid for malformed settings', () => {
      const settings = {
        autoSave: 'yes', // should be boolean
        theme: 'invalid',
        fontSize: 5 // too small
      };
      const result = validateSettings(settings);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});