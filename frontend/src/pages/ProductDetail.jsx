// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar/Navbar";
// import Footer from "../components/Footer/Footer";
// import "./ProductDetail.css";

// export default function ProductDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [product, setProduct] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [loading, setLoading] = useState(true);
//     const [wishlisted, setWishlisted] = useState(false);
//     const userEmail = localStorage.getItem('email') || 'guest';

//     // Fetch product
//     useEffect(() => {
//         fetch(`http://localhost:3000/api/products/${id}`)
//             .then(res => res.json())
//             .then(data => {
//                 if (data.success && data.product) {
//                     setProduct(data.product);
//                 } else {
//                     navigate("/products");
//                 }
//             })
//             .catch(() => navigate("/products"))
//             .finally(() => setLoading(false));
//     }, [id, navigate]);

//     // Check if already wishlisted once product loads
//     useEffect(() => {
//         if (!product) return;
//         fetch(`http://localhost:3000/api/wishlist?userEmail=${userEmail}`)
//             .then(res => res.json())
//             .then(data => {
//                 const items = data.wishlist?.items || [];
//                 setWishlisted(items.some(item => (item._id || item).toString() === product._id));
//             })
//             .catch(() => {});
//     }, [product]);

//     const incrementQuantity = () => setQuantity(q => q + 1);
//     const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

//     const toggleWishlist = async () => {
//         try {
//             const res = await fetch('http://localhost:3000/api/wishlist', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ userEmail, productId: product._id })
//             });
//             const data = await res.json();
//             setWishlisted(data.wishlisted);
//         } catch (err) {
//             console.error('Wishlist error:', err);
//         }
//     };

//     const addToCart = async () => {
//         try {
//             await fetch('http://localhost:3000/api/cart', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     userEmail,
//                     productId: product._id,
//                     quantity,
//                     price: product.price
//                 })
//             });
//             alert(`Added ${quantity} of ${product.name} to cart!`);
//         } catch (err) {
//             alert('Cart error');
//         }
//     };

//     const buyNow = () => alert("Redirecting to checkout...");

//     if (loading) return <div className="loading">Loading product...</div>;
//     if (!product) return <div>Product not found</div>;

//     return (
//         <>
//             <Navbar />
//             <section className="product-detail-page">
//                 <div className="product-detail-container">

//                     {/* Image Section */}
//                     <div className="product-image-section">
//                         <div className="product-image-placeholder">
//                             <img
//                                 src={product.imageUrl || product.image || "/api/products/default.jpg"}
//                                 alt={product.name}
//                                 className="product-main-image"
//                             />
//                         </div>
//                     </div>

//                     {/* Details Section */}
//                     <div className="product-details-section">
//                         <div className="product-header">
//                             <h1 className="product-name">{product.name}</h1>
//                             <p className="product-price-large">
//                                 Rs. {product.price.toLocaleString()}
//                             </p>

//                             <button
//                                 className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
//                                 onClick={toggleWishlist}
//                                 title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
//                             >
//                                 {wishlisted ? '❤️' : '🤍'}
//                             </button>
//                         </div>

//                         <div className="quantity-selector">
//                             <label>Quantity</label>
//                             <div className="quantity-controls">
//                                 <button onClick={decrementQuantity}>-</button>
//                                 <span>{quantity}</span>
//                                 <button onClick={incrementQuantity}>+</button>
//                             </div>
//                         </div>

//                         <div className="product-actions">
//                             <button className="btn btn-cta buy-now-btn" onClick={buyNow}>
//                                 Buy Now
//                             </button>
//                             <button className="btn btn-soft add-cart-btn" onClick={addToCart}>
//                                 Add to Cart
//                             </button>
//                         </div>

//                         {product.skinTypes && (
//                             <div className="skin-types-section">
//                                 <h3>Best for skin types:</h3>
//                                 <div className="skin-type-tags">
//                                     {product.skinTypes.map((type, index) => (
//                                         <span key={index} className="skin-type-tag">
//                                             {type}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                 </div>
//             </section>
//             <Footer />
//         </>
//     );
// }







import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiHeart } from "react-icons/fi";
import "./ProductDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [wishlisted, setWishlisted] = useState(false);
    const userEmail = localStorage.getItem('email') || 'guest';

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.product) {
                    setProduct(data.product);
                } else {
                    navigate("/products");
                }
            })
            .catch(() => navigate("/products"))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    useEffect(() => {
        if (!product) return;
        fetch(`http://localhost:3000/api/wishlist?userEmail=${userEmail}`)
            .then(res => res.json())
            .then(data => {
                const items = data.wishlist?.items || [];
                setWishlisted(items.some(item => (item._id || item).toString() === product._id));
            })
            .catch(() => {});
    }, [product]);

    const incrementQuantity = () => setQuantity(q => q + 1);
    const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

    const toggleWishlist = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, productId: product._id })
            });
            const data = await res.json();
            setWishlisted(data.wishlisted);
        } catch (err) {
            console.error('Wishlist error:', err);
        }
    };

    const addToCart = async () => {
        try {
            await fetch('http://localhost:3000/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail,
                    productId: product._id,
                    quantity,
                    price: product.price
                })
            });
            alert(`Added ${quantity} of ${product.name} to cart!`);
        } catch (err) {
            alert('Cart error');
        }
    };

    const buyNow = () => alert("Redirecting to checkout...");

    if (loading) return <div className="loading">Loading product...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <>
            <Navbar />
            <section className="product-detail-page">
                <div className="product-detail-container">

                    <div className="product-image-section">
                        <div className="product-image-placeholder">
                            <img
                                src={product.imageUrl || product.image || "/api/products/default.jpg"}
                                alt={product.name}
                                className="product-main-image"
                            />
                        </div>
                    </div>

                    <div className="product-details-section">
                        <div className="product-header">
                            <h1 className="product-name">{product.name}</h1>
                            <p className="product-price-large">
                                Rs. {product.price.toLocaleString()}
                            </p>

                            <button
                                className="wishlist-btn"
                                onClick={toggleWishlist}
                                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <FiHeart
                                    style={{
                                        fill: wishlisted ? '#8B5E3C' : 'none',
                                        color: wishlisted ? '#8B5E3C' : '#999',
                                        fontSize: '22px',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            </button>
                        </div>

                        <div className="quantity-selector">
                            <label>Quantity</label>
                            <div className="quantity-controls">
                                <button onClick={decrementQuantity}>-</button>
                                <span>{quantity}</span>
                                <button onClick={incrementQuantity}>+</button>
                            </div>
                        </div>

                        <div className="product-actions">
                            <button className="btn btn-cta buy-now-btn" onClick={buyNow}>
                                Buy Now
                            </button>
                            <button className="btn btn-soft add-cart-btn" onClick={addToCart}>
                                Add to Cart
                            </button>
                        </div>

                        {product.skinTypes && (
                            <div className="skin-types-section">
                                <h3>Best for skin types:</h3>
                                <div className="skin-type-tags">
                                    {product.skinTypes.map((type, index) => (
                                        <span key={index} className="skin-type-tag">{type}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </section>
            <Footer />
        </>
    );
}