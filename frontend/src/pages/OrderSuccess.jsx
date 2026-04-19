import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiCheckCircle } from "react-icons/fi";
import "./OrderSuccess.css";

export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const [recommendations, setRecommendations] = useState([]);

    const orderedItems = location.state?.orderedItems || [];


    useEffect(() => {
        if (!orderedItems.length) return;

        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(data => {
                const all = data.products || [];

                const orderedIds = new Set(orderedItems.map(item => String(item.productId)));
                const orderedCategories = new Set(
                    orderedItems.map(item => item.category).filter(Boolean)
                );
                const orderedBrands = new Set(
                    orderedItems.map(item => item.brand).filter(Boolean)
                );



                const suggestions = all
                    .filter(p =>
                        !orderedIds.has(String(p._id)) &&
                        (orderedCategories.has(p.category) || orderedBrands.has(p.brand))
                    )
                    .slice(0, 6);

                setRecommendations(suggestions);
            })
            .catch(() => {});
    }, [orderedItems.length]);

    return (
        <>
            <Navbar />
            <section className="order-success-page">
                <div className="order-success-card">
                    <FiCheckCircle className="order-success-icon" />
                    <h1>Order Placed!</h1>
                    <p>Thank you for your order. We'll deliver it to you soon.</p>
                    <div className="order-success-actions">
                        <button className="btn btn-cta" onClick={() => navigate("/products")}>
                            Continue Shopping
                        </button>
                        <button className="btn btn-soft" onClick={() => navigate("/profile")}>
                            View My Orders
                        </button>
                    </div>
                </div>

                {recommendations.length > 0 && (
                    <div className="order-success-recommendations">
                        <h2 className="recommendations-title">You might also like</h2>
                        <p className="recommendations-subtitle">Based on your recent order</p>
                        <div className="recommendations-grid">
                            {recommendations.map(p => (
                                <div
                                    key={p._id}
                                    className="recommendation-card"
                                    onClick={() => navigate(`/products/${p._id}`)}
                                >
                                    <div className="recommendation-img">
                                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} />}
                                    </div>
                                    <div className="recommendation-info">
                                        <p className="recommendation-category">{p.category}</p>
                                        <p className="recommendation-name">{p.name}</p>
                                        <p className="recommendation-price">Rs. {p.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
            <Footer />
        </>
    );
}

