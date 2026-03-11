
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./ProductDetail.css"; 

const allProducts = [
    { 
        id: 1, 
        name: "Hydrating Essence", 
        price: 4000, 
        category: "Hydration",
        image: "/api/products/1/image", 
        description: "Lightweight essence that deeply hydrates without greasiness. Perfect for daily use.",
        skinTypes: ["Normal", "Dry", "Combination"],
        benefits: ["24hr hydration", "Strengthens barrier", "Non-comedogenic"]
    },
    { 
        id: 2, 
        name: "Restorative Serum", 
        price: 5200, 
        category: "Repair",
        image: "/api/products/2/image",
        description: "Advanced repair serum with peptides and antioxidants.",
        skinTypes: ["All", "Aging", "Damaged"],
        benefits: ["Reduces wrinkles", "Firms skin", "Brightens"]
    },
    // Others...
    ];

    export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState(false);

    useEffect(() => {
        // Simulate API call
        const foundProduct = allProducts.find(p => p.id === parseInt(id));
        if (foundProduct) {
        setProduct(foundProduct);
        } else {
        navigate("/products");
        }
        setLoading(false);
    }, [id, navigate]);

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);
    
    const toggleWishlist = () => setWishlist(!wishlist);
    const addToCart = () => alert(`Added ${quantity} of ${product?.name} to cart!`);
    const buyNow = () => alert("Redirecting to checkout...");

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <>
        <Navbar />
        <section className="product-detail-page">
            <div className="product-detail-container">
            {/* Image Section */}
            <div className="product-image-section">
                <img 
                src={product.image} 
                alt={product.name}
                className="product-main-image"
                />
            </div>

            {/* Details Section */}
            <div className="product-details-section">
                <div className="product-header">
                <h1 className="product-name">{product.name}</h1>
                <p className="product-price-large">
                    Rs. {product.price.toLocaleString()}
                </p>
                
                {/* Wishlist Button */}
                
                <button 
                    className={`wishlist-btn ${wishlist ? 'active' : ''}`}
                    onClick={toggleWishlist}
                >
                    <span className="heart-icon"></span>
                </button>


                </div>

                {/* Quantity Selector */}
                <div className="quantity-selector">
                <label>Quantity</label>
                <div className="quantity-controls">
                    <button onClick={decrementQuantity}>-</button>
                    <span>{quantity}</span>
                    <button onClick={incrementQuantity}>+</button>
                </div>
                </div>

                {/* Action Buttons */}
                <div className="product-actions">
                <button className="btn btn-cta buy-now-btn" onClick={buyNow}>
                    Buy Now
                </button>
                <button className="btn btn-soft add-cart-btn" onClick={addToCart}>
                    Add to Cart
                </button>
                </div>

                {/* Skin Types */}
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
            </div>
            </div>
        </section>
        <Footer />
        </>
    );
}
