// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar/Navbar";
// import Footer from "../components/Footer/Footer";
// import toast from "react-hot-toast";
// import "./Checkout.css";

// export default function Checkout() {
//     const navigate = useNavigate();
//     const userEmail = localStorage.getItem("email") || "guest";
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [placing, setPlacing] = useState(false);
//     const [savedAddresses, setSavedAddresses] = useState([]);
//     const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "" });
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         fetch(`http://localhost:3000/api/cart?userEmail=${userEmail}`)
//             .then(res => res.json())
//             .then(data => {
//                 const validItems = (data.cart?.items || []).filter(item => item.price && item.quantity && item.productId);
//                 setCartItems(validItems);
//                 if (validItems.length === 0) navigate("/cart");
//             })
//             .catch(err => console.error(err))
//             .finally(() => setLoading(false));

//         fetch(`http://localhost:3000/api/addresses?userEmail=${userEmail}`)
//             .then(res => res.json())
//             .then(data => {
//                 const addresses = data.addresses || [];
//                 setSavedAddresses(addresses);
//                 const defaultAddr = addresses.find(a => a.isDefault);
//                 if (defaultAddr) {
//                     setForm({
//                         fullName: defaultAddr.fullName,
//                         phone: defaultAddr.phone,
//                         address: defaultAddr.address,
//                         city: defaultAddr.city
//                     });
//                 }
//             })
//             .catch(err => console.error(err));
//     }, []);

//     const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

//     const validate = () => {
//         const newErrors = {};

//         if (!form.fullName.trim()) {
//             newErrors.fullName = "Full name is required";
//         } else if (form.fullName.trim().length < 3) {
//             newErrors.fullName = "Full name must be at least 3 characters";
//         }

//         if (!form.phone.trim()) {
//             newErrors.phone = "Phone number is required";
//         } else if (!/^(97|98)\d{8}$/.test(form.phone.trim())) {
//             newErrors.phone = "Phone must start with 97 or 98 and be exactly 10 digits";
//         }

//         if (!form.address.trim()) {
//             newErrors.address = "Delivery address is required";
//         } else if (form.address.trim().length < 5) {
//             newErrors.address = "Address must be at least 5 characters";
//         }

//         if (!form.city.trim()) {
//             newErrors.city = "City is required";
//         } else if (form.city.trim().length < 2) {
//             newErrors.city = "City must be at least 2 characters";
//         }

//         return newErrors;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name === "phone") {
//             const digits = value.replace(/\D/g, '').slice(0, 10);
//             setForm(prev => ({ ...prev, phone: digits }));
//         } else {
//             setForm(prev => ({ ...prev, [name]: value }));
//         }

//         // Clear error on change
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: "" }));
//         }
//     };

//     const handleSelectAddress = (addr) => {
//         setForm({ fullName: addr.fullName, phone: addr.phone, address: addr.address, city: addr.city });
//         setErrors({});
//     };

//     const handlePlaceOrder = async () => {
//         const validationErrors = validate();
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             toast.error("Please fix the errors before placing your order");
//             return;
//         }

//         try {
//             setPlacing(true);
//             const res = await fetch("http://localhost:3000/api/orders", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ userEmail, deliveryAddress: form })
//             });
//             const data = await res.json();
//             if (data.success) {
//                 navigate("/order-success");
//             } else {
//                 toast.error("Order failed: " + data.message);
//             }
//         } catch (err) {
//             toast.error("Something went wrong. Please try again.");
//         } finally {
//             setPlacing(false);
//         }
//     };

//     if (loading) {
//         return (
//             <>
//                 <Navbar />
//                 <div style={{ padding: "140px 6rem", textAlign: "center", minHeight: "80vh", background: "var(--bg-secondary)" }}>
//                     <h2>Loading...</h2>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     return (
//         <>
//             <Navbar />
//             <section className="checkout-page">
//                 <div className="checkout-wrapper">
//                     <h1 className="checkout-title">Checkout</h1>
//                     <div className="checkout-container">
//                         <div className="checkout-left">

//                             {/* Saved Addresses */}
//                             {savedAddresses.length > 0 && (
//                                 <div className="checkout-section">
//                                     <h2>Saved addresses</h2>
//                                     <div className="saved-address-list">
//                                         {savedAddresses.map(addr => (
//                                             <div
//                                                 key={addr._id}
//                                                 className={`saved-address-item ${form.address === addr.address && form.phone === addr.phone ? 'selected' : ''}`}
//                                                 onClick={() => handleSelectAddress(addr)}
//                                             >
//                                                 <div className="saved-address-label">
//                                                     {addr.label}
//                                                     {addr.isDefault && <span className="address-default-badge">Default</span>}
//                                                 </div>
//                                                 <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0' }}>{addr.fullName}</p>
//                                                 <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{addr.address}, {addr.city}</p>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Delivery Form */}
//                             <div className="checkout-section">
//                                 <h2>Delivery details</h2>
//                                 <div className="checkout-form">

