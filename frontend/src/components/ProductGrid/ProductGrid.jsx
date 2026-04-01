import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductGrid.css";

export default function ProductGrid({ limit, skinTypeFilter }) {
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data.products || data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setLoading(false);
            });
    }, []);

    // Apply skin type filter first, then category filter on top
    const skinFiltered = skinTypeFilter
        ? allProducts.filter(product =>
            product.skinTypes && product.skinTypes.some(t =>
                t.toLowerCase() === skinTypeFilter.toLowerCase()
            )
        )
        : allProducts;

    const categoryFiltered = activeCategory === "All"
        ? skinFiltered
        : skinFiltered.filter(product => product.category === activeCategory);

    const displayedProducts = limit ? categoryFiltered.slice(0, limit) : categoryFiltered;

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9a8880' }}>Loading products...</div>;

    return (
        <>
            {!limit && (
                <div className="products-filters">
                    {["All", "Cleanser", "Toner", "Moisturizer", "Sunscreen", ].map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${activeCategory === category ? "active" : ""}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {!loading && displayedProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9a8880' }}>
                    <p style={{ fontSize: '16px', marginBottom: '8px' }}>No products found for your skin type in this category.</p>
                    <p style={{ fontSize: '14px' }}>Try switching the category or clearing the skin type filter.</p>
                </div>
            )}

            <div className="products-grid">
                {displayedProducts.map(product => (
                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="product-image">
                            {product.imageUrl
                                ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                : null
                            }
                        </div>
                        <h3>{product.name}</h3>
                        <p className="product-price">Rs. {product.price.toLocaleString()}</p>
                        <button className="btn btn-soft">View Details</button>
                    </div>
                ))}
            </div>
        </>
    );
}