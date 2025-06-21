import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteDialogProps {
  confirmingDeletePath: string | null;
  setConfirmingDeletePath: (path: string | null) => void;
  onDelete: (path: string) => void;
  getDisplayPath: (path: string) => string;
}

export const DeleteDialog = ({
  confirmingDeletePath,
  setConfirmingDeletePath,
  getDisplayPath,
  onDelete,
}: DeleteDialogProps) => {
  return (
    <Dialog
      open={!!confirmingDeletePath}
      onOpenChange={() => setConfirmingDeletePath(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete File or Folder</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-mono">
              {getDisplayPath(confirmingDeletePath || '')}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setConfirmingDeletePath(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirmingDeletePath) {
                onDelete(confirmingDeletePath);
                setConfirmingDeletePath(null);
              }
            }}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
