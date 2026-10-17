// Date helpers used by bookings and AI services.
const DAY_MS = 24 * 60 * 60 * 1000;

// Number of rental days between two 'YYYY-MM-DD' dates (at least 1)
export function rentalDays(startDate, endDate) {
  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(endDate + 'T00:00:00Z');
  const days = Math.round((end - start) / DAY_MS);
  if (days < 1) {
    return 1;
  }
  return days;
}

// Today's date as 'YYYY-MM-DD'
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
