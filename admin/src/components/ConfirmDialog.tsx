import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="confirm-backdrop"
        onClick={loading ? undefined : onCancel}
        aria-label="Close confirmation dialog"
      />

      <div className="confirm-card">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}

        <div className="confirm-actions">
          <button type="button" className="muted" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className="danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
