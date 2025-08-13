import { 
  Plugin, 
  PluginContext, 
  PluginRegistry, 
  PluginExecutionResult 
} from '@/types/plugin';

/**
 * Plugin Manager class that handles plugin registration, execution, and lifecycle
 * Implements a simple but powerful plugin system for content transformation
 */
class PluginManager {
  private registry: PluginRegistry = {
    plugins: new Map(),
    enabledPlugins: new Set(),
  };

  /**
   * Register a new plugin
   */
  registerPlugin(plugin: Plugin): void {
    this.registry.plugins.set(plugin.id, plugin);
    
    if (plugin.enabled) {
      this.enablePlugin(plugin.id);
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
  }

  /**
   * Unregister a plugin
   */
  unregisterPlugin(pluginId: string): void {
    const plugin = this.registry.plugins.get(pluginId);
    if (plugin) {
      this.disablePlugin(pluginId);
      if (plugin.cleanup) {
        const cleanupResult = plugin.cleanup();
        if (cleanupResult instanceof Promise) {
          cleanupResult.catch((error: any) => {
            console.error(`Failed to cleanup plugin ${pluginId}:`, error);
          });
        }
      }
      this.registry.plugins.delete(pluginId);
    }
  }

  /**
   * Enable a plugin
   */
  enablePlugin(pluginId: string): void {
    const plugin = this.registry.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = true;
      this.registry.enabledPlugins.add(pluginId);
    }
  }

  /**
   * Disable a plugin
   */
  disablePlugin(pluginId: string): void {
    const plugin = this.registry.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = false;
      this.registry.enabledPlugins.delete(pluginId);
    }
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): Plugin[] {
    return Array.from(this.registry.plugins.values());
  }

  /**
   * Get a specific plugin by ID
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.registry.plugins.get(pluginId);
  }

  /**
   * Create plugin context from file information
   */
  private createContext(filePath: string, projectDir: string): PluginContext {
    const fileName = filePath.split('/').pop() || '';
    const fileExtension = fileName.split('.').pop() || '';
    
    return {
      filePath,
      fileName,
      fileExtension,
      projectDir,
      timestamp: new Date(),
    };
  }

  /**
   * Execute onSave hooks for all enabled plugins
   */
  async executeOnSave(content: string, filePath: string, projectDir: string): Promise<PluginExecutionResult> {
    const context = this.createContext(filePath, projectDir);
    let transformedContent = content;

    for (const pluginId of this.registry.enabledPlugins) {
      const plugin = this.registry.plugins.get(pluginId);
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
  }

  /**
   * Execute onLoad hooks for all enabled plugins
   */
  async executeOnLoad(content: string, filePath: string, projectDir: string): Promise<PluginExecutionResult> {
    const context = this.createContext(filePath, projectDir);
    let transformedContent = content;

    for (const pluginId of this.registry.enabledPlugins) {
      const plugin = this.registry.plugins.get(pluginId);
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
  }

  /**
   * Execute onContentChange hooks for all enabled plugins
   */
  async executeOnContentChange(content: string, filePath: string, projectDir: string): Promise<PluginExecutionResult> {
    const context = this.createContext(filePath, projectDir);
    let transformedContent = content;

    for (const pluginId of this.registry.enabledPlugins) {
      const plugin = this.registry.plugins.get(pluginId);
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
  }

  /**
   * Save plugin configuration to localStorage
   */
  savePluginConfig(): void {
    const pluginConfigs = Array.from(this.registry.plugins.entries()).map(([id, plugin]) => ({
      id,
      enabled: plugin.enabled,
      config: plugin.config,
    }));

    localStorage.setItem('writter-plugin-configs', JSON.stringify(pluginConfigs));
  }

  /**
   * Load plugin configuration from localStorage
   */
  loadPluginConfig(): void {
    try {
      const saved = localStorage.getItem('writter-plugin-configs');
      if (saved) {
        const configs = JSON.parse(saved);
        configs.forEach((config: { id: string; enabled: boolean; config: any }) => {
          const plugin = this.registry.plugins.get(config.id);
          if (plugin) {
            plugin.enabled = config.enabled;
            plugin.config = { ...plugin.config, ...config.config };
            
            if (plugin.enabled) {
              this.registry.enabledPlugins.add(config.id);
            }
          }
        });
      }
    } catch (error) {
      console.error('Failed to load plugin config:', error);
    }
  }
}

// Create a singleton instance
export const pluginManager = new PluginManager();

export { PluginManager };