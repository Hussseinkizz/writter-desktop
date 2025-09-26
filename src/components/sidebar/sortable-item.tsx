import React from 'react';
import {
  HiDocument,
  HiFolder,
  HiFolderOpen,
  HiPencil,
  HiTrash,
  HiArrowRightOnRectangle,
  HiDocumentPlus,
  HiFolderPlus,
  HiChevronDown,
  HiChevronRight,
} from 'react-icons/hi2';
import { HiDotsVertical } from 'react-icons/hi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileTreeDropdownMenu } from './file-tree-dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { FileNode } from '@/utils/build-tree';
import { motion } from 'framer-motion';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  unsavedPaths: string[];
  openFolders: Record<string, boolean>;
  onFileSelected: (path: string) => void;
  toggleFolder: (path: string) => void;
  startRename: (path: string, currentName: string) => void;
  setConfirmingDeletePath: (path: string) => void;
  setMovingFilePath: (path: string) => void;
  onCreateFileInFolder?: (folderPath: string) => void;
  onCreateFolderInFolder?: (folderPath: string) => void;
  index: number;
}

/**
 * FileTreeItem component - replaces SortableItem with simpler implementation
 * Removed drag/drop functionality and added move option to context menu
 */
export const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node,
  depth,
  selectedPath,
  unsavedPaths,
  openFolders,
  onFileSelected,
  toggleFolder,
  startRename,
  setConfirmingDeletePath,
  setMovingFilePath,
  onCreateFileInFolder,
  onCreateFolderInFolder,
  index,
}) => {
  const isSelected = selectedPath === node.path;
  const hasUnsaved = unsavedPaths.includes(node.path);
  const isDir = node.isDir;
  const isOpen = openFolders[node.path] ?? false;

  const style = {
    paddingLeft: depth * 3, // 3px per depth level
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
        delay: index * 0.03, // Stagger animation
      }}
      className="w-full">
      <ContextMenu key={node.path}>
        <ContextMenuTrigger
          asChild
          className="flex items-center justify-start gap-2 w-full">
          <div
            style={style}
            className={`group flex items-center justify-start gap-2 --text-sm cursor-pointer rounded-md w-full p-2 transition-colors duration-150 ${
              isSelected
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
            onClick={() => {
              if (isDir) {
                toggleFolder(node.path);
              } else {
                onFileSelected(node.path);
              }
            }}>
            <div className="flex items-center justify-start gap-2 overflow-hidden w-full group">
              {isDir && (
                <div className="flex items-center">
                  {isOpen ? (
                    <HiChevronDown className="text-zinc-400 w-4 h-4" />
                  ) : (
                    <HiChevronRight className="text-zinc-400 w-4 h-4" />
                  )}
                </div>
              )}
              {isDir ? (
                isOpen ? (
                  <HiFolderOpen className="text-amber-400" />
                ) : (
                  <HiFolder className="text-amber-400" />
                )
              ) : (
                <HiDocument className="text-gray-400" />
              )}
              <span className="truncate">{node.name}</span>
            </div>
            {hasUnsaved && !isDir && (
              <span className="text-green-400 ml-auto">●</span>
            )}
            <FileTreeDropdownMenu
              node={node}
              isDir={isDir}
              startRename={startRename}
              setConfirmingDeletePath={setConfirmingDeletePath}
              setMovingFilePath={setMovingFilePath}
              onCreateFileInFolder={onCreateFileInFolder}
              onCreateFolderInFolder={onCreateFolderInFolder}
              isActive={isSelected}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 dark">
          {isDir && (
            <>
              <ContextMenuItem
                onClick={() => onCreateFileInFolder?.(node.path)}>
                <HiDocumentPlus className="mr-2" /> New File
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => onCreateFolderInFolder?.(node.path)}>
                <HiFolderPlus className="mr-2" /> New Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem onClick={() => startRename(node.path, node.name)}>
            <HiPencil className="mr-2" /> Rename
          </ContextMenuItem>
          {!isDir && (
            <ContextMenuItem onClick={() => setMovingFilePath(node.path)}>
              <HiArrowRightOnRectangle className="mr-2" /> Move to Folder
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => setConfirmingDeletePath(node.path)}>
            <HiTrash className="mr-2" /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </motion.div>
  );
};
