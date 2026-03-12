import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./ProductDetail.css"; 

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState(false);

    // CHANGE: Fetch SINGLE product from API
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
        .catch(err => {
            console.error('Error:', err);
            navigate("/products");
        })
        .finally(() => {
            setLoading(false);
        });
    }, [id, navigate]);

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);
    
    const toggleWishlist = () => setWishlist(!wishlist);
    const addToCart = async () => {
    try {
        const userEmail = localStorage.getItem('email') || 'guest';
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
            {/* Image Section */}
            <div className="product-image-section">
                <div className="product-image-placeholder">
                {/* Use imageUrl from DB or fallback */}
                <img 
                    src={product.imageUrl || product.image || "/api/products/default.jpg"} 
                    alt={product.name}
                    className="product-main-image"
                />
                </div>
            </div>

            {/* Details Section */}
            <div className="product-details-section">
                <div className="product-header">
                <h1 className="product-name">{product.name}</h1>
                <p className="product-price-large">
                    Rs. {product.price.toLocaleString()}
                </p>
                
                <button 
                    className={`wishlist-btn ${wishlist ? 'active' : ''}`}
                    onClick={toggleWishlist}
                >
                    <span className="heart-icon"></span>
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
                        <span key={index} className="skin-type-tag">
                        {type}
                        </span>
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
