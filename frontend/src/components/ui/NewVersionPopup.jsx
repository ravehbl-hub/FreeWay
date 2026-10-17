// NewVersionPopup: two jobs.
// 1. After a deploy: show "What's new" once (the last BUILD_ID the user saw is in localStorage).
// 2. While the app is open: every minute fetch /build.json; if the server has a newer build,
//    ask the user: "Reload now" or "Later" (Later hides the question for that build).
import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { APP_VERSION, BUILD_ID, BUILD_MESSAGE, BUILD_DATE, CHANGES } from '../../version.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { longDate } from '../../utils/format.js';

const STORAGE_KEY = 'freeway_seen_version';
const CHECK_EVERY_MS = 60 * 1000;

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
  const [newer, setNewer] = useState(null); // build info of a newer deploy, if found
  const [dismissedId, setDismissedId] = useState(''); // build the user chose "Later" for

  // Ask the server every minute whether a newer build was deployed
  useEffect(() => {
    async function check() {
      try {
        const response = await fetch('/build.json?t=' + Date.now(), { cache: 'no-store' });
        if (!response.ok) return;
        const info = await response.json();
        if (info.id && info.id !== BUILD_ID && info.id !== dismissedId) setNewer(info);
      } catch {
        // Offline or blocked - try again next minute
      }
    }
    const timer = setInterval(check, CHECK_EVERY_MS);
    return () => clearInterval(timer);
  }, [dismissedId]);

  function close() {
    saveSeenVersion();
    setOpen(false);
  }

  function later() {
    setDismissedId(newer.id);
    setNewer(null);
  }

  // A newer deploy exists: ask the user to reload now or later
  if (newer) {
    return (
      <div className="popup-backdrop">
        <div className="popup-card" role="dialog" aria-modal="true">
          <div className="popup-icon">
            <Sparkles size={22} />
          </div>
          <h2>{t('whatsNew.updateTitle')}</h2>
          <p className="popup-version">{t('whatsNew.updateText')}</p>
          {newer.message ? <p className="popup-message">{newer.message}</p> : null}
          <div className="popup-actions">
            <button type="button" className="button button-light" onClick={later}>
              {t('whatsNew.later')}
            </button>
            <button type="button" className="button button-green" onClick={() => window.location.reload()}>
              {t('whatsNew.reload')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!open) return null;

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
