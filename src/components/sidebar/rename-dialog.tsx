import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const RenameDialog = ({
  renamingPath,
  setRenamingPath,
  getDisplayPath,
  renameValue,
  setRenameValue,
  confirmRename,
}: {
  renamingPath: string | null;
  setRenamingPath: (path: string | null) => void;
  getDisplayPath: (path: string) => string;
  renameValue: string;
  setRenameValue: (value: string) => void;
  confirmRename: () => void;
}) => {
  return (
    <Dialog open={!!renamingPath} onOpenChange={() => setRenamingPath(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
          <DialogDescription>
            Enter a new name for{' '}
            <span className="font-mono">
              {getDisplayPath(renamingPath || '')}
            </span>
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          value={renameValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRenameValue(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') confirmRename();
            else if (e.key === 'Escape') setRenamingPath(null);
          }}
        />
        <DialogFooter>
          <Button variant="secondary" onClick={() => setRenamingPath(null)}>
            Cancel
          </Button>
          <Button variant="default" onClick={confirmRename}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
