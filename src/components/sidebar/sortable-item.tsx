import React, { useRef } from 'react';
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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileNode } from '@/utils/build-tree';

interface SortableItemProps {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  unsavedPaths: string[];
  openFolders: Record<string, boolean>;
  onFileSelected: (path: string) => void;
  toggleFolder: (path: string) => void;
  startRename: (path: string, currentName: string) => void;
  setConfirmingDeletePath: (path: string) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  node,
  depth,
  selectedPath,
  unsavedPaths,
  openFolders,
  onFileSelected,
  toggleFolder,
  startRename,
  setConfirmingDeletePath,
}) => {
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
    paddingLeft: depth * 1,
    padding: '0.5em',
    cursor: isDragging ? 'grab' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    width: '100%',
  };

  const isSelected = selectedPath === node.path;
  const hasUnsaved = unsavedPaths.includes(node.path);
  const isDir = node.isDir;
  const isOpen = openFolders[node.path] ?? true;
  const DRAG_CLICK_THRESHOLD = 4; // pixels
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  return (
    <ContextMenu key={node.path}>
      <ContextMenuTrigger
        asChild
        className="flex items-center justify-start gap-2 w-full">
        <div
          ref={setNodeRef}
          {...attributes}
          style={style}
          className={`flex items-center justify-start gap-2 text-sm cursor-pointer rounded-md w-full ${
            isSelected
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:bg-zinc-800'
          }`}
          onPointerDown={(e) => {
            pointerDown.current = { x: e.clientX, y: e.clientY };
            // Call dnd-kit pointer down listener!
            listeners?.onPointerDown?.(e);
          }}
          onPointerUp={(e) => {
            if (!pointerDown.current) return;
            const dx = Math.abs(e.clientX - pointerDown.current.x);
            const dy = Math.abs(e.clientY - pointerDown.current.y);
            pointerDown.current = null;
            if (dx < DRAG_CLICK_THRESHOLD && dy < DRAG_CLICK_THRESHOLD) {
              if (!isDir) onFileSelected(node.path);
            }
          }}>
          <div
            className="flex items-center justify-start gap-2 overflow-hidden w-full"
            onClick={(e) => {
              if (isDir) {
                e.stopPropagation();
                toggleFolder(node.path);
              }
            }}>
            {isDir ? isOpen ? <HiFolderOpen /> : <HiFolder /> : <HiDocument />}
            <span className="truncate">{node.name}</span>
          </div>
          {hasUnsaved && !isDir && <span className="text-green-400">●</span>}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-40 dark">
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
