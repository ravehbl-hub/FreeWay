// Finds rental dates and the pickup location written in a chat (user or assistant text),
// so "Book" can book right away. Dates: 20/10/2026, 20.10.2026 or 2026-10-20 (fallback: tomorrow + 3 days).
// Location: any branch name or alias (English / Hebrew); fallback: the first branch in the list.
import { todayISO } from './format.js';
import { PICKUP_PLACES } from './pickupLocations.js';

function pad(n) {
  return String(n).padStart(2, '0');
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Returns all dates found in the text as YYYY-MM-DD, in the order they appear
export function findDates(text) {
  const found = [];
  const dayFirst = text.matchAll(/\b(\d{1,2})[./](\d{1,2})[./](\d{4})\b/g);
  for (const m of dayFirst) found.push({ index: m.index, iso: m[3] + '-' + pad(m[2]) + '-' + pad(m[1]) });
  const iso = text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g);
  for (const m of iso) found.push({ index: m.index, iso: m[0] });
  return found.sort((a, b) => a.index - b.index).map((item) => item.iso);
}

// Picks start/end dates for a quick booking: the two future dates from the chat, or defaults
export function pickBookingDates(text) {
  const today = todayISO();
  const dates = findDates(text).filter((d) => d > today);
  if (dates.length >= 2 && dates[1] > dates[0]) {
    return { start_date: dates[0], end_date: dates[1], fromChat: true };
  }
  if (dates.length === 1) {
    return { start_date: dates[0], end_date: addDays(dates[0], 3), fromChat: true };
  }
  const start = addDays(today, 1);
  return { start_date: start, end_date: addDays(start, 3), fromChat: false };
}

// Finds the pickup location mentioned in the text. If several are mentioned, the LAST one wins
// (usually the one the user settled on). Longer aliases are checked first ("haifa port" before "haifa").
export function findLocation(text) {
  const lower = text.toLowerCase();
  let best = null;
  PICKUP_PLACES.forEach((place) => {
    const words = [place.name.toLowerCase(), ...place.aliases].sort((a, b) => b.length - a.length);
    words.forEach((word) => {
      const index = lower.lastIndexOf(word);
      if (index >= 0 && (!best || index > best.index || (index === best.index && word.length > best.length))) {
        best = { name: place.name, index: index, length: word.length };
      }
    });
  });
  return best ? best.name : null;
}
