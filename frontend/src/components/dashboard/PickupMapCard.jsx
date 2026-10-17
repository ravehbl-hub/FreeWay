// PickupMapCard: the pickup location of the next booking + all branches as chips.
// Clicking a chip or the map button opens the map with every location.
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PICKUP_LOCATIONS } from '../../utils/pickupLocations.js';
import LocationsModal from '../locations/LocationsModal.jsx';

export default function PickupMapCard({ location }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState('');
  const current = location || PICKUP_LOCATIONS[0];

  return (
    <section className="card map-card">
      <div className="card-header">
        <div>
          <h2>{t('map.title')}</h2>
          <p className="muted">{current}</p>
        </div>
        <button type="button" className="icon-link" onClick={() => setOpen(current)} aria-label={t('map.viewAll')}>
          <MapPin size={20} />
        </button>
      </div>
      <div className="location-chips">
        {PICKUP_LOCATIONS.map((name) => (
          <button
            key={name}
            type="button"
            className={name === current ? 'location-chip selected' : 'location-chip'}
            onClick={() => setOpen(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <button type="button" className="button button-light button-block" onClick={() => setOpen(current)}>
        {t('map.viewAll')}
      </button>
      {open && <LocationsModal initial={open} onClose={() => setOpen('')} />}
    </section>
  );
}
