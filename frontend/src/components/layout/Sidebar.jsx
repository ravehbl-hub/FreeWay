// Sidebar: the icon-only navigation on the left (bottom bar on mobile)
import { NavLink } from 'react-router-dom';
import { Car, CalendarDays, House, MessageSquareText, Settings, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const LINKS = [
  { to: '/', label: 'Dashboard', icon: House },
  { to: '/vehicles', label: 'Vehicles', icon: Car },
  { to: '/bookings', label: 'My bookings', icon: CalendarDays },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquareText },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <nav className="sidebar" aria-label="Main navigation">
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className="sidebar-link" title={link.label} aria-label={link.label}>
            <Icon size={22} strokeWidth={1.7} />
          </NavLink>
        );
      })}
      {isAdmin && (
        <NavLink to="/admin" className="sidebar-link" title="Admin" aria-label="Admin">
          <Shield size={22} strokeWidth={1.7} />
        </NavLink>
      )}
      <NavLink to="/profile#settings" className="sidebar-link sidebar-settings" title="Settings" aria-label="Settings">
        <Settings size={22} strokeWidth={1.7} />
      </NavLink>
    </nav>
  );
}
