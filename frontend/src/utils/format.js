// Formatting helpers for prices and dates. Date helpers take the language ('en' / 'he').
export function formatPrice(value) {
  return Number(value).toFixed(0) + ' €';
}

// Browser locale for each app language
export function localeFor(lang) {
  return lang === 'he' ? 'he-IL' : 'en-GB';
}

const MONTHS = {
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  he: ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'],
};

// '2026-07-04' -> { day: 4, month: 'JUL' }
export function dayAndMonth(isoDate, lang = 'en') {
  const parts = isoDate.split('-');
  const months = MONTHS[lang] || MONTHS.en;
  return { day: Number(parts[2]), month: months[Number(parts[1]) - 1] };
}

// '2026-07-04' -> 'Saturday, 4 July 2026' (or the Hebrew version)
export function longDate(isoDate, lang = 'en') {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString(localeFor(lang), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function daysBetween(startDate, endDate) {
  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(endDate + 'T00:00:00Z');
  return Math.round((end - start) / (24 * 60 * 60 * 1000));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
