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
  description: string;
  confirmButtonLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmDialog({
  open,
  header,
  description,
  confirmButtonLabel,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="shared.delete-dialog.title">
            {header}
          </DialogTitle>
          <DialogDescription data-testid="shared.delete-dialog.description">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            data-testid="shared.delete-dialog.cancel-btn"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            data-testid="shared.delete-dialog.confirm-btn"
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
