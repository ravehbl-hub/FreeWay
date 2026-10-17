// MyBookingsPage: the user's bookings, split into upcoming and past
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { cancelBooking, fetchMyBookings, payBooking, updateBooking } from '../api/bookings.api.js';
import { todayISO } from '../utils/format.js';
import BookingRow from '../components/bookings/BookingRow.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function MyBookingsPage() {
  const { t } = useLanguage();
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

  if (loading && !data) return <Loader text="loading.bookings" />;
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
      <h1 className="page-title">{t('bookings.title')}</h1>
      <p className="page-subtitle">{t('bookings.subtitle')}</p>

      {data.bookings.length === 0 && (
        <EmptyState title={t('bookings.empty')} text={t('bookings.emptyText')}>
          <Link to="/vehicles" className="button button-green">
            {t('bookings.browse')}
          </Link>
        </EmptyState>
      )}

      {upcoming.length > 0 && (
        <section className="list-section">
          <h2>{t('bookings.upcoming')}</h2>
          {renderList(upcoming)}
        </section>
      )}
      {past.length > 0 && (
        <section className="list-section">
          <h2>{t('bookings.past')}</h2>
          {renderList(past)}
        </section>
      )}
    </div>
  );
}
