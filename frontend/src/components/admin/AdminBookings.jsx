// AdminBookings: all bookings of all users, the admin can change status or delete
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch.js';
import { deleteBooking, fetchAllBookings, setBookingStatus } from '../../api/bookings.api.js';
import { formatPrice } from '../../utils/format.js';
import Loader from '../ui/Loader.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function AdminBookings() {
  const { data, loading, error, reload } = useFetch(fetchAllBookings);
  const [actionError, setActionError] = useState('');

  async function handleStatus(id, status) {
    setActionError('');
    try {
      await setBookingStatus(id, status);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this booking permanently?')) return;
    setActionError('');
    try {
      await deleteBooking(id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading && !data) return <Loader text="Loading bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (data.bookings.length === 0) return <EmptyState title="No bookings yet" />;

  return (
    <div>
      <ErrorMessage message={actionError} />
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {data.bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  {booking.user_name}
                  <br />
                  <small className="muted">{booking.user_email}</small>
                </td>
                <td>{booking.vehicle_name}</td>
                <td>
                  {booking.start_date} → {booking.end_date}
                </td>
                <td>{formatPrice(booking.total_price)}</td>
                <td>
                  <select value={booking.status} onChange={(event) => handleStatus(booking.id, event.target.value)} aria-label="Status">
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td className="table-actions">
                  <button type="button" className="icon-link danger" aria-label="Delete" onClick={() => handleDelete(booking.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
