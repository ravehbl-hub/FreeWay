// VehiclesPage: the full catalog with filters
import { useState } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { fetchVehicles } from '../api/vehicles.api.js';
import VehicleFilters from '../components/vehicles/VehicleFilters.jsx';
import VehicleCard from '../components/vehicles/VehicleCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const EMPTY_FILTERS = { search: '', category: '', transmission: '', minSeats: '', maxPrice: '' };

export default function VehiclesPage() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const { data, loading, error, reload } = useFetch(() => fetchVehicles(filters), [
    filters.search, filters.category, filters.transmission, filters.minSeats, filters.maxPrice,
  ]);

  return (
    <div>
      <h1 className="page-title">{t('vehicles.title')}</h1>
      <p className="page-subtitle">{t('vehicles.subtitle')}</p>
      <VehicleFilters filters={filters} onChange={setFilters} onReset={() => setFilters(EMPTY_FILTERS)} />

      {loading && <Loader text="loading.vehicles" />}
      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}
      {!loading && !error && data.vehicles.length === 0 && (
        <EmptyState title={t('vehicles.empty')} text={t('vehicles.emptyText')} />
      )}
      {!loading && !error && data.vehicles.length > 0 && (
        <div className="vehicle-grid">
          {data.vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
