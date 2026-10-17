// ErrorMessage: red box with the error text and an optional "Try again" button
import { CircleAlert } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-box" role="alert">
      <CircleAlert size={18} />
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="link-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
