import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email") || "guest";

    useEffect(() => {
        fetch(`http://localhost:3000/api/orders?userEmail=${userEmail}`)
            .then(res => res.json())
            .then(data => setOrders(data.orders || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const statusColor = (status) => {
        const colors = {
            Pending: '#f0a500',
            Processing: '#3b82f6',
            Shipped: '#8b5cf6',
            Delivered: '#22c55e',
            Cancelled: '#ef4444'
        };
        return colors[status] || '#888';
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "140px 6rem", textAlign: "center", minHeight: "80vh" }}>
                    <h2>Loading orders...</h2>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="orders-page">
                <div className="orders-wrapper">
                    <div className="orders-header">
                        <h1>My Orders</h1>
                        <p>{orders.length} orders</p>
                    </div>

                    {orders.length === 0 ? (
                        <div className="empty-orders">
                            <h2>No orders yet</h2>
                            <p>Your order history will appear here</p>
                            <button className="btn btn-cta" onClick={() => navigate("/products")}>
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order._id} className="order-card">
                                    <div className="order-card-header">
                                        <div>
                                            <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="order-date">
                                                {new Date(order.createdAt).toLocaleDateString('en-NP', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className="order-status"
                                            style={{ background: statusColor(order.status) }}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="order-items">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <div className="order-item-image">
                                                    {item.imageUrl
                                                        ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                        : null
                                                    }
                                                </div>
                                                <div className="order-item-info">
                                                    <p className="order-item-name">{item.name}</p>
                                                    <p className="order-item-qty">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="order-item-price">
                                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-card-footer">
                                        <div className="order-delivery">
                                            <p>{order.deliveryAddress.fullName}</p>
                                            <p>{order.deliveryAddress.address}, {order.deliveryAddress.city}</p>
                                        </div>
                                        <div className="order-total">
                                            <span>Total</span>
                                            <span>Rs. {order.totalAmount.toLocaleString()}</span>
                                        </div>
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