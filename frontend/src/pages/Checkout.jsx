import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import toast from "react-hot-toast";
import "./Checkout.css";

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = localStorage.getItem("email") || "guest";

    const isBuyNow = new URLSearchParams(location.search).get("mode") === "buynow";

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isBuyNow) {
            const raw = sessionStorage.getItem("buyNowItem");
            if (!raw) { navigate("/products"); return; }
            setCartItems([JSON.parse(raw)]);
            setLoading(false);
        } else {
            const selectedItems = location.state?.selectedItems;

            if (selectedItems && selectedItems.length > 0) {
                setCartItems(selectedItems);
                setLoading(false);
            } else {
                fetch(`http://localhost:3000/api/cart?userEmail=${userEmail}`)
                    .then(res => res.json())
                    .then(data => {
                        const validItems = (data.cart?.items || []).filter(
                            item => item.price && item.quantity && item.productId
                        );
                        if (validItems.length === 0) navigate("/cart");
                        setCartItems(validItems);
                    })
                    .catch(err => console.error(err))
                    .finally(() => setLoading(false));
            }
        }

        fetch(`http://localhost:3000/api/addresses?userEmail=${userEmail}`)
            .then(res => res.json())
            .then(data => {
                const addresses = data.addresses || [];
                setSavedAddresses(addresses);

                const defaultAddr = addresses.find(a => a.isDefault);
                if (defaultAddr) {
                    setForm({
                        fullName: defaultAddr.fullName,
                        phone: defaultAddr.phone,
                        address: defaultAddr.address,
                        city: defaultAddr.city
                    });
                }
            })
            .catch(err => console.error(err));
    }, []);

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const validate = () => {
        const newErrors = {};

        if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
        else if (form.fullName.trim().length < 3)
            newErrors.fullName = "Full name must be at least 3 characters";

        if (!form.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^(97|98)\d{8}$/.test(form.phone.trim()))
            newErrors.phone = "Phone must be 10 digits starting with 97 or 98";

        if (!form.address.trim()) newErrors.address = "Address is required";
        else if (form.address.trim().length < 5)
            newErrors.address = "Address must be at least 5 characters";

        if (!form.city.trim()) newErrors.city = "City is required";
        else if (form.city.trim().length < 2)
            newErrors.city = "City must be at least 2 characters";

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const digits = value.replace(/\D/g, "").slice(0, 10);
            setForm(prev => ({ ...prev, phone: digits }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSelectAddress = (addr) => {
        setForm({
            fullName: addr.fullName,
            phone: addr.phone,
            address: addr.address,
            city: addr.city
        });
        setErrors({});
    };

    const handlePlaceOrder = async () => {
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix form errors");
            return;
        }

        try {
            setPlacing(true);

            const itemsPayload = cartItems.map(item => ({
                productId: item.productId?._id || item.productId,
                name: item.productId?.name || item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.productId?.imageUrl || item.imageUrl || ""
            }));

            const res = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail,
                    deliveryAddress: form,
                    items: itemsPayload,
                    isBuyNow
                })
            });

            const data = await res.json();

            if (data.success) {
                if (isBuyNow) sessionStorage.removeItem("buyNowItem");

                navigate("/order-success", {
                    state: {
                        orderedItems: cartItems
                    }
                });
            } else {
                toast.error(data.message || "Order failed");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "140px 6rem", textAlign: "center" }}>
                    <h2>Loading...</h2>
                </div>
                <Footer />
            </>
        );
    }

    // UI Shipping, for display puropse only
    const getShippingCost = () => {
        if (total > 4500) return 0;
        const city = form.city.trim().toLowerCase();
        if (city === "pokhara") return 150;
        return 220;
    };

    const shipping = getShippingCost();
    const grandTotal = total + shipping;

    return (
        <>
            <Navbar />

            <section className="checkout-page">
                <div className="checkout-wrapper">

                    <h1 className="checkout-title">
                        {isBuyNow ? "Quick Checkout" : "Checkout"}
                    </h1>

                    <div className="checkout-container">

                        {/* LEFT */}
                        <div className="checkout-left">

                            {savedAddresses.length > 0 && (
                                <div className="checkout-section">
                                    <h2>Saved Addresses</h2>
                                    <div className="saved-address-list">
                                        {savedAddresses.map(addr => (
                                            <div
                                                key={addr._id}
                                                className={`saved-address-item ${form.address === addr.address ? "selected" : ""}`}
                                                onClick={() => handleSelectAddress(addr)}
                                            >
                                                <div className="saved-address-label">
                                                    {addr.label}
                                                    {addr.isDefault && (
                                                        <span className="address-default-badge">Default</span>
                                                    )}
                                                </div>
                                                <p>{addr.fullName}</p>
                                                <p>{addr.address}, {addr.city}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="checkout-section">
                                <h2>Delivery Details</h2>

                                <div className="checkout-form">

                                    <div className="checkout-field">
                                        <label>Full Name *</label>
                                        <input name="fullName" value={form.fullName} onChange={handleChange} />
                                        {errors.fullName && <p className="checkout-error">{errors.fullName}</p>}
                                    </div>

                                    <div className="checkout-field">
                                        <label>Phone *</label>
                                        <input name="phone" value={form.phone} onChange={handleChange} />
                                        {errors.phone && <p className="checkout-error">{errors.phone}</p>}
                                    </div>

                                    <div className="checkout-field">
                                        <label>Address *</label>
                                        <input name="address" value={form.address} onChange={handleChange} />
                                        {errors.address && <p className="checkout-error">{errors.address}</p>}
                                    </div>

                                    <div className="checkout-field">
                                        <label>City *</label>
                                        <input name="city" value={form.city} onChange={handleChange} />
                                        {errors.city && <p className="checkout-error">{errors.city}</p>}
                                    </div>

                                </div>
                            </div>

                            <div className="checkout-section">
                                <h2>Payment</h2>
                                <div className="payment-option selected">
                                    Cash on Delivery
                                </div>
                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="checkout-right">

                            <div className="checkout-summary">

                                <h2>Order Summary</h2>

                                <div className="checkout-items">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="checkout-item">
                                            <div className="checkout-item-image">
                                                <img src={item.productId?.imageUrl || item.imageUrl} />
                                            </div>
                                            <div>
                                                <p>{item.productId?.name || item.name}</p>
                                                <p>Qty: {item.quantity}</p>
                                            </div>
                                            <p>Rs. {(item.price * item.quantity).toLocaleString()}</p>
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
                                        <span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                                    </div>

                                    <div className="summary-total">
                                        <span>Total</span>
                                        <span>Rs. {grandTotal.toLocaleString()}</span>
                                    </div>

                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={placing}
                                    className="btn btn-cta full-width"
                                >
                                    {placing ? "Placing..." : "Place Order"}
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