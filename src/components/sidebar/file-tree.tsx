import { useState } from 'react';
import { FileNode } from '@/utils/build-tree';
import { FileTreeItem } from './sortable-item'; // Reusing the file but renamed the component
import { DeleteDialog } from './delete-dialog';
import { RenameDialog } from './rename-dialog';
import { MoveFileDialog } from './move-file-dialog';
import { motion } from 'framer-motion';

interface Props {
  tree: FileNode[];
  selectedPath: string | null;
  unsavedPaths?: string[];
  onFileSelected: (path: string) => void;
  onRename: (path: string, newName: string) => void;
  onDelete: (path: string) => void;
  onMove: (fromPath: string, toFolderPath: string) => void;
}

/**
 * FileTree component that displays files and folders in a tree structure
 * Removed drag/drop functionality as requested, replaced with context menu move option
 */
export const FileTree = ({
  tree,
  selectedPath,
  unsavedPaths = [],
  onFileSelected,
  onRename,
  onDelete,
  onMove,
}: Props) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmingDeletePath, setConfirmingDeletePath] = useState<
    string | null
  >(null);
  const [movingFilePath, setMovingFilePath] = useState<string | null>(null);

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const startRename = (path: string, currentName: string) => {
    setRenamingPath(path);
    setRenameValue(currentName);
  };

  const confirmRename = () => {
    if (renamingPath && renameValue.trim()) {
      onRename(renamingPath, renameValue.trim());
    }
    setRenamingPath(null);
    setRenameValue('');
  };

  const getDisplayPath = (path: string) => {
    const segments = path.split('/');
    return segments.slice(-2).join('/');
  };

  const flattenTree = (nodes: FileNode[]): FileNode[] => {
    let result: FileNode[] = [];
    for (const node of nodes) {
      result.push(node);
      if (node.isDir && node.children && (openFolders[node.path] ?? true)) {
        result = result.concat(flattenTree(node.children));
      }
    }
    return result;
  };

  const flattenedItems = flattenTree(tree);

  return (
    <>
      <motion.div 
        className="flex w-full flex-col gap-2 items-start justify-start"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {flattenedItems.map((node, index) => (
          <FileTreeItem
            key={node.path}
            node={node}
            depth={node.path.split('/').length - 1}
            selectedPath={selectedPath}
            unsavedPaths={unsavedPaths}
            openFolders={openFolders}
            onFileSelected={onFileSelected}
            toggleFolder={toggleFolder}
            startRename={startRename}
            setConfirmingDeletePath={setConfirmingDeletePath}
            setMovingFilePath={setMovingFilePath}
            index={index}
          />
        ))}
      </motion.div>

      {/* Delete Modal */}
      <DeleteDialog
        confirmingDeletePath={confirmingDeletePath}
        setConfirmingDeletePath={setConfirmingDeletePath}
        getDisplayPath={getDisplayPath}
        onDelete={onDelete}
      />
      
      {/* Move File Modal */}
      <MoveFileDialog
        movingFilePath={movingFilePath}
        setMovingFilePath={setMovingFilePath}
        tree={tree}
        onMove={onMove}
        getDisplayPath={getDisplayPath}
      />
      
      {/* Rename Modal */}
      <RenameDialog
        renamingPath={renamingPath}
        setRenamingPath={setRenamingPath}
        getDisplayPath={getDisplayPath}
        renameValue={renameValue}
        setRenameValue={setRenameValue}
        confirmRename={confirmRename}
      />
    </>
  );
};
