// VehicleFilters: search box + category / transmission / seats / max price filters
import { useLanguage } from '../../context/LanguageContext.jsx';

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
      <button type="button" className="button button-light" onClick={onReset}>
        {t('common.reset')}
      </button>
    </div>
  );
}
