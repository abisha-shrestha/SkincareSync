import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
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
    const userName = localStorage.getItem('name') || 'Guest';

    // Review state
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(null);
    const [myReview, setMyReview] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [hovered, setHovered] = useState(0);
    const [reviewError, setReviewError] = useState('');
    const [canReview, setCanReview] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.product) setProduct(data.product);
                else navigate("/products");
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

    useEffect(() => {
        fetchReviews();
        checkCanReview();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/reviews/${id}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews);
                setAverage(data.average);
                const mine = data.reviews.find(r => r.userEmail === userEmail);
                if (mine) {
                    setMyReview(mine);
                    setReviewForm({ rating: mine.rating, comment: mine.comment });
                }
            }
        } catch (err) { console.error(err); }
    };

    const checkCanReview = async () => {
        if (!userEmail || userEmail === 'guest') return;
        try {
            const res = await fetch(`http://localhost:3000/api/orders?userEmail=${userEmail}`);
            const data = await res.json();
            const bought = data.orders?.some(order =>
                order.status === 'Delivered' &&
                order.items.some(item => item.productId?.toString() === id || item.productId === id)
            );
            setCanReview(bought);
        } catch (err) { console.error(err); }
    };

    const handleSubmitReview = async () => {
        setReviewError('');
        if (!reviewForm.rating) { setReviewError('Please select a rating'); return; }
        try {
            const url = `http://localhost:3000/api/reviews/${id}`;
            const method = myReview && editMode ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, userName, ...reviewForm })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(editMode ? 'Review updated' : 'Review submitted');
                setEditMode(false);
                fetchReviews();
            } else {
                setReviewError(data.message);
            }
        } catch (err) { toast.error('Something went wrong'); }
    };

    const handleDeleteReview = async () => {
        if (!window.confirm('Delete your review?')) return;
        try {
            const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Review deleted');
                setMyReview(null);
                setReviewForm({ rating: 0, comment: '' });
                fetchReviews();
            }
        } catch (err) { toast.error('Something went wrong'); }
    };

    const StarDisplay = ({ rating, size = 16 }) => (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(n => (
                <FiStar
                    key={n}
                    size={size}
                    style={{
                        fill: n <= rating ? 'var(--accent)' : 'none',
                        color: n <= rating ? 'var(--accent)' : 'var(--border)',
                    }}
                />
            ))}
        </div>
    );

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
        } catch (err) { toast.error("Something went wrong"); }
    };

    const addToCart = async () => {
        setAddingToCart(true);
        try {
            const res = await fetch('http://localhost:3000/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, productId: product._id, quantity, price: product.price })
            });
            const data = await res.json();
            if (data.success) toast.success(`${product.name} added to cart`);
            else toast.error("Failed to add to cart");
        } catch (err) { toast.error("Something went wrong"); }
        finally { setAddingToCart(false); }
    };

    const buyNow = () => {
        const buyNowItem = {
            productId: {
                _id: product._id,
                name: product.name,
                imageUrl: product.imageUrl || product.image || null,
            },
            name: product.name,
            price: product.price,
            quantity: quantity,
            isBuyNow: true,
        };
        sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
        navigate("/checkout?mode=buynow");
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
                            <p className="product-price-large">Rs. {product.price.toLocaleString()}</p>
                            {average && (
                                <div className="product-rating-summary">
                                    <StarDisplay rating={Math.round(average)} />
                                    <span className="product-rating-text">{average} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                                </div>
                            )}
                            <button
                                className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                                onClick={toggleWishlist}
                            >
                                <FiHeart style={{ fill: wishlisted ? 'var(--accent)' : 'none', color: wishlisted ? 'var(--accent)' : 'var(--text-muted)', fontSize: '20px' }} />
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
                            <button className="product-btn-buynow" onClick={buyNow} disabled={addingToCart}>Buy Now</button>
                            <button className="product-btn-addcart" onClick={addToCart} disabled={addingToCart}>
                                <FiShoppingCart /> Add to Cart
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

                {/* REVIEWS SECTION */}
                <div className="reviews-section">
                    <div className="reviews-header">
                        <h2>Reviews {reviews.length > 0 && <span className="reviews-count">{reviews.length}</span>}</h2>
                        {average && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <StarDisplay rating={Math.round(average)} size={20} />
                                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{average}</span>
                            </div>
                        )}
                    </div>

                    {/* Review form — only for buyers who haven't reviewed yet, or editing */}
                    {canReview && (!myReview || editMode) && (
                        <div className="review-form-card">
                            <h3>{editMode ? 'Edit your review' : 'Write a review'}</h3>
                            <div className="review-star-picker">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <FiStar
                                        key={n}
                                        size={28}
                                        className="review-star-btn"
                                        onMouseEnter={() => setHovered(n)}
                                        onMouseLeave={() => setHovered(0)}
                                        onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                                        style={{
                                            fill: n <= (hovered || reviewForm.rating) ? 'var(--accent)' : 'none',
                                            color: n <= (hovered || reviewForm.rating) ? 'var(--accent)' : 'var(--border)',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                    />
                                ))}
                            </div>
                            {reviewError && <p className="field-error">{reviewError}</p>}
                            <textarea
                                placeholder="Share your thoughts (optional)"
                                value={reviewForm.comment}
                                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className="review-textarea"
                                rows={3}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="review-submit-btn" onClick={handleSubmitReview}>
                                    {editMode ? 'Update Review' : 'Submit Review'}
                                </button>
                                {editMode && (
                                    <button className="review-cancel-btn" onClick={() => setEditMode(false)}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* My review display */}
                    {myReview && !editMode && (
                        <div className="review-card review-card-mine">
                            <div className="review-card-header">
                                <div>
                                    <p className="review-author">You</p>
                                    <StarDisplay rating={myReview.rating} />
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="review-edit-btn" onClick={() => setEditMode(true)}>Edit</button>
                                    <button className="review-delete-btn" onClick={handleDeleteReview}>Delete</button>
                                </div>
                            </div>
                            {myReview.comment && <p className="review-comment">{myReview.comment}</p>}
                            <p className="review-date">{new Date(myReview.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    )}

                    {/* Other reviews */}
                    <div className="reviews-list">
                        {reviews.filter(r => r.userEmail !== userEmail).map(review => (
                            <div key={review._id} className="review-card">
                                <div className="review-card-header">
                                    <div>
                                        <p className="review-author">{review.userName}</p>
                                        <StarDisplay rating={review.rating} />
                                    </div>
                                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                {review.comment && <p className="review-comment">{review.comment}</p>}
                            </div>
                        ))}
                    </div>

                    {reviews.length === 0 && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
                            No reviews yet. Be the first to review this product.
                        </p>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}