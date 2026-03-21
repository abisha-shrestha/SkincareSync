import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiCheckCircle } from "react-icons/fi";
import "./OrderSuccess.css";

export default function OrderSuccess() {
    const navigate = useNavigate();
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
                        <button className="btn btn-soft" onClick={() => navigate("/orders")}>
                            View My Orders
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}