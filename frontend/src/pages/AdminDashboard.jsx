import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FiUsers, FiPackage, FiShoppingCart, FiClock, FiTrash2, FiEdit2, FiPlus, FiX, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import toast from "react-hot-toast";
import { useTheme } from "../ThemeContext";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [productForm, setProductForm] = useState({
        name: "", brand: "", price: "", category: "", description: "", skinTypes: "", imageUrl: ""
    });

    const getHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    });

    const statusColor = (status) => {
        const colors = { Pending: '#f0a500', Processing: '#3b82f6', Shipped: '#8b5cf6', Delivered: '#22c55e', Cancelled: '#ef4444' };
        return colors[status] || '#888';
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || role !== "admin") navigate("/auth");
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { fetchStats(); fetchAnalytics(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => { if (activeTab === "users") fetchUsers(); }, [activeTab]);
    useEffect(() => { if (activeTab === "products") fetchProducts(); }, [activeTab]);
    useEffect(() => { if (activeTab === "orders") fetchOrders(); }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/admin/stats", { headers: getHeaders() });
            const data = await res.json();
            setStats(data.stats || {});
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/admin/analytics", { headers: getHeaders() });
            const data = await res.json();
            setAnalytics(data.analytics || []);
        } catch (err) { console.error(err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/admin/users", { headers: getHeaders() });
            const data = await res.json();
            setUsers(data.users || []);
        } catch (err) { console.error(err); }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/admin/products", { headers: getHeaders() });
            const data = await res.json();
            setProducts(data.products || []);
        } catch (err) { console.error(err); }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/orders/all", { headers: getHeaders() });
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (err) { console.error(err); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        await fetch(`http://localhost:3000/api/admin/users/${id}`, { method: "DELETE", headers: getHeaders() });
        fetchUsers(); fetchStats();
        toast.success("User deleted");
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await fetch(`http://localhost:3000/api/admin/products/${id}`, { method: "DELETE", headers: getHeaders() });
        fetchProducts(); fetchStats();
        toast.success("Product deleted");
    };

    const updateOrderStatus = async (id, status) => {
        await fetch(`http://localhost:3000/api/orders/${id}/status`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        fetchOrders(); fetchStats();
        toast.success(`Order marked as ${status}`);
    };

    const deleteOrder = async (id) => {
        if (!window.confirm("Delete this order?")) return;
        await fetch(`http://localhost:3000/api/orders/${id}`, { method: "DELETE", headers: getHeaders() });
        fetchOrders(); fetchStats();
        toast.success("Order deleted");
    };

    const openAddProduct = () => {
        setEditingProduct(null);
        setProductForm({ name: "", brand: "", price: "", category: "", description: "", skinTypes: "", imageUrl: "" });
        setShowProductModal(true);
    };

    const openEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name, brand: product.brand || "", price: product.price,
            category: product.category || "", description: product.description || "",
            skinTypes: (product.skinTypes || []).join(", "), imageUrl: product.imageUrl || ""
        });
        setShowProductModal(true);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });
            const data = await res.json();
            if (data.success) { setProductForm(prev => ({ ...prev, imageUrl: data.imageUrl })); toast.success("Image uploaded"); }
            else toast.error("Image upload failed");
        } catch (err) { toast.error("Image upload error"); }
        finally { setUploadingImage(false); }
    };

    const saveProduct = async () => {
        if (!productForm.name.trim()) { toast.error("Product name is required"); return; }
        if (!productForm.brand.trim()) { toast.error("Brand is required"); return; }
        if (!productForm.price) { toast.error("Price is required"); return; }
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
        fetchProducts(); fetchStats();
        toast.success(editingProduct ? "Product updated" : "Product added");
    };

    const logout = () => { localStorage.clear(); navigate("/auth"); };

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, icon: <FiUsers />, tab: "users" },
        { label: "Total Products", value: stats.totalProducts, icon: <FiPackage />, tab: "products" },
        { label: "Total Orders", value: stats.totalOrders, icon: <FiShoppingCart />, tab: "orders" },
        { label: "Pending Orders", value: stats.pendingOrders, icon: <FiClock />, tab: "orders" },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px' }}>
                    <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color, margin: '2px 0' }}>
                            {p.name === 'revenue' ? `Revenue: Rs. ${p.value.toLocaleString()}` : `Orders: ${p.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">SkincareSync</div>
                <p className="admin-role-label">Admin Panel</p>
                <nav className="admin-nav">
                    {["overview", "orders", "products", "users"].map(tab => (
                        <button
                            key={tab}
                            className={`admin-nav-btn ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <button className="admin-theme-btn" onClick={toggleTheme} title="Toggle theme">
                        {theme === 'light' ? <FiMoon size={15} /> : <FiSun size={15} />}
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                    <button className="admin-logout-btn" onClick={logout}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

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
                    <>
                        <div className="admin-stats-grid">
                            {statCards.map((card) => (
                                <div key={card.label} className="stat-card stat-card-clickable" onClick={() => setActiveTab(card.tab)}>
                                    <div className="stat-icon">{card.icon}</div>
                                    <div>
                                        <p className="stat-value">{loading ? "..." : card.value}</p>
                                        <p className="stat-label">{card.label}</p>
                                    </div>
                                    <span className="stat-arrow">→</span>
                                </div>
                            ))}
                        </div>
                        <div className="analytics-card">
                            <h2 className="analytics-title">Revenue & Orders — Last 7 Days</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analytics} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }} />
                                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#6b5d52" strokeWidth={2.5} dot={{ fill: '#6b5d52', r: 4 }} activeDot={{ r: 6 }} name="revenue" />
                                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#c8956c" strokeWidth={2.5} dot={{ fill: '#c8956c', r: 4 }} activeDot={{ r: 6 }} name="orders" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {/* ORDERS */}
                {activeTab === "orders" && (
                    <div className="admin-table-wrapper">
                        {orders.length === 0 ? (
                            <p style={{ padding: '40px', textAlign: 'center', color: '#9a8880', fontSize: '14px' }}>No orders yet.</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}></th>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <>
                                            <tr key={order._id} className={`order-row ${expandedOrder === order._id ? 'order-row-expanded' : ''}`}>
                                                <td style={{ textAlign: 'center', padding: '14px 8px' }}>
                                                    <button
                                                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                        style={{
                                                            background: expandedOrder === order._id ? '#f5f0eb' : 'none',
                                                            border: '1px solid #e6e0d9', borderRadius: '6px',
                                                            width: '28px', height: '28px', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'all 0.2s',
                                                            color: expandedOrder === order._id ? '#8B5E3C' : '#9a8880',
                                                            fontSize: '12px', flexShrink: 0
                                                        }}
                                                        title={expandedOrder === order._id ? 'Collapse' : 'View items'}
                                                    >
                                                        <span className={`order-expand-icon ${expandedOrder === order._id ? 'open' : ''}`}>▸</span>
                                                    </button>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</td>
                                                <td>
                                                    <p style={{ fontWeight: 500 }}>{order.deliveryAddress.fullName}</p>
                                                    <p style={{ fontSize: '12px', color: '#888' }}>{order.userEmail}</p>
                                                </td>
                                                <td>
                                                    <span style={{ background: '#f5f0eb', color: '#6b5d52', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>Rs. {order.totalAmount.toLocaleString()}</td>
                                                <td onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={order.status}
                                                        onChange={e => updateOrderStatus(order._id, e.target.value)}
                                                        className="status-select"
                                                        style={{ borderColor: statusColor(order.status), color: statusColor(order.status), fontWeight: 600 }}
                                                    >
                                                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ fontSize: '13px', color: '#888' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="action-cell">
                                                    <button className="icon-btn delete" onClick={() => deleteOrder(order._id)}>
                                                        <FiTrash2 />
                                                    </button>
                                                </td>
                                            </tr>

                                            {expandedOrder === order._id && (
                                                <tr key={`${order._id}-expanded`} className="order-items-row">
                                                    <td colSpan={8}>
                                                        <div className="order-items-expanded">
                                                            <div className="order-items-expanded-header">
                                                                <span>Order items</span>
                                                                <span className="order-delivery-info">
                                                                    {order.deliveryAddress.fullName} · {order.deliveryAddress.address}, {order.deliveryAddress.city} · {order.deliveryAddress.phone}
                                                                </span>
                                                            </div>
                                                            <div className="order-items-list">
                                                                {order.items.map((item, i) => (
                                                                    <div key={i} className="order-item-expanded">
                                                                        <div className="order-item-img-admin">
                                                                            {item.imageUrl
                                                                                ? <img src={item.imageUrl} alt={item.name} />
                                                                                : <div className="order-item-img-placeholder" />
                                                                            }
                                                                        </div>
                                                                        <div className="order-item-info-admin">
                                                                            <p className="order-item-name-admin">{item.name}</p>
                                                                            <p className="order-item-qty-admin">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                                                                        </div>
                                                                        <p className="order-item-price-admin">
                                                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e6e0d9', fontSize: '14px', fontWeight: 700, color: '#3a2e28', gap: '12px' }}>
                                                                <span>Order Total</span>
                                                                <span>Rs. {order.totalAmount.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* PRODUCTS */}
                {activeTab === "products" && (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            {p.imageUrl
                                                ? <img src={p.imageUrl} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                                : <div style={{ width: '50px', height: '50px', background: '#f2f2f2', borderRadius: '8px' }} />
                                            }
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{p.brand || "—"}</td>
                                        <td>{p.category || "—"}</td>
                                        <td>Rs. {p.price?.toLocaleString()}</td>
                                        <td className="action-cell">
                                            <button className="icon-btn edit" onClick={() => openEditProduct(p)}><FiEdit2 /></button>
                                            <button className="icon-btn delete" onClick={() => deleteProduct(p._id)}><FiTrash2 /></button>
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
                                            <button className="icon-btn delete" onClick={() => deleteUser(u._id)}><FiTrash2 /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* PRODUCT MODAL */}
            {showProductModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
                            <button className="modal-close" onClick={() => setShowProductModal(false)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Name <span style={{ color: '#e63946' }}>*</span></label>
                                <input type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Niacinamide Serum" />
                            </div>
                            <div className="form-group">
                                <label>Brand <span style={{ color: '#e63946' }}>*</span></label>
                                <input type="text" value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} placeholder="e.g. The Ordinary" />
                            </div>
                            <div className="form-group">
                                <label>Price <span style={{ color: '#e63946' }}>*</span></label>
                                <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="e.g. 1500" />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input type="text" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} placeholder="e.g. Serum" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Short product description" />
                            </div>
                            <div className="form-group">
                                <label>Skin Types <span style={{ color: '#9a8880', fontWeight: 400, fontSize: '12px' }}>(comma separated)</span></label>
                                <input type="text" value={productForm.skinTypes} onChange={e => setProductForm({ ...productForm, skinTypes: e.target.value })} placeholder="e.g. Oily, Dry, Combination" />
                            </div>
                            <div className="form-group">
                                <label>Product Image</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                {uploadingImage && <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>Uploading image...</p>}
                                {productForm.imageUrl && (
                                    <img src={productForm.imageUrl} alt="Preview" style={{ marginTop: '10px', width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-modal-cancel" onClick={() => setShowProductModal(false)}>Cancel</button>
                            <button className="btn-modal-save" onClick={saveProduct} disabled={uploadingImage}>
                                {editingProduct ? "Save Changes" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}