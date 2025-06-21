import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ReorderDialogProps {
  pendingDrop: { from: string; to: string } | null;
  setPendingDrop: (value: { from: string; to: string } | null) => void;
  onDrop: (from: string, to: string) => void;
  getDisplayPath: (path: string) => string;
}

export const ReorderDialog = ({
  pendingDrop,
  setPendingDrop,
  onDrop,
  getDisplayPath,
}: ReorderDialogProps) => {
  return (
    <Dialog open={!!pendingDrop} onOpenChange={() => setPendingDrop(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reorder</DialogTitle>
          <DialogDescription>
            Move{' '}
            <span className="font-mono text-violet-500">
              {getDisplayPath(pendingDrop?.from || '')}
            </span>{' '}
            to{' '}
            <span className="font-mono text-green-500">
              {getDisplayPath(pendingDrop?.to || '')}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setPendingDrop(null)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => {
              if (pendingDrop) {
                onDrop(pendingDrop.from, pendingDrop.to);
                setPendingDrop(null);
              }
            }}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
