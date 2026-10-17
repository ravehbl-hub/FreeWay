// Topbar: brand + greeting + round buttons (language, notifications) + the user menu
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import UserMenu from './UserMenu.jsx';

export default function Topbar() {
  const { user } = useAuth();
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
        <UserMenu />
      </div>
    </header>
  );
}
