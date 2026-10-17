// VehicleDetailsModal: popup with a vehicle's picture, specs, price and a "Book" button.
// Used by the AI assistant when it suggests vehicles.
import { useNavigate } from 'react-router-dom';
import { Cog, Fuel, Leaf, User, X } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch.js';
import { fetchVehicle } from '../../api/vehicles.api.js';
import { formatPrice } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import VehicleImage from '../ui/VehicleImage.jsx';
import Loader from '../ui/Loader.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';

export default function VehicleDetailsModal({ vehicleId, onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useFetch(() => fetchVehicle(vehicleId), [vehicleId]);
  const vehicle = data ? data.vehicle : null;

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-card popup-vehicle" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="popup-close" onClick={onClose} aria-label={t('common.close')}>
          <X size={18} />
        </button>
        {loading && <Loader text="loading.vehicle" />}
        {!loading && error && <ErrorMessage message={error} onRetry={reload} />}
        {vehicle && (
          <div>
            <VehicleImage src={vehicle.image_url} category={vehicle.category} alt={vehicle.name} className="popup-vehicle-image" />
            <p className="eyebrow">{t('category.' + vehicle.category)}</p>
            <h2>{vehicle.name}</h2>
            <p className="muted">{vehicle.description}</p>
            <div className="details-specs">
              <span><User size={18} /> {vehicle.seats} {t('common.seats')}</span>
              <span><Cog size={18} /> {vehicle.transmission === 'auto' ? t('common.automatic') : t('common.manual')}</span>
              <span><Fuel size={18} /> {t('fuel.' + vehicle.fuel_type)}</span>
              <span><Leaf size={18} /> {vehicle.co2_per_km} {t('details.co2')}</span>
            </div>
            <p className="vehicle-price vehicle-price-large">
              {formatPrice(vehicle.price_per_day)} <span>{t('common.perDay')}</span>
            </p>
            <button type="button" className="button button-green button-block" onClick={() => navigate('/vehicles/' + vehicle.id)}>
              {t('chatActions.book')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
