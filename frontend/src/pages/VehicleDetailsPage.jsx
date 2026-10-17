// VehicleDetailsPage: one vehicle with its details and the booking form
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cog, Fuel, Leaf, User } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { fetchVehicle } from '../api/vehicles.api.js';
import { createBooking } from '../api/bookings.api.js';
import { capitalize, formatPrice } from '../utils/format.js';
import BookingForm from '../components/bookings/BookingForm.jsx';
import VehicleImage from '../components/ui/VehicleImage.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const { data, loading, error, reload } = useFetch(() => fetchVehicle(id), [id]);

  async function handleBook(values) {
    await createBooking(values);
    setSuccess('Booking created! Redirecting to your bookings...');
    setTimeout(() => navigate('/bookings'), 1200);
  }

  if (loading) return <Loader text="Loading vehicle..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const vehicle = data.vehicle;

  return (
    <div>
      <Link to="/vehicles" className="back-link">
        ← All vehicles
      </Link>
      <div className="details-layout">
        <section className="card details-card">
          <VehicleImage src={vehicle.image_url} category={vehicle.category} alt={vehicle.name} className="details-image" />
          <p className="eyebrow">{capitalize(vehicle.category)}</p>
          <h1 className="page-title">{vehicle.name}</h1>
          <p className="muted">{vehicle.description}</p>
          <div className="details-specs">
            <span><User size={18} /> {vehicle.seats} seats</span>
            <span><Cog size={18} /> {vehicle.transmission === 'auto' ? 'Automatic' : 'Manual'}</span>
            <span><Fuel size={18} /> {capitalize(vehicle.fuel_type)}</span>
            <span><Leaf size={18} /> {vehicle.co2_per_km} kg CO₂/km</span>
          </div>
          <p className="vehicle-price vehicle-price-large">
            {formatPrice(vehicle.price_per_day)} <span>/ day</span>
          </p>
        </section>

        <section className="card">
          <h2>Book this vehicle</h2>
          {!vehicle.available && <ErrorMessage message="This vehicle is not available right now." />}
          {success && <p className="success-box">{success}</p>}
          {vehicle.available && !success && <BookingForm vehicle={vehicle} submitLabel="Confirm booking" onSubmit={handleBook} />}
        </section>
      </div>
    </div>
  );
}
