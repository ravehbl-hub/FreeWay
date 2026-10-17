// AdminPage: admin only - fleet totals and tabs for managing vehicles, bookings and users
import { useState } from 'react';
import { Car, CalendarDays, Euro, Users } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { fetchAdminStats } from '../api/stats.api.js';
import StatCard from '../components/dashboard/StatCard.jsx';
import AdminVehicles from '../components/admin/AdminVehicles.jsx';
import AdminBookings from '../components/admin/AdminBookings.jsx';
import AdminUsers from '../components/admin/AdminUsers.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';

const TABS = [
  { id: 'vehicles', label: 'Vehicles' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'users', label: 'Users' },
];

export default function AdminPage() {
  const [tab, setTab] = useState('vehicles');
  const { data, error } = useFetch(fetchAdminStats);

  return (
    <div>
      <h1 className="page-title">Admin</h1>
      <p className="page-subtitle">Manage the fleet, bookings and users.</p>

      <ErrorMessage message={error} />
      {data && (
        <div className="stats-row stats-row-4">
          <StatCard icon={Users} value={data.stats.users} label="Users" />
          <StatCard icon={Car} value={data.stats.vehicles} label="Vehicles" />
          <StatCard icon={CalendarDays} value={data.stats.bookings} label="Bookings" />
          <StatCard icon={Euro} value={Math.round(data.stats.revenue)} label="Confirmed revenue (€)" />
        </div>
      )}

      <div className="tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? 'tab active' : 'tab'}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'vehicles' && <AdminVehicles />}
      {tab === 'bookings' && <AdminBookings />}
      {tab === 'users' && <AdminUsers />}
    </div>
  );
}
