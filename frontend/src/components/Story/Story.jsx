import "./Story.css";
import giftImg from "../../assets/images/gift.jpg";
import { useNavigate } from "react-router-dom";

export default function Story() {
    const navigate = useNavigate();

    return (
        <section className="story">
            <div className="story-inner">
                <div className="story-image-col">
                    <div className="story-image-wrapper">
                        <img src={giftImg} alt="SkincareSync gift" />
                        <div className="story-image-badge">
                            <span className="story-badge-number">5</span>
                            <span className="story-badge-label">Skin types<br />supported</span>
                        </div>
                    </div>
                </div>

                <div className="story-content-col">
                    <span className="story-eyebrow">Why SkincareSync</span>
                    <h2 className="story-title">Skincare decisions<br />made smarter</h2>
                    <p className="story-desc">
                        Instead of overwhelming you with hundreds of products,
                        SkincareSync filters choices based on your individual skin
                        profile, so every recommendation actually makes sense for you.
                    </p>

                    <div className="story-stats">
                        <div className="story-stat">
                            <span className="story-stat-value">10</span>
                            <span className="story-stat-label">Quiz questions</span>
                        </div>
                        <div className="story-stat-divider" />
                        <div className="story-stat">
                            <span className="story-stat-value">5</span>
                            <span className="story-stat-label">Skin profiles</span>
                        </div>
                        <div className="story-stat-divider" />
                        <div className="story-stat">
                            <span className="story-stat-value">100%</span>
                            <span className="story-stat-label">Personalized</span>
                        </div>
                    </div>

                    {/* <button className="story-btn" onClick={() => navigate("/quiz")}>
                        Take the Skin Quiz
                    </button> */}
                </div>
            </div>
        </section>
    );
}