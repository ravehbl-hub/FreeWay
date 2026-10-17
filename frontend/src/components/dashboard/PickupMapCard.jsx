// PickupMapCard: shows the pickup location on a simple drawn map
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PickupMapCard({ location }) {
  return (
    <section className="card map-card">
      <div className="card-header">
        <div>
          <h2>Pickup location</h2>
          <p className="muted">{location || 'Tel Aviv - Downtown'}</p>
        </div>
        <Link to="/bookings" aria-label="See bookings" className="icon-link">
          <ChevronRight size={20} />
        </Link>
      </div>
      <div className="map">
        <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="260" height="200" fill="#E9EBEE" />
          <g stroke="#FFFFFF" strokeWidth="9" fill="none" strokeLinecap="round">
            <path d="M-10 40 L120 90 L280 60" />
            <path d="M40 -10 L90 120 L60 220" />
            <path d="M150 -10 L170 100 L230 220" />
            <path d="M-10 160 L110 140 L280 170" />
          </g>
          <g stroke="#F7F8F9" strokeWidth="4" fill="none">
            <path d="M0 110 L260 120" />
            <path d="M210 0 L200 200" />
            <path d="M10 0 L30 200" />
          </g>
        </svg>
        <div className="map-pin">
          <span className="pin-halo" />
          <svg viewBox="0 0 24 32" width="34" height="44" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0z" fill="#1E8E5A" />
            <circle cx="12" cy="12" r="4.5" fill="#fff" />
          </svg>
        </div>
      </div>
    </section>
  );
}
