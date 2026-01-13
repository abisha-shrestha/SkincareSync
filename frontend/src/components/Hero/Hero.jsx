import "./Hero.css";

export default function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: "url(/hero.jpg)" }}
    >
      <div className="hero-content">
        <p className="hero-tag">Natural Beauty Rituals</p>
        <h1>Embrace your natural glow</h1>
        <button>Explore Products</button>
      </div>
    </section>
  );
}
