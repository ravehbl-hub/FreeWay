// BookingSummaryCard: "My booking" card with the dates (4 JUL -> 6 JUL) and pickup time
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Ellipsis } from 'lucide-react';
import { dayAndMonth, longDate } from '../../utils/format.js';
import StatusBadge from '../ui/StatusBadge.jsx';

export default function BookingSummaryCard({ booking }) {
  if (!booking) {
    return (
      <section className="card booking-card">
        <h2>My booking</h2>
        <p className="muted">You have no upcoming booking.</p>
        <Link to="/vehicles" className="button button-green booking-empty-button">
          Find a vehicle
        </Link>
      </section>
    );
  }

  const start = dayAndMonth(booking.start_date);
  const end = dayAndMonth(booking.end_date);

  return (
    <section className="card booking-card">
      <div className="card-header">
        <div>
          <h2>My booking</h2>
          <p className="muted">{longDate(booking.start_date)}</p>
        </div>
        <Link to="/bookings" className="icon-link" aria-label="All bookings">
          <Ellipsis size={20} />
        </Link>
      </div>
      <div className="date-range">
        <div>
          <strong>{start.day}</strong>
          <span>{start.month}</span>
        </div>
        <ArrowRight size={22} className="muted" />
        <div>
          <strong>{end.day}</strong>
          <span>{end.month}</span>
        </div>
      </div>
      <div className="booking-card-footer">
        <Clock size={20} strokeWidth={1.6} />
        <div>
          <strong>{booking.pickup_time}</strong>
          <p className="muted">Pickup time · {booking.vehicle_name}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
    </section>
  );
}
