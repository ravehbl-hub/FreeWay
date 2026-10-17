// BookingSummaryCard: "My booking" card with the dates (4 JUL -> 6 JUL) and pickup time
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Ellipsis } from 'lucide-react';
import { dayAndMonth, longDate } from '../../utils/format.js';
import StatusBadge from '../ui/StatusBadge.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function BookingSummaryCard({ booking }) {
  const { t, lang } = useLanguage();
  if (!booking) {
    return (
      <section className="card booking-card">
        <h2>{t('bookingCard.title')}</h2>
        <p className="muted">{t('bookingCard.none')}</p>
        <Link to="/vehicles" className="button button-green booking-empty-button">
          {t('bookingCard.find')}
        </Link>
      </section>
    );
  }

  const start = dayAndMonth(booking.start_date, lang);
  const end = dayAndMonth(booking.end_date, lang);

  return (
    <section className="card booking-card">
      <div className="card-header">
        <div>
          <h2>{t('bookingCard.title')}</h2>
          <p className="muted">{longDate(booking.start_date, lang)}</p>
        </div>
        <Link to="/bookings" className="icon-link" aria-label={t('bookingCard.all')}>
          <Ellipsis size={20} />
        </Link>
      </div>
      <div className="date-range">
        <div>
          <strong>{start.day}</strong>
          <span>{start.month}</span>
        </div>
        <ArrowRight size={22} className="muted flip-rtl" />
        <div>
          <strong>{end.day}</strong>
          <span>{end.month}</span>
        </div>
      </div>
      <div className="booking-card-footer">
        <Clock size={20} strokeWidth={1.6} />
        <div>
          <strong>{booking.pickup_time}</strong>
          <p className="muted">{t('bookingCard.pickupTime')} · {booking.vehicle_name}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
    </section>
  );
}
