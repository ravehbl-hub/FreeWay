// ChatVehicleActions: under an AI answer, one row per vehicle the answer mentions (/vehicles/<id>)
// with "Details" (popup) and "Book" buttons. "Book" creates the booking right away, using the dates
// written in the chat (or tomorrow + 3 days) and the default pickup location, then shows the result.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, Info } from 'lucide-react';
import { fetchVehicle } from '../../api/vehicles.api.js';
import { createBooking } from '../../api/bookings.api.js';
import { formatPrice, longDate } from '../../utils/format.js';
import { pickBookingDates } from '../../utils/chatDates.js';
import { PICKUP_LOCATIONS } from '../../utils/pickupLocations.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import VehicleImage from '../ui/VehicleImage.jsx';
import VehicleDetailsModal from '../vehicles/VehicleDetailsModal.jsx';

// Finds the vehicle ids in the answer text, without duplicates
export function findVehicleIds(text) {
  const ids = [];
  const matches = text.matchAll(/\/vehicles\/(\d+)/g);
  for (const match of matches) {
    const id = Number(match[1]);
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

export default function ChatVehicleActions({ text, contextText = '' }) {
  const { t, lang } = useLanguage();
  const ids = findVehicleIds(text);
  const [vehicles, setVehicles] = useState([]);
  const [detailsId, setDetailsId] = useState(null);
  const [results, setResults] = useState({}); // vehicleId -> { booking } | { error } | { busy: true }

  // Load the details of each mentioned vehicle (name, picture, price)
  useEffect(() => {
    let cancelled = false;
    Promise.all(ids.map((id) => fetchVehicle(id).then((data) => data.vehicle).catch(() => null))).then((list) => {
      if (!cancelled) setVehicles(list.filter(Boolean));
    });
    return () => {
      cancelled = true;
    };
  }, [ids.join(',')]);

  // One click = one booking. Dates come from the conversation when they were written there.
  async function quickBook(vehicle) {
    const dates = pickBookingDates(contextText + ' ' + text);
    setResults({ ...results, [vehicle.id]: { busy: true } });
    try {
      const data = await createBooking({
        vehicle_id: vehicle.id,
        start_date: dates.start_date,
        end_date: dates.end_date,
        pickup_time: '10:00',
        pickup_location: PICKUP_LOCATIONS[0],
        insurance: false,
      });
      setResults({ ...results, [vehicle.id]: { booking: data.booking, fromChat: dates.fromChat } });
    } catch (err) {
      setResults({ ...results, [vehicle.id]: { error: err.message } });
    }
  }

  if (vehicles.length === 0) return null;

  return (
    <div className="chat-vehicles">
      {vehicles.map((vehicle) => {
        const result = results[vehicle.id] || {};
        return (
          <div key={vehicle.id} className="chat-vehicle-block">
            <div className="chat-vehicle">
              <VehicleImage src={vehicle.image_url} category={vehicle.category} alt={vehicle.name} className="chat-vehicle-image" />
              <div className="chat-vehicle-info">
                <strong>{vehicle.name}</strong>
                <span className="muted">
                  {formatPrice(vehicle.price_per_day)} {t('common.perDay')}
                </span>
              </div>
              <div className="chat-vehicle-buttons">
                <button type="button" className="button button-light button-small" onClick={() => setDetailsId(vehicle.id)}>
                  <Info size={14} /> {t('chatActions.details')}
                </button>
                {!result.booking && (
                  <button type="button" className="button button-green button-small" disabled={result.busy} onClick={() => quickBook(vehicle)}>
                    <CalendarCheck size={14} /> {result.busy ? t('common.saving') : t('chatActions.book')}
                  </button>
                )}
              </div>
            </div>

            {result.booking && (
              <div className="chat-booked">
                <CheckCircle2 size={18} />
                <div>
                  <strong>{t('chatActions.booked')}</strong>
                  <p className="muted">
                    {longDate(result.booking.start_date, lang)} → {longDate(result.booking.end_date, lang)} · {result.booking.pickup_location} ·{' '}
                    {formatPrice(result.booking.total_price)}
                    {!result.fromChat ? ' · ' + t('chatActions.defaultDates') : ''}
                  </p>
                  <div className="chat-vehicle-buttons">
                    <Link to={'/pay/' + result.booking.id} className="button button-green button-small">
                      {t('bookings.payNow')}
                    </Link>
                    <Link to="/bookings" className="button button-light button-small">
                      {t('chatActions.change')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {result.error && (
              <p className="field-message">
                {result.error}{' '}
                <Link to={'/vehicles/' + vehicle.id}>{t('chatActions.pickDates')}</Link>
              </p>
            )}
          </div>
        );
      })}
      {detailsId && <VehicleDetailsModal vehicleId={detailsId} onClose={() => setDetailsId(null)} />}
    </div>
  );
}
