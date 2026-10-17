// Topbar: brand + greeting + round buttons (language, notifications, profile, log out)
import { Link } from 'react-router-dom';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        Free<span>Way</span>
      </Link>
      <div className="topbar-actions">
        <span className="topbar-hello">{t('topbar.hi').replace('{name}', user.name.split(' ')[0])}</span>
        <LanguageToggle />
        <Link to="/bookings" className="round-button" aria-label={t('topbar.notifications')}>
          <Bell size={20} strokeWidth={1.7} />
        </Link>
        <Link to="/profile" className="round-button" aria-label={t('topbar.profile')}>
          <User size={20} strokeWidth={1.7} />
        </Link>
        <button type="button" className="round-button" onClick={logout} aria-label={t('topbar.logout')} title={t('topbar.logout')}>
          <LogOut size={20} strokeWidth={1.7} />
        </button>
      </div>
    </header>
  );
}
