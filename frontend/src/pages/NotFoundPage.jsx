// NotFoundPage: shown for unknown URLs
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="not-found">
      <h1 className="page-title">404</h1>
      <p className="page-subtitle">{t('notFound.text')}</p>
      <Link to="/" className="button button-green">
        {t('notFound.back')}
      </Link>
    </div>
  );
}
