// PaymentCard: dark bank card on the dashboard. Shows the last card used (demo) and
// a "Pay now" link to the payment page when the next booking is still pending.
import { Link } from 'react-router-dom';
import { Lock, Nfc } from 'lucide-react';
import { formatPrice } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const DEMO_LAST4 = '4242';

export default function PaymentCard({ booking, bookings = [] }) {
  const { t } = useLanguage();
  const canPay = booking && booking.status === 'pending';
  // Last 4 digits of the most recent paid booking, or the demo card
  const paid = bookings.find((b) => b.card_last4);
  const last4 = paid ? paid.card_last4 : DEMO_LAST4;

  return (
    <section className="card payment-card">
      <h2>{t('payment.title')}</h2>
      <p className="muted">{t('payment.bankCard')}</p>
      <div className="bank-card">
        <div className="bank-card-number">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span>{last4}</span>
          <Nfc size={22} className="bank-card-nfc" />
        </div>
        <span className="bank-card-expiry">{t('payment.expires')}</span>
      </div>
      {canPay ? (
        <Link to={'/pay/' + booking.id} className="button button-green button-block">
          {t('payment.payNow')} · {formatPrice(booking.total_price)}
        </Link>
      ) : (
        <button type="button" className="button button-green button-block" disabled>
          {t('payment.nothing')}
        </button>
      )}
      <p className="secure-note">
        <Lock size={14} /> {t('payment.secure')}
      </p>
    </section>
  );
}
