// BookingRow: one booking in the "My bookings" list with Pay / Edit / Cancel actions
import { useState } from 'react';
import { formatPrice, longDate } from '../../utils/format.js';
import StatusBadge from '../ui/StatusBadge.jsx';
import VehicleImage from '../ui/VehicleImage.jsx';
import BookingForm from './BookingForm.jsx';

export default function BookingRow({ booking, onPay, onCancel, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isPending = booking.status === 'pending';

  async function runAction(action) {
    setBusy(true);
    setError('');
    try {
      await action(booking.id);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  async function handleUpdate(values) {
    await onUpdate(booking.id, values);
    setEditing(false);
  }

  return (
    <article className="card booking-row">
      <div className="booking-row-main">
        <VehicleImage src={booking.vehicle_image} category={booking.vehicle_category} alt={booking.vehicle_name} className="booking-row-image" />
        <div className="booking-row-info">
          <h3>{booking.vehicle_name}</h3>
          <p className="muted">
            {longDate(booking.start_date)} → {longDate(booking.end_date)}
          </p>
          <p className="muted">
            {booking.pickup_location} · {booking.pickup_time}
            {booking.insurance ? ' · insured' : ''}
          </p>
        </div>
        <div className="booking-row-side">
          <StatusBadge status={booking.status} />
          <strong>{formatPrice(booking.total_price)}</strong>
        </div>
      </div>

      {booking.status !== 'cancelled' && (
        <div className="booking-row-actions">
          {isPending && (
            <button type="button" className="button button-green button-small" disabled={busy} onClick={() => runAction(onPay)}>
              Pay now
            </button>
          )}
          {isPending && (
            <button type="button" className="button button-light button-small" onClick={() => setEditing(!editing)}>
              {editing ? 'Close' : 'Edit'}
            </button>
          )}
          <button
            type="button"
            className="button button-danger button-small"
            disabled={busy}
            onClick={() => {
              if (window.confirm('Cancel this booking?')) runAction(onCancel);
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {error && <p className="field-message">{error}</p>}

      {editing && (
        <BookingForm
          vehicle={{ id: booking.vehicle_id, price_per_day: booking.vehicle_price_per_day }}
          initialValues={{
            start_date: booking.start_date,
            end_date: booking.end_date,
            pickup_time: booking.pickup_time,
            pickup_location: booking.pickup_location,
            insurance: booking.insurance,
          }}
          submitLabel="Save changes"
          onSubmit={handleUpdate}
        />
      )}
    </article>
  );
}
