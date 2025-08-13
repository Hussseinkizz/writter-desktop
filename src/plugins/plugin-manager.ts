import { 
  Plugin, 
  PluginContext, 
  PluginRegistry, 
  PluginExecutionResult 
} from '@/types/plugin';

/**
 * Plugin Manager factory function that creates a plugin manager instance
 * Implements a simple but powerful plugin system for content transformation
 * Uses factory pattern instead of classes for functional programming approach
 */
export function createPluginManager() {
  // Private registry state in closure
  const registry: PluginRegistry = {
    plugins: new Map(),
    enabledPlugins: new Set(),
  };

  /**
   * Create plugin context from file information
   */
  const createContext = (filePath: string, projectDir: string): PluginContext => {
    const fileName = filePath.split('/').pop() || '';
    const fileExtension = fileName.split('.').pop() || '';
    
    return {
      filePath,
      fileName,
      fileExtension,
      projectDir,
      timestamp: new Date(),
    };
  };

  /**
   * Register a new plugin
   */
  const registerPlugin = (plugin: Plugin): void => {
    registry.plugins.set(plugin.id, plugin);
    
    if (plugin.enabled) {
      enablePlugin(plugin.id);
    }

    // Initialize plugin if it has an init function
    if (plugin.init) {
      const initResult = plugin.init();
      if (initResult instanceof Promise) {
        initResult.catch((error: any) => {
          console.error(`Failed to initialize plugin ${plugin.id}:`, error);
        });
      }
    }
  };

  /**
   * Unregister a plugin
   */
  const unregisterPlugin = (pluginId: string): void => {
    const plugin = registry.plugins.get(pluginId);
    if (plugin) {
      disablePlugin(pluginId);
      if (plugin.cleanup) {
        const cleanupResult = plugin.cleanup();
        if (cleanupResult instanceof Promise) {
          cleanupResult.catch((error: any) => {
            console.error(`Failed to cleanup plugin ${pluginId}:`, error);
          });
        }
      }
      registry.plugins.delete(pluginId);
    }
  };

  /**
   * Enable a plugin
   */
  const enablePlugin = (pluginId: string): void => {
    const plugin = registry.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = true;
      registry.enabledPlugins.add(pluginId);
    }
  };

  /**
   * Disable a plugin
   */
  const disablePlugin = (pluginId: string): void => {
    const plugin = registry.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = false;
      registry.enabledPlugins.delete(pluginId);
    }
  };

  /**
   * Get all registered plugins
   */
  const getPlugins = (): Plugin[] => {
    return Array.from(registry.plugins.values());
  };

  /**
   * Get a specific plugin by ID
   */
  const getPlugin = (pluginId: string): Plugin | undefined => {
    return registry.plugins.get(pluginId);
  };

  /**
   * Execute onSave hooks for all enabled plugins
   */
  const executeOnSave = async (content: string, filePath: string, projectDir: string): Promise<PluginExecutionResult> => {
    const context = createContext(filePath, projectDir);
    let transformedContent = content;

    for (const pluginId of registry.enabledPlugins) {
      const plugin = registry.plugins.get(pluginId);
      if (plugin && plugin.hooks.onSave) {
        try {
          transformedContent = await plugin.hooks.onSave(transformedContent, context);
        } catch (error) {
          console.error(`Plugin ${pluginId} onSave hook failed:`, error);
          return {
            success: false,
            content: transformedContent,
            error: `Plugin ${plugin.name} failed: ${error}`,
          };
        }
      }
    }

    return {
      success: true,
      content: transformedContent,
    };
  };

  /**
   * Execute onLoad hooks for all enabled plugins
   */
  const executeOnLoad = async (content: string, filePath: string, projectDir: string): Promise<PluginExecutionResult> => {
    const context = createContext(filePath, projectDir);
    let transformedContent = content;

    for (const pluginId of registry.enabledPlugins) {
      const plugin = registry.plugins.get(pluginId);
      if (plugin && plugin.hooks.onLoad) {
        try {
          transformedContent = await plugin.hooks.onLoad(transformedContent, context);
        } catch (error) {
          console.error(`Plugin ${pluginId} onLoad hook failed:`, error);
          return {
            success: false,
            content: transformedContent,
            error: `Plugin ${plugin.name} failed: ${error}`,
          };
        }
      }
    }

    return {
      success: true,
      content: transformedContent,
    };
  };

  /**
   * Execute onContentChange hooks for all enabled plugins
   */
  const executeOnContentChange = async (content: string, filePath: string, projectDir: string): Promise<PluginExecutionResult> => {
    const context = createContext(filePath, projectDir);
    let transformedContent = content;

    for (const pluginId of registry.enabledPlugins) {
      const plugin = registry.plugins.get(pluginId);
      if (plugin && plugin.hooks.onContentChange) {
        try {
          transformedContent = await plugin.hooks.onContentChange(transformedContent, context);
        } catch (error) {
          console.error(`Plugin ${pluginId} onContentChange hook failed:`, error);
          return {
            success: false,
            content: transformedContent,
            error: `Plugin ${plugin.name} failed: ${error}`,
          };
        }
      }
    }

    return {
      success: true,
      content: transformedContent,
    };
  };

  /**
   * Save plugin configuration to localStorage
   */
  const savePluginConfig = (): void => {
    const pluginConfigs = Array.from(registry.plugins.entries()).map(([id, plugin]) => ({
      id,
      enabled: plugin.enabled,
      config: plugin.config,
    }));

    localStorage.setItem('writter-plugin-configs', JSON.stringify(pluginConfigs));
  };

  /**
   * Load plugin configuration from localStorage
   */
  const loadPluginConfig = (): void => {
    try {
      const saved = localStorage.getItem('writter-plugin-configs');
      if (saved) {
        const configs = JSON.parse(saved);
        configs.forEach((config: { id: string; enabled: boolean; config: any }) => {
          const plugin = registry.plugins.get(config.id);
          if (plugin) {
            plugin.enabled = config.enabled;
            plugin.config = { ...plugin.config, ...config.config };
            
            if (plugin.enabled) {
              registry.enabledPlugins.add(config.id);
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to load plugin config:', error);
    }
  };

  // Return object with all methods
  return {
    registerPlugin,
    unregisterPlugin,
    enablePlugin,
    disablePlugin,
    getPlugins,
    getPlugin,
    executeOnSave,
    executeOnLoad,
    executeOnContentChange,
    savePluginConfig,
    loadPluginConfig,
  };
}

// Create a singleton instance using the factory
export const pluginManager = createPluginManager();