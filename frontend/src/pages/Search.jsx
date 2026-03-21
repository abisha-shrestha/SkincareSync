import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiSearch, FiX } from "react-icons/fi";
import "./Search.css";

export default function Search() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [results, setResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/products")
            .then(res => res.json())
            .then(data => {
                setAllProducts(data.products || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) { setResults([]); return; }

        const filtered = allProducts.filter(p => {
            const inName = p.name?.toLowerCase().includes(q);
            const inCategory = p.category?.toLowerCase().includes(q);
            const inSkinTypes = p.skinTypes?.some(t => t.toLowerCase().includes(q));
            const inTags = p.tags?.some(t => t.toLowerCase().includes(q));
            return inName || inCategory || inSkinTypes || inTags;
        });
        setResults(filtered);
        setSearchParams(q ? { q } : {});
    }, [query, allProducts]);

    const handleClear = () => {
        setQuery("");
        setResults([]);
        inputRef.current?.focus();
    };

    return (
        <>
            <Navbar />
            <section className="search-page">
                <div className="search-wrapper">

                    <div className="search-bar-wrapper">
                        <FiSearch className="search-bar-icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-bar-input"
                            placeholder="Search by name, category, skin type..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {query && (
                            <button className="search-clear-btn" onClick={handleClear}>
                                <FiX />
                            </button>
                        )}
                    </div>

                    {loading && (
                        <p className="search-status">Loading products...</p>
                    )}

                    {!loading && !query && (
                        <div className="search-empty-state">
                            <p className="search-hint">Start typing to search products</p>
                            <div className="search-suggestions">
                                {["Hydration", "Oily", "Cleanser", "Dry", "Sensitive"].map(s => (
                                    <button key={s} className="search-suggestion-chip" onClick={() => setQuery(s)}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className="search-empty-state">
                            <p className="search-hint">No products found for "{query}"</p>
                            <p className="search-sub">Try a different keyword or browse all products</p>
                            <button className="search-browse-btn" onClick={() => navigate("/products")}>
                                Browse All Products
                            </button>
                        </div>
                    )}

                    {results.length > 0 && (
                        <>
                            <p className="search-results-count">
                                {results.length} result{results.length > 1 ? 's' : ''} for "{query}"
                            </p>
                            <div className="search-results-grid">
                                {results.map(product => (
                                    <div
                                        key={product._id}
                                        className="search-result-card"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <div className="search-result-img">
                                            {product.imageUrl
                                                ? <img src={product.imageUrl} alt={product.name} />
                                                : null
                                            }
                                        </div>
                                        <div className="search-result-info">
                                            <p className="search-result-name">{product.name}</p>
                                            <p className="search-result-category">{product.category}</p>
                                            {product.skinTypes?.length > 0 && (
                                                <div className="search-result-tags">
                                                    {product.skinTypes.slice(0, 3).map((t, i) => (
                                                        <span key={i} className="search-tag">{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="search-result-price">Rs. {product.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}