import {
  HiFolder,
  HiCheck,
  HiEye,
  HiEyeOff,
  HiMusicNote,
  HiTemplate,
  HiPlus,
  HiTable,
  HiCode,
  HiClipboardList,
  HiMenu,
  HiInformationCircle,
} from 'react-icons/hi';
import { useState } from 'react';
import { format } from 'date-fns-tz';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  MarkdownCheatSheet,
  SnippetSystem,
  TableCreator,
  QuickFormatting,
} from './markdown-utilities';
import { BackgroundMusicPlayer, SimpleTodoManager } from './enhanced-features';
import { AboutDialog } from './about-dialog';

// Path utilities for cross-platform path truncation
const getPathSeparator = (path: string): string => {
  if (path.includes('\\')) return '\\'; // Windows
  return '/'; // Unix/Linux/Mac
};

const truncateProjectName = (projectName: string, maxLength: number = 20): string => {
  if (projectName.length <= maxLength) return projectName;
  return projectName.substring(0, maxLength - 3) + '...';
};

const truncateFilePath = (filePath: string, maxLength: number = 30): string => {
  if (filePath.length <= maxLength) return filePath;
  
  const separator = getPathSeparator(filePath);
  const parts = filePath.split(separator);
  
  if (parts.length === 1) {
    // Single file name, truncate from middle
    const name = parts[0];
    if (name.length <= maxLength) return name;
    const start = Math.floor((maxLength - 3) / 2);
    const end = name.length - (maxLength - 3 - start);
    return name.substring(0, start) + '...' + name.substring(end);
  }
  
  // Multiple path parts
  const fileName = parts[parts.length - 1];
  const pathParts = parts.slice(0, -1);
  
  // If just filename is too long
  if (fileName.length > maxLength) {
    const start = Math.floor((maxLength - 3) / 2);
    const end = fileName.length - (maxLength - 3 - start);
    return fileName.substring(0, start) + '...' + fileName.substring(end);
  }
  
  // Build truncated path
  let result = fileName;
  let remainingLength = maxLength - fileName.length - 3; // Reserve space for "..." and separator
  
  for (let i = pathParts.length - 1; i >= 0; i--) {
    const part = pathParts[i];
    if (part.length + separator.length <= remainingLength) {
      result = part + separator + result;
      remainingLength -= part.length + separator.length;
    } else {
      result = '...' + separator + result;
      break;
    }
  }
  
  return result;
};

type HeaderProps = {
  projectName: string;
  currentFile: string;
  showPreview: boolean;
  onAutoSave: (v: boolean) => void;
  selectedPath: boolean;
  saveFile: () => void;
  togglePreview: () => void;
  autoSave: boolean;
  onInsertContent: (content: string) => void;
  onMusicStateChange: (playing: boolean) => void;
  musicPlaying: boolean;
};

