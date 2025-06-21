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

export const CreateFileDialog = ({
  open,
  setOpen,
  parentPath,
  fileName,
  setFileName,
  confirmCreate,
  errorMessage,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentPath: string;
  fileName: string;
  setFileName: (value: string) => void;
  confirmCreate: () => void;
  errorMessage?: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File</DialogTitle>
          <DialogDescription>
            Enter a name for the new file in{' '}
            <span className="font-mono">{parentPath}</span>
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="e.g. note.md"
          value={fileName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFileName(e.target.value)
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
            disabled={!fileName.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
