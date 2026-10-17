// DashboardPage: the main screen (like the reference design) - hero, stats, AI panel,
// pickup map, next booking, payment, recommended vehicles and promo.
import { useState } from 'react';
import { Car, Leaf, ShieldCheck } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { fetchMyStats } from '../api/stats.api.js';
import { fetchMyBookings } from '../api/bookings.api.js';
import { fetchVehicles } from '../api/vehicles.api.js';
import { fetchRecommendations, generateRecommendations } from '../api/ai.api.js';
import { todayISO } from '../utils/format.js';
import HeroSection from '../components/dashboard/HeroSection.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import AiAssistantPanel from '../components/dashboard/AiAssistantPanel.jsx';
import PickupMapCard from '../components/dashboard/PickupMapCard.jsx';
import BookingSummaryCard from '../components/dashboard/BookingSummaryCard.jsx';
import RecommendedVehicles from '../components/dashboard/RecommendedVehicles.jsx';
import PromoCard from '../components/dashboard/PromoCard.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';

// Loads everything the dashboard needs at the same time
async function loadDashboard() {
  const results = await Promise.all([
    fetchMyStats(),
    fetchMyBookings(),
    fetchVehicles({ available: true }),
    fetchRecommendations(),
  ]);
  return {
    stats: results[0].stats,
    bookings: results[1].bookings,
    vehicles: results[2].vehicles,
    aiPicks: results[3].recommendations,
  };
}

// The next booking that is not cancelled and not finished yet
function findNextBooking(bookings) {
  const today = todayISO();
  const upcoming = bookings
    .filter((b) => b.status !== 'cancelled' && b.end_date >= today)
    .sort((a, b) => (a.start_date < b.start_date ? -1 : 1));
  return upcoming[0] || null;
}

// The cheapest vehicle of each category (default picks before the AI is asked)
function pickOnePerCategory(vehicles) {
  const picks = [];
  ['compact', 'suv', 'premium'].forEach((category) => {
    const found = vehicles.find((v) => v.category === category);
    if (found) picks.push(found);
  });
  return picks;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { data, loading, error, reload, setData } = useFetch(loadDashboard);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  async function handleGenerate() {
    setGenerating(true);
    setAiError('');
    try {
      const result = await generateRecommendations();
      setData({ ...data, aiPicks: result.recommendations });
    } catch (err) {
      setAiError(err.message);
    }
    setGenerating(false);
  }

  if (loading && !data) return <Loader text="loading.dashboard" />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const nextBooking = findNextBooking(data.bookings);

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="dashboard-hero-area">
          <HeroSection availability={data.stats.availability} />
          <div className="stats-row">
            <StatCard icon={Car} value={data.stats.bookingsThisMonth} label={t('dashboard.statBookings')} />
            <StatCard icon={ShieldCheck} value={data.stats.availability} unit="%" label={t('dashboard.statAvailability')} />
            <StatCard icon={Leaf} value={data.stats.co2Saved} label={t('dashboard.statCo2')} />
          </div>
        </div>
        <AiAssistantPanel />
      </div>

      <div className="dashboard-middle">
        <PickupMapCard location={nextBooking ? nextBooking.pickup_location : ''} />
        <BookingSummaryCard booking={nextBooking} />
      </div>

      <div className="dashboard-bottom">
        <RecommendedVehicles
          vehicles={pickOnePerCategory(data.vehicles)}
          aiPicks={data.aiPicks}
          onGenerate={handleGenerate}
          generating={generating}
          error={aiError}
        />
        <PromoCard />
      </div>
    </div>
  );
}
