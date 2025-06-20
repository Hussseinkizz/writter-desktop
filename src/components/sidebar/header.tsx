import { HiDotsVertical, HiPlus } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  onNewFile: () => void;
  onNewFolder: () => void;
  onRefresh: () => void;
  onSync: () => void;
}

export const SidebarHeader = ({
  onNewFile,
  onNewFolder,
  onRefresh,
  onSync,
}: Props) => {
  return (
    <div className="flex w-full items-center justify-between border-b border-zinc-800 px-4 py-4">
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={onNewFile}>
          <HiPlus className="text-base" />
          <span className="ml-1">New Note</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={onNewFolder}>
          <HiPlus className="text-base" />
          <span className="ml-1">Folder</span>
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <HiDotsVertical className="text-base text-zinc-300 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32 dark">
          <DropdownMenuItem onClick={onRefresh}>Refresh</DropdownMenuItem>
          <DropdownMenuItem onClick={onSync}>Sync</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
