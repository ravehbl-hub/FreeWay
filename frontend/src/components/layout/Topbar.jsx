// Topbar: round notification + profile buttons in the top-right corner
import { Link } from 'react-router-dom';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        Free<span>Way</span>
      </Link>
      <div className="topbar-actions">
        <span className="topbar-hello">Hi, {user.name.split(' ')[0]}</span>
        <Link to="/bookings" className="round-button" aria-label="Notifications">
          <Bell size={20} strokeWidth={1.7} />
        </Link>
        <Link to="/profile" className="round-button" aria-label="Profile">
          <User size={20} strokeWidth={1.7} />
        </Link>
        <button type="button" className="round-button" onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={20} strokeWidth={1.7} />
        </button>
      </div>
    </header>
  );
}
