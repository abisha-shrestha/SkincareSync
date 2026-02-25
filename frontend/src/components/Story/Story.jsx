import "./Story.css";
import giftImg from "../../assets/images/gift.jpg";

export default function Story() {
  return (
    <section className="story">
      <img src={giftImg} alt="gift" />
      <div>
        <p className="label">Why SkincareSync</p>
        <h2>Skincare decisions made smarter</h2>
        <p>
          Instead of overwhelming users with hundreds of products, SkincareSync
          filters choices based on individual skin profiles and preferences.
        </p>
      </div>
    </section>
  );
}
