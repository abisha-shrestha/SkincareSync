import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import "./Cart.css";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [complementary, setComplementary] = useState([]);
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email") || "guest";

    const fetchCart = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/cart?userEmail=${userEmail}`);
            const data = await res.json();
            const validItems = (data.cart?.items || []).filter(
                item => item.price && item.quantity && item.productId
            );
            setCartItems(validItems.map(item => ({ ...item, selected: true })));
        } catch (err) {
            console.error("Cart fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComplementary = async (items) => {
        if (!items.length) return;
        try {
            const res = await fetch('http://localhost:3000/api/products');
            const data = await res.json();
            const all = data.products || [];
            const cartCategories = new Set(items.map(item => item.productId?.category).filter(Boolean));
            const cartSkinTypes = new Set(items.flatMap(item => item.productId?.skinTypes || []).map(t => t.toLowerCase()));
            const cartIds = new Set(items.map(item => item.productId?._id || item.productId));
            const suggestions = all
                .filter(p =>
                    !cartIds.has(p._id) &&
                    !cartCategories.has(p.category) &&
                    p.skinTypes?.some(t => cartSkinTypes.has(t.toLowerCase()))
                )
                .slice(0, 4);
            setComplementary(suggestions);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchCart(); }, []); 

    useEffect(() => {
        if (cartItems.length > 0) fetchComplementary(cartItems);
    }, [cartItems.length]); 

    const updateQuantity = async (productId, change) => {
        const currentItem = cartItems.find(item => (item.productId._id || item.productId) === productId);
        if (!currentItem) return;
        const newQuantity = Math.max(1, currentItem.quantity + change);
        try {
            await fetch("http://localhost:3000/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, productId, quantity: newQuantity })
            });
            fetchCart();
        } catch (err) { console.error("Update error:", err); }
    };

    const removeItem = async (productId) => {
        try {
            await fetch("http://localhost:3000/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, productId, quantity: 0 })
            });
            fetchCart();
        } catch (err) { console.error("Remove error:", err); }
    };

    const toggleSelect = (productId) => {
        setCartItems(prev =>
            prev.map(item =>
                (item.productId._id || item.productId) === productId
                    ? { ...item, selected: !item.selected }
                    : item
            )
        );
    };

    const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    const someSelected = cartItems.some(item => item.selected);

    const toggleSelectAll = () => {
        setCartItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
    };

    const handleProceedToCheckout = () => {
        const selectedItems = cartItems.filter(item => item.selected);
        navigate("/checkout", { state: { selectedItems } });
    };

    const subtotal = cartItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    const selectedCount = cartItems.filter(item => item.selected).length;

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
                        <p>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <div className="empty-icon">
                                <FiShoppingBag size={48} style={{ color: 'var(--accent-dark)' }} />
                            </div>
                            <h2>Your cart is empty</h2>
                            <p>Discover our premium skincare collection</p>
                            <button className="btn btn-cta" onClick={() => navigate("/products")}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-container">
                                <div className="cart-items">
                                    <div className="cart-select-all">
                                        <label className="cart-checkbox-label">
                                            <input
                                                type="checkbox"
                                                className="cart-checkbox"
                                                checked={allSelected}
                                                onChange={toggleSelectAll}
                                            />
                                            <span>Select All ({cartItems.length} items)</span>
                                        </label>
                                    </div>

                                    {cartItems.map(item => (
                                        <div
                                            key={item.productId._id || item.productId}
                                            className={`cart-item ${!item.selected ? "cart-item-dimmed" : ""}`}
                                        >
                                            <div className="cart-item-checkbox">
                                                <input
                                                    type="checkbox"
                                                    className="cart-checkbox"
                                                    checked={item.selected}
                                                    onChange={() => toggleSelect(item.productId._id || item.productId)}
                                                />
                                            </div>
                                            <div className="cart-item-image">
                                                {item.productId?.imageUrl
                                                    ? <img src={item.productId.imageUrl} alt={item.productId.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                                    : null
                                                }
                                            </div>
                                            <div className="cart-item-main">
                                                <div className="cart-item-details">
                                                    <h3>{item.productId?.name || item.name}</h3>
                                                    <p className="cart-item-price">Rs. {item.price.toLocaleString()}</p>
                                                </div>
                                                <div className="cart-item-quantity">
                                                    <button className="qty-btn" onClick={() => updateQuantity(item.productId._id || item.productId, -1)}>−</button>
                                                    <span className="qty-display">{item.quantity}</span>
                                                    <button className="qty-btn" onClick={() => updateQuantity(item.productId._id || item.productId, 1)}>+</button>
                                                </div>
                                            </div>
                                            <div className="cart-item-total">
                                                Rs. {(item.price * item.quantity).toLocaleString()}
                                            </div>
                                            <button className="delete-btn" onClick={() => removeItem(item.productId._id || item.productId)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-summary">
                                    <h2>Order Summary</h2>
                                    <div className="checkout-items">
                                        {cartItems.filter(item => item.selected).map((item, idx) => (
                                            <div key={idx} className="checkout-item">
                                                <div className="checkout-item-image">
                                                    <img
                                                        src={item.productId?.imageUrl || item.imageUrl}
                                                        alt={item.productId?.name || item.name}
                                                    />
                                                </div>
                                                <div>
                                                    <p>{item.productId?.name || item.name}</p>
                                                    <p>Qty: {item.quantity}</p>
                                                </div>
                                                <p>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="summary-selected-note">
                                        {selectedCount} of {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} selected
                                    </div>
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>Rs. {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        <span>
                                            {subtotal > 4500 ? "Free (above Rs. 4500)" : "Rs. 150–220 (based on location)"}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-cta full-width"
                                        onClick={handleProceedToCheckout}
                                        disabled={!someSelected}
                                    >
                                        {someSelected
                                            ? `Checkout (${selectedCount} item${selectedCount !== 1 ? "s" : ""})`
                                            : "Select items to checkout"
                                        }
                                    </button>
                                    <button className="btn btn-cta full-width secondary-btn" onClick={() => navigate("/products")}>
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>

                            {complementary.length > 0 && (
                                <div className="cart-recommendations">
                                    <h2 className="recommendations-title">You might also need</h2>
                                    <p className="recommendations-subtitle">Products that complement what's in your cart</p>
                                    <div className="recommendations-grid">
                                        {complementary.map(p => (
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
                        </>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}