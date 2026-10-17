// VehicleCard: car picture, category, seats, transmission and price per day
import { Link } from 'react-router-dom';
import { Cog, User } from 'lucide-react';
import { capitalize, formatPrice } from '../../utils/format.js';
import VehicleImage from '../ui/VehicleImage.jsx';

export default function VehicleCard({ vehicle, reason, showName = true }) {
  return (
    <Link to={'/vehicles/' + vehicle.id} className="vehicle-card">
      <VehicleImage src={vehicle.image_url} category={vehicle.category} alt={vehicle.name} className="vehicle-card-image" />
      <h3>{capitalize(vehicle.category)}</h3>
      {showName && <p className="vehicle-card-name">{vehicle.name}</p>}
      <div className="vehicle-specs">
        <span>
          <User size={16} strokeWidth={1.6} /> {vehicle.seats}
        </span>
        <span>
          <Cog size={16} strokeWidth={1.6} /> {vehicle.transmission === 'auto' ? 'Auto' : 'Manual'}
        </span>
      </div>
      <p className="vehicle-price">
        {formatPrice(vehicle.price_per_day)} <span>/ day</span>
      </p>
      {reason && <p className="vehicle-reason">✦ {reason}</p>}
      {vehicle.available === false && <span className="unavailable-tag">Unavailable</span>}
    </Link>
  );
}
