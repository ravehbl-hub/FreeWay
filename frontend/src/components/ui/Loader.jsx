// Loader: spinner shown while data is loading
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function Loader({ text, fullPage = false }) {
  const { t } = useLanguage();
  return (
    <div className={fullPage ? 'loader loader-full' : 'loader'} role="status">
      <span className="spinner" />
      <span>{text ? t(text) : t('common.loading')}</span>
    </div>
  );
}
