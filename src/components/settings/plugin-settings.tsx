import { useState } from 'react';
import { pluginManager } from '@/plugins/plugin-manager';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function PluginSettings() {
  const [plugins, setPlugins] = useState(() => pluginManager.getPlugins());

  const refreshPlugins = () => {
    setPlugins(pluginManager.getPlugins());
  };

  const togglePlugin = (pluginId: string, enabled: boolean) => {
    if (enabled) {
      pluginManager.enablePlugin(pluginId);
    } else {
      pluginManager.disablePlugin(pluginId);
    }
    pluginManager.savePluginConfig();
    refreshPlugins();
    toast.success(`Plugin ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Plugin Management
            <Button variant="outline" size="sm" onClick={refreshPlugins}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>
            Enable or disable plugins to customize your editing experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plugins.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No plugins available
              </p>
            ) : (
              plugins.map((plugin) => (
                <div key={plugin.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{plugin.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          v{plugin.version}
                        </Badge>
                        {plugin.enabled && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plugin.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {plugin.author}
                      </p>
                      
                      {/* Show available hooks */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {plugin.hooks.onSave && (
                          <Badge variant="outline" className="text-xs">
                            onSave
                          </Badge>
                        )}
                        {plugin.hooks.onLoad && (
                          <Badge variant="outline" className="text-xs">
                            onLoad
                          </Badge>
                        )}
                        {plugin.hooks.onContentChange && (
                          <Badge variant="outline" className="text-xs">
                            onChange
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Switch
                      checked={plugin.enabled}
                      onCheckedChange={(checked) => togglePlugin(plugin.id, checked)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plugin Development</CardTitle>
          <CardDescription>
            Information for creating custom plugins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Plugins can transform content at three key points:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• <strong>onSave:</strong> Transform content before saving to file</li>
            <li>• <strong>onLoad:</strong> Transform content after loading from file</li>
            <li>• <strong>onChange:</strong> Transform content during editing (debounced)</li>
          </ul>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Each plugin receives context information including file path, project directory, 
            and timestamp to make intelligent transformation decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}