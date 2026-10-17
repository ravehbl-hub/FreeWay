// AuthLayout: centered white card used by the Login and Register pages (with a language toggle)
import { useLanguage } from '../../context/LanguageContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';

export default function AuthLayout({ title, subtitle, children }) {
  const { t } = useLanguage();
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <p className="brand brand-large">
          Free<span>Way</span>
        </p>
        <h1>{t('auth.tagline')}</h1>
        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Volvo%20EX30%20Auto%20Zuerich%202023%201X7A0949.jpg?width=1200" alt={t('auth.heroAlt')} />
      </div>
      <div className="card auth-card">
        <div className="auth-card-top">
          <LanguageToggle />
        </div>
        <h2>{title}</h2>
        <p className="muted">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
