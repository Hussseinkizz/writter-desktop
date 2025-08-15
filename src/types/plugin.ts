import { z } from 'zod';

/**
 * Plugin System Types and Interfaces with Zod validation
 * 
 * This module defines the core plugin architecture for the Writter application.
 * Plugins can hook into content transformation during save, load, and editing operations.
 */

/**
 * Context object schema passed to plugin hooks containing metadata about the current operation
 */
export const pluginContextSchema = z.object({
  filePath: z.string().min(1, 'File path is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileExtension: z.string(),
  projectDir: z.string().min(1, 'Project directory is required'),
  timestamp: z.date()
});

/**
 * Plugin configuration schema
 */
export const pluginConfigSchema = z.record(z.unknown());

/**
 * Plugin hook functions schema
 */
export const pluginHooksSchema = z.object({
  onSave: z.function()
    .args(z.string(), pluginContextSchema)
    .returns(z.union([z.string(), z.promise(z.string())]))
    .optional(),
  onLoad: z.function()
    .args(z.string(), pluginContextSchema)
    .returns(z.union([z.string(), z.promise(z.string())]))
    .optional(),
  onContentChange: z.function()
    .args(z.string(), pluginContextSchema)
    .returns(z.union([z.string(), z.promise(z.string())]))
    .optional()
});

/**
 * Main plugin schema that all plugins must implement
 */
export const pluginSchema = z.object({
  id: z.string().min(1, 'Plugin ID is required'),
  name: z.string().min(1, 'Plugin name is required'),
  description: z.string().min(1, 'Plugin description is required'),
  version: z.string().min(1, 'Plugin version is required'),
  author: z.string().min(1, 'Plugin author is required'),
  enabled: z.boolean().default(true),
  config: pluginConfigSchema.default({}),
  hooks: pluginHooksSchema.default({}),
  init: z.function()
    .returns(z.union([z.void(), z.promise(z.void())]))
    .optional(),
  cleanup: z.function()
    .returns(z.union([z.void(), z.promise(z.void())]))
    .optional()
});

/**
 * Plugin execution result schema
 */
export const pluginExecutionResultSchema = z.object({
  success: z.boolean(),
  content: z.string(),
  error: z.string().optional()
});

/**
 * Validation helper functions
 */
export const validatePlugin = (plugin: unknown): { isValid: boolean; error?: string; data?: Plugin } => {
  try {
    const validatedPlugin = pluginSchema.parse(plugin);
    return { isValid: true, data: validatedPlugin };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
    }
    return { isValid: false, error: 'Invalid plugin data' };
  }
};

export const validatePluginContext = (context: unknown): { isValid: boolean; error?: string; data?: PluginContext } => {
  try {
    const validatedContext = pluginContextSchema.parse(context);
    return { isValid: true, data: validatedContext };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
    }
    return { isValid: false, error: 'Invalid plugin context' };
  }
};

/**
 * Type exports for use throughout the application
 */
export type PluginContext = z.infer<typeof pluginContextSchema>;
export type PluginConfig = z.infer<typeof pluginConfigSchema>;
export type PluginHooks = z.infer<typeof pluginHooksSchema>;
export type Plugin = z.infer<typeof pluginSchema>;
export type PluginExecutionResult = z.infer<typeof pluginExecutionResultSchema>;

/**
 * Plugin registry state (doesn't need Zod validation as it's internal)
 */
export interface PluginRegistry {
  plugins: Map<string, Plugin>;
  enabledPlugins: Set<string>;
}