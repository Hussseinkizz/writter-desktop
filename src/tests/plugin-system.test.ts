import { describe, it, expect, beforeEach } from 'vitest'
import { createPluginManager } from '../plugins/plugin-manager'
import { Plugin } from '../types/plugin'

describe('Plugin System', () => {
  let pluginManager: ReturnType<typeof createPluginManager>

  const mockPlugin: Plugin = {
    id: 'test-plugin',
    name: 'Test Plugin',
    description: 'A test plugin',
    version: '1.0.0',
    author: 'Test Author',
    enabled: true,
    config: {},
    hooks: {
      onSave: async (content) => content + '\n<!-- Test plugin was here -->',
      onLoad: async (content) => content.replace('<!-- Test plugin was here -->', ''),
    },
  }

  beforeEach(() => {
    pluginManager = createPluginManager()
  })

  it('should register and retrieve plugins', () => {
    pluginManager.registerPlugin(mockPlugin)
    
    const plugins = pluginManager.getPlugins()
    expect(plugins).toHaveLength(1)
    expect(plugins[0].id).toBe('test-plugin')
    
    const retrievedPlugin = pluginManager.getPlugin('test-plugin')
    expect(retrievedPlugin).toBeDefined()
    expect(retrievedPlugin?.name).toBe('Test Plugin')
  })

  it('should enable and disable plugins', () => {
    const disabledPlugin = { ...mockPlugin, enabled: false }
    pluginManager.registerPlugin(disabledPlugin)
    
    expect(pluginManager.getPlugin('test-plugin')?.enabled).toBe(false)
    
    pluginManager.enablePlugin('test-plugin')
    expect(pluginManager.getPlugin('test-plugin')?.enabled).toBe(true)
    
    pluginManager.disablePlugin('test-plugin')
    expect(pluginManager.getPlugin('test-plugin')?.enabled).toBe(false)
  })

  it('should execute onSave hooks', async () => {
    pluginManager.registerPlugin(mockPlugin)
    
    const result = await pluginManager.executeOnSave('Hello world', '/path/to/file.md', '/project')
    
    expect(result.success).toBe(true)
    expect(result.content).toBe('Hello world\n<!-- Test plugin was here -->')
  })

  it('should execute onLoad hooks', async () => {
    pluginManager.registerPlugin(mockPlugin)
    
    const contentWithPlugin = 'Hello world\n<!-- Test plugin was here -->'
    const result = await pluginManager.executeOnLoad(contentWithPlugin, '/path/to/file.md', '/project')
    
    expect(result.success).toBe(true)
    expect(result.content).toBe('Hello world\n')
  })

  it('should not execute hooks for disabled plugins', async () => {
    const disabledPlugin = { ...mockPlugin, enabled: false }
    pluginManager.registerPlugin(disabledPlugin)
    
    const result = await pluginManager.executeOnSave('Hello world', '/path/to/file.md', '/project')
    
    expect(result.success).toBe(true)
    expect(result.content).toBe('Hello world') // No transformation
  })

  it('should handle plugin errors gracefully', async () => {
    const errorPlugin: Plugin = {
      ...mockPlugin,
      id: 'error-plugin',
      hooks: {
        onSave: async () => {
          throw new Error('Plugin failed')
        },
      },
    }
    
    pluginManager.registerPlugin(errorPlugin)
    
    const result = await pluginManager.executeOnSave('Hello world', '/path/to/file.md', '/project')
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('Plugin Test Plugin failed')
  })

  it('should unregister plugins', () => {
    pluginManager.registerPlugin(mockPlugin)
    expect(pluginManager.getPlugins()).toHaveLength(1)
    
    pluginManager.unregisterPlugin('test-plugin')
    expect(pluginManager.getPlugins()).toHaveLength(0)
    expect(pluginManager.getPlugin('test-plugin')).toBeUndefined()
  })

  it('should create proper plugin context', async () => {
    let receivedContext: any = null
    
    const contextTestPlugin: Plugin = {
      ...mockPlugin,
      id: 'context-test',
      enabled: true, // Ensure plugin is enabled
      hooks: {
        onSave: async (content, context) => {
          receivedContext = context
          return content
        },
      },
    }
    
    pluginManager.registerPlugin(contextTestPlugin)
    
    await pluginManager.executeOnSave('test content', '/project/subfolder/test.md', '/project')
    
    expect(receivedContext).toBeDefined()
    expect(receivedContext.filePath).toBe('/project/subfolder/test.md')
    expect(receivedContext.fileName).toBe('test.md')
    expect(receivedContext.fileExtension).toBe('md')
    expect(receivedContext.projectDir).toBe('/project')
    expect(receivedContext.timestamp).toBeInstanceOf(Date)
  })
})