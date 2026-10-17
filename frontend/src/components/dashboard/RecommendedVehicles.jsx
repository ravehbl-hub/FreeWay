// RecommendedVehicles: row of vehicle cards. Shows AI picks (saved in the DB) or the default picks.
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import VehicleCard from '../vehicles/VehicleCard.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function RecommendedVehicles({ vehicles, aiPicks, onGenerate, generating, error }) {
  const { t } = useLanguage();
  // AI picks come from the ai_recommendations table and include a "reason"
  let items = vehicles.map((vehicle) => ({ vehicle: vehicle, reason: '' }));
  if (aiPicks.length > 0) {
    items = aiPicks.map((pick) => ({
      vehicle: {
        id: pick.vehicle_id,
        name: pick.name,
        category: pick.category,
        seats: pick.seats,
        transmission: pick.transmission,
        price_per_day: pick.price_per_day,
        image_url: pick.image_url,
      },
      reason: pick.reason,
    }));
  }

  return (
    <section className="card recommended">
      <div className="card-header">
        <h2>{t('recommended.title')}</h2>
        <div className="card-header-actions">
          <button type="button" className="button button-small" onClick={onGenerate} disabled={generating}>
            <Sparkles size={14} /> {generating ? t('common.thinking') : aiPicks.length ? t('recommended.refresh') : t('recommended.ask')}
          </button>
          <Link to="/vehicles" className="icon-link" aria-label={t('recommended.all')}>
            <ChevronRight size={20} className="flip-rtl" />
          </Link>
        </div>
      </div>
      {aiPicks.length > 0 && aiPicks[0].summary && <p className="muted ai-summary">{aiPicks[0].summary}</p>}
      <ErrorMessage message={error} />
      <div className="vehicle-row">
        {items.map((item) => (
          <VehicleCard key={item.vehicle.id} vehicle={item.vehicle} reason={item.reason} showName={aiPicks.length > 0} />
        ))}
      </div>
    </section>
  );
}
