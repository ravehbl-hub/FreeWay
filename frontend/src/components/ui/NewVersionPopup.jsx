// NewVersionPopup: shows "What's new" once after every new app version.
// The last version the user saw is kept in localStorage under 'freeway_seen_version'.
import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { APP_VERSION, CHANGES } from '../../version.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const STORAGE_KEY = 'freeway_seen_version';

function readSeenVersion() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveSeenVersion() {
  try {
    localStorage.setItem(STORAGE_KEY, APP_VERSION);
  } catch {
    // Browser storage is blocked - the popup will simply show again next time
  }
}

export default function NewVersionPopup() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(readSeenVersion() !== APP_VERSION);

  if (!open) return null;

  function close() {
    saveSeenVersion();
    setOpen(false);
  }

  return (
    <div className="popup-backdrop" onClick={close}>
      <div className="popup-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="popup-close" onClick={close} aria-label={t('common.close')}>
          <X size={18} />
        </button>
        <div className="popup-icon">
          <Sparkles size={22} />
        </div>
        <h2>{t('whatsNew.title')}</h2>
        <p className="popup-version">{t('whatsNew.version')} {APP_VERSION}</p>
        <ul className="popup-list">
          {CHANGES.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
        <button type="button" className="button button-green button-block" onClick={close}>
          {t('whatsNew.gotIt')}
        </button>
      </div>
    </div>
  );
}
