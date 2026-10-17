// LanguageContext: keeps the chosen language (en / he) for the whole app.
// Any component can call useLanguage() to get { lang, setLang, t, dir }.
import { createContext, useContext, useEffect, useState } from 'react';
import { languages, translate } from '../i18n/index.js';

const STORAGE_KEY = 'freeway_lang';
const LanguageContext = createContext(null);

// Reads the saved language from localStorage (may fail in private mode - then use 'en')
function loadSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'he' || saved === 'en') return saved;
  } catch {
    // ignore - fall back to the default
  }
  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(loadSavedLanguage);
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  // Tell the browser the language and the text direction (this flips the whole layout)
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  function setLang(newLang) {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore - the choice just will not be remembered
    }
  }

  // t('login.title') -> 'Welcome back' / 'ברוכים השבים'
  function t(key) {
    return translate(languages[lang], key);
  }

  const value = { lang: lang, setLang: setLang, t: t, dir: dir };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
