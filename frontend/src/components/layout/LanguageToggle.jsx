// LanguageToggle: small round button that switches between English and Hebrew.
// Shows the OTHER language ("עב" when the app is in English, "EN" when in Hebrew).
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  const next = lang === 'he' ? 'en' : 'he';

  return (
    <button type="button" className="round-button lang-button" onClick={() => setLang(next)} title={t('topbar.language')} aria-label={t('topbar.language')}>
      {next === 'he' ? 'עב' : 'EN'}
    </button>
  );
}
