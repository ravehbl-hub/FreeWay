// PromoCard: dark picture card with the free-cancellation message
import { Link } from 'react-router-dom';

export default function PromoCard() {
  return (
    <section className="promo-card">
      <svg className="promo-art" viewBox="0 0 300 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6B7A75" />
            <stop offset="1" stopColor="#2E3B36" />
          </linearGradient>
        </defs>
        <rect width="300" height="340" fill="url(#sky)" />
        <path d="M0 150 L40 110 L70 140 L110 90 L150 135 L190 95 L230 140 L270 100 L300 130 V340 H0z" fill="#33433C" />
        <path d="M0 200 L30 170 L60 195 L95 160 L130 200 L170 165 L210 205 L250 170 L300 200 V340 H0z" fill="#25332D" />
        <path d="M210 340 C150 290 260 260 200 220 C160 195 230 175 215 150" stroke="#4A4F52" strokeWidth="34" fill="none" />
        <path d="M210 340 C150 290 260 260 200 220 C160 195 230 175 215 150" stroke="#E8C66A" strokeWidth="2" strokeDasharray="8 8" fill="none" />
      </svg>
      <div className="promo-content">
        <h2>
          Travel with
          <br />a free mind
        </h2>
        <p>
          Free cancellation
          <br />
          up to 24h before
        </p>
        <Link to="/vehicles" className="button button-glass">
          Learn more
        </Link>
      </div>
    </section>
  );
}
