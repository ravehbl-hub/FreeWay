// Formatting helpers for prices and dates
export function formatPrice(value) {
  return Number(value).toFixed(0) + ' €';
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// '2026-07-04' -> { day: 4, month: 'JUL' }
export function dayAndMonth(isoDate) {
  const parts = isoDate.split('-');
  return { day: Number(parts[2]), month: MONTHS[Number(parts[1]) - 1] };
}

// '2026-07-04' -> 'Saturday, 4 July 2026'
export function longDate(isoDate) {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function daysBetween(startDate, endDate) {
  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(endDate + 'T00:00:00Z');
  return Math.round((end - start) / (24 * 60 * 60 * 1000));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function capitalize(text) {
  if (!text) return '';
  if (text === 'suv') return 'SUV';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
