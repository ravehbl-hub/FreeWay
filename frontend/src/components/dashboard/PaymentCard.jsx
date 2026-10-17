// PaymentCard: dark bank card + "Pay now" button (demo payment that confirms a pending booking)
import { useState } from 'react';
import { Lock, Nfc } from 'lucide-react';
import { formatPrice } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function PaymentCard({ booking, onPay }) {
  const { t } = useLanguage();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const canPay = booking && booking.status === 'pending';

  async function handlePay() {
    setPaying(true);
    setError('');
    try {
      await onPay(booking.id);
    } catch (err) {
      setError(err.message);
    }
    setPaying(false);
  }

  return (
    <section className="card payment-card">
      <h2>{t('payment.title')}</h2>
      <p className="muted">{t('payment.bankCard')}</p>
      <div className="bank-card">
        <div className="bank-card-number">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span>2468</span>
          <Nfc size={22} className="bank-card-nfc" />
        </div>
        <span className="bank-card-expiry">{t('payment.expires')}</span>
      </div>
      <button type="button" className="button button-green button-block" disabled={!canPay || paying} onClick={handlePay}>
        {paying ? t('payment.processing') : canPay ? t('payment.payNow') + ' · ' + formatPrice(booking.total_price) : t('payment.nothing')}
      </button>
      {error && <p className="field-message">{error}</p>}
      <p className="secure-note">
        <Lock size={14} /> {t('payment.secure')}
      </p>
    </section>
  );
}
