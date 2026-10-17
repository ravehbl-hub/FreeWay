// MyBookingsPage: the user's bookings, split into upcoming and past
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { cancelBooking, fetchMyBookings, payBooking, updateBooking } from '../api/bookings.api.js';
import { todayISO } from '../utils/format.js';
import BookingRow from '../components/bookings/BookingRow.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function MyBookingsPage() {
  const { data, loading, error, reload } = useFetch(fetchMyBookings);

  async function handlePay(id) {
    await payBooking(id);
    reload();
  }

  async function handleCancel(id) {
    await cancelBooking(id);
    reload();
  }

  async function handleUpdate(id, values) {
    await updateBooking(id, values);
    reload();
  }

  if (loading && !data) return <Loader text="Loading bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const today = todayISO();
  const upcoming = data.bookings.filter((b) => b.end_date >= today);
  const past = data.bookings.filter((b) => b.end_date < today);

  function renderList(list) {
    return list.map((booking) => (
      <BookingRow key={booking.id} booking={booking} onPay={handlePay} onCancel={handleCancel} onUpdate={handleUpdate} />
    ));
  }

  return (
    <div>
      <h1 className="page-title">My bookings</h1>
      <p className="page-subtitle">Pay, change or cancel your rentals.</p>

      {data.bookings.length === 0 && (
        <EmptyState title="No bookings yet" text="Your rentals will appear here.">
          <Link to="/vehicles" className="button button-green">
            Browse vehicles
          </Link>
        </EmptyState>
      )}

      {upcoming.length > 0 && (
        <section className="list-section">
          <h2>Upcoming</h2>
          {renderList(upcoming)}
        </section>
      )}
      {past.length > 0 && (
        <section className="list-section">
          <h2>Past</h2>
          {renderList(past)}
        </section>
      )}
    </div>
  );
}
