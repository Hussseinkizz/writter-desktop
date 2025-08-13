import { useSettings } from '@/hooks/use-settings';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';

export function AppearanceSettings() {
  const { settings, updateSetting } = useSettings();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose your preferred color scheme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Color theme</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => {
                  setTheme('light');
                  updateSetting('theme', 'light');
                }}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => {
                  setTheme('dark');
                  updateSetting('theme', 'dark');
                }}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => {
                  setTheme('system');
                  updateSetting('theme', 'system');
                }}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Light, dark, or follow your system preference
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
          <CardDescription>
            Customize the application layout
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
                <SelectItem value="hidden">Hidden by default</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose where to show the markdown preview
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Appearance preferences for the preview pane
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The preview uses GitHub-flavored markdown styling with custom scrollbars for a clean appearance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}