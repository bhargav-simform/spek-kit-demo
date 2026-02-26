import './EmptyState.css';

interface EmptyStateProps {
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  message,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📷</div>
      <h2>{message}</h2>
      {description && <p>{description}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