//                                     <div className="checkout-field">
//                                         <label>Full Name <span className="checkout-required">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="fullName"
//                                             value={form.fullName}
//                                             onChange={handleChange}
//                                             placeholder="Enter your full name"
//                                             className={errors.fullName ? "input-error" : ""}
//                                         />
//                                         {errors.fullName && <p className="checkout-error">{errors.fullName}</p>}
//                                     </div>

//                                     <div className="checkout-field">
//                                         <label>Phone Number <span className="checkout-required">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="phone"
//                                             value={form.phone}
//                                             onChange={handleChange}
//                                             placeholder="98XXXXXXXX"
//                                             maxLength={10}
//                                             className={errors.phone ? "input-error" : ""}
//                                         />
//                                         {errors.phone && <p className="checkout-error">{errors.phone}</p>}
//                                     </div>

//                                     <div className="checkout-field">
//                                         <label>Delivery Address <span className="checkout-required">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="address"
//                                             value={form.address}
//                                             onChange={handleChange}
//                                             placeholder="Street address, tole"
//                                             className={errors.address ? "input-error" : ""}
//                                         />
//                                         {errors.address && <p className="checkout-error">{errors.address}</p>}
//                                     </div>

//                                     <div className="checkout-field">
//                                         <label>City <span className="checkout-required">*</span></label>
//                                         <input
//                                             type="text"
//                                             name="city"
//                                             value={form.city}
//                                             onChange={handleChange}
//                                             placeholder="Pokhara"
//                                             className={errors.city ? "input-error" : ""}
//                                         />
//                                         {errors.city && <p className="checkout-error">{errors.city}</p>}
//                                     </div>

//                                 </div>
//                             </div>

