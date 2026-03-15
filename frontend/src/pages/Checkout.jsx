import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Checkout.css";

export default function Checkout() {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email") || "guest";
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: ""
    });

    useEffect(() => {
        fetch(`http://localhost:3000/api/cart?userEmail=${userEmail}`)
            .then(res => res.json())
            .then(data => {
                const validItems = (data.cart?.items || []).filter(
                    item => item.price && item.quantity && item.productId
                );
                setCartItems(validItems);
                if (validItems.length === 0) navigate("/cart");
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        if (!form.fullName || !form.phone || !form.address || !form.city) {
            alert("Please fill in all delivery details");
            return;
        }
        try {
            setPlacing(true);
            const res = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail,
                    deliveryAddress: form
                })
            });
            const data = await res.json();
            if (data.success) {
                navigate("/order-success");
            } else {
                alert("Order failed: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "140px 6rem", textAlign: "center", minHeight: "80vh" }}>
                    <h2>Loading...</h2>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="checkout-page">
                <div className="checkout-wrapper">
                    <h1 className="checkout-title">Checkout</h1>

                    <div className="checkout-container">

                        {/* LEFT — Delivery Form */}
                        <div className="checkout-left">
                            <div className="checkout-section">
                                <h2>Delivery Details</h2>
                                <div className="checkout-form">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="98XXXXXXXX"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Delivery Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Street address, tole"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            placeholder="Kathmandu"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="checkout-section">
                                <h2>Payment Method</h2>
                                <div className="payment-option selected">
                                    <span className="payment-dot" />
                                    Cash on Delivery
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Order Summary */}
                        <div className="checkout-right">
                            <div className="checkout-summary">
                                <h2>Order Summary</h2>
                                <div className="checkout-items">
                                    {cartItems.map(item => (
                                        <div key={item.productId._id || item.productId} className="checkout-item">
                                            <div className="checkout-item-image">
                                                {item.productId?.imageUrl
                                                    ? <img src={item.productId.imageUrl} alt={item.productId.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                    : null
                                                }
                                            </div>
                                            <div className="checkout-item-info">
                                                <p className="checkout-item-name">{item.productId?.name || item.name}</p>
                                                <p className="checkout-item-qty">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="checkout-item-price">
                                                Rs. {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="checkout-totals">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>Rs. {total.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="summary-total">
                                        <span>Total</span>
                                        <span>Rs. {total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-cta full-width"
                                    onClick={handlePlaceOrder}
                                    disabled={placing}
                                >
                                    {placing ? "Placing Order..." : "Place Order →"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}