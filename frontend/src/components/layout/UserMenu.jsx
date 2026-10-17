// UserMenu: the round user button in the topbar opens a small menu
// (Profile, Payment method, Log out). Closes when clicking outside.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, LogOut, User, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-menu" ref={menuRef}>
      <button type="button" className="round-button" onClick={() => setOpen(!open)} aria-label={t('topbar.profile')} aria-expanded={open}>
        <User size={20} strokeWidth={1.7} />
      </button>
      {open && (
        <div className="user-menu-dropdown">
          <div className="user-menu-head">
            <strong>{user.name}</strong>
            <span className="muted">{user.email}</span>
          </div>
          <Link to="/profile" className="user-menu-item" onClick={() => setOpen(false)}>
            <UserCircle size={18} /> {t('menu.profile')}
          </Link>
          <Link to="/payment-method" className="user-menu-item" onClick={() => setOpen(false)}>
            <CreditCard size={18} /> {t('menu.paymentMethod')}
          </Link>
          <button type="button" className="user-menu-item" onClick={logout}>
            <LogOut size={18} /> {t('topbar.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
