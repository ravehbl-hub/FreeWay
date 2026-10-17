// HeroSection: big headline, availability chip and the hero car picture
export default function HeroSection({ availability }) {
  const isAvailable = availability > 0;
  return (
    <section className="hero">
      <h1 className="hero-title">
        Dashboard
        <br />
        AI Assistant
      </h1>
      <p className="hero-subtitle">for car rental</p>
      <span className="chip">
        <span className={isAvailable ? 'dot dot-green' : 'dot dot-grey'} />
        {isAvailable ? 'Vehicles available' : 'No vehicles available'}
      </span>
      <img className="hero-car" src="/cars/hero.svg" alt="Silver electric SUV" />
    </section>
  );
}
