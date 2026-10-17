// NewVersionPopup: shows "What's new" once after every deploy.
// The last BUILD_ID the user saw is kept in localStorage under 'freeway_seen_version'.
import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { APP_VERSION, BUILD_ID, BUILD_MESSAGE, BUILD_DATE, CHANGES } from '../../version.js';
import { longDate } from '../../utils/format.js';
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
    localStorage.setItem(STORAGE_KEY, BUILD_ID);
  } catch {
    // Browser storage is blocked - the popup will simply show again next time
  }
}

export default function NewVersionPopup() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(readSeenVersion() !== BUILD_ID);

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
        <p className="popup-version">
          {t('whatsNew.version')} {APP_VERSION} · {t('whatsNew.deployed')} {longDate(BUILD_DATE.slice(0, 10), lang)}
        </p>
        {BUILD_MESSAGE ? <p className="popup-message">{BUILD_MESSAGE}</p> : null}
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
