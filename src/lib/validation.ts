import { z } from 'zod';

/**
 * URL validation schema with support for both HTTP(S) and file protocols
 */
export const urlSchema = z.string().refine(
  (val) => {
    try {
      const url = new URL(val);
      return ['http:', 'https:', 'file:'].includes(url.protocol);
    } catch {
      return false;
    }
  },
  { message: 'Invalid URL. Must be a valid HTTP, HTTPS, or file URL.' }
);

/**
 * File path validation schema for local files
 */
export const filePathSchema = z.string().min(1, 'File path cannot be empty').refine(
  (val) => {
    // Basic validation for file paths
    return val.length > 0 && !val.includes('<') && !val.includes('>');
  },
  { message: 'Invalid file path' }
);

/**
 * Music track validation schema
 */
export const musicTrackSchema = z.object({
  id: z.string().min(1, 'Track ID is required'),
  name: z.string().min(1, 'Track name is required'),
  description: z.string().min(1, 'Track description is required'),
  url: z.union([urlSchema, filePathSchema], {
    errorMap: () => ({ message: 'Must be a valid URL or file path' })
  }),
  category: z.enum(['nature', 'lofi', 'ambient', 'custom'], {
    errorMap: () => ({ message: 'Category must be nature, lofi, ambient, or custom' })
  }),
  duration: z.string().optional(),
  isLocal: z.boolean().default(false)
});

/**
 * Music player settings validation schema
 */
export const musicPlayerSettingsSchema = z.object({
  volume: z.number().min(0).max(100).default(50),
  autoplay: z.boolean().default(false),
  loop: z.boolean().default(true),
  fadeInOut: z.boolean().default(true),
  customTracks: z.array(musicTrackSchema).default([]),
  musicSource: z.enum(['streaming', 'local', 'both']).default('streaming'),
  localMusicDirectory: z.string().optional()
});

/**
 * Main application settings validation schema
 */
export const settingsSchema = z.object({
  lastProjectDir: z.string().nullable().default(null),
  autoSave: z.boolean().default(true),
  autoSaveInterval: z.number().min(1000).max(60000).default(5000),
  theme: z.enum(['light', 'dark', 'system']).default('dark'),
  fontSize: z.number().min(8).max(32).default(14),
  fontFamily: z.string().min(1).default('JetBrains Mono, Monaco, Consolas, monospace'),
  wordWrap: z.boolean().default(true),
  showLineNumbers: z.boolean().default(false),
  tabSize: z.number().min(1).max(8).default(2),
  enableVimMode: z.boolean().default(false),
  enableSpellCheck: z.boolean().default(false),
  previewPosition: z.enum(['right', 'bottom', 'hidden']).default('right'),
  showWordCount: z.boolean().default(true),
  maxRecentFiles: z.number().min(1).max(50).default(10),
  musicPlayer: musicPlayerSettingsSchema.default({})
});

/**
 * Plugin configuration validation schema
 */
export const pluginConfigSchema = z.object({
  enabled: z.boolean().default(true),
  config: z.record(z.unknown()).default({})
});

/**
 * Validation helper functions
 */
export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  try {
    urlSchema.parse(url);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid URL' };
  }
};

export const validateFilePath = (path: string): { isValid: boolean; error?: string } => {
  try {
    filePathSchema.parse(path);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid file path' };
  }
};

export const validateMusicTrack = (track: unknown): { isValid: boolean; error?: string; data?: z.infer<typeof musicTrackSchema> } => {
  try {
    const validatedTrack = musicTrackSchema.parse(track);
    return { isValid: true, data: validatedTrack };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return { isValid: false, error: 'Invalid track data' };
  }
};

export const validateSettings = (settings: unknown): { isValid: boolean; error?: string; data?: z.infer<typeof settingsSchema> } => {
  try {
    const validatedSettings = settingsSchema.parse(settings);
    return { isValid: true, data: validatedSettings };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
    }
    return { isValid: false, error: 'Invalid settings data' };
  }
};

/**
 * Type exports for use throughout the application
 */
export type Settings = z.infer<typeof settingsSchema>;
export type MusicPlayerSettings = z.infer<typeof musicPlayerSettingsSchema>;
export type MusicTrack = z.infer<typeof musicTrackSchema>;
export type PluginConfig = z.infer<typeof pluginConfigSchema>;