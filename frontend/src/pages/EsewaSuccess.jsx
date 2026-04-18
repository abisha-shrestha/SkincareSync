import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EsewaSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const data = params.get("data");

        if (!data) { navigate("/orders"); return; }

        fetch(`http://localhost:3000/api/orders/esewa/verify?data=${encodeURIComponent(data)}`)
            .then(res => res.json())
            .then(result => {
                sessionStorage.removeItem("pendingOrderId");
                sessionStorage.removeItem("buyNowItem");
                if (result.success) {
                    toast.success("Payment successful!");
                    navigate("/order-success", { state: { orderedItems: result.order.items } });
                } else {
                    toast.error(result.message || "Payment verification failed");
                    navigate("/orders");
                }
            })
            .catch(() => navigate("/orders"));
    }, []);

    return <div style={{ padding: "140px 4rem", textAlign: "center" }}><h2>Verifying payment...</h2></div>;
}