import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiPackage, FiShoppingCart, FiHeart, FiTrash2, FiEdit2, FiPlus, FiX, FiLogOut } from "react-icons/fi";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: "", price: "", category: "", description: "", skinTypes: ""
    });

    // Build headers fresh every time
    const getHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    });

    // Guard
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || role !== "admin") {
            navigate("/auth");
        }
    }, []);

    useEffect(() => { fetchStats(); }, []);
    useEffect(() => { if (activeTab === "users") fetchUsers(); }, [activeTab]);
    useEffect(() => { if (activeTab === "products") fetchProducts(); }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/admin/stats", { headers: getHeaders() });
            const data = await res.json();
            console.log("Stats response:", data);
            setStats(data.stats || {});
        } catch (err) {
            console.error("Stats error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/admin/users", { headers: getHeaders() });
            const data = await res.json();
            console.log("Users response:", data);
            setUsers(data.users || []);
        } catch (err) {
            console.error("Users error:", err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/admin/products", { headers: getHeaders() });
            const data = await res.json();
            console.log("Products response:", data);
            setProducts(data.products || []);
        } catch (err) {
            console.error("Products error:", err);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        await fetch(`http://localhost:3000/api/admin/users/${id}`, { method: "DELETE", headers: getHeaders() });
        fetchUsers();
        fetchStats();
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await fetch(`http://localhost:3000/api/admin/products/${id}`, { method: "DELETE", headers: getHeaders() });
        fetchProducts();
        fetchStats();
    };

    const openAddProduct = () => {
        setEditingProduct(null);
        setProductForm({ name: "", price: "", category: "", description: "", skinTypes: "" });
        setShowProductModal(true);
    };

    const openEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            price: product.price,
            category: product.category || "",
            description: product.description || "",
            skinTypes: (product.skinTypes || []).join(", ")
        });
        setShowProductModal(true);
    };

    const saveProduct = async () => {
        const body = {
            ...productForm,
            price: Number(productForm.price),
            skinTypes: productForm.skinTypes.split(",").map(s => s.trim()).filter(Boolean)
        };
        const url = editingProduct
            ? `http://localhost:3000/api/admin/products/${editingProduct._id}`
            : "http://localhost:3000/api/admin/products";
        const method = editingProduct ? "PUT" : "POST";
        await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(body) });
        setShowProductModal(false);
        fetchProducts();
        fetchStats();
    };

    const logout = () => {
        localStorage.clear();
        navigate("/auth");
    };

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, icon: <FiUsers /> },
        { label: "Total Products", value: stats.totalProducts, icon: <FiPackage /> },
        { label: "Active Carts", value: stats.totalCarts, icon: <FiShoppingCart /> },
        { label: "Wishlists", value: stats.totalWishlists, icon: <FiHeart /> },
    ];

    return (
        <div className="admin-layout">

            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-brand">SkincareSync</div>
                <p className="admin-role-label">Admin Panel</p>

                <nav className="admin-nav">
                    {["overview", "products", "users"].map(tab => (
                        <button
                            key={tab}
                            className={`admin-nav-btn ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>

                <button className="admin-logout-btn" onClick={logout}>
                    <FiLogOut /> Logout
                </button>
            </aside>

            {/* Main */}
            <main className="admin-main">
                <div className="admin-topbar">
                    <h1 className="admin-page-title">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                    {activeTab === "products" && (
                        <button className="btn-admin-add" onClick={openAddProduct}>
                            <FiPlus /> Add Product
                        </button>
                    )}
                </div>

                {/* OVERVIEW */}
                {activeTab === "overview" && (
                    <div className="admin-stats-grid">
                        {statCards.map((card) => (
                            <div key={card.label} className="stat-card">
                                <div className="stat-icon">{card.icon}</div>
                                <div>
                                    <p className="stat-value">{loading ? "..." : card.value}</p>
                                    <p className="stat-label">{card.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PRODUCTS */}
                {activeTab === "products" && (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.name}</td>
                                        <td>{p.category || "—"}</td>
                                        <td>Rs. {p.price?.toLocaleString()}</td>
                                        <td className="action-cell">
                                            <button className="icon-btn edit" onClick={() => openEditProduct(p)}>
                                                <FiEdit2 />
                                            </button>
                                            <button className="icon-btn delete" onClick={() => deleteProduct(p._id)}>
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* USERS */}
                {activeTab === "users" && (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td className="action-cell">
                                            <button className="icon-btn delete" onClick={() => deleteUser(u._id)}>
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {showProductModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
                            <button className="modal-close" onClick={() => setShowProductModal(false)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="modal-body">
                            {["name", "price", "category", "description"].map(field => (
                                <div className="form-group" key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input
                                        type={field === "price" ? "number" : "text"}
                                        value={productForm[field]}
                                        onChange={e => setProductForm({ ...productForm, [field]: e.target.value })}
                                    />
                                </div>
                            ))}
                            <div className="form-group">
                                <label>Skin Types (comma separated)</label>
                                <input
                                    type="text"
                                    value={productForm.skinTypes}
                                    onChange={e => setProductForm({ ...productForm, skinTypes: e.target.value })}
                                    placeholder="e.g. Oily, Dry, Combination"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-modal-cancel" onClick={() => setShowProductModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-modal-save" onClick={saveProduct}>
                                {editingProduct ? "Save Changes" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}