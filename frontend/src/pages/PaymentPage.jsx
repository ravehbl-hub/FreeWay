// PaymentPage (/pay/:id): booking summary + demo card form. No real money moves:
// the server validates the card, keeps only its last 4 digits and confirms the booking.
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, CreditCard, Lock } from 'lucide-react';
import { fetchBooking, payBooking } from '../api/bookings.api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { formatPrice, longDate } from '../utils/format.js';
import { serverErrorsToFields, validatePayment } from '../utils/validation.js';
import FormField from '../components/ui/FormField.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import Loader from '../components/ui/Loader.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import VehicleImage from '../components/ui/VehicleImage.jsx';

// A well-known test card number (used by payment providers for demos). It never charges anyone.
const DEMO_CARD = { card_number: '4242 4242 4242 4242', expiry: '12/28', cvc: '123' };

// Adds a space after every 4 digits while typing: 4242424242424242 -> 4242 4242 4242 4242
function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
}

// Adds the slash automatically: 1228 -> 12/28
function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
}

export default function PaymentPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { data, loading, error, reload, setData } = useFetch(() => fetchBooking(id), [id]);
  const [values, setValues] = useState({ card_name: user.name, card_number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  if (loading && !data) return <Loader text="loading.booking" />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const booking = data.booking;

  function handleChange(event) {
    const { name, value } = event.target;
    let nextValue = value;
    if (name === 'card_number') nextValue = formatCardNumber(value);
    if (name === 'expiry') nextValue = formatExpiry(value);
    if (name === 'cvc') nextValue = value.replace(/\D/g, '').slice(0, 4);
    setValues({ ...values, [name]: nextValue });
    setErrors({ ...errors, [name]: '' });
  }

  function useDemoCard() {
    setValues({ ...values, ...DEMO_CARD });
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formErrors = validatePayment(values);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setPaying(true);
    setServerError('');
    try {
      const result = await payBooking(booking.id, values);
      setData({ booking: result.booking });
      setPaid(true);
    } catch (err) {
      setErrors(serverErrorsToFields(err));
      setServerError(err.message);
    }
    setPaying(false);
  }

  return (
    <div className="page-narrow">
      <h1 className="page-title">{t('pay.title')}</h1>
      <p className="muted">{t('pay.subtitle')}</p>

      <div className="pay-layout">
        <section className="card pay-summary">
          <VehicleImage src={booking.vehicle_image} category={booking.vehicle_category} alt={booking.vehicle_name} className="pay-image" />
          <h2>{booking.vehicle_name}</h2>
          <p className="muted">
            {longDate(booking.start_date, lang)} → {longDate(booking.end_date, lang)}
          </p>
          <p className="muted">
            {booking.pickup_location} · {booking.pickup_time}
            {booking.insurance ? ' · ' + t('bookings.insured') : ''}
          </p>
          <div className="pay-total">
            <span>{t('pay.total')}</span>
            <strong>{formatPrice(booking.total_price)}</strong>
          </div>
          <StatusBadge status={booking.status} />
        </section>

        <section className="card pay-form-card">
          {paid || booking.status === 'confirmed' ? (
            <div className="pay-success">
              <CheckCircle2 size={44} />
              <h2>{t('pay.successTitle')}</h2>
              <p className="muted">{t('pay.successText')}</p>
              <Link to="/bookings" className="button button-green">
                {t('pay.goToBookings')}
              </Link>
            </div>
          ) : booking.status === 'cancelled' ? (
            <div className="pay-success">
              <h2>{t('pay.cancelledTitle')}</h2>
              <Link to="/vehicles" className="button button-light">
                {t('bookings.browse')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="form">
              <div className="pay-form-head">
                <CreditCard size={20} />
                <h2>{t('pay.cardDetails')}</h2>
              </div>
              <button type="button" className="button button-light button-small" onClick={useDemoCard}>
                {t('pay.useDemoCard')}
              </button>
              <FormField label={t('pay.cardName')} name="card_name" value={values.card_name} onChange={handleChange} error={errors.card_name} autoComplete="cc-name" />
              <FormField label={t('pay.cardNumber')} name="card_number" value={values.card_number} onChange={handleChange} error={errors.card_number} inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
              <div className="form-row">
                <FormField label={t('pay.expiry')} name="expiry" value={values.expiry} onChange={handleChange} error={errors.expiry} inputMode="numeric" placeholder="MM/YY" autoComplete="cc-exp" />
                <FormField label={t('pay.cvc')} name="cvc" value={values.cvc} onChange={handleChange} error={errors.cvc} inputMode="numeric" placeholder="123" autoComplete="cc-csc" />
              </div>
              <ErrorMessage message={serverError} />
              <button type="submit" className="button button-green button-block" disabled={paying}>
                {paying ? t('payment.processing') : t('pay.payButton') + ' · ' + formatPrice(booking.total_price)}
              </button>
              <p className="secure-note">
                <Lock size={14} /> {t('pay.demoNote')}
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
