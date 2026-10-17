// AuthLayout: centered white card used by the Login and Register pages
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <p className="brand brand-large">
          Free<span>Way</span>
        </p>
        <h1>Rent a car with your own AI assistant.</h1>
        <img src="/cars/hero.svg" alt="FreeWay rental car" />
      </div>
      <div className="card auth-card">
        <h2>{title}</h2>
        <p className="muted">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
