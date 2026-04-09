import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Profile.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTheme } from "../ThemeContext";

export default function Profile() {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email") || "";
    const userName = localStorage.getItem("name") || "";
    const [activeTab, setActiveTab] = useState("personal");
    const { theme, toggleTheme } = useTheme();

    const [profile, setProfile] = useState({ fullName: "", phone: "", city: "", birthdate: "", gender: "" });
    const [profileErrors, setProfileErrors] = useState({});
    const [skinType, setSkinType] = useState("");

    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({ label: "", fullName: "", phone: "", address: "", city: "", isDefault: false });
    const [addressErrors, setAddressErrors] = useState({});

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    // Diary state
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [diaryLoading, setDiaryLoading] = useState(false);
    const [diaryFormVisible, setDiaryFormVisible] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [diaryForm, setDiaryForm] = useState({ date: '', condition: 3, products: '', notes: '' });

    const skinTypeLabels = {
        dry: 'Dry Skin', oily: 'Oily Skin', combination: 'Combination Skin',
        normal: 'Normal Skin', sensitive: 'Sensitive Skin'
    };

    const conditionLabels = ['', 'Very bad', 'Bad', 'Okay', 'Good', 'Great'];

    useEffect(() => {
        if (!userEmail) { navigate("/auth"); return; }
        fetchProfile();
        fetchSkinType();
    }, []);

    useEffect(() => {
        if (activeTab === "orders") fetchOrders();
        if (activeTab === "address") fetchAddresses();
        if (activeTab === "diary") fetchDiaryEntries();
    }, [activeTab]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/profile?userEmail=${userEmail}`);
            const data = await res.json();
            if (data.success) {
                setProfile({
                    fullName: data.profile.fullName || userName,
                    phone: data.profile.phone || "",
                    city: data.profile.city || "",
                    birthdate: data.profile.birthdate || "",
                    gender: data.profile.gender || ""
                });
            }
        } catch (err) { console.error(err); }
    };

    const fetchSkinType = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/profile/skin-type?userEmail=${userEmail}`);
            const data = await res.json();
            if (data.success) setSkinType(data.skinType || "");
        } catch (err) { console.error(err); }
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/orders?userEmail=${userEmail}`);
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (err) { console.error(err); }
        finally { setOrdersLoading(false); }
    };

    const fetchAddresses = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/addresses?userEmail=${userEmail}`);
            const data = await res.json();
            setAddresses(data.addresses || []);
        } catch (err) { console.error(err); }
    };

    const fetchDiaryEntries = async () => {
        setDiaryLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/diary?userEmail=${userEmail}`);
            const data = await res.json();
            if (data.success) setDiaryEntries(data.entries);
        } catch (err) { console.error(err); }
        finally { setDiaryLoading(false); }
    };

    const validatePhone = (phone) => {
        if (!phone || phone.trim() === '') return null;
        if (!/^(97|98)\d{8}$/.test(phone.trim())) return 'Phone must start with 97 or 98 and be exactly 10 digits';
        return null;
    };

    const validateProfile = () => {
        const errors = {};
        if (!profile.fullName || profile.fullName.trim().length < 3) {
            errors.fullName = 'Full name must be at least 3 characters';
        }
        const phoneErr = validatePhone(profile.phone);
        if (phoneErr) errors.phone = phoneErr;
        return errors;
    };

    const handleProfileSave = async () => {
        const errors = validateProfile();
        if (Object.keys(errors).length > 0) { setProfileErrors(errors); return; }
        setProfileErrors({});
        try {
            const res = await fetch("http://localhost:3000/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, ...profile })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Profile updated successfully");
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (err) { toast.error("Something went wrong"); }
    };

    const validateAddressForm = () => {
        const errors = {};
        if (!addressForm.label.trim()) errors.label = 'Label is required';
        if (!addressForm.fullName.trim() || addressForm.fullName.trim().length < 3) errors.fullName = 'Full name must be at least 3 characters';
        const phoneErr = validatePhone(addressForm.phone);
        if (phoneErr) errors.phone = phoneErr;
        if (!addressForm.phone.trim()) errors.phone = 'Phone is required';
        if (!addressForm.address.trim()) errors.address = 'Address is required';
        if (!addressForm.city.trim()) errors.city = 'City is required';
        return errors;
    };

    const handleAddressSave = async () => {
        const errors = validateAddressForm();
        if (Object.keys(errors).length > 0) { setAddressErrors(errors); return; }
        setAddressErrors({});
        try {
            const url = editingAddress
                ? `http://localhost:3000/api/addresses/${editingAddress._id}`
                : "http://localhost:3000/api/addresses";
            const method = editingAddress ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, ...addressForm })
            });
            const data = await res.json();
            if (data.success) {
                fetchAddresses();
                setShowAddressForm(false);
                setEditingAddress(null);
                setAddressForm({ label: "", fullName: "", phone: "", address: "", city: "", isDefault: false });
                toast.success(editingAddress ? "Address updated" : "Address saved");
            }
        } catch (err) { toast.error("Something went wrong"); }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        await fetch(`http://localhost:3000/api/addresses/${id}`, { method: "DELETE" });
        fetchAddresses();
        toast.success("Address deleted");
    };

    const handleEditAddress = (addr) => {
        setEditingAddress(addr);
        setAddressForm({ label: addr.label, fullName: addr.fullName, phone: addr.phone, address: addr.address, city: addr.city, isDefault: addr.isDefault });
        setShowAddressForm(true);
    };

    const validatePassword = () => {
        const errors = {};
        if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
        if (!passwordForm.newPassword || passwordForm.newPassword.length < 4) errors.newPassword = 'New password must be at least 4 characters';
        if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        return errors;
    };

    const handleChangePassword = async () => {
        const errors = validatePassword();
        if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }
        setPasswordErrors({});
        try {
            const res = await fetch("http://localhost:3000/api/profile/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Password changed successfully");
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setPasswordErrors({ general: data.message });
            }
        } catch (err) { toast.error("Something went wrong"); }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) { setDeleteError("Please enter your password"); return; }
        try {
            const res = await fetch("http://localhost:3000/api/profile/delete-account", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, password: deletePassword })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.clear();
                navigate("/auth");
            } else {
                setDeleteError(data.message);
            }
        } catch (err) { console.error(err); }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders();
                toast.success("Order cancelled");
            } else {
                toast.error(data.message);
            }
        } catch (err) { console.error(err); }
    };

    const handleDiarySave = async () => {
        if (!diaryForm.date) return toast.error('Please select a date');
        try {
            const url = editingEntry
                ? `http://localhost:3000/api/diary/${editingEntry._id}`
                : 'http://localhost:3000/api/diary';
            const method = editingEntry ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, ...diaryForm })
            });
            const data = await res.json();
            if (data.success) {
                fetchDiaryEntries();
                setDiaryFormVisible(false);
                setEditingEntry(null);
                setDiaryForm({ date: '', condition: 3, products: '', notes: '' });
                toast.success(editingEntry ? 'Entry updated' : 'Entry saved');
            } else {
                toast.error(data.message);
            }
        } catch (err) { toast.error('Something went wrong'); }
    };

    const handleDiaryEdit = (entry) => {
        setEditingEntry(entry);
        setDiaryForm({ date: entry.date, condition: entry.condition, products: entry.products, notes: entry.notes });
        setDiaryFormVisible(true);
    };

    const handleDiaryDelete = async (id) => {
        if (!window.confirm('Delete this entry?')) return;
        await fetch(`http://localhost:3000/api/diary/${id}`, { method: 'DELETE' });
        fetchDiaryEntries();
        toast.success('Entry deleted');
    };

    const logout = () => { localStorage.clear(); navigate("/auth"); };

    const statusColor = (status) => {
        const colors = { Pending: '#f0a500', Processing: '#3b82f6', Shipped: '#8b5cf6', Delivered: '#22c55e', Cancelled: '#ef4444' };
        return colors[status] || '#888';
    };

    const initials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

    const tabs = [
        { key: "personal", label: "Personal details" },
        { key: "orders", label: "Orders" },
        { key: "address", label: "Address" },
        { key: "diary", label: "Skin Diary" },
        { key: "settings", label: "Settings" },
    ];

    return (
        <>
            <Navbar />
            <section className="profile-page">
                <div className="profile-wrapper">
                    <div className="profile-layout">

                        <aside className="profile-sidebar">
                            <div className="profile-avatar-section">
                                <div className="profile-avatar">{initials(profile.fullName || userName)}</div>
                                <p className="profile-display-name">{profile.fullName || userName}</p>
                                <p className="profile-email">{userEmail}</p>
                                {skinType && (
                                    <span className="profile-skin-badge">
                                        {skinTypeLabels[skinType]}
                                    </span>
                                )}
                            </div>
                            <nav className="profile-nav">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        className={`profile-nav-btn ${activeTab === tab.key ? "active" : ""}`}
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                                <button className="profile-logout-btn" onClick={logout}>Logout</button>
                            </nav>
                        </aside>

                        <main className="profile-main">

                            {/* PERSONAL DETAILS */}
                            {activeTab === "personal" && (
                                <div className="profile-section">
                                    <h2>Personal information</h2>
                                    <div className="profile-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Full Name <span className="required">*</span></label>
                                                <input
                                                    type="text"
                                                    value={profile.fullName}
                                                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                                                    placeholder="Enter your full name"
                                                />
                                                {profileErrors.fullName && <p className="field-error">{profileErrors.fullName}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input type="email" value={userEmail} disabled className="input-disabled" />
                                                <p className="field-hint">Email cannot be changed</p>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Phone</label>
                                                <input
                                                    type="text"
                                                    value={profile.phone}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                        setProfile({ ...profile, phone: val });
                                                    }}
                                                    placeholder="98XXXXXXXX"
                                                    maxLength={10}
                                                />
                                                {profileErrors.phone && <p className="field-error">{profileErrors.phone}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label>City</label>
                                                <input
                                                    type="text"
                                                    value={profile.city}
                                                    onChange={e => setProfile({ ...profile, city: e.target.value })}
                                                    placeholder="Kathmandu"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Birthdate</label>
                                                <input
                                                    type="date"
                                                    value={profile.birthdate}
                                                    onChange={e => setProfile({ ...profile, birthdate: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Gender</label>
                                                <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}>
                                                    <option value="">Prefer not to say</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* SKIN TYPE */}
                                        <div className="skin-type-section">
                                            <div className="skin-type-row">
                                                <div>
                                                    <p className="skin-type-title">Your skin type</p>
                                                    <p className="skin-type-hint">This helps us personalize your product recommendations</p>
                                                </div>
                                                {skinType ? (
                                                    <div className="skin-type-result">
                                                        <span className="skin-type-value">{skinTypeLabels[skinType]}</span>
                                                        <button className="skin-type-retake" onClick={() => navigate('/quiz')}>
                                                            Retake Quiz
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="skin-type-retake" onClick={() => navigate('/quiz')}>
                                                        Take the Quiz
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {profileErrors.general && <p className="field-error">{profileErrors.general}</p>}
                                        <button className="btn-profile-save" onClick={handleProfileSave}>Save changes</button>
                                    </div>
                                </div>
                            )}

                            {/* ORDERS */}
                            {activeTab === "orders" && (
                                <div className="profile-section">
                                    <h2>My orders</h2>
                                    {ordersLoading ? <p>Loading...</p> : orders.length === 0 ? (
                                        <div className="profile-empty">
                                            <p>No orders yet</p>
                                            <button className="btn-profile-save" onClick={() => navigate("/products")}>Start Shopping</button>
                                        </div>
                                    ) : (
                                        <div className="profile-orders-list">
                                            {orders.map(order => (
                                                <div key={order._id} className="profile-order-card">
                                                    <div className="profile-order-header">
                                                        <div>
                                                            <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
                                                            <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <span className="order-status-badge" style={{ background: statusColor(order.status) }}>
                                                                {order.status}
                                                            </span>
                                                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                                                <button className="btn-cancel-order" onClick={() => handleCancelOrder(order._id)}>
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="profile-order-items">
                                                        {order.items.map((item, i) => (
                                                            <div key={i} className="profile-order-item">
                                                                <div className="profile-order-img">
                                                                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />}
                                                                </div>
                                                                <div>
                                                                    <p className="profile-order-name">{item.name}</p>
                                                                    <p className="profile-order-qty">Qty: {item.quantity}</p>
                                                                </div>
                                                                <p className="profile-order-price">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="profile-order-footer">
                                                        <span>Total</span>
                                                        <span>Rs. {order.totalAmount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ADDRESS */}
                            {activeTab === "address" && (
                                <div className="profile-section">
                                    <div className="profile-section-header">
                                        <h2>Saved addresses</h2>
                                        <button className="btn-profile-save" onClick={() => { setShowAddressForm(true); setEditingAddress(null); setAddressForm({ label: "", fullName: "", phone: "", address: "", city: "", isDefault: false }); }}>
                                            + Add Address
                                        </button>
                                    </div>
                                    {showAddressForm && (
                                        <div className="address-form-card">
                                            <h3>{editingAddress ? "Edit address" : "New address"}</h3>
                                            <div className="profile-form">
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Label (e.g. Home, Work)</label>
                                                        <input type="text" value={addressForm.label} onChange={e => setAddressForm({ ...addressForm, label: e.target.value })} placeholder="Home" />
                                                        {addressErrors.label && <p className="field-error">{addressErrors.label}</p>}
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Full Name <span className="required">*</span></label>
                                                        <input type="text" value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} placeholder="Full name" />
                                                        {addressErrors.fullName && <p className="field-error">{addressErrors.fullName}</p>}
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Phone <span className="required">*</span></label>
                                                        <input
                                                            type="text"
                                                            value={addressForm.phone}
                                                            onChange={e => {
                                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                                setAddressForm({ ...addressForm, phone: val });
                                                            }}
                                                            placeholder="98XXXXXXXX"
                                                            maxLength={10}
                                                        />
                                                        {addressErrors.phone && <p className="field-error">{addressErrors.phone}</p>}
                                                    </div>
                                                    <div className="form-group">
                                                        <label>City <span className="required">*</span></label>
                                                        <input type="text" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="Kathmandu" />
                                                        {addressErrors.city && <p className="field-error">{addressErrors.city}</p>}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Street Address <span className="required">*</span></label>
                                                    <input type="text" value={addressForm.address} onChange={e => setAddressForm({ ...addressForm, address: e.target.value })} placeholder="Street, tole" />
                                                    {addressErrors.address && <p className="field-error">{addressErrors.address}</p>}
                                                </div>
                                                <div className="form-group-check">
                                                    <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                                                    <label htmlFor="isDefault">Set as default address</label>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                                    <button className="btn-profile-save" onClick={handleAddressSave}>Save address</button>
                                                    <button className="btn-profile-cancel" onClick={() => { setShowAddressForm(false); setAddressErrors({}); }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="address-list">
                                        {addresses.length === 0 && !showAddressForm && (
                                            <p style={{ color: '#888', fontSize: '14px' }}>No saved addresses yet.</p>
                                        )}
                                        {addresses.map(addr => (
                                            <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                                                <div className="address-card-header">
                                                    <span className="address-label">{addr.label}</span>
                                                    {addr.isDefault && <span className="address-default-badge">Default</span>}
                                                </div>
                                                <p className="address-name">{addr.fullName}</p>
                                                <p className="address-detail">{addr.address}, {addr.city}</p>
                                                <p className="address-detail">{addr.phone}</p>
                                                <div className="address-actions">
                                                    <button className="btn-address-edit" onClick={() => handleEditAddress(addr)}>Edit</button>
                                                    <button className="btn-address-delete" onClick={() => handleDeleteAddress(addr._id)}>Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SKIN DIARY */}
                            {activeTab === "diary" && (
                                <div className="profile-section">
                                    <div className="profile-section-header">
                                        <h2>Skin Diary</h2>
                                        <button className="btn-profile-save" onClick={() => {
                                            setDiaryFormVisible(true);
                                            setEditingEntry(null);
                                            setDiaryForm({ date: '', condition: 3, products: '', notes: '' });
                                        }}>
                                            + New Entry
                                        </button>
                                    </div>

                                    {diaryFormVisible && (
                                        <div className="address-form-card">
                                            <h3>{editingEntry ? 'Edit Entry' : 'New Entry'}</h3>
                                            <div className="profile-form">
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label>Date</label>
                                                        <input
                                                            type="date"
                                                            value={diaryForm.date}
                                                            max={new Date().toISOString().split('T')[0]}
                                                            onChange={e => setDiaryForm({ ...diaryForm, date: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Skin Condition Today</label>
                                                        <div className="diary-condition-row">
                                                            {[1, 2, 3, 4, 5].map(n => (
                                                                <button
                                                                    key={n}
                                                                    type="button"
                                                                    className={`diary-condition-btn ${diaryForm.condition === n ? 'active' : ''}`}
                                                                    onClick={() => setDiaryForm({ ...diaryForm, condition: n })}
                                                                >
                                                                    {n}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <p className="field-hint">{conditionLabels[diaryForm.condition]}</p>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Products Used</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. CeraVe Moisturizer, Vitamin C Serum"
                                                        value={diaryForm.products}
                                                        onChange={e => setDiaryForm({ ...diaryForm, products: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Notes</label>
                                                    <textarea
                                                        placeholder="How did your skin feel today? Any reactions?"
                                                        value={diaryForm.notes}
                                                        onChange={e => setDiaryForm({ ...diaryForm, notes: e.target.value })}
                                                        rows={3}
                                                        style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', width: '100%' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button className="btn-profile-save" onClick={handleDiarySave}>
                                                        {editingEntry ? 'Update Entry' : 'Save Entry'}
                                                    </button>
                                                    <button className="btn-profile-cancel" onClick={() => {
                                                        setDiaryFormVisible(false);
                                                        setEditingEntry(null);
                                                    }}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {diaryLoading ? (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</p>
                                    ) : diaryEntries.length === 0 && !diaryFormVisible ? (
                                        <div className="profile-empty">
                                            <p>No diary entries yet. Start tracking your skin journey.</p>
                                        </div>
                                    ) : (
                                        <div className="address-list">
                                            {diaryEntries.map(entry => (
                                                <div key={entry._id} className="address-card">
                                                    <div className="address-card-header">
                                                        <span className="address-label">
                                                            {new Date(entry.date).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </span>
                                                        <span className="diary-condition-badge">
                                                            {'★'.repeat(entry.condition)}{'☆'.repeat(5 - entry.condition)}
                                                            <span style={{ marginLeft: '6px', fontSize: '11px' }}>
                                                                {conditionLabels[entry.condition]}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {entry.products && (
                                                        <p className="address-name">Products: <span style={{ fontWeight: 400 }}>{entry.products}</span></p>
                                                    )}
                                                    {entry.notes && (
                                                        <p className="address-detail">{entry.notes}</p>
                                                    )}
                                                    <div className="address-actions">
                                                        <button className="btn-address-edit" onClick={() => handleDiaryEdit(entry)}>Edit</button>
                                                        <button className="btn-address-delete" onClick={() => handleDiaryDelete(entry._id)}>Delete</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SETTINGS */}
                            {activeTab === "settings" && (
                                <div className="profile-section">
                                    <h2>Settings</h2>
                                    <div className="settings-block">
                                        <h3>Change password</h3>
                                        <div className="form-group">
                                            <label>Current Password</label>
                                            <div className="profile-input-wrapper">
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={passwordForm.currentPassword}
                                                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                    placeholder="Enter current password"
                                                    autoComplete="off"
                                                />
                                                <button type="button" className="profile-eye-btn" onClick={() => setShowCurrentPassword(v => !v)} tabIndex={-1}>
                                                    {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                </button>
                                            </div>
                                            {passwordErrors.currentPassword && <p className="field-error">{passwordErrors.currentPassword}</p>}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>New Password</label>
                                                <div className="profile-input-wrapper">
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={passwordForm.newPassword}
                                                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                        placeholder="Enter new password"
                                                        autoComplete="off"
                                                    />
                                                    <button type="button" className="profile-eye-btn" onClick={() => setShowNewPassword(v => !v)} tabIndex={-1}>
                                                        {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                    </button>
                                                </div>
                                                {passwordErrors.newPassword && <p className="field-error">{passwordErrors.newPassword}</p>}
                                            </div>
                                            <div className="form-group">
                                                <label>Confirm New Password</label>
                                                <div className="profile-input-wrapper">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={passwordForm.confirmPassword}
                                                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                        placeholder="Confirm new password"
                                                        autoComplete="off"
                                                    />
                                                    <button type="button" className="profile-eye-btn" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                                                        {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                    </button>
                                                </div>
                                                {passwordErrors.confirmPassword && <p className="field-error">{passwordErrors.confirmPassword}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="settings-block danger-block">
                                        <h3>Delete account</h3>
                                        <p className="danger-text">Your account will be scheduled for permanent deletion after 30 days. This action cannot be undone.</p>
                                        {!showDeleteConfirm ? (
                                            <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete my account</button>
                                        ) : (
                                            <div className="form-group">
                                                <label>Enter your password to confirm</label>
                                                <div className="profile-input-wrapper">
                                                    <input
                                                        type={showDeletePassword ? "text" : "password"}
                                                        value={deletePassword}
                                                        onChange={e => setDeletePassword(e.target.value)}
                                                        placeholder="Your password"
                                                        autoComplete="off"
                                                    />
                                                    <button type="button" className="profile-eye-btn" onClick={() => setShowDeletePassword(v => !v)} tabIndex={-1}>
                                                        {showDeletePassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                    </button>
                                                </div>
                                                {deleteError && <p className="field-error">{deleteError}</p>}
                                            </div>
                                        )}
                                        <h3>Appearance</h3>
                                        <div className="theme-setting-row">
                                            <div>
                                                <p className="skin-type-title">Theme</p>
                                                <p className="skin-type-hint">Switch between light and dark mode</p>
                                            </div>
                                            <button className="theme-toggle-btn" onClick={toggleTheme}>
                                                {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}