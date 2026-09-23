"use client";

import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-sm">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-secondary select-none">{message}</p>
        <div className="flex items-center justify-end gap-3 mt-2">
          <Button variant="secondary" onClick={onClose} disabled={loading} size="sm">
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} loading={loading} size="sm">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
