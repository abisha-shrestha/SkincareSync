import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccess() {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                <div style={{ textAlign: 'center', padding: '60px 40px', background: 'white', borderRadius: '20px', border: '1px solid #eee', maxWidth: '460px', width: '100%' }}>
                    <FiCheckCircle style={{ fontSize: '60px', color: '#8B5E3C', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '26px', marginBottom: '10px' }}>Order Placed!</h1>
                    <p style={{ color: '#777', marginBottom: '30px' }}>
                        Thank you for your order. We'll deliver it to you soon.
                    </p>
                    <button className="btn btn-cta" onClick={() => navigate("/products")} style={{ marginRight: '12px' }}>
                        Continue Shopping
                    </button>
                    <button className="btn btn-soft" onClick={() => navigate("/orders")}>
                        View My Orders
                    </button>
                </div>
            </section>
            <Footer />
        </>
    );
}