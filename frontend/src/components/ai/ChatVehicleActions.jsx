// ChatVehicleActions: under an AI answer, one row per vehicle the answer mentions (/vehicles/<id>)
// with "Details" (popup) and "Book" (goes to the booking form of that vehicle) buttons.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Info } from 'lucide-react';
import { fetchVehicle } from '../../api/vehicles.api.js';
import { formatPrice } from '../../utils/format.js';
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

export default function ChatVehicleActions({ text }) {
  const { t } = useLanguage();
  const ids = findVehicleIds(text);
  const [vehicles, setVehicles] = useState([]);
  const [detailsId, setDetailsId] = useState(null);

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

  if (vehicles.length === 0) return null;

  return (
    <div className="chat-vehicles">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="chat-vehicle">
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
            <Link to={'/vehicles/' + vehicle.id} className="button button-green button-small">
              <CalendarCheck size={14} /> {t('chatActions.book')}
            </Link>
          </div>
        </div>
      ))}
      {detailsId && <VehicleDetailsModal vehicleId={detailsId} onClose={() => setDetailsId(null)} />}
    </div>
  );
}
