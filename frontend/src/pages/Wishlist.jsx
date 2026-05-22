import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiTrash2, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import "./Wishlist.css";

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email") || "guest";

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/wishlist?userEmail=${userEmail}`);
            const data = await res.json();
            setWishlistItems(data.wishlist?.items || []);
        } catch (err) {
            console.error("Wishlist fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId) => {
        try {
            await fetch("http://localhost:3000/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, productId })
            });
            fetchWishlist();
        } catch (err) {
            console.error("Remove error:", err);
        }
    };

    const addToCart = async (product) => {
        try {
            await fetch("http://localhost:3000/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail,
                    productId: product._id,
                    quantity: 1,
                    price: product.price
                })
            });
            toast.success(`${product.name} added to cart`);
        } catch (err) {
            console.error("Add to cart error:", err);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => { fetchWishlist(); }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "140px 6rem", textAlign: "center", minHeight: "80vh" }}>
                    <h2>Loading wishlist...</h2>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="wishlist-page">
                <div className="wishlist-wrapper">
                    <div className="wishlist-header">
                        <h1>My Wishlist</h1>
                        <p>{wishlistItems.length} items</p>
                    </div>

                    {wishlistItems.length === 0 ? (
                        <div className="empty-wishlist">
                            <div className="empty-icon">
                                <FiHeart style={{ fontSize: '50px', color: '#ccc' }} />
                            </div>
                            <h2>Your wishlist is empty</h2>
                            <p>Save your favourite products here</p>
                            <button className="btn btn-cta" onClick={() => navigate("/products")}>
                                Explore Products
                            </button>
                        </div>
                    ) : (
                        <div className="wishlist-items">
                            {wishlistItems.map(product => (
                                <div key={product._id} className="wishlist-item">
                                    <div
                                        className="wishlist-item-image"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        {product.imageUrl
                                            ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                            : null
                                        }
                                    </div>
                                    <div className="wishlist-item-main">
                                        <div className="wishlist-item-details">
                                            <h3 onClick={() => navigate(`/product/${product._id}`)}>
                                                {product.name}
                                            </h3>
                                            <p className="wishlist-item-meta">{product.category}</p>
                                            <p className="wishlist-item-price">Rs. {product.price.toLocaleString()}</p>
                                        </div>
                                        <div className="wishlist-item-actions">
                                            <button
                                                className="btn btn-soft wishlist-cart-btn"
                                                onClick={() => addToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                    <button className="delete-btn" onClick={() => removeItem(product._id)}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}