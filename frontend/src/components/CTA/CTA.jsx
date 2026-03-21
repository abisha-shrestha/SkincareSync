import "./CTA.css";
import { useNavigate } from "react-router-dom";

export default function CTA() {
    const navigate = useNavigate();

    return (
        <section className="cta">
            <div className="cta-inner">
                <div className="cta-image-col" />
                <div className="cta-content-col">
                    <span className="cta-eyebrow">Get Started</span>
                    <h2 className="cta-title">Not sure what<br />suits your skin?</h2>
                    <p className="cta-desc">
                        Take a quick skin quiz and let SkincareSync recommend
                        products based on your unique skin type. Free, fast,
                        and surprisingly accurate.
                    </p>
                    <div className="cta-actions">
                        <button className="cta-btn-primary" onClick={() => navigate("/quiz")}>
                            Find My Skin Type
                        </button>
                        <button className="cta-btn-secondary" onClick={() => navigate("/products")}>
                            Explore Products
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}