import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FileNode } from '@/utils/build-tree';
import { SortableItem } from './sortable-item';
import { DeleteDialog } from './delete-dialog';
import { ReorderDialog } from './reorder-dialog';
import { RenameDialog } from './rename-dialog';

interface Props {
  tree: FileNode[];
  selectedPath: string | null;
  unsavedPaths?: string[];
  onFileSelected: (path: string) => void;
  onRename: (path: string, newName: string) => void;
  onDelete: (path: string) => void;
  onDrop: (fromPath: string, toPath: string) => void;
}

export const FileTree = ({
  tree,
  selectedPath,
  unsavedPaths = [],
  onFileSelected,
  onRename,
  onDelete,
  onDrop,
}: Props) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmingDeletePath, setConfirmingDeletePath] = useState<
    string | null
  >(null);
  const [pendingDrop, setPendingDrop] = useState<{
    from: string;
    to: string;
  } | null>(null);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPendingDrop({ from: active.id as string, to: over.id as string });
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={flattenedItems.map((n) => n.path)}
          strategy={verticalListSortingStrategy}>
          <div className="flex w-full flex-col gap-2 items-start justify-start">
            {flattenedItems.map((node) => (
              <SortableItem
                onFileSelected={onFileSelected}
                openFolders={openFolders}
                selectedPath={selectedPath}
                unsavedPaths={unsavedPaths}
                toggleFolder={toggleFolder}
                setConfirmingDeletePath={setConfirmingDeletePath}
                startRename={startRename}
                key={node.path}
                node={node}
                depth={node.path.split('/').length - 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Delete Modal */}
      <DeleteDialog
        confirmingDeletePath={confirmingDeletePath}
        setConfirmingDeletePath={setConfirmingDeletePath}
        getDisplayPath={getDisplayPath}
        onDelete={onDelete}
      />
      {/* Reorder Modal */}
      <ReorderDialog
        pendingDrop={pendingDrop}
        setPendingDrop={setPendingDrop}
        onDrop={onDrop}
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
