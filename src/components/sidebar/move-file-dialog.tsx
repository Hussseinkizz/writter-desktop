import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { FileNode } from '@/utils/build-tree';
import { HiFolder } from 'react-icons/hi2';

interface MoveFileDialogProps {
  movingFilePath: string | null;
  setMovingFilePath: (path: string | null) => void;
  tree: FileNode[];
  onMove: (fromPath: string, toFolderPath: string) => void;
  getDisplayPath: (path: string) => string;
}

/**
 * MoveFileDialog component for moving files to different folders
 * Replaces the drag/drop functionality with a proper dialog interface
 */
export const MoveFileDialog = ({
  movingFilePath,
  setMovingFilePath,
  tree,
  onMove,
  getDisplayPath,
}: MoveFileDialogProps) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  // Get all folders from the tree (excluding the current file's parent)
  const getAllFolders = (
    nodes: FileNode[],
    currentFilePath: string | null
  ): FileNode[] => {
    let folders: FileNode[] = [];

    for (const node of nodes) {
      if (node.isDir) {
        // Don't include the current file's parent folder
        const currentFileParent = currentFilePath?.substring(
          0,
          currentFilePath.lastIndexOf('/')
        );
        if (node.path !== currentFileParent) {
          folders.push(node);
        }

        // Recursively get subfolders
        if (node.children) {
          folders = folders.concat(
            getAllFolders(node.children, currentFilePath)
          );
        }
      }
    }

    return folders;
  };

  const availableFolders = getAllFolders(tree, movingFilePath);

  // Reset selection when dialog opens
  useEffect(() => {
    if (movingFilePath) {
      setSelectedFolder('');
    }
  }, [movingFilePath]);

  const handleMove = () => {
    if (movingFilePath && selectedFolder) {
      onMove(movingFilePath, selectedFolder);
      setMovingFilePath(null);
      setSelectedFolder('');
    }
  };

  const fileName = movingFilePath ? movingFilePath.split('/').pop() : '';

  return (
    <Dialog
      open={!!movingFilePath}
      onOpenChange={() => setMovingFilePath(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move File</DialogTitle>
          <DialogDescription>
            Choose a destination folder for{' '}
            <span className="font-mono text-violet-500">{fileName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select destination folder:
            </label>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a folder..." />
              </SelectTrigger>
              <SelectContent>
                {availableFolders.length === 0 ? (
                  <SelectItem value="" disabled>
                    No other folders available
                  </SelectItem>
                ) : (
                  availableFolders.map((folder) => (
                    <SelectItem key={folder.path} value={folder.path}>
                      <div className="flex items-center gap-2">
                        <HiFolder className="text-violet-500" />
                        <span>{getDisplayPath(folder.path)}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="secondary" onClick={() => setMovingFilePath(null)}>
            Cancel
          </Button>
          <Button onClick={handleMove} disabled={!selectedFolder}>
            Move File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
