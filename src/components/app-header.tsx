import {
  HiBell,
  HiFolder,
  HiCog,
  HiCheck,
  HiPlay,
  HiStop,
  HiEye,
  HiEyeOff,
} from 'react-icons/hi';
import { useState } from 'react';
import { format } from 'date-fns-tz';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { 
  MarkdownCheatSheet, 
  SnippetSystem, 
  TableCreator, 
  QuickFormatting 
} from './markdown-utilities';
import { 
  BackgroundMusicPlayer, 
  SimpleTodoManager 
} from './enhanced-features';

type HeaderProps = {
  projectName: string;
  currentFile: string;
  openSettings: () => void;
  playMusic: () => void;
  musicPlaying: boolean;
  showPreview: boolean;
  onAutoSave: (v: boolean) => void;
  selectedPath: boolean;
  saveFile: () => void;
  togglePreview: () => void;
  autoSave: boolean;
  onInsertContent: (content: string) => void;
  onMusicStateChange: (playing: boolean) => void;
};

export function AppHeader({
  projectName,
  currentFile,
  openSettings,
  playMusic,
  musicPlaying,
  showPreview,
  togglePreview,
  saveFile,
  selectedPath,
  onAutoSave,
  autoSave,
  onInsertContent,
  onMusicStateChange,
}: HeaderProps) {
  const [saving, setSaving] = useState(false);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const formattedDate = format(now, 'EEEE, MMMM do, yyyy', { timeZone });
  const formattedTime = format(now, 'hh:mm:ss a zzz', { timeZone });

  const handleSave = async () => {
    setSaving(true);
    saveFile();
    setSaving(false);
  };

  return (
    <header className="flex h-[5vh] w-full items-center justify-between border-b border-zinc-800 bg-neutral-900 px-4 py-2 text-neutral-200 shadow">
      {/* Left: Project & File */}
      <div className="flex items-center gap-2">
        <HiFolder className="text-amber-500" />
        <span className="capitalize font-semibold truncate">{projectName}</span>
        <span className="mx-1 text-zinc-400">/</span>
        <span className="font-mono truncate">{currentFile}</span>
      </div>

      {/* Middle: Date & Time */}
      <div className="lg:flex hidden text-sm items-center gap-4">
        <span className="font-medium text-neutral-400">{formattedDate}</span>
        <span className="text-xs text-neutral-400">{formattedTime}</span>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-2">
        {/* Markdown Utilities */}
        <div className="flex items-center gap-1 mr-2">
          <MarkdownCheatSheet />
          <SnippetSystem onInsert={onInsertContent} />
          <TableCreator onInsert={onInsertContent} />
          <QuickFormatting onInsert={onInsertContent} />
        </div>
        
        {/* Toggle Preview */}
        <Button
          title={showPreview ? 'Hide preview' : 'Show preview'}
          variant="ghost"
          size="icon"
          onClick={togglePreview}
          className="rounded-full text-neutral-300 hover:bg-zinc-800 transition"
          aria-label={showPreview ? 'Hide preview' : 'Show preview'}>
          {showPreview ? (
            <HiEyeOff className="text-xl" />
          ) : (
            <HiEye className="text-xl" />
          )}
        </Button>
        {/* Play Music */}
        <BackgroundMusicPlayer 
          isPlaying={musicPlaying}
          onPlayStateChange={onMusicStateChange}
        />
        
        {/* Todo Manager */}
        <SimpleTodoManager />
        
        {/* Settings */}
        <Button
          title="Open settings"
          variant="ghost"
          size="icon"
          onClick={openSettings}
          className="rounded-full hover:bg-zinc-800 transition"
          aria-label="Settings">
          <HiCog className="text-xl text-neutral-300" />
        </Button>
        {/* Notification */}
        <Button
          title="Notifications"
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-zinc-800 transition"
          aria-label="Notifications">
          <HiBell className="text-xl text-neutral-300" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>
        </Button>
        {/* Auto Save Toggle */}
        <div className="flex items-center gap-2 mr-3">
          <Switch
            checked={autoSave}
            onCheckedChange={(v: boolean) => {
              onAutoSave(v);
              toast(autoSave ? 'Auto Save off' : 'Auto Save on');
            }}
            id="auto-save"
          />
          <label htmlFor="auto-save" className="text-xs text-neutral-300">
            Auto Save
          </label>
        </div>
        {/* Save Note */}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || !selectedPath}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded shadow transition">
          {saving ? (
            <>
              <span className="mr-1 animate-spin">
                <Loader2 />
              </span>
              Saving...
            </>
          ) : (
            <>
              <HiCheck className="text-lg" />
              Save
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
