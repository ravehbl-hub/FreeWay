// ErrorMessage: red box with the error text and an optional "Try again" button
import { CircleAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ErrorMessage({ message, onRetry }) {
  const { t } = useLanguage();
  if (!message) return null;
  return (
    <div className="error-box" role="alert">
      <CircleAlert size={18} />
      <span>{t(message)}</span>
      {onRetry && (
        <button type="button" className="link-button" onClick={onRetry}>
          {t('common.tryAgain')}
        </button>
      )}
    </div>
  );
}
