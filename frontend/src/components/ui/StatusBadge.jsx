// StatusBadge: colored pill for a booking status (text is translated)
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  return (
    <span className={'status-badge status-' + status}>
      <span className="dot" />
      {t('status.' + status)}
    </span>
  );
}
