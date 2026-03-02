import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting: externalIsDeleting,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleting = externalIsDeleting ?? isDeleting;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Error is handled by parent component
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={deleting ? undefined : onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleting}
            aria-busy={deleting}
          >
            {deleting ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