export function AppHeader({
  projectName,
  currentFile,
  showPreview,
  togglePreview,
  saveFile,
  selectedPath,
  onAutoSave,
  autoSave,
  onInsertContent,
  onMusicStateChange,
  musicPlaying,
}: HeaderProps) {
  const [saving, setSaving] = useState(false);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const formattedDate = format(now, 'EEEE, MMMM do, yyyy', { timeZone });
  const formattedTime = format(now, 'hh:mm:ss a zzz', { timeZone });

  // Preprocess project name and file path for display
  const displayProjectName = truncateProjectName(projectName);
  const displayCurrentFile = truncateFilePath(currentFile);

  const handleSave = async () => {
    setSaving(true);
    saveFile();
    setSaving(false);
  };

  const handleComingSoon = (feature: string) => {
    toast(`${feature} coming soon! 🚀`);
  };

  return (
    <header className="flex h-[6vh] w-full items-center justify-between border-b border-zinc-800 bg-neutral-900 px-4 py-2 text-neutral-200 shadow">
      {/* Left: Project & File */}
      <div className="flex items-center gap-2">
        <HiFolder className="text-amber-500" />
        <span 
          className="capitalize font-semibold truncate" 
          title={projectName}
        >
          {displayProjectName}
        </span>
        <span className="mx-1 text-zinc-400">/</span>
        <span 
          className="font-mono truncate" 
          title={currentFile}
        >
          {displayCurrentFile}
        </span>
      </div>

      {/* Middle: Date & Time */}
      <div className="lg:flex hidden text-sm items-center gap-4">
        <span className="font-medium text-neutral-400">{formattedDate}</span>
        <span className="text-xs text-neutral-400">{formattedTime}</span>
      </div>

      {/* Right: Preview, Guide, Save, and Utilities Menu */}
      <div className="flex items-center gap-3">
        {/* Preview Toggle Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={togglePreview}
          className="flex items-center gap-1 px-2 py-1 h-8 border-zinc-700 text-neutral-300 hover:bg-zinc-800 hover:text-white text-xs">
          {showPreview ? (
            <>
              <HiEyeOff className="text-sm" />
              Hide Preview
            </>
          ) : (
            <>
              <HiEye className="text-sm" />
              Preview
            </>
          )}
        </Button>

        {/* Guide Toggle Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const trigger = document.querySelector(
              '[data-dialog="cheat-sheet"] button'
            ) as HTMLButtonElement;
            trigger?.click();
          }}
          className="flex items-center gap-1 px-2 py-1 h-8 border-zinc-700 text-neutral-300 hover:bg-zinc-800 hover:text-white text-xs">
          <HiCode className="text-sm" />
          Guide
        </Button>

        {/* Save Button */}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || !selectedPath}
          className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-3 py-1 h-8 rounded shadow transition text-xs">
          {saving ? (
            <>
              <span className="animate-spin">
                <Loader2 className="h-3 w-3" />
              </span>
              Saving...
            </>
          ) : (
            <>
              <HiCheck className="text-sm" />
              Save
            </>
          )}
        </Button>

        {/* Utilities Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              className="rounded-full text-neutral-300 hover:bg-zinc-800 transition p-2 flex items-center justify-center"
              title="Tools & Utilities"
              aria-label="Open tools menu">
              <HiMenu className="text-xl" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-neutral-900 border-neutral-700"
            align="end"
            sideOffset={5}>
            {/* View Options */}
            <DropdownMenuItem
              onClick={() => {
                onAutoSave(!autoSave);
                toast(autoSave ? 'Auto Save disabled' : 'Auto Save enabled');
              }}
              className="flex items-center justify-between cursor-pointer hover:bg-neutral-800">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 text-neutral-400">💾</span>
                <span>Auto Save</span>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={() => {}}
                className="pointer-events-none scale-75"
              />
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-neutral-700" />

            {/* Markdown Tools */}
            <DropdownMenuItem
              onClick={() => {
                const trigger = document.querySelector(
                  '[data-dialog="snippets"] button'
                ) as HTMLButtonElement;
                trigger?.click();
              }}
              className="flex items-center gap-3 cursor-pointer hover:bg-neutral-800">
              <HiTemplate className="h-4 w-4 text-neutral-400" />
              <span>Snippets Library</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const trigger = document.querySelector(
                  '[data-dialog="table"] button'
                ) as HTMLButtonElement;
                trigger?.click();
              }}
              className="flex items-center gap-3 cursor-pointer hover:bg-neutral-800">
              <HiTable className="h-4 w-4 text-neutral-400" />
              <span>Table Creator</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const trigger = document.querySelector(
                  '[data-dialog="formatting"] button'
                ) as HTMLButtonElement;
                trigger?.click();
              }}
              className="flex items-center gap-3 cursor-pointer hover:bg-neutral-800">
              <HiPlus className="h-4 w-4 text-neutral-400" />
              <span>Quick Formatting</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-neutral-700" />

            {/* Enhanced Features */}
            <DropdownMenuItem
              onClick={() => {
                const trigger = document.querySelector(
                  '[data-dialog="music"] button'
                ) as HTMLButtonElement;
                trigger?.click();
              }}
              className="flex items-center gap-3 cursor-pointer hover:bg-neutral-800">
              <HiMusicNote className="h-4 w-4 text-violet-400" />
              <span>Background Music</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const trigger = document.querySelector(
                  '[data-dialog="todo"] button'
                ) as HTMLButtonElement;
                trigger?.click();
              }}
              className="flex items-center gap-3 cursor-pointer hover:bg-neutral-800">
              <HiClipboardList className="h-4 w-4 text-neutral-400" />
              <span>Todo Manager</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-neutral-700" />

            {/* About */}
            <DropdownMenuItem
              onClick={() => {
                const trigger = document.querySelector(
                  '[data-dialog="about"] button'
                ) as HTMLButtonElement;
                trigger?.click();
              }}
              className="flex items-center gap-3 cursor-pointer hover:bg-neutral-800">
              <HiInformationCircle className="h-4 w-4 text-blue-400" />
              <span>About</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-neutral-700" />

            {/* Coming Soon Items */}
            <DropdownMenuItem
              onClick={() => handleComingSoon('Settings')}
              className="flex items-center gap-3 cursor-pointer hover:bg-neutral-800">
              <span className="h-4 w-4 text-neutral-500">⚙️</span>
              <span className="text-neutral-500">Settings</span>
              <span className="ml-auto text-xs text-neutral-500">Soon</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleComingSoon('Notifications')}
              className="flex items-center gap-3 cursor-pointer hover:bg-neutral-800">
              <span className="h-4 w-4 text-neutral-500">🔔</span>
              <span className="text-neutral-500">Notifications</span>
              <span className="ml-auto text-xs text-neutral-500">Soon</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hidden Dialog Components */}
      <div style={{ display: 'none' }}>
        <div data-dialog="cheat-sheet">
          <MarkdownCheatSheet />
        </div>
        <div data-dialog="snippets">
          <SnippetSystem onInsert={onInsertContent} />
        </div>
        <div data-dialog="table">
          <TableCreator onInsert={onInsertContent} />
        </div>
        <div data-dialog="formatting">
          <QuickFormatting onInsert={onInsertContent} />
        </div>
        <div data-dialog="music">
          <BackgroundMusicPlayer
            isPlaying={musicPlaying}
            onPlayStateChange={onMusicStateChange}
          />
        </div>
        <div data-dialog="todo">
          <SimpleTodoManager />
        </div>
        <div data-dialog="about">
          <AboutDialog />
        </div>
      </div>
    </header>
  );
}
