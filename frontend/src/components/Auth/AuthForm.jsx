import { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheck } from "react-icons/fi";
import "./Auth.css";

export default function AuthForm({ isLogin, toggleAuth }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Clear sensitive fields whenever switching between login and signup
    useEffect(() => {
        setFormData(prev => ({
            name: "",
            email: prev.email, // keep email only
            password: "",
            confirmPassword: ""
        }));
        setErrors({});
        setServerError("");
        setShowPassword(false);
        setShowConfirm(false);
    }, [isLogin]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (!isLogin && formData.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 4) {
            newErrors.password = "Password must be at least 4 characters";
        }

        if (!isLogin && !formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            setLoading(true);

            const url = isLogin
                ? "http://localhost:3000/auth/login"
                : "http://localhost:3000/auth/signup";

            const body = isLogin
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.message || "Something went wrong. Please try again.");
                return;
            }

            if (isLogin) {
                localStorage.setItem("token", result.jwtToken);
                localStorage.setItem("name", result.name);
                localStorage.setItem("email", result.email);
                localStorage.setItem("role", result.role);
                window.location.href = result.role === 'admin' ? '/admin' : '/';
            } else {
                const signedUpEmail = formData.email;
                toggleAuth();
                // email carries over to login, everything else cleared by useEffect
                setFormData(prev => ({ ...prev, email: signedUpEmail }));
            }

        } catch (err) {
            setServerError("Unable to connect. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 4) return { label: "Too short", color: "#e63946", width: "20%" };
        if (pwd.length < 6) return { label: "Weak", color: "#c8956c", width: "40%" };
        if (pwd.length < 8) return { label: "Fair", color: "#8a7a6d", width: "60%" };
        if (pwd.length < 10) return { label: "Good", color: "#6b5d52", width: "80%" };
        return { label: "Strong", color: "#3a2e28", width: "100%" };
    };

    const strength = !isLogin ? passwordStrength(formData.password) : null;

    return (
        <section className="auth-page">
            <div className="auth-container">

                <div className="auth-brand">SkincareSync</div>

                <h1 className="auth-heading">
                    {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="auth-subtext">
                    {isLogin
                        ? "Sign in to continue your skincare journey."
                        : "Join SkincareSync and discover what your skin needs."}
                </p>

                {serverError && (
                    <div className="auth-server-error">
                        <FiAlertCircle />
                        <span>{serverError}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit} noValidate autoComplete="off">

                    {!isLogin && (
                        <div className="auth-field">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="off"
                                className={
                                    errors.name ? "input-error"
                                    : formData.name.length >= 3 ? "input-success"
                                    : ""
                                }
                            />
                            {errors.name
                                ? <p className="field-error"><FiAlertCircle /> {errors.name}</p>
                                : formData.name.length >= 3
                                ? <p className="field-ok"><FiCheck /> Looks good</p>
                                : null
                            }
                        </div>
                    )}

                    <div className="auth-field">
                        <label>Email address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            className={errors.email ? "input-error" : ""}
                        />
                        {errors.email && <p className="field-error"><FiAlertCircle /> {errors.email}</p>}
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder={isLogin ? "Enter your password" : "Create a password"}
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className={errors.password ? "input-error" : ""}
                            />
                            <button
                                type="button"
                                className="eye-btn"
                                onClick={() => setShowPassword(v => !v)}
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {errors.password && <p className="field-error"><FiAlertCircle /> {errors.password}</p>}
                        {!isLogin && strength && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div style={{ width: strength.width, background: strength.color }} />
                                </div>
                                <span style={{ color: strength.color }}>{strength.label}</span>
                            </div>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="auth-field">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    className={
                                        errors.confirmPassword ? "input-error"
                                        : formData.confirmPassword && formData.password === formData.confirmPassword ? "input-success"
                                        : ""
                                    }
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowConfirm(v => !v)}
                                    tabIndex={-1}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword
                                ? <p className="field-error"><FiAlertCircle /> {errors.confirmPassword}</p>
                                : formData.confirmPassword && formData.password === formData.confirmPassword
                                ? <p className="field-ok"><FiCheck /> Passwords match</p>
                                : null
                            }
                        </div>
                    )}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading
                            ? <span className="auth-spinner" />
                            : isLogin ? "Sign in" : "Create account"
                        }
                    </button>

                </form>

                <p className="auth-toggle">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={toggleAuth}>
                        {isLogin ? "Sign up" : "Sign in"}
                    </span>
                </p>

            </div>
        </section>
    );
}