import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiTrash2 } from "react-icons/fi";
import "./Cart.css";


export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email") || "guest";

    const fetchCart = async () => {
        try {
        const res = await fetch(
            `http://localhost:3000/api/cart?userEmail=${userEmail}`
        );
        const data = await res.json();
        const validItems = (data.cart?.items || []).filter(
            (item) => item.price && item.quantity && item.productId
        );
        setCartItems(validItems);
        } catch (err) {
        console.error("Cart fetch error:", err);
        } finally {
        setLoading(false);
        }
    };
    const updateQuantity = async (productId, change) => {
        const currentItem = cartItems.find(
        (item) => (item.productId._id || item.productId) === productId
        );
        if (!currentItem) return;
        const newQuantity = Math.max(1, currentItem.quantity + change);
        try {
        await fetch("http://localhost:3000/api/cart", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            userEmail,
            productId,
            quantity: newQuantity
            })
        });
        fetchCart();
        } catch (err) {
        console.error("Update error:", err);
        }
    };
    const removeItem = async (productId) => {
        try {
        await fetch("http://localhost:3000/api/cart", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            userEmail,
            productId,
            quantity: 0
            })
        });
        fetchCart();
        } catch (err) {
        console.error("Remove error:", err);
        }
    };
    useEffect(() => {
        fetchCart();
    }, []);
    const total = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
    if (loading) {
        return (
        <>
            <Navbar />
            <div style={{ padding: "140px 6rem", textAlign: "center", minHeight: "80vh" }}>
            <h2>Loading cart...</h2>
            </div>
            <Footer />
        </>
        );
    }
    return (
        <>
        <Navbar />
        <section className="cart-page">
            <div className="cart-wrapper">
            <div className="cart-header">
                <h1>My Cart</h1>
                <p>{cartItems.length} items</p>
            </div>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Discover our premium skincare collection</p>
                <button
                    className="btn btn-cta"
                    onClick={() => navigate("/products")}
                >
                    Continue Shopping
                </button>
                </div>
            ) : (
                <div className="cart-container">
                <div className="cart-items">
                    {cartItems.map((item) => (
                    <div
                        key={item.productId._id || item.productId}
                        className="cart-item"
                    >
                        <div className="cart-item-image"></div>
                        <div className="cart-item-main">
                        <div className="cart-item-details">
                            <h3>{item.productId?.name || item.name}</h3>
                            <p className="cart-item-meta">
                            {item.productId?.name || item.name}
                            </p>
                            <p className="cart-item-price">
                            Rs. {item.price.toLocaleString()}
                            </p>
                        </div>
                        <div className="cart-item-quantity">
                            <button
                            className="qty-btn"
                            onClick={() =>
                                updateQuantity(
                                item.productId._id || item.productId,
                                -1
                                )
                            }
                            >
                            -
                            </button>
                            <span className="qty-display">
                            {item.quantity}
                            </span>
                            <button
                            className="qty-btn"
                            onClick={() =>
                                updateQuantity(
                                item.productId._id || item.productId,
                                1
                                )
                            }
                            >
                            +
                            </button>
                        </div>
                        </div>
                        <div className="cart-item-total">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                        <button
                        className="delete-btn"
                        onClick={() =>
                            removeItem(item.productId._id || item.productId)
                        }
                        >
                        <FiTrash2 />
                        </button>
                    </div>
                    ))}
                </div>
                <div className="cart-summary">
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
                    <button className="btn btn-cta full-width">
                    Proceed to Checkout →
                    </button>
                    <button
                    className="btn btn-cta full-width secondary-btn"
                    onClick={() => navigate("/products")}
                    >
                    Continue Shopping
                    </button>
                </div>
                </div>
            )}
            </div>
        </section>
        <Footer />
        </>
    );
}
