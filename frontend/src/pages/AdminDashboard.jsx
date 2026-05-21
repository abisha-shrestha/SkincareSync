import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FiUsers, FiPackage, FiShoppingCart, FiClock, FiTrash2, FiEdit2, FiPlus, FiX, FiLogOut, FiSun, FiMoon, FiFileText, FiGrid, FiList, FiStar, FiMessageSquare } from "react-icons/fi";
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
    const [recentOrders, setRecentOrders] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [productForm, setProductForm] = useState({
        name: "", brand: "", price: "", category: "", description: "", skinTypes: "", imageUrl: ""
    });

    // Reviews state 
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewSearch, setReviewSearch] = useState("");
    const [reviewRatingFilter, setReviewRatingFilter] = useState("all"); // "all" | "1"–"5"

    const tabIcons = {
        overview:  <FiGrid size={14} />,
        orders:    <FiShoppingCart size={14} />,
        products:  <FiPackage size={14} />,
        users:     <FiUsers size={14} />,
        reviews:   <FiMessageSquare size={14} />,
        reports:   <FiFileText size={14} />,
    };

    // Reports state
    const [reportType, setReportType] = useState("sales");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [reportData, setReportData] = useState([]);
    const [reportGenerated, setReportGenerated] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);

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
    }, []);

    useEffect(() => { fetchStats(); fetchAnalytics(); fetchRecentOrders(); }, []);
    useEffect(() => { if (activeTab === "users") fetchUsers(); }, [activeTab]);
    useEffect(() => { if (activeTab === "products") fetchProducts(); }, [activeTab]);
    useEffect(() => { if (activeTab === "orders") fetchOrders(); }, [activeTab]);
    useEffect(() => { if (activeTab === "reviews") fetchAllReviews(); }, [activeTab]);

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

    const fetchRecentOrders = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/orders/all", { headers: getHeaders() });
            const data = await res.json();
            setRecentOrders((data.orders || []).slice(0, 5));
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

    //  Reviews fetching & deletion 
    const fetchAllReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/admin/reviews", { headers: getHeaders() });
            const data = await res.json();
            setReviews(data.reviews || []);
        } catch (err) { console.error(err); }
        finally { setReviewsLoading(false); }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm("Delete this review? This cannot be undone.")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/admin/reviews/${reviewId}`, {
                method: "DELETE",
                headers: getHeaders()
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Review deleted");
                fetchAllReviews();
            } else {
                toast.error(data.message || "Failed to delete review");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    // Filtered reviews (search + star filter)
    const filteredReviews = reviews.filter(r => {
        const matchesRating = reviewRatingFilter === "all" || r.rating === Number(reviewRatingFilter);
        const query = reviewSearch.toLowerCase();
        const matchesSearch =
            !query ||
            r.userName?.toLowerCase().includes(query) ||
            r.userEmail?.toLowerCase().includes(query) ||
            r.comment?.toLowerCase().includes(query) ||
            r.productId?.name?.toLowerCase().includes(query);
        return matchesRating && matchesSearch;
    });

    //  StarDisplay helper 
    const StarDisplay = ({ rating }) => (
        <div style={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map(n => (
                <FiStar
                    key={n}
                    size={13}
                    style={{
                        fill: n <= rating ? "var(--accent)" : "none",
                        color: n <= rating ? "var(--accent)" : "var(--border)",
                        flexShrink: 0,
                    }}
                />
            ))}
        </div>
    );

    //  Existing helpers 
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
        try {
            const res = await fetch(`http://localhost:3000/api/orders/${id}/status`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Failed to update order");
            fetchOrders(); fetchStats();
            toast.success(`Order marked as ${status}`);
        } catch (err) {
            console.error(err);
            toast.error("Status update failed");
        }
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

    // Reports 
    const generateReport = async () => {
        setGeneratingReport(true);
        setReportGenerated(false);
        try {
            const [ordersRes, productsRes, usersRes] = await Promise.all([
                fetch("http://localhost:3000/api/orders/all", { headers: getHeaders() }),
                fetch("http://localhost:3000/api/admin/products", { headers: getHeaders() }),
                fetch("http://localhost:3000/api/admin/users", { headers: getHeaders() }),
            ]);
            const ordersData = await ordersRes.json();
            const productsData = await productsRes.json();
            const usersData = await usersRes.json();

            let allOrders = ordersData.orders || [];
            const allProducts = productsData.products || [];
            const allUsers = usersData.users || [];

            if (dateFrom) allOrders = allOrders.filter(o => new Date(o.createdAt) >= new Date(dateFrom));
            if (dateTo) allOrders = allOrders.filter(o => new Date(o.createdAt) <= new Date(dateTo + "T23:59:59"));

            let rows = [];

            if (reportType === "sales") {
                rows = allOrders.map(o => ({
                    "Order ID": `#${o._id.slice(-8).toUpperCase()}`,
                    "Customer": o.deliveryAddress?.fullName || o.userEmail,
                    "Email": o.userEmail,
                    "Items": o.items.length,
                    "Total (Rs.)": o.totalAmount,
                    "Status": o.status,
                    "Payment Method": o.paymentMethod || "Cash on Delivery",
                    "Payment Status": o.paymentStatus,
                    "Date": new Date(o.createdAt).toLocaleDateString("en-NP"),
                }));
            }

            if (reportType === "orders") {
                rows = allOrders.flatMap(o =>
                    o.items.map(item => ({
                        "Order ID": `#${o._id.slice(-8).toUpperCase()}`,
                        "Customer": o.deliveryAddress?.fullName || o.userEmail,
                        "Product": item.name,
                        "Qty": item.quantity,
                        "Unit Price (Rs.)": item.price,
                        "Subtotal (Rs.)": item.price * item.quantity,
                        "Status": o.status,
                        "Date": new Date(o.createdAt).toLocaleDateString("en-NP"),
                    }))
                );
            }

            if (reportType === "products") {
                const salesMap = {};
                allOrders.forEach(o => {
                    o.items.forEach(item => {
                        const key = item.name;
                        if (!salesMap[key]) salesMap[key] = { qty: 0, revenue: 0 };
                        salesMap[key].qty += item.quantity;
                        salesMap[key].revenue += item.price * item.quantity;
                    });
                });
                rows = allProducts.map(p => ({
                    "Product": p.name,
                    "Brand": p.brand || "—",
                    "Category": p.category || "—",
                    "Price (Rs.)": p.price,
                    "Units Sold": salesMap[p.name]?.qty || 0,
                    "Revenue (Rs.)": salesMap[p.name]?.revenue || 0,
                    "Skin Types": (p.skinTypes || []).join(", "),
                }));
            }

            if (reportType === "customers") {
                const orderMap = {};
                allOrders.forEach(o => {
                    if (!orderMap[o.userEmail]) orderMap[o.userEmail] = { count: 0, spent: 0 };
                    orderMap[o.userEmail].count += 1;
                    orderMap[o.userEmail].spent += o.totalAmount;
                });
                rows = allUsers.map(u => ({
                    "Name": u.name,
                    "Email": u.email,
                    "Skin Type": u.skinType || "—",
                    "Total Orders": orderMap[u.email]?.count || 0,
                    "Total Spent (Rs.)": orderMap[u.email]?.spent || 0,
                }));
            }

            if (reportType === "skintypes") {
                const skinMap = {};
                allOrders.forEach(o => {
                    const user = allUsers.find(u => u.email === o.userEmail);
                    const skinType = user?.skinType || "Unknown";
                    if (!skinMap[skinType]) skinMap[skinType] = { orders: 0, revenue: 0, customers: new Set() };
                    skinMap[skinType].orders += 1;
                    skinMap[skinType].revenue += o.totalAmount;
                    skinMap[skinType].customers.add(o.userEmail);
                });
                rows = Object.entries(skinMap).map(([type, data]) => ({
                    "Skin Type": type,
                    "Unique Customers": data.customers.size,
                    "Total Orders": data.orders,
                    "Total Revenue (Rs.)": data.revenue,
                    "Avg Order Value (Rs.)": Math.round(data.revenue / data.orders),
                }));
            }

            setReportData(rows);
            setReportGenerated(true);
        } catch (err) {
            toast.error("Failed to generate report");
            console.error(err);
        } finally {
            setGeneratingReport(false);
        }
    };

    const downloadCSV = () => {
        if (!reportData.length) return;
        const headers = Object.keys(reportData[0]);
        const csvRows = [
            headers.join(","),
            ...reportData.map(row =>
                headers.map(h => `"${String(row[h]).replace(/"/g, '""')}"`).join(",")
            )
        ];
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `skincaresync-${reportType}-report.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV downloaded");
    };

    const downloadExcel = () => {
        if (!reportData.length) return;
        const headers = Object.keys(reportData[0]);
        const rows = reportData.map(row => headers.map(h => row[h]));
        const tableHTML = `
            <html><head><meta charset="UTF-8"></head><body>
            <table>
                <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
                ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
            </table>
            </body></html>
        `;
        const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `skincaresync-${reportType}-report.xls`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Excel file downloaded");
    };

    const reportTypes = [
        { value: "sales",     label: "Sales Report",         desc: "Revenue and order summaries" },
        { value: "orders",    label: "Order Details",         desc: "Line-by-line order breakdown" },
        { value: "products",  label: "Product Performance",   desc: "Units sold and revenue per product" },
        { value: "customers", label: "Customer Report",       desc: "Spending and order history per customer" },
        { value: "skintypes", label: "Skin Type Insights",    desc: "Purchases and revenue by skin type" },
    ];

    const logout = () => { localStorage.clear(); navigate("/auth"); };

    const statCards = [
        { label: "Total Users",     value: stats.totalUsers,    icon: <FiUsers />,        tab: "users" },
        { label: "Total Products",  value: stats.totalProducts, icon: <FiPackage />,      tab: "products" },
        { label: "Total Orders",    value: stats.totalOrders,   icon: <FiShoppingCart />, tab: "orders" },
        { label: "Pending Orders",  value: stats.pendingOrders, icon: <FiClock />,        tab: "orders" },
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
                <div className="admin-brand" onClick={() => setActiveTab("overview")} style={{ cursor: "pointer" }}>
                    SkincareSync
                </div>
                <p className="admin-role-label">Admin Panel</p>
                <nav className="admin-nav">
                    {["overview", "orders", "products", "users", "reviews", "reports"].map(tab => (
                        <button
                            key={tab}
                            className={`admin-nav-btn ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tabIcons[tab]}
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

                {/*  OVERVIEW  */}
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
                            <h2 className="analytics-title">Revenue & Orders - Last 7 Days</h2>
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

                        <div className="recent-orders-card">
                            <div className="recent-orders-header">
                                <h2 className="analytics-title" style={{ margin: 0 }}>Recent Orders</h2>
                                <button className="recent-orders-viewall" onClick={() => setActiveTab("orders")}>View All →</button>
                            </div>
                            {recentOrders.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '20px 0' }}>No orders yet.</p>
                            ) : (
                                <table className="admin-table" style={{ marginTop: '16px' }}>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th>
                                            <th>Payment</th><th>Method</th><th>Status</th><th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(order => (
                                            <tr key={order._id} className="order-row">
                                                <td style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</td>
                                                <td>
                                                    <p style={{ fontWeight: 500, margin: 0 }}>{order.deliveryAddress?.fullName}</p>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{order.userEmail}</p>
                                                </td>
                                                <td>
                                                    <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>Rs. {order.totalAmount.toLocaleString()}</td>
                                                <td>
                                                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: order.paymentMethod === 'eSewa' ? '#00a3441a' : '#6b5d521a', color: order.paymentMethod === 'eSewa' ? '#00a344' : '#6b5d52' }}>
                                                        {order.paymentMethod === 'eSewa' ? 'eSewa' : 'COD'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ color: order.paymentStatus === "Paid" ? "#22c55e" : "#ef4444", fontWeight: 600, fontSize: '13px', background: order.paymentStatus === "Paid" ? '#22c55e18' : '#ef444418', padding: '3px 10px', borderRadius: '20px' }}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ color: statusColor(order.status), fontWeight: 600, fontSize: '13px', background: `${statusColor(order.status)}18`, padding: '3px 10px', borderRadius: '20px' }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/*  ORDERS  */}
                {activeTab === "orders" && (
                    <div className="admin-table-wrapper">
                        {orders.length === 0 ? (
                            <p style={{ padding: '40px', textAlign: 'center', color: '#9a8880', fontSize: '14px' }}>No orders yet.</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}></th>
                                        <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th>
                                        <th>Payment</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <>
                                            <tr key={order._id} className={`order-row ${expandedOrder === order._id ? 'order-row-expanded' : ''}`}>
                                                <td style={{ textAlign: 'center', padding: '14px 8px' }}>
                                                    <button
                                                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                        style={{ background: expandedOrder === order._id ? 'var(--accent-light)' : 'none', border: '1px solid var(--border)', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: expandedOrder === order._id ? 'var(--accent)' : 'var(--text-muted)', fontSize: '12px', flexShrink: 0 }}
                                                    >
                                                        <span className={`order-expand-icon ${expandedOrder === order._id ? 'open' : ''}`}>▸</span>
                                                    </button>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</td>
                                                <td>
                                                    <p style={{ fontWeight: 500, margin: 0 }}>{order.deliveryAddress.fullName}</p>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{order.userEmail}</p>
                                                </td>
                                                <td>
                                                    <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>Rs. {order.totalAmount.toLocaleString()}</td>
                                                <td>
                                                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: order.paymentMethod === 'eSewa' ? '#00a3441a' : '#6b5d521a', color: order.paymentMethod === 'eSewa' ? '#00a344' : '#6b5d52' }}>
                                                        {order.paymentMethod === 'eSewa' ? 'eSewa' : 'COD'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ color: order.paymentStatus === "Paid" ? "#22c55e" : "#ef4444", fontWeight: 600, fontSize: '13px', background: order.paymentStatus === "Paid" ? '#22c55e18' : '#ef444418', padding: '3px 10px', borderRadius: '20px' }}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td onClick={e => e.stopPropagation()}>
                                                    <select value={order.status} onChange={e => updateOrderStatus(order._id, e.target.value)} className="status-select" style={{ borderColor: statusColor(order.status), color: statusColor(order.status), fontWeight: 600 }}>
                                                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="action-cell">
                                                    <button className="icon-btn delete" onClick={() => deleteOrder(order._id)}><FiTrash2 /></button>
                                                </td>
                                            </tr>
                                            {expandedOrder === order._id && (
                                                <tr key={`${order._id}-expanded`} className="order-items-row">
                                                    <td colSpan={10}>
                                                        <div className="order-items-expanded">
                                                            <div className="order-items-expanded-header">
                                                                <span>Order items</span>
                                                                <span style={{ fontSize: '12px', fontWeight: 600, color: order.paymentMethod === 'eSewa' ? '#00a344' : '#6b5d52' }}>
                                                                    {order.paymentMethod === 'eSewa' ? 'eSewa' : 'Cash on Delivery'}
                                                                </span>
                                                                <span className="order-delivery-info">
                                                                    {order.deliveryAddress.fullName} · {order.deliveryAddress.address}, {order.deliveryAddress.city} · {order.deliveryAddress.phone}
                                                                </span>
                                                            </div>
                                                            <div className="order-items-list">
                                                                {order.items.map((item, i) => (
                                                                    <div key={i} className="order-item-expanded">
                                                                        <div className="order-item-img-admin">
                                                                            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <div className="order-item-img-placeholder" />}
                                                                        </div>
                                                                        <div className="order-item-info-admin">
                                                                            <p className="order-item-name-admin">{item.name}</p>
                                                                            <p className="order-item-qty-admin">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                                                                        </div>
                                                                        <p className="order-item-price-admin">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', gap: '12px' }}>
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

                {/*  PRODUCTS  */}
                {activeTab === "products" && (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr><th>Image</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            {p.imageUrl
                                                ? <img src={p.imageUrl} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                                : <div style={{ width: '50px', height: '50px', background: 'var(--bg-subtle)', borderRadius: '8px' }} />
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
                                <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
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

                {/* REVIEWS */}
                {activeTab === "reviews" && (
                    <div className="admin-table-wrapper">

                        {/* Toolbar: search + star filter */}
                        <div className="reviews-toolbar">
                            <input
                                type="text"
                                className="reviews-search"
                                placeholder="Search by reviewer, product, or comment…"
                                value={reviewSearch}
                                onChange={e => setReviewSearch(e.target.value)}
                            />
                            <div className="reviews-filter-stars">
                                {["all", "5", "4", "3", "2", "1"].map(val => (
                                    <button
                                        key={val}
                                        className={`reviews-filter-btn ${reviewRatingFilter === val ? "active" : ""}`}
                                        onClick={() => setReviewRatingFilter(val)}
                                    >
                                        {val === "all" ? "All" : `${val} ★`}
                                    </button>
                                ))}
                            </div>
                            <span className="reviews-count-label">
                                {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {reviewsLoading ? (
                            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                                Loading reviews…
                            </p>
                        ) : filteredReviews.length === 0 ? (
                            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                                No reviews found.
                            </p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Reviewer</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReviews.map(review => (
                                        <tr key={review._id}>

                                            {/* Product */}
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    {review.productId?.imageUrl
                                                        ? <img src={review.productId.imageUrl} alt={review.productId.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                                                        : <div style={{ width: '38px', height: '38px', background: 'var(--bg-subtle)', borderRadius: '8px', flexShrink: 0 }} />
                                                    }
                                                    <span style={{ fontWeight: 500, fontSize: '13px' }}>
                                                        {review.productId?.name || "Deleted product"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Reviewer */}
                                            <td>
                                                <p style={{ fontWeight: 500, margin: 0, fontSize: '13px' }}>{review.userName}</p>
                                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{review.userEmail}</p>
                                            </td>

                                            {/* Rating */}
                                            <td>
                                                <StarDisplay rating={review.rating} />
                                            </td>

                                            {/* Comment */}
                                            <td style={{ maxWidth: '260px' }}>
                                                {review.comment
                                                    ? <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {review.comment}
                                                    </p>
                                                    : <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>No comment</span>
                                                }
                                            </td>

                                            {/* Date */}
                                            <td style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                {new Date(review.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>

                                            {/* Delete */}
                                            <td className="action-cell">
                                                <button className="icon-btn delete" onClick={() => deleteReview(review._id)} title="Delete review">
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* REPORTS */}
                {activeTab === "reports" && (
                    <div className="reports-page">
                        <div className="report-type-grid">
                            {reportTypes.map(rt => (
                                <div
                                    key={rt.value}
                                    className={`report-type-card ${reportType === rt.value ? "active" : ""}`}
                                    onClick={() => { setReportType(rt.value); setReportGenerated(false); }}
                                >
                                    <p className="report-type-label">{rt.label}</p>
                                    <p className="report-type-desc">{rt.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="report-filters-card">
                            <h3 className="report-section-title">Filters</h3>
                            <div className="report-filters-row">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>From Date</label>
                                    <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setReportGenerated(false); }} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>To Date</label>
                                    <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setReportGenerated(false); }} />
                                </div>
                                <button className="btn-generate-report" onClick={generateReport} disabled={generatingReport}>
                                    {generatingReport ? "Generating..." : "Generate Report"}
                                </button>
                            </div>
                        </div>

                        {reportGenerated && (
                            <div className="report-preview-card">
                                <div className="report-preview-header">
                                    <h3 className="report-section-title" style={{ margin: 0 }}>
                                        Preview — {reportTypes.find(r => r.value === reportType)?.label}
                                        <span style={{ fontWeight: 400, fontSize: '13px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                                            {reportData.length} row{reportData.length !== 1 ? "s" : ""}
                                        </span>
                                    </h3>
                                    <div className="report-download-btns">
                                        <button className="btn-download csv" onClick={downloadCSV}>↓ Download CSV</button>
                                        <button className="btn-download excel" onClick={downloadExcel}>↓ Download Excel</button>
                                    </div>
                                </div>

                                {reportData.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', padding: '24px 0', fontSize: '14px' }}>No data found for the selected filters.</p>
                                ) : (
                                    <div className="report-table-wrapper">
                                        <table className="admin-table report-table">
                                            <thead>
                                                <tr>{Object.keys(reportData[0]).map(col => <th key={col}>{col}</th>)}</tr>
                                            </thead>
                                            <tbody>
                                                {reportData.slice(0, 50).map((row, i) => (
                                                    <tr key={i}>{Object.values(row).map((val, j) => <td key={j}>{String(val)}</td>)}</tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {reportData.length > 50 && (
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px 0', textAlign: 'center' }}>
                                                Showing first 50 rows. Download for full data.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
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
                                {uploadingImage && <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>Uploading image...</p>}
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