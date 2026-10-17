// VehicleCard: car picture, category, seats, transmission and price per day
import { Link } from 'react-router-dom';
import { Cog, User } from 'lucide-react';
import { formatPrice } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import VehicleImage from '../ui/VehicleImage.jsx';
import { PICKUP_LOCATIONS } from '../../utils/pickupLocations.js';

export default function VehicleCard({ vehicle, reason, showName = true, location = '' }) {
  const { t } = useLanguage();
  return (
    <Link to={'/vehicles/' + vehicle.id} className="vehicle-card">
      <VehicleImage src={vehicle.image_url} category={vehicle.category} alt={vehicle.name} className="vehicle-card-image" />
      <h3>{t('category.' + vehicle.category)}</h3>
      {showName && <p className="vehicle-card-name">{vehicle.name}</p>}
      <div className="vehicle-specs">
        <span>
          <User size={16} strokeWidth={1.6} /> {vehicle.seats}
        </span>
        <span>
          <Cog size={16} strokeWidth={1.6} /> {vehicle.transmission === 'auto' ? t('common.auto') : t('common.manual')}
        </span>
      </div>
      <p className="vehicle-price">
        {formatPrice(vehicle.price_per_day)} <span>{t('common.perDay')}</span>
      </p>
      {reason && <p className="vehicle-reason">✦ {reason}</p>}
      {vehicle.available === false && <span className="unavailable-tag">{t('common.unavailable')}</span>}
      {location && vehicle.booked && <span className="unavailable-tag">{t('vehicles.bookedAt').replace('{location}', location)}</span>}
      {location && vehicle.booked === false && vehicle.available !== false && <span className="free-tag">{t('vehicles.freeAt').replace('{location}', location)}</span>}
      {vehicle.available !== false && vehicle.free_locations && (
        <div className="branches">
          <span className="free-tag">
            {t('vehicles.availableIn').replace('{n}', vehicle.free_locations.length).replace('{total}', PICKUP_LOCATIONS.length)}
          </span>
          <p className="branches-list">
            {vehicle.free_locations.slice(0, 4).join(' · ')}
            {vehicle.free_locations.length > 4 ? ' · +' + (vehicle.free_locations.length - 4) : ''}
          </p>
        </div>
      )}
    </Link>
  );
}
