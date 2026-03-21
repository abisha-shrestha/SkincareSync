import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiHeart, FiShoppingCart} from "react-icons/fi";
import toast from "react-hot-toast";
import "./ProductDetail.css";


export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [wishlisted, setWishlisted] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
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
            toast.success(data.wishlisted ? "Added to wishlist" : "Removed from wishlist");
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    const addToCart = async () => {
        setAddingToCart(true);
        try {
            const res = await fetch('http://localhost:3000/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail,
                    productId: product._id,
                    quantity,
                    price: product.price
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`${product.name} added to cart`);
            } else {
                toast.error("Failed to add to cart");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setAddingToCart(false);
        }
    };

    const buyNow = async () => {
        setAddingToCart(true);
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
            navigate("/checkout");
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="product-detail-loading">
                    <div className="product-detail-spinner" />
                </div>
                <Footer />
            </>
        );
    }

    if (!product) return null;

    return (
        <>
            <Navbar />
            <section className="product-detail-page">
                <div className="product-detail-container">

                    {/* Image */}
                    <div className="product-image-section">
                        <img
                            src={product.imageUrl || product.image || "/api/products/default.jpg"}
                            alt={product.name}
                            className="product-main-image"
                        />
                    </div>

                    {/* Details */}
                    <div className="product-details-section">
                        <div className="product-header">
                            <p className="product-category">{product.category}</p>
                            <h1 className="product-name">{product.name}</h1>
                            <p className="product-price-large">
                                Rs. {product.price.toLocaleString()}
                            </p>
                            <button
                                className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                                onClick={toggleWishlist}
                                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <FiHeart
                                    style={{
                                        fill: wishlisted ? 'var(--accent)' : 'none',
                                        color: wishlisted ? 'var(--accent)' : 'var(--text-muted)',
                                        fontSize: '20px',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            </button>
                        </div>

                        {product.description && (
                            <p className="product-description">{product.description}</p>
                        )}

                        <div className="quantity-selector">
                            <label>Quantity</label>
                            <div className="quantity-controls">
                                <button onClick={decrementQuantity}>−</button>
                                <span>{quantity}</span>
                                <button onClick={incrementQuantity}>+</button>
                            </div>
                        </div>

                        <div className="product-actions">
                            <button
                                className="product-btn-buynow"
                                onClick={buyNow}
                                disabled={addingToCart}
                            >
                                Buy Now
                            </button>
                            <button
                                className="product-btn-addcart"
                                onClick={addToCart}
                                disabled={addingToCart}
                            >
                                <FiShoppingCart />
                                Add to Cart
                            </button>
                        </div>

                        {product.skinTypes && product.skinTypes.length > 0 && (
                            <div className="skin-types-section">
                                <h3>Best for skin types</h3>
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