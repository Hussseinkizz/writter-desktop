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

type HeaderProps = {
  projectName: string;
  currentFile: string;
  openSettings: () => void;
  playMusic: () => void;
  musicPlaying: boolean;
  showPreview: boolean;
  togglePreview: () => void;
};

export function AppHeader({
  projectName,
  currentFile,
  openSettings,
  playMusic,
  musicPlaying,
  showPreview,
  togglePreview,
}: HeaderProps) {
  const [autoSave, setAutoSave] = useState(false);
  const [saving, setSaving] = useState(false);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const formattedDate = format(now, 'EEEE, MMMM do, yyyy', { timeZone });
  const formattedTime = format(now, 'hh:mm:ss a zzz', { timeZone });

  const handleSave = async () => {
    setSaving(true);
    toast('Saving...');
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Saved note!');
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
        <Button
          title="Play music"
          variant="ghost"
          size="icon"
          onClick={playMusic}
          className={`rounded-full text-neutral-300 hover:bg-zinc-800 transition ${
            musicPlaying ? 'text-green-500' : 'text-neutral-400'
          }`}
          aria-label={musicPlaying ? 'Stop music' : 'Play music'}>
          {musicPlaying ? (
            <HiStop className="text-xl" />
          ) : (
            <HiPlay className="text-xl" />
          )}
        </Button>
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
            onCheckedChange={() => {
              setAutoSave((v) => !v);
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
          disabled={saving}
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
