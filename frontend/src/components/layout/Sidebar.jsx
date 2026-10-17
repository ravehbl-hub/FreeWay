// Sidebar: the icon-only navigation on the side (bottom bar on mobile)
import { NavLink } from 'react-router-dom';
import { Car, CalendarDays, House, Settings, Shield, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const LINKS = [
  { to: '/', label: 'nav.dashboard', icon: House },
  { to: '/vehicles', label: 'nav.vehicles', icon: Car },
  { to: '/bookings', label: 'nav.bookings', icon: CalendarDays },
  { to: '/assistant', label: 'nav.assistant', icon: Sparkles },
  { to: '/profile', label: 'nav.profile', icon: User },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="sidebar" aria-label={t('nav.main')}>
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className="sidebar-link" title={t(link.label)} aria-label={t(link.label)}>
            <Icon size={22} strokeWidth={1.7} />
          </NavLink>
        );
      })}
      {isAdmin && (
        <NavLink to="/admin" className="sidebar-link" title={t('nav.admin')} aria-label={t('nav.admin')}>
          <Shield size={22} strokeWidth={1.7} />
        </NavLink>
      )}
      <NavLink to="/profile#settings" className="sidebar-link sidebar-settings" title={t('nav.settings')} aria-label={t('nav.settings')}>
        <Settings size={22} strokeWidth={1.7} />
      </NavLink>
    </nav>
  );
}
