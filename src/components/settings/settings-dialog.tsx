import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, RotateCcw } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { GeneralSettings } from './general-settings';
import { EditorSettings } from './editor-settings';
import { AppearanceSettings } from './appearance-settings';
import { PluginSettings } from './plugin-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface SettingsDialogProps {
  trigger?: React.ReactNode;
}

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const { resetSettings } = useSettings();

  const handleResetSettings = async () => {
    try {
      await resetSettings();
      toast.success('Settings reset to defaults');
    } catch (error) {
      toast.error('Failed to reset settings');
      console.error('Failed to reset settings:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your Writter experience. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0">
          <Tabs defaultValue="general" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="plugins">Plugins</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 min-h-0 mt-4">
              <ScrollArea className="h-full pr-4">
                <TabsContent value="general" className="mt-0">
                  <GeneralSettings />
                </TabsContent>
                <TabsContent value="editor" className="mt-0">
                  <EditorSettings />
                </TabsContent>
                <TabsContent value="appearance" className="mt-0">
                  <AppearanceSettings />
                </TabsContent>
                <TabsContent value="plugins" className="mt-0">
                  <PluginSettings />
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}