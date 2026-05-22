import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiStar, FiChevronDown, FiChevronUp, FiSliders, FiX } from "react-icons/fi";
import "./ProductGrid.css";

const CATEGORIES = ["All", "Cleanser", "Toner", "Moisturizer", "Sunscreen"];
const SKIN_TYPES = ["All", "Oily", "Dry", "Combination", "Normal", "Sensitive"];
const SORT_OPTIONS = [
    { value: "default", label: "Default" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating_desc", label: "Top Rated" },
    { value: "name_asc", label: "Name: A to Z" },
];

const PRODUCTS_PER_PAGE = 12;

// Read a param, fall back to defaultVal when absent or empty.
function sp(params, key, defaultVal) {
    const v = params.get(key);
    return v !== null && v !== '' ? v : defaultVal;
}

function StarDisplay({ rating }) {
    if (!rating || rating === 0) return null;
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
            <span className="pg-rating-text">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function ProductGrid({ limit, skinTypeFilter }) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState(50000);
    const [brandOpen, setBrandOpen] = useState(false);

    // All filter state derived directly from URL params
    const filtersOpen    = sp(searchParams, 'fo', '1') === '1';
    const activeCategory = sp(searchParams, 'cat', 'All');
    const activeSkinType = sp(searchParams, 'skin', 'All');
    const activeBrand    = sp(searchParams, 'brand', 'All');
    const sortBy         = sp(searchParams, 'sort', 'default');
    const minRating      = Number(sp(searchParams, 'rating', '0'));
    const currentPage    = Number(sp(searchParams, 'page', '1'));

    // Price range stored as "min_max" in one param
    const priceParam = sp(searchParams, 'price', null);
    const priceRange = useMemo(() => {
        if (priceParam) {
            const [lo, hi] = priceParam.split('_').map(Number);
            return [lo, hi];
        }
        return [0, maxPrice];
    }, [priceParam, maxPrice]);

    // Patch one or more params at once
    const patch = (updates) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            Object.entries(updates).forEach(([k, v]) => {
                if (v === null || v === undefined) next.delete(k);
                else next.set(k, String(v));
            });
            return next;
        }, { replace: true });
    };

    // Setters
    const setFiltersOpen    = (v) => patch({ fo: v ? '1' : '0' });
    const setActiveCategory = (v) => patch({ cat: v, page: '1' });
    const setActiveSkinType = (v) => patch({ skin: v, page: '1' });
    const setActiveBrand    = (v) => patch({ brand: v, page: '1' });
    const setSortBy         = (v) => patch({ sort: v, page: '1' });
    const setMinRating      = (v) => patch({ rating: String(v), page: '1' });
    const setCurrentPage    = (v) => patch({ page: String(v) });
    const setPriceRange     = (range) => patch({ price: `${range[0]}_${range[1]}`, page: '1' });

    const prevSkinTypeFilter = useRef(skinTypeFilter);

    useEffect(() => {
        if (prevSkinTypeFilter.current !== skinTypeFilter) {
            prevSkinTypeFilter.current = skinTypeFilter;
            patch({ page: '1' });
        }
    }, [skinTypeFilter]);

    // Fetch products once
    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(data => {
                const products = data.products || data || [];
                setAllProducts(products);

                const max = Math.max(...products.map(p => p.price || 0), 1000);
                const roundedMax = Math.ceil(max / 1000) * 1000;
                setMaxPrice(roundedMax);

                // Only set price default when not already in the URL
                if (!searchParams.get('price')) {
                    patch({ price: `0_${roundedMax}` });
                }

                setLoading(false);
            })
            .catch(err => { console.error('Error:', err); setLoading(false); });
    }, []);

    const allBrands = useMemo(() => {
        return [...new Set(allProducts.map(p => p.brand?.trim()).filter(Boolean))].sort();
    }, [allProducts]);

    const activeFilterCount = [
        activeCategory !== "All",
        activeSkinType !== "All" && !skinTypeFilter,
        activeBrand !== "All",
        priceRange[0] > 0 || priceRange[1] < maxPrice,
        minRating > 0,
    ].filter(Boolean).length;

    const clearAllFilters = () => {
        patch({
            cat: 'All',
            skin: 'All',
            brand: 'All',
            price: `0_${maxPrice}`,
            rating: '0',
            sort: 'default',
            page: '1',
        });
    };

    const displayedProducts = useMemo(() => {
        let result = [...allProducts];

        if (skinTypeFilter) {
            result = result.filter(p =>
                p.skinTypes?.some(t => t.toLowerCase() === skinTypeFilter.toLowerCase())
            );
        }
        if (activeCategory !== "All") {
            result = result.filter(p => p.category === activeCategory);
        }
        if (!skinTypeFilter && activeSkinType !== "All") {
            result = result.filter(p =>
                p.skinTypes?.some(t => t.toLowerCase() === activeSkinType.toLowerCase())
            );
        }
        if (activeBrand !== "All") {
            result = result.filter(p => p.brand?.trim() === activeBrand);
        }

        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        if (minRating > 0) {
            result = result.filter(p => (p.averageRating || 0) >= minRating);
        }

        if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
        else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
        else if (sortBy === "rating_desc") result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        else if (sortBy === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name));

        return limit ? result.slice(0, limit) : result;
    }, [allProducts, skinTypeFilter, activeCategory, activeSkinType, activeBrand, priceRange, minRating, sortBy, limit]);

    const totalPages = Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = displayedProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading products...
        </div>
    );

    // Home page snippet - no filters
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
                        {product.brand && <p className="product-brand">{product.brand}</p>}
                        <h3>{product.name}</h3>
                        <StarDisplay rating={product.averageRating || 0} />
                        <p className="product-price">Rs. {product.price.toLocaleString()}</p>
                        <button className="btn btn-soft">View Details</button>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="products-layout">

            {/* FILTER SIDEBAR */}
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

                {/* Skin Type */}
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
                            className="filter-collapsible"
                            onClick={() => setBrandOpen(o => !o)}
                        >
                            Brand
                            {brandOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        </button>
                        {brandOpen && (
                            <div className="filter-chip-group" style={{ marginTop: '10px' }}>
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
                    <div className="filter-price-inputs">
                        <div className="filter-price-input-wrap">
                            <span className="filter-price-prefix">Rs.</span>
                            <input
                                type="number"
                                className="filter-price-input"
                                value={priceRange[0]}
                                min={0}
                                max={priceRange[1] - 100}
                                step={100}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (val < priceRange[1]) setPriceRange([val, priceRange[1]]);
                                }}
                            />
                        </div>
                        <span className="filter-price-sep">—</span>
                        <div className="filter-price-input-wrap">
                            <span className="filter-price-prefix">Rs.</span>
                            <input
                                type="number"
                                className="filter-price-input"
                                value={priceRange[1]}
                                min={priceRange[0] + 100}
                                max={maxPrice}
                                step={100}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (val > priceRange[0]) setPriceRange([priceRange[0], val]);
                                }}
                            />
                        </div>
                    </div>
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
                        className="filter-single-range"
                    />
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
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        {star}+ <FiStar size={11} style={{ fill: 'currentColor' }} />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* PRODUCTS AREA */}
            <div className="products-main">
                <div className="products-topbar">
                    <button
                        className="filters-toggle-btn"
                        onClick={() => setFiltersOpen(!filtersOpen)}
                    >
                        <FiSliders size={14} />
                        {filtersOpen ? "Hide Filters" : "Show Filters"}
                        {activeFilterCount > 0 && !filtersOpen && (
                            <span className="filter-active-badge">{activeFilterCount}</span>
                        )}
                    </button>
                    <p className="products-result-count">
                        {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
                        {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
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
                        {paginatedProducts.map(product => (
                            <div
                                key={product._id}
                                className="product-card"
                                onClick={() => {
                                    sessionStorage.setItem('productsScrollY', window.scrollY);
                                    navigate(`/product/${product._id}`);
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="product-image">
                                    {product.imageUrl && (
                                        <img src={product.imageUrl} alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                    )}
                                </div>
                                {product.brand && <p className="product-brand">{product.brand}</p>}
                                <h3>{product.name}</h3>
                                <StarDisplay rating={product.averageRating || 0} />
                                <p className="product-price">Rs. {product.price.toLocaleString()}</p>
                                <button className="btn btn-soft">View Details</button>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            ← Prev
                        </button>

                        <div className="pagination-pages">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page =>
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(page - currentPage) <= 1
                                )
                                .reduce((acc, page, idx, arr) => {
                                    if (idx > 0 && page - arr[idx - 1] > 1) acc.push('...');
                                    acc.push(page);
                                    return acc;
                                }, [])
                                .map((item, idx) =>
                                    item === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                                    ) : (
                                        <button
                                            key={item}
                                            className={`pagination-page ${currentPage === item ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(item)}
                                        >
                                            {item}
                                        </button>
                                    )
                                )
                            }
                        </div>

                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}