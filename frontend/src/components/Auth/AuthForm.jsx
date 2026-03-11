import { useState } from "react";
import "./Auth.css";

export default function AuthForm({ isLogin, toggleAuth }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isLogin && formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);

            const url = isLogin
                ? "http://localhost:3000/auth/login"
                : "http://localhost:3000/auth/signup";

            const body = isLogin
                ? {
                        email: formData.email,
                        password: formData.password
                    }
                    : {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || result.message || "Something went wrong");
                return;
            }

            if (isLogin) {
                localStorage.setItem("token", result.jwtToken);
                localStorage.setItem("name", result.name);
                localStorage.setItem("email", result.email);
                alert("Login successful!");
                // Redirect here
                window.location.href = "/";
            } else {
                alert("Signup successful! Please login.");
                toggleAuth();
            }

        } catch (err) {
            setError("Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-page">
            <div className="auth-container">
                <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>

                <p className="auth-subtext">
                    {isLogin
                        ? "Login to continue your skincare journey."
                        : "Join SkincareSync and discover personalized care."}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

                    <button type="submit" className="btn btn-cta" disabled={loading}>
                        {loading
                            ? "Please wait..."
                            : isLogin
                            ? "Login"
                            : "Sign Up"}
                    </button>
                </form>

                <p className="auth-toggle">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}{" "}
                    <span onClick={toggleAuth}>
                        {isLogin ? "Sign up instead" : "Login instead"}
                    </span>
                </p>
            </div>
        </section>
    );
}