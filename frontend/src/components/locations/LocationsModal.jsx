// LocationsModal: popup with the list of all pickup locations and the map.
// Clicking a name in the list (or a marker) selects it; "Use this location" sends it back.
import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PICKUP_PLACES } from '../../utils/pickupLocations.js';
import LocationsMap from './LocationsMap.jsx';

export default function LocationsModal({ initial, onClose, onChoose }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(initial || PICKUP_PLACES[0].name);

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-card popup-wide" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="popup-close" onClick={onClose} aria-label={t('common.close')}>
          <X size={18} />
        </button>
        <h2>{t('map.allLocations')}</h2>
        <p className="popup-version">{t('map.allLocationsText')}</p>
        <div className="locations-layout">
          <ul className="locations-list">
            {PICKUP_PLACES.map((place) => (
              <li key={place.name}>
                <button
                  type="button"
                  className={place.name === selected ? 'location-item selected' : 'location-item'}
                  onClick={() => setSelected(place.name)}
                >
                  <MapPin size={16} /> {place.name}
                </button>
              </li>
            ))}
          </ul>
          <LocationsMap selected={selected} onSelect={setSelected} />
        </div>
        {onChoose && (
          <button type="button" className="button button-green button-block" onClick={() => onChoose(selected)}>
            {t('map.useLocation').replace('{location}', selected)}
          </button>
        )}
      </div>
    </div>
  );
}
