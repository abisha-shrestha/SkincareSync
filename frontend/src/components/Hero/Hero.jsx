import "./Hero.css";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-inner">
                <div className="hero-content">
                    <span className="hero-eyebrow">Personalized Skincare System</span>
                    <h1 className="hero-title">
                        Skincare that actually
                        <em> understands</em>
                        <br />your skin
                    </h1>
                    <p className="hero-desc">
                        Answer a few simple questions and get skincare recommendations
                        tailored to your unique skin type.
                    </p>
                    <div className="hero-actions">
                        <button className="hero-btn-primary" onClick={() => navigate("/quiz")}>
                            Find My Skin Type
                        </button>
                        <button className="hero-btn-secondary" onClick={() => navigate("/products")}>
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}