import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FiArrowLeft } from "react-icons/fi";

export default function BrandProducts() {
    const { brand } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const decodedBrand = decodeURIComponent(brand);

    useEffect(() => {
        fetch(`http://localhost:3000/api/products?brand=${encodeURIComponent(decodedBrand)}`)
            .then(res => res.json())
            .then(data => {
                const all = data.products || [];
                const filtered = all.filter(
                    p => p.brand?.trim().toLowerCase() === decodedBrand.trim().toLowerCase()
                );
                setProducts(filtered);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [brand]);

    return (
        <>
            <Navbar />
            <section style={{ padding: "110px 6rem 60px", minHeight: "100vh", background: "var(--bg-secondary)" }}>
                <div style={{ maxWidth: "1300px", margin: "auto" }}>

                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px",
                            padding: 0
                        }}
                    >
                        <FiArrowLeft /> Back
                    </button>

                    <div style={{ marginBottom: "36px" }}>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                            Brand
                        </p>
                        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "var(--text-primary)" }}>
                            {decodedBrand}
                        </h1>
                        {!loading && (
                            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "6px" }}>
                                {products.length} product{products.length !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 0" }}>
                            <p style={{ fontSize: "18px", color: "var(--text-muted)" }}>No products found for this brand.</p>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                            gap: "24px"
                        }}>
                            {products.map(product => (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/product/${product._id}`)}
                                    style={{
                                        background: "var(--bg-card)",
                                        borderRadius: "14px",
                                        border: "1px solid var(--border-light)",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        transition: "box-shadow 0.2s ease, transform 0.2s ease",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.transform = "none";
                                    }}
                                >
                                    <div style={{ height: "200px", background: "var(--bg-subtle)", overflow: "hidden" }}>
                                        {product.imageUrl
                                            ? <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            : null
                                        }
                                    </div>
                                    <div style={{ padding: "16px" }}>
                                        <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                                            {product.category || "Skincare"}
                                        </p>
                                        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "8px", lineHeight: "1.3" }}>
                                            {product.name}
                                        </h3>
                                        <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--accent)" }}>
                                            Rs. {product.price?.toLocaleString()}
                                        </p>
                                    </div>
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