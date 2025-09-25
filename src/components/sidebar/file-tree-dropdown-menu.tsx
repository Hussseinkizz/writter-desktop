import React from "react";
import {
  HiDocumentPlus,
  HiFolderPlus,
  HiPencil,
  HiTrash,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { HiDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FileNode } from "@/utils/build-tree";

interface FileTreeDropdownMenuProps {
  node: FileNode;
  isDir: boolean;
  startRename: (path: string, currentName: string) => void;
  setConfirmingDeletePath: (path: string) => void;
  setMovingFilePath: (path: string) => void;
  onCreateFileInFolder?: (folderPath: string) => void;
  onCreateFolderInFolder?: (folderPath: string) => void;
}

export const FileTreeDropdownMenu: React.FC<FileTreeDropdownMenuProps> = ({
  node,
  isDir,
  startRename,
  setConfirmingDeletePath,
  setMovingFilePath,
  onCreateFileInFolder,
  onCreateFolderInFolder,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HiDotsVertical className="text-base text-zinc-300 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 dark">
        {isDir && (
          <>
            <DropdownMenuItem onClick={() => onCreateFileInFolder?.(node.path)}>
              <HiDocumentPlus className="mr-2" /> New File
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateFolderInFolder?.(node.path)}
            >
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