//                             <div className="checkout-section">
//                                 <h2>Payment method</h2>
//                                 <div className="payment-option selected">
//                                     <span className="payment-dot" />
//                                     Cash on Delivery
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Order Summary */}
//                         <div className="checkout-right">
//                             <div className="checkout-summary">
//                                 <h2>Order summary</h2>
//                                 <div className="checkout-items">
//                                     {cartItems.map(item => (
//                                         <div key={item.productId._id || item.productId} className="checkout-item">
//                                             <div className="checkout-item-image">
//                                                 {item.productId?.imageUrl && (
//                                                     <img
//                                                         src={item.productId.imageUrl}
//                                                         alt={item.productId.name}
//                                                         style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
//                                                     />
//                                                 )}
//                                             </div>
//                                             <div className="checkout-item-info">
//                                                 <p className="checkout-item-name">{item.productId?.name || item.name}</p>
//                                                 <p className="checkout-item-qty">Qty: {item.quantity}</p>
//                                             </div>
//                                             <p className="checkout-item-price">
//                                                 Rs. {(item.price * item.quantity).toLocaleString()}
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div className="checkout-totals">
//                                     <div className="summary-row"><span>Subtotal</span><span>Rs. {total.toLocaleString()}</span></div>
//                                     <div className="summary-row"><span>Shipping</span><span>Free</span></div>
//                                     <div className="summary-total"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
//                                 </div>
//                                 <button
//                                     className="btn btn-cta full-width"
//                                     onClick={handlePlaceOrder}
//                                     disabled={placing}
//                                     style={{ marginTop: '16px' }}
//                                 >
//                                     {placing ? "Placing Order..." : "Place Order →"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <Footer />
//         </>
//     );
// }


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

    // Detect mode
    const isBuyNow = new URLSearchParams(location.search).get("mode") === "buynow";

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isBuyNow) {
            // Buy Now: read from sessionStorage, skip cart fetch entirely
            const raw = sessionStorage.getItem("buyNowItem");
            if (!raw) {
                navigate("/products");
                return;
            }
            setCartItems([JSON.parse(raw)]);
            setLoading(false);
        } else {
            // Normal cart checkout: read selected items passed via router state
            const selectedItems = location.state?.selectedItems;
            if (selectedItems && selectedItems.length > 0) {
                setCartItems(selectedItems);
                setLoading(false);
            } else {
                // Fallback: fetch full cart (e.g. user navigated directly to /checkout)
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

        // Fetch saved addresses regardless of mode
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

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const validate = () => {
        const newErrors = {};
        if (!form.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (form.fullName.trim().length < 3) {
            newErrors.fullName = "Full name must be at least 3 characters";
        }
        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^(97|98)\d{8}$/.test(form.phone.trim())) {
            newErrors.phone = "Phone must start with 97 or 98 and be exactly 10 digits";
        }
        if (!form.address.trim()) {
            newErrors.address = "Delivery address is required";
        } else if (form.address.trim().length < 5) {
            newErrors.address = "Address must be at least 5 characters";
        }
        if (!form.city.trim()) {
            newErrors.city = "City is required";
        } else if (form.city.trim().length < 2) {
            newErrors.city = "City must be at least 2 characters";
        }
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
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectAddress = (addr) => {
        setForm({ fullName: addr.fullName, phone: addr.phone, address: addr.address, city: addr.city });
        setErrors({});
    };

    const handlePlaceOrder = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors before placing your order");
            return;
        }

        try {
            setPlacing(true);

            // Build the items payload — works for both buy now and cart
            const itemsPayload = cartItems.map(item => ({
                productId: item.productId._id || item.productId,
                name: item.productId?.name || item.name,
                price: item.price,
                quantity: item.quantity,
            }));

            const res = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail,
                    deliveryAddress: form,
                    items: itemsPayload,        // ← explicit items list
                    isBuyNow,                   // ← flag so backend knows not to clear cart
                })
            });

            const data = await res.json();
            if (data.success) {
                if (isBuyNow) sessionStorage.removeItem("buyNowItem");
                navigate("/order-success");
            } else {
                toast.error("Order failed: " + data.message);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "140px 6rem", textAlign: "center", minHeight: "80vh", background: "var(--bg-secondary)" }}>
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
                    <h1 className="checkout-title">
                        {isBuyNow ? "Quick Checkout" : "Checkout"}
                    </h1>
                    <div className="checkout-container">
                        <div className="checkout-left">

                            {savedAddresses.length > 0 && (
                                <div className="checkout-section">
                                    <h2>Saved addresses</h2>
                                    <div className="saved-address-list">
                                        {savedAddresses.map(addr => (
                                            <div
                                                key={addr._id}
                                                className={`saved-address-item ${form.address === addr.address && form.phone === addr.phone ? "selected" : ""}`}
                                                onClick={() => handleSelectAddress(addr)}
                                            >
                                                <div className="saved-address-label">
                                                    {addr.label}
                                                    {addr.isDefault && <span className="address-default-badge">Default</span>}
                                                </div>
                                                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "2px 0" }}>{addr.fullName}</p>
                                                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>{addr.address}, {addr.city}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="checkout-section">
                                <h2>Delivery details</h2>
                                <div className="checkout-form">
                                    <div className="checkout-field">
                                        <label>Full Name <span className="checkout-required">*</span></label>
                                        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full name" className={errors.fullName ? "input-error" : ""} />
                                        {errors.fullName && <p className="checkout-error">{errors.fullName}</p>}
                                    </div>
                                    <div className="checkout-field">
                                        <label>Phone Number <span className="checkout-required">*</span></label>
                                        <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="98XXXXXXXX" maxLength={10} className={errors.phone ? "input-error" : ""} />
                                        {errors.phone && <p className="checkout-error">{errors.phone}</p>}
                                    </div>
                                    <div className="checkout-field">
                                        <label>Delivery Address <span className="checkout-required">*</span></label>
                                        <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Street address, tole" className={errors.address ? "input-error" : ""} />
                                        {errors.address && <p className="checkout-error">{errors.address}</p>}
                                    </div>
                                    <div className="checkout-field">
                                        <label>City <span className="checkout-required">*</span></label>
                                        <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Pokhara" className={errors.city ? "input-error" : ""} />
                                        {errors.city && <p className="checkout-error">{errors.city}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="checkout-section">
                                <h2>Payment method</h2>
                                <div className="payment-option selected">
                                    <span className="payment-dot" />
                                    Cash on Delivery
                                </div>
                            </div>
                        </div>

                        <div className="checkout-right">
                            <div className="checkout-summary">
                                <h2>Order summary</h2>
                                <div className="checkout-items">
                                    {cartItems.map((item, idx) => (
                                        <div key={item.productId?._id || item.productId || idx} className="checkout-item">
                                            <div className="checkout-item-image">
                                                {item.productId?.imageUrl && (
                                                    <img src={item.productId.imageUrl} alt={item.productId.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                                                )}
                                            </div>
                                            <div className="checkout-item-info">
                                                <p className="checkout-item-name">{item.productId?.name || item.name}</p>
                                                <p className="checkout-item-qty">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="checkout-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="checkout-totals">
                                    <div className="summary-row"><span>Subtotal</span><span>Rs. {total.toLocaleString()}</span></div>
                                    <div className="summary-row"><span>Shipping</span><span>Free</span></div>
                                    <div className="summary-total"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
                                </div>
                                <button className="btn btn-cta full-width" onClick={handlePlaceOrder} disabled={placing} style={{ marginTop: "16px" }}>
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