// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./ProductGrid.css";

// export default function ProductGrid({ limit, skinTypeFilter }) {
//     const navigate = useNavigate();
//     const [allProducts, setAllProducts] = useState([]);
//     const [activeCategory, setActiveCategory] = useState("All");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch('http://localhost:3000/api/products')
//             .then(res => res.json())
//             .then(data => {
//                 setAllProducts(data.products || data || []);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error('Error:', err);
//                 setLoading(false);
//             });
//     }, []);

//     // Apply skin type filter first, then category filter on top
//     const skinFiltered = skinTypeFilter
//         ? allProducts.filter(product =>
//             product.skinTypes && product.skinTypes.some(t =>
//                 t.toLowerCase() === skinTypeFilter.toLowerCase()
//             )
//         )
//         : allProducts;

//     const categoryFiltered = activeCategory === "All"
//         ? skinFiltered
//         : skinFiltered.filter(product => product.category === activeCategory);

//     const displayedProducts = limit ? categoryFiltered.slice(0, limit) : categoryFiltered;

//     if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#9a8880' }}>Loading products...</div>;

//     return (
//         <>
//             {!limit && (
//                 <div className="products-filters">
//                     {["All", "Cleanser", "Toner", "Moisturizer", "Sunscreen", ].map(category => (
//                         <button
//                             key={category}
//                             className={`filter-btn ${activeCategory === category ? "active" : ""}`}
//                             onClick={() => setActiveCategory(category)}
//                         >
//                             {category}
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {!loading && displayedProducts.length === 0 && (
//                 <div style={{ textAlign: 'center', padding: '60px', color: '#9a8880' }}>
//                     <p style={{ fontSize: '16px', marginBottom: '8px' }}>No products found for your skin type in this category.</p>
//                     <p style={{ fontSize: '14px' }}>Try switching the category or clearing the skin type filter.</p>
//                 </div>
//             )}

//             <div className="products-grid">
//                 {displayedProducts.map(product => (
//                     <div
//                         key={product._id}
//                         className="product-card"
//                         onClick={() => navigate(`/product/${product._id}`)}
//                         style={{ cursor: 'pointer' }}
//                     >
//                         <div className="product-image">
//                             {product.imageUrl
//                                 ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
//                                 : null
//                             }
//                         </div>
//                         <h3>{product.name}</h3>
//                         <p className="product-price">Rs. {product.price.toLocaleString()}</p>
//                         <button className="btn btn-soft">View Details</button>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// }




import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiChevronDown, FiChevronUp, FiSliders, FiX } from "react-icons/fi";
import "./ProductGrid.css";

const CATEGORIES = ["All", "Cleanser", "Toner", "Moisturizer", "Sunscreen", "Serum", "Hydration", "Repair"];
const SKIN_TYPES = ["All", "Oily", "Dry", "Combination", "Normal", "Sensitive"];
const SORT_OPTIONS = [
    { value: "default", label: "Default" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating_desc", label: "Top Rated" },
    { value: "name_asc", label: "Name: A to Z" },
];

function StarDisplay({ rating }) {
    return (
        <div className="pg-stars">
            {[1, 2, 3, 4, 5].map(n => (
                <FiStar
                    key={n}
                    size={12}
                    style={{
                        fill: n <= Math.round(rating) ? 'var(--accent)' : 'none',
                        color: n <= Math.round(rating) ? 'var(--accent)' : 'var(--border)',
                    }}
                />
            ))}
            <span className="pg-rating-text">{rating > 0 ? rating.toFixed(1) : "No reviews"}</span>
        </div>
    );
}

export default function ProductGrid({ limit, skinTypeFilter }) {
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(true);

    // Filters
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeSkinType, setActiveSkinType] = useState("All");
    const [activeBrand, setActiveBrand] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("default");

    // Derived
    const [maxPrice, setMaxPrice] = useState(50000);
    const [brandOpen, setBrandOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(data => {
                const products = data.products || data || [];
                setAllProducts(products);
                const max = Math.max(...products.map(p => p.price || 0), 1000);
                const roundedMax = Math.ceil(max / 1000) * 1000;
                setMaxPrice(roundedMax);
                setPriceRange([0, roundedMax]);
                setLoading(false);
            })
            .catch(err => { console.error('Error:', err); setLoading(false); });
    }, []);

    // All unique brands from products
    const allBrands = useMemo(() => {
        const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))].sort();
        return brands;
    }, [allProducts]);

    // Count active filters
    const activeFilterCount = [
        activeCategory !== "All",
        activeSkinType !== "All" && !skinTypeFilter,
        activeBrand !== "All",
        priceRange[0] > 0 || priceRange[1] < maxPrice,
        minRating > 0,
    ].filter(Boolean).length;

    const clearAllFilters = () => {
        setActiveCategory("All");
        setActiveSkinType("All");
        setActiveBrand("All");
        setPriceRange([0, maxPrice]);
        setMinRating(0);
        setSortBy("default");
    };

    // Filter + sort pipeline
    const displayedProducts = useMemo(() => {
        let result = [...allProducts];

        // Skin type from parent (banner toggle)
        if (skinTypeFilter) {
            result = result.filter(p =>
                p.skinTypes?.some(t => t.toLowerCase() === skinTypeFilter.toLowerCase())
            );
        }

        // Category
        if (activeCategory !== "All") {
            result = result.filter(p => p.category === activeCategory);
        }

        // Skin type from filter panel (only if no parent filter)
        if (!skinTypeFilter && activeSkinType !== "All") {
            result = result.filter(p =>
                p.skinTypes?.some(t => t.toLowerCase() === activeSkinType.toLowerCase())
            );
        }

        // Brand
        if (activeBrand !== "All") {
            result = result.filter(p => p.brand === activeBrand);
        }

        // Price
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Rating
        if (minRating > 0) {
            result = result.filter(p => (p.averageRating || 0) >= minRating);
        }

        // Sort
        if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
        else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
        else if (sortBy === "rating_desc") result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        else if (sortBy === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name));

        return limit ? result.slice(0, limit) : result;
    }, [allProducts, skinTypeFilter, activeCategory, activeSkinType, activeBrand, priceRange, minRating, sortBy, limit]);

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading products...
        </div>
    );

    // For home page (limit mode) — simple grid, no filters
    if (limit) {
        return (
            <div className="products-grid">
                {displayedProducts.map(product => (
                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => navigate(`/products/${product._id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="product-image">
                            {product.imageUrl && (
                                <img src={product.imageUrl} alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                            )}
                        </div>
                        <h3>{product.name}</h3>
                        <p className="product-price">Rs. {product.price.toLocaleString()}</p>
                        <button className="btn btn-soft">View Details</button>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="products-layout">

            {/* ── FILTER SIDEBAR ── */}
            <aside className={`filters-sidebar ${filtersOpen ? "open" : "closed"}`}>
                <div className="filters-sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiSliders size={15} />
                        <span className="filters-sidebar-title">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="filter-active-badge">{activeFilterCount}</span>
                        )}
                    </div>
                    {activeFilterCount > 0 && (
                        <button className="filter-clear-all" onClick={clearAllFilters}>
                            Clear all
                        </button>
                    )}
                </div>

                {/* Sort */}
                <div className="filter-section">
                    <p className="filter-section-title">Sort By</p>
                    <select
                        className="filter-select"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                {/* Category */}
                <div className="filter-section">
                    <p className="filter-section-title">Category</p>
                    <div className="filter-chip-group">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Skin Type — hidden if parent is controlling it */}
                {!skinTypeFilter && (
                    <div className="filter-section">
                        <p className="filter-section-title">Skin Type</p>
                        <div className="filter-chip-group">
                            {SKIN_TYPES.map(st => (
                                <button
                                    key={st}
                                    className={`filter-chip ${activeSkinType === st ? "active" : ""}`}
                                    onClick={() => setActiveSkinType(st)}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Brand */}
                {allBrands.length > 0 && (
                    <div className="filter-section">
                        <button
                            className="filter-section-title filter-collapsible"
                            onClick={() => setBrandOpen(o => !o)}
                        >
                            Brand
                            {brandOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        </button>
                        {brandOpen && (
                            <div className="filter-chip-group">
                                <button
                                    className={`filter-chip ${activeBrand === "All" ? "active" : ""}`}
                                    onClick={() => setActiveBrand("All")}
                                >
                                    All
                                </button>
                                {allBrands.map(brand => (
                                    <button
                                        key={brand}
                                        className={`filter-chip ${activeBrand === brand ? "active" : ""}`}
                                        onClick={() => setActiveBrand(brand)}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Price Range */}
                <div className="filter-section">
                    <p className="filter-section-title">
                        Price Range
                        <span className="filter-range-label">
                            Rs. {priceRange[0].toLocaleString()} — Rs. {priceRange[1].toLocaleString()}
                        </span>
                    </p>
                    <div className="filter-range-track">
                        <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            step={100}
                            value={priceRange[0]}
                            onChange={e => {
                                const val = Number(e.target.value);
                                if (val < priceRange[1]) setPriceRange([val, priceRange[1]]);
                            }}
                            className="filter-range-input"
                        />
                        <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            step={100}
                            value={priceRange[1]}
                            onChange={e => {
                                const val = Number(e.target.value);
                                if (val > priceRange[0]) setPriceRange([priceRange[0], val]);
                            }}
                            className="filter-range-input"
                        />
                    </div>
                    <div className="filter-range-labels">
                        <span>Rs. 0</span>
                        <span>Rs. {maxPrice.toLocaleString()}</span>
                    </div>
                </div>

                {/* Min Rating */}
                <div className="filter-section">
                    <p className="filter-section-title">Minimum Rating</p>
                    <div className="filter-rating-group">
                        {[0, 1, 2, 3, 4].map(star => (
                            <button
                                key={star}
                                className={`filter-rating-btn ${minRating === star ? "active" : ""}`}
                                onClick={() => setMinRating(star)}
                            >
                                {star === 0 ? "Any" : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {star}+ <FiStar size={12} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

            </aside>

            {/* ── PRODUCTS AREA ── */}
            <div className="products-main">

                {/* Topbar: toggle + results count */}
                <div className="products-topbar">
                    <button
                        className="filters-toggle-btn"
                        onClick={() => setFiltersOpen(o => !o)}
                    >
                        <FiSliders size={14} />
                        {filtersOpen ? "Hide Filters" : "Show Filters"}
                        {activeFilterCount > 0 && !filtersOpen && (
                            <span className="filter-active-badge">{activeFilterCount}</span>
                        )}
                    </button>
                    <p className="products-result-count">
                        {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
                        {activeFilterCount > 0 ? " found" : ""}
                    </p>
                </div>

                {displayedProducts.length === 0 ? (
                    <div className="products-empty">
                        <p>No products match your filters.</p>
                        <button className="filter-clear-all" onClick={clearAllFilters} style={{ marginTop: '12px' }}>
                            <FiX size={13} /> Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {displayedProducts.map(product => (
                            <div
                                key={product._id}
                                className="product-card"
                                onClick={() => navigate(`/products/${product._id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="product-image">
                                    {product.imageUrl && (
                                        <img src={product.imageUrl} alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                    )}
                                </div>
                                {product.brand && (
                                    <p className="product-brand">{product.brand}</p>
                                )}
                                <h3>{product.name}</h3>
                                <StarDisplay rating={product.averageRating || 0} />
                                <p className="product-price">Rs. {product.price.toLocaleString()}</p>
                                <button className="btn btn-soft">View Details</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}