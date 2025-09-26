import React from 'react';
import {
  HiDocumentPlus,
  HiFolderPlus,
  HiPencil,
  HiTrash,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';
import { HiDotsVertical } from 'react-icons/hi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { FileNode } from '@/utils/build-tree';

interface FileTreeDropdownMenuProps {
  node: FileNode;
  isDir: boolean;
  startRename: (path: string, currentName: string) => void;
  setConfirmingDeletePath: (path: string) => void;
  setMovingFilePath: (path: string) => void;
  onCreateFileInFolder?: (folderPath: string) => void;
  onCreateFolderInFolder?: (folderPath: string) => void;
  isActive?: boolean;
}

export const FileTreeDropdownMenu: React.FC<FileTreeDropdownMenuProps> = ({
  node,
  isDir,
  startRename,
  setConfirmingDeletePath,
  setMovingFilePath,
  onCreateFileInFolder,
  onCreateFolderInFolder,
  isActive = false,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
  <button
    type="button"
    tabIndex={-1}
    className="ml-1 bg-transparent border-none p-0 focus:outline-none"
    aria-label="Show file actions"
  >
    <HiDotsVertical
      className={`text-base cursor-pointer transition-colors ml-1
        ${isActive ? '!visible text-zinc-400' : '!invisible text-zinc-600 group-hover:!visible group-hover:text-zinc-400'}
        data-[state=open]:!visible
      `}
    />
  </button>
</DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 dark">
        {isDir && (
          <>
            <DropdownMenuItem onClick={() => onCreateFileInFolder?.(node.path)}>
              <HiDocumentPlus className="mr-2" /> New File
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateFolderInFolder?.(node.path)}>
              <HiFolderPlus className="mr-2" /> New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => startRename(node.path, node.name)}>
          <HiPencil className="mr-2" /> Rename
        </DropdownMenuItem>

        {!isDir && (
          <DropdownMenuItem onClick={() => setMovingFilePath(node.path)}>
            <HiArrowRightOnRectangle className="mr-2" /> Move to Folder
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => setConfirmingDeletePath(node.path)}>
          <HiTrash className="mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
