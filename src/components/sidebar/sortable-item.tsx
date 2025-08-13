import React from 'react';
import {
  HiDocument,
  HiFolder,
  HiFolderOpen,
  HiPencil,
  HiTrash,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { FileNode } from '@/utils/build-tree';
import { motion } from 'framer-motion';

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
  index,
}) => {
  const isSelected = selectedPath === node.path;
  const hasUnsaved = unsavedPaths.includes(node.path);
  const isDir = node.isDir;
  const isOpen = openFolders[node.path] ?? true;

  const style = {
    paddingLeft: depth * 16, // 1rem = 16px
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeOut", 
        delay: index * 0.03 // Stagger animation
      }}
      className="w-full"
    >
      <ContextMenu key={node.path}>
        <ContextMenuTrigger
          asChild
          className="flex items-center justify-start gap-2 w-full"
        >
          <div
            style={style}
            className={`flex items-center justify-start gap-2 text-sm cursor-pointer rounded-md w-full p-2 transition-colors duration-150 ${
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
            }}
          >
            <div className="flex items-center justify-start gap-2 overflow-hidden w-full">
              {isDir ? (
                isOpen ? (
                  <HiFolderOpen className="text-blue-400" />
                ) : (
                  <HiFolder className="text-blue-400" />
                )
              ) : (
                <HiDocument className="text-gray-400" />
              )}
              <span className="truncate">{node.name}</span>
            </div>
            {hasUnsaved && !isDir && (
              <span className="text-green-400 ml-auto">●</span>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 dark">
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
