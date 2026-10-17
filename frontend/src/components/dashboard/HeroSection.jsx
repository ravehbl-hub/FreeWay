// HeroSection: big headline, availability chip and a stylized silver car (PNG cutout, re-toned to match the UI)
import { useLanguage } from '../../context/LanguageContext.jsx';

const HERO_PHOTO = '/cars/hero.png';

export default function HeroSection({ availability }) {
  const { t } = useLanguage();
  const isAvailable = availability > 0;
  return (
    <section className="hero">
      <h1 className="hero-title">
        {t('dashboard.heroTitle1')}
        <br />
        {t('dashboard.heroTitle2')}
      </h1>
      <p className="hero-subtitle">{t('dashboard.heroSubtitle')}</p>
      <span className="chip">
        <span className={isAvailable ? 'dot dot-green' : 'dot dot-grey'} />
        {isAvailable ? t('dashboard.available') : t('dashboard.noneAvailable')}
      </span>
      <img className="hero-car" src={HERO_PHOTO} alt={t('dashboard.heroAlt')} />
    </section>
  );
}
