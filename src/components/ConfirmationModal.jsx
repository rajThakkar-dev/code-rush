import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 backdrop-blur-sm"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="panel w-full max-w-md p-6">
        <div className="flex items-start justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: 'rgba(251,113,133,0.1)', color: '#fda4af' }}>
            <AlertTriangle size={20} />
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 transition hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <h2 id="confirm-title" className="mt-5 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
          {message}
        </p>
        <div className="mt-6 flex gap-2">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            className="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-3 font-semibold text-white transition hover:opacity-90"
            style={{ background: '#ef4444' }}
          >
            Yes, nuke it
          </button>
        </div>
      </div>
    </div>
  );
}
