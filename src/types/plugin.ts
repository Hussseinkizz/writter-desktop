/**
 * Plugin System Types and Interfaces
 * 
 * This module defines the core plugin architecture for the Writter application.
 * Plugins can hook into content transformation during save, load, and editing operations.
 */

/**
 * Context object passed to plugin hooks containing metadata about the current operation
 */
export interface PluginContext {
  filePath: string;
  fileName: string;
  fileExtension: string;
  projectDir: string;
  timestamp: Date;
}

/**
 * Plugin hook functions that can transform content at different lifecycle points
 */
export interface PluginHooks {
  /**
   * Transform content before saving to file
   * @param content - The markdown content to be saved
   * @param context - Metadata about the current operation
   * @returns The transformed content or a promise resolving to transformed content
   */
  onSave?: (content: string, context: PluginContext) => string | Promise<string>;

  /**
   * Transform content after loading from file
   * @param content - The markdown content loaded from file
   * @param context - Metadata about the current operation
   * @returns The transformed content or a promise resolving to transformed content
   */
  onLoad?: (content: string, context: PluginContext) => string | Promise<string>;

  /**
   * Transform content during editing (debounced)
   * @param content - The current markdown content being edited
   * @param context - Metadata about the current operation
   * @returns The transformed content or a promise resolving to transformed content
   */
  onContentChange?: (content: string, context: PluginContext) => string | Promise<string>;
}

/**
 * Plugin configuration options
 */
export interface PluginConfig {
  [key: string]: any;
}

/**
 * Main plugin interface that all plugins must implement
 */
export interface Plugin {
  /** Unique identifier for the plugin */
  id: string;
  
  /** Human-readable name of the plugin */
  name: string;
  
  /** Description of what the plugin does */
  description: string;
  
  /** Plugin version */
  version: string;
  
  /** Plugin author */
  author: string;
  
  /** Whether the plugin is currently enabled */
  enabled: boolean;
  
  /** Plugin configuration options */
  config: PluginConfig;
  
  /** Hook functions for content transformation */
  hooks: PluginHooks;
  
  /**
   * Initialize the plugin (called when plugin is loaded)
   */
  init?: () => void | Promise<void>;
  
  /**
   * Cleanup when plugin is disabled or unloaded
   */
  cleanup?: () => void | Promise<void>;
}

/**
 * Plugin registry state
 */
export interface PluginRegistry {
  plugins: Map<string, Plugin>;
  enabledPlugins: Set<string>;
}

/**
 * Plugin execution result
 */
export interface PluginExecutionResult {
  success: boolean;
  content: string;
  error?: string;
}