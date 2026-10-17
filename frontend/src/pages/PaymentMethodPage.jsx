// PaymentMethodPage (/payment-method): the user's (demo) card and the bookings waiting for payment.
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { fetchMyBookings } from '../api/bookings.api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { formatPrice, longDate } from '../utils/format.js';
import PaymentCard from '../components/dashboard/PaymentCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function PaymentMethodPage() {
  const { t, lang } = useLanguage();
  const { data, loading, error, reload } = useFetch(fetchMyBookings);

  if (loading) return <Loader text="loading.bookings" />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const bookings = data.bookings;
  const pending = bookings.filter((b) => b.status === 'pending');

  return (
    <div className="page-narrow">
      <h1 className="page-title">{t('paymentPage.title')}</h1>
      <p className="page-subtitle">{t('paymentPage.subtitle')}</p>
      <div className="pay-layout">
        <PaymentCard booking={pending[0]} bookings={bookings} />
        <section className="card">
          <h2>{t('paymentPage.pending')}</h2>
          {pending.length === 0 ? (
            <EmptyState title={t('paymentPage.noPending')} text={t('paymentPage.noPendingText')} />
          ) : (
            <ul className="pending-list">
              {pending.map((b) => (
                <li key={b.id} className="pending-item">
                  <div>
                    <strong>{b.vehicle_name}</strong>
                    <p className="muted">
                      {longDate(b.start_date, lang)} → {longDate(b.end_date, lang)} · {b.pickup_location}
                    </p>
                  </div>
                  <Link to={'/pay/' + b.id} className="button button-green button-small">
                    {t('bookings.payNow')} · {formatPrice(b.total_price)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
