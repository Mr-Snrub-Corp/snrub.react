import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  header: string;
  confirmButtonLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmDialog({
  open,
  header,
  confirmButtonLabel,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="delete-confirm-dialog-title">
            {header}
          </DialogTitle>
          <DialogDescription data-testid="delete-confirm-dialog-description">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            data-testid="delete-confirm-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            data-testid="delete-confirm-submit-btn"
            onClick={onConfirm}
          >
            {confirmButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteConfirmDialog;
