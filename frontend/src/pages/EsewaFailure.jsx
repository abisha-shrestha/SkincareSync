import { useNavigate } from "react-router-dom";

export default function EsewaFailure() {
    const navigate = useNavigate();
    return (
        <div style={{ padding: "140px 4rem", textAlign: "center" }}>
            <h2>Payment Failed</h2>
            <p>Your payment was not completed. No charges were made.</p>
            <button className="btn btn-cta" onClick={() => navigate("/cart")}>Back to Cart</button>
        </div>
    );
}