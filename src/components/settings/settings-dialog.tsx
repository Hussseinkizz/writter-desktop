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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ trigger, open: externalOpen, onOpenChange: externalOnOpenChange }: SettingsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { resetSettings } = useSettings();

  // Use external state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

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
      <DialogContent className="max-w-4xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-neutral-200">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Customize your Writter experience. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-neutral-800">
              <TabsTrigger value="general" className="data-[state=active]:bg-violet-600">General</TabsTrigger>
              <TabsTrigger value="editor" className="data-[state=active]:bg-violet-600">Editor</TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-violet-600">Appearance</TabsTrigger>
              <TabsTrigger value="plugins" className="data-[state=active]:bg-violet-600">Plugins</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 space-y-6">
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
            </div>
          </Tabs>
        </ScrollArea>

        <div className="flex justify-between pt-4 border-t border-neutral-700">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            className="flex items-center gap-2 border-red-600/50 text-red-400 hover:bg-red-600/10"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={() => setOpen(false)}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}