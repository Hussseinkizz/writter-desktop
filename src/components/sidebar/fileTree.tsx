import { useEffect, useRef, useState } from 'react';
import {
  HiDocument,
  HiFolder,
  HiFolderOpen,
  HiPencil,
  HiTrash,
} from 'react-icons/hi2';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileNode } from '@/utils/build-tree';

interface Props {
  tree: FileNode[];
  selectedPath: string | null;
  unsavedPaths?: string[];
  onClick: (path: string) => void;
  onRename: (path: string, newName: string) => void;
  onDelete: (path: string) => void;
  onDrop: (fromPath: string, toPath: string) => void;
}

export const FileTree = ({
  tree,
  selectedPath,
  unsavedPaths = [],
  onClick,
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
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const startRename = (path: string, currentName: string) => {
    setRenamingPath(path);
    setRenameValue(currentName);
    setConfirmingDeletePath(null);
  };

  const confirmRename = () => {
    if (renamingPath && renameValue.trim()) {
      onRename(renamingPath, renameValue.trim());
    }
    setRenamingPath(null);
    setRenameValue('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedPath) return;

    if (pendingDrop) {
      if (e.key.toLowerCase() === 'y') {
        onDrop(pendingDrop.from, pendingDrop.to);
        setPendingDrop(null);
      } else if (e.key.toLowerCase() === 'n') {
        setPendingDrop(null);
      }
      return;
    }

    if (confirmingDeletePath) {
      if (e.key.toLowerCase() === 'y') {
        onDelete(confirmingDeletePath);
        setConfirmingDeletePath(null);
      } else if (e.key.toLowerCase() === 'n') {
        setConfirmingDeletePath(null);
      }
      return;
    }

    if (e.key === 'F2') {
      e.preventDefault();
      const name = selectedPath.split('/').pop() || '';
      startRename(selectedPath, name);
    } else if (e.key === 'Delete') {
      e.preventDefault();
      setConfirmingDeletePath(selectedPath);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPath, confirmingDeletePath, pendingDrop]);

  useEffect(() => {
    if (renamingPath && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renamingPath]);

  const SortableItem = ({ node, depth }: { node: FileNode; depth: number }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: node.path });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      paddingLeft: depth * 16,
    };

    const isSelected = selectedPath === node.path;
    const hasUnsaved = unsavedPaths.includes(node.path);
    const isRenaming = renamingPath === node.path;
    const isConfirmingDelete = confirmingDeletePath === node.path;
    const isDir = node.isDir;
    const isOpen = openFolders[node.path] ?? true;

    return (
      <ContextMenu key={node.path}>
        <ContextMenuTrigger asChild>
          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            onClick={() => onClick(node.path)}
            className={`flex items-center justify-between gap-2 text-sm cursor-pointer rounded-md ${
              isSelected
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}>
            <div
              className="flex items-center gap-2 overflow-hidden w-full"
              onClick={(e) => {
                e.stopPropagation();
                if (isDir) toggleFolder(node.path);
              }}>
              {isDir ? (
                isOpen ? (
                  <HiFolderOpen />
                ) : (
                  <HiFolder />
                )
              ) : (
                <HiDocument />
              )}
              {isRenaming ? (
                <input
                  ref={inputRef}
                  className="bg-transparent border-b border-white outline-none text-white flex-1"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={confirmRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmRename();
                    else if (e.key === 'Escape') setRenamingPath(null);
                  }}
                />
              ) : isConfirmingDelete ? (
                <span className="text-red-400 text-xs truncate">
                  Are you sure? (y/n)
                </span>
              ) : (
                <span className="truncate">{node.name}</span>
              )}
            </div>
            {hasUnsaved && !isDir && <span className="text-green-400">●</span>}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem onClick={() => startRename(node.path, node.name)}>
            <HiPencil className="mr-2" /> Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setConfirmingDeletePath(node.path)}>
            <HiTrash className="mr-2" /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
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
          <div>
            {flattenedItems.map((node) => (
              <SortableItem
                key={node.path}
                node={node}
                depth={node.path.split('/').length - 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {pendingDrop && (
        <div className="text-sm text-center bg-zinc-800 py-2 px-4 border-t border-zinc-700 flex justify-center gap-4">
          <span>
            Move <code className="text-blue-300">{pendingDrop.from}</code> under{' '}
            <code className="text-blue-300">{pendingDrop.to}</code>? (y/n)
          </span>
        </div>
      )}
    </>
  );
};
