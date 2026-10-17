// NotFoundPage: shown for unknown URLs
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1 className="page-title">404</h1>
      <p className="page-subtitle">This road leads nowhere.</p>
      <Link to="/" className="button button-green">
        Back to dashboard
      </Link>
    </div>
  );
}
