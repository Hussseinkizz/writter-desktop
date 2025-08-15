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

export const CreateFolderDialog = ({
  open,
  setOpen,
  parentPath,
  folderName,
  setFolderName,
  confirmCreate,
  errorMessage,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentPath: string;
  folderName: string;
  setFolderName: (value: string) => void;
  confirmCreate: () => void;
  errorMessage?: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for the new folder in{' '}
            <span className="font-mono">{parentPath}</span>
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="e.g. my-notes"
          value={folderName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFolderName(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') confirmCreate();
            else if (e.key === 'Escape') setOpen(false);
          }}
        />
        {errorMessage && (
          <div className="text-sm text-red-500 mt-1">{errorMessage}</div>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={confirmCreate}
            disabled={!folderName.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};