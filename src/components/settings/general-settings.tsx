import { useSettings } from '@/hooks/use-settings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function GeneralSettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Auto-Save</CardTitle>
          <CardDescription>
            Automatically save your work while typing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save">Enable auto-save</Label>
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(checked) => updateSetting('autoSave', checked)}
            />
          </div>
          
          {settings.autoSave && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Auto-save interval: {settings.autoSaveInterval / 1000}s</Label>
                <Slider
                  value={[settings.autoSaveInterval]}
                  onValueChange={([value]) => updateSetting('autoSaveInterval', value)}
                  min={1000}
                  max={30000}
                  step={1000}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  How often to save changes automatically (1-30 seconds)
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <CardDescription>
            Settings for file handling and organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Maximum recent files</Label>
            <Select
              value={settings.maxRecentFiles.toString()}
              onValueChange={(value) => updateSetting('maxRecentFiles', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 files</SelectItem>
                <SelectItem value="10">10 files</SelectItem>
                <SelectItem value="15">15 files</SelectItem>
                <SelectItem value="20">20 files</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>UI Preferences</CardTitle>
          <CardDescription>
            Configure the user interface behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preview position</Label>
            <Select
              value={settings.previewPosition}
              onValueChange={(value: 'right' | 'bottom' | 'hidden') => 
                updateSetting('previewPosition', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Right panel</SelectItem>
                <SelectItem value="bottom">Bottom panel</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="word-count">Show word count</Label>
            <Switch
              id="word-count"
              checked={settings.showWordCount}
              onCheckedChange={(checked) => updateSetting('showWordCount', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}