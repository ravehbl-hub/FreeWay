// StatCard: one white tile with an icon, a big number and a label
export default function StatCard({ icon, value, unit, label }) {
  const Icon = icon;
  return (
    <div className="card stat-card">
      <Icon size={24} strokeWidth={1.6} className="stat-icon" />
      <div>
        <p className="stat-value">
          {value}
          {unit && <small>{unit}</small>}
        </p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
