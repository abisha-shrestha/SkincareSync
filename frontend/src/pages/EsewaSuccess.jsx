import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EsewaSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const data = params.get("data");
        const pendingOrder = JSON.parse(sessionStorage.getItem("pendingOrder") || "null");

        if (!data || !pendingOrder) {
            navigate("/orders");
            return;
        }

        fetch(`http://localhost:3000/api/orders/esewa/verify?data=${encodeURIComponent(data)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pendingOrder })
        })
            .then(res => res.json())
            .then(result => {
                sessionStorage.removeItem("pendingOrder");
                sessionStorage.removeItem("buyNowItem");
                if (result.success) {
                    toast.success("Payment successful!");
                    navigate("/order-success", { state: { orderedItems: result.order.items } });
                } else {
                    toast.error(result.message || "Payment verification failed");
                    navigate("/checkout"); // back to checkout, cart intact
                }
            })
            .catch(() => navigate("/checkout"));
    }, []);

    return (
        <div style={{ padding: "140px 4rem", textAlign: "center" }}>
            <h2>Verifying payment...</h2>
        </div>
    );
}