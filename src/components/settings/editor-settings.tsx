import { useSettings } from '@/hooks/use-settings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const fontFamilies = [
  'JetBrains Mono, Monaco, Consolas, monospace',
  'Monaco, Consolas, Courier New, monospace',
  'Fira Code, Monaco, Consolas, monospace',
  'Source Code Pro, Monaco, Consolas, monospace',
  'Cascadia Code, Monaco, Consolas, monospace',
  'SF Mono, Monaco, Consolas, monospace',
];

export function EditorSettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Customize the editor font and sizing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Font family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => updateSetting('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font}>
                    <span style={{ fontFamily: font.split(',')[0] }}>
                      {font.split(',')[0]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Font size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSetting('fontSize', value)}
              min={10}
              max={24}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Adjust the editor font size (10-24px)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editor Behavior</CardTitle>
          <CardDescription>
            Configure how the editor behaves while typing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="word-wrap">Word wrap</Label>
            <Switch
              id="word-wrap"
              checked={settings.wordWrap}
              onCheckedChange={(checked) => updateSetting('wordWrap', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="line-numbers">Show line numbers</Label>
            <Switch
              id="line-numbers"
              checked={settings.showLineNumbers}
              onCheckedChange={(checked) => updateSetting('showLineNumbers', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Tab size</Label>
            <Select
              value={settings.tabSize.toString()}
              onValueChange={(value) => updateSetting('tabSize', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="8">8 spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
          <CardDescription>
            Enable advanced editing features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="vim-mode">Vim mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable Vim key bindings
              </p>
            </div>
            <Switch
              id="vim-mode"
              checked={settings.enableVimMode}
              onCheckedChange={(checked) => updateSetting('enableVimMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="spell-check">Spell check</Label>
              <p className="text-sm text-muted-foreground">
                Highlight misspelled words
              </p>
            </div>
            <Switch
              id="spell-check"
              checked={settings.enableSpellCheck}
              onCheckedChange={(checked) => updateSetting('enableSpellCheck', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}