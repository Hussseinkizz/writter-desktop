import { useState, useMemo } from 'react';
import { SidebarHeader } from './header';
import { SidebarSearch } from './search';
import { FileTree } from './file-tree';
import { FileNode } from '@/utils/build-tree';
import { filterTreeDeep } from '@/utils/tree-helpers';

interface Props {
  fileTree: FileNode[];
  selectedPath: string | null;
  unsavedPaths?: string[];
  onFileClick: (path: string) => void;
  onCreateNewFile: () => void;
  onCreateNewFolder: () => void;
  onRename: (path: string, newName: string) => void;
  onDelete: (path: string) => void;
  onDrop: (from: string, to: string) => void;
  onRefresh: () => void;
  onSync: () => void;
  changeFolder: () => void;
  openSettings: () => void;
}

export const Sidebar = ({
  fileTree,
  selectedPath,
  unsavedPaths = [],
  onFileClick,
  onCreateNewFile,
  onCreateNewFolder,
  onRename,
  onDelete,
  onDrop,
  onRefresh,
  onSync,
  changeFolder,
  openSettings,
}: Props) => {
  const [search, setSearch] = useState('');

  // Memoize filteredTree for performance
  const filteredTree = useMemo(() => {
    if (!search.trim()) return fileTree;
    return filterTreeDeep(fileTree, search);
  }, [fileTree, search]);

  return (
    <div className="flex dark h-full w-full flex-col bg-zinc-900 text-white">
      <SidebarHeader
        openSettings={openSettings}
        changeFolder={changeFolder}
        onNewFile={onCreateNewFile}
        onNewFolder={onCreateNewFolder}
        onRefresh={onRefresh}
        onSync={onSync}
      />
      <SidebarSearch onChange={setSearch} />
      <div className="flex-1 overflow-auto px-4 py-2">
        <FileTree
          tree={filteredTree}
          selectedPath={selectedPath}
          onFileSelected={onFileClick}
          onRename={onRename}
          onDelete={onDelete}
          onDrop={onDrop}
          unsavedPaths={unsavedPaths}
        />
      </div>
    </div>
  );
};
