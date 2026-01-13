import "./Story.css";

export default function Story() {
  return (
    <section className="story">
      <img src="/story.jpg" alt="story" />
      <div>
        <p className="label">Our Story</p>
        <h2>Rooted in Nature</h2>
        <p>
          Every ingredient is thoughtfully sourced and designed to nourish your skin.
        </p>
        <button>Our Story</button>
      </div>
    </section>
  );
}
