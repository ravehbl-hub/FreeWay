// StatusBadge: colored pill for a booking status
export default function StatusBadge({ status }) {
  return (
    <span className={'status-badge status-' + status}>
      <span className="dot" />
      {status}
    </span>
  );
}
