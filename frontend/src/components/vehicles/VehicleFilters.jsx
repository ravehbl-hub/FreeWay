// VehicleFilters: search box + category / transmission / seats / max price filters,
// plus pickup location and dates (to see which cars are free there - one car per location)
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PICKUP_LOCATIONS } from '../../utils/pickupLocations.js';
import { todayISO } from '../../utils/format.js';

export default function VehicleFilters({ filters, onChange, onReset }) {
  const { t } = useLanguage();
  function handleChange(event) {
    onChange({ ...filters, [event.target.name]: event.target.value });
  }

  return (
    <div className="card filters">
      <input name="search" placeholder={t('vehicles.search')} value={filters.search} onChange={handleChange} aria-label={t('vehicles.searchLabel')} />
      <select name="category" value={filters.category} onChange={handleChange} aria-label={t('vehicles.categoryLabel')}>
        <option value="">{t('vehicles.allCategories')}</option>
        <option value="compact">{t('category.compact')}</option>
        <option value="suv">SUV</option>
        <option value="premium">{t('category.premium')}</option>
      </select>
      <select name="transmission" value={filters.transmission} onChange={handleChange} aria-label={t('vehicles.transmissionLabel')}>
        <option value="">{t('vehicles.anyTransmission')}</option>
        <option value="auto">{t('common.automatic')}</option>
        <option value="manual">{t('common.manual')}</option>
      </select>
      <select name="minSeats" value={filters.minSeats} onChange={handleChange} aria-label={t('vehicles.seatsLabel')}>
        <option value="">{t('vehicles.anySeats')}</option>
        <option value="4">{t('vehicles.seatsPlus').replace('{n}', 4)}</option>
        <option value="5">{t('vehicles.seatsPlus').replace('{n}', 5)}</option>
        <option value="7">{t('vehicles.seatsPlus').replace('{n}', 7)}</option>
      </select>
      <select name="maxPrice" value={filters.maxPrice} onChange={handleChange} aria-label={t('vehicles.maxPriceLabel')}>
        <option value="">{t('vehicles.anyPrice')}</option>
        <option value="50">{t('vehicles.upTo').replace('{n}', 50)}</option>
        <option value="80">{t('vehicles.upTo').replace('{n}', 80)}</option>
        <option value="120">{t('vehicles.upTo').replace('{n}', 120)}</option>
      </select>
      <select name="location" value={filters.location} onChange={handleChange} aria-label={t('vehicles.locationLabel')}>
        <option value="">{t('vehicles.anyLocation')}</option>
        {PICKUP_LOCATIONS.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
      <input name="start_date" type="date" min={todayISO()} value={filters.start_date} onChange={handleChange} aria-label={t('booking.pickupDate')} disabled={!filters.location} />
      <input name="end_date" type="date" min={filters.start_date || todayISO()} value={filters.end_date} onChange={handleChange} aria-label={t('booking.returnDate')} disabled={!filters.location} />
      <button type="button" className="button button-light" onClick={onReset}>
        {t('common.reset')}
      </button>
    </div>
  );
}
