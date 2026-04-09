import { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheck } from "react-icons/fi";
import "./Auth.css";

export default function AuthForm({ isLogin, toggleAuth }) {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Forgot password state
    const [forgotMode, setForgotMode] = useState(false); 
    const [forgotStep, setForgotStep] = useState('email');
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');

    useEffect(() => {
        setFormData(prev => ({ name: "", email: prev.email, password: "", confirmPassword: "" }));
        setErrors({});
        setServerError("");
        setShowPassword(false);
        setShowConfirm(false);
        setForgotMode(false);
        setForgotStep('email');
        setForgotError('');
        setForgotSuccess('');
    }, [isLogin]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!isLogin && !formData.name.trim()) newErrors.name = "Full name is required";
        else if (!isLogin && formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email address";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 4) newErrors.password = "Password must be at least 4 characters";
        if (!isLogin && !formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
        else if (!isLogin && formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setErrors({});
        try {
            setLoading(true);
            const url = isLogin ? "http://localhost:3000/auth/login" : "http://localhost:3000/auth/signup";
            const body = isLogin
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const result = await response.json();
            if (!response.ok) { setServerError(result.message || "Something went wrong."); return; }
            if (isLogin) {
                localStorage.setItem("token", result.jwtToken);
                localStorage.setItem("name", result.name);
                localStorage.setItem("email", result.email);
                localStorage.setItem("role", result.role);
                const sessionSkinType = sessionStorage.getItem('skinType');
                if (sessionSkinType) {
                    fetch('http://localhost:3000/api/profile/skin-type', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userEmail: result.email, skinType: sessionSkinType })
                    }).then(() => sessionStorage.removeItem('skinType'));
                }
                window.location.href = result.role === 'admin' ? '/admin' : '/';
            } else {
                const signedUpEmail = formData.email;
                toggleAuth();
                setFormData(prev => ({ ...prev, email: signedUpEmail }));
            }
        } catch (err) {
            setServerError("Unable to connect. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        setForgotError('');
        if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
            setForgotError('Enter a valid email address');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await res.json();
            if (data.success) {
                setForgotStep('otp');
            } else {
                setForgotError(data.message);
            }
        } catch {
            setForgotError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setForgotError('');
        if (!otp.trim()) { setForgotError('Enter the OTP'); return; }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, otp })
            });
            const data = await res.json();
            if (data.success) {
                setForgotStep('reset');
            } else {
                setForgotError(data.message);
            }
        } catch {
            setForgotError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setForgotError('');
        if (!newPassword || newPassword.length < 4) { setForgotError('Password must be at least 4 characters'); return; }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, otp, newPassword })
            });
            const data = await res.json();
            if (data.success) {
                setForgotSuccess('Password reset successfully. You can now sign in.');
                setForgotStep('done');
            } else {
                setForgotError(data.message);
            }
        } catch {
            setForgotError('Something went wrong.');
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

    // FORGOT PASSWORD SCREENS
    if (forgotMode) {
        return (
            <section className="auth-page">
                <div className="auth-container">
                    <div className="auth-brand">SkincareSync</div>

                    {forgotStep === 'email' && (
                        <>
                            <h1 className="auth-heading">Forgot password</h1>
                            <p className="auth-subtext">Enter your email and we'll send you an OTP.</p>
                            {forgotError && <div className="auth-server-error"><FiAlertCircle /><span>{forgotError}</span></div>}
                            <div className="auth-form">
                                <div className="auth-field">
                                    <label>Email address</label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={forgotEmail}
                                        onChange={e => setForgotEmail(e.target.value)}
                                    />
                                </div>
                                <button className="auth-submit-btn" onClick={handleSendOtp} disabled={loading}>
                                    {loading ? <span className="auth-spinner" /> : 'Send OTP'}
                                </button>
                            </div>
                        </>
                    )}

                    {forgotStep === 'otp' && (
                        <>
                            <h1 className="auth-heading">Enter OTP</h1>
                            <p className="auth-subtext">We sent a 6-digit code to {forgotEmail}.</p>
                            {forgotError && <div className="auth-server-error"><FiAlertCircle /><span>{forgotError}</span></div>}
                            <div className="auth-form">
                                <div className="auth-field">
                                    <label>OTP</label>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        maxLength={6}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                                <button className="auth-submit-btn" onClick={handleVerifyOtp} disabled={loading}>
                                    {loading ? <span className="auth-spinner" /> : 'Verify OTP'}
                                </button>
                                <p className="auth-toggle">
                                    Didn't receive it? <span onClick={handleSendOtp}>Resend</span>
                                </p>
                            </div>
                        </>
                    )}

                    {forgotStep === 'reset' && (
                        <>
                            <h1 className="auth-heading">New password</h1>
                            <p className="auth-subtext">Set a new password for your account.</p>
                            {forgotError && <div className="auth-server-error"><FiAlertCircle /><span>{forgotError}</span></div>}
                            <div className="auth-form">
                                <div className="auth-field">
                                    <label>New Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="At least 4 characters"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            autoComplete="off"
                                        />
                                        <button type="button" className="eye-btn" onClick={() => setShowNewPassword(v => !v)} tabIndex={-1}>
                                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>
                                <button className="auth-submit-btn" onClick={handleResetPassword} disabled={loading}>
                                    {loading ? <span className="auth-spinner" /> : 'Reset Password'}
                                </button>
                            </div>
                        </>
                    )}

                    {forgotStep === 'done' && (
                        <>
                            <h1 className="auth-heading">All done!</h1>
                            {forgotSuccess && <p className="field-ok" style={{ marginBottom: '20px' }}><FiCheck /> {forgotSuccess}</p>}
                        </>
                    )}

                    <p className="auth-toggle">
                        <span onClick={() => { setForgotMode(false); setForgotStep('email'); setForgotError(''); setForgotSuccess(''); }}>
                            Back to sign in
                        </span>
                    </p>
                </div>
            </section>
        );
    }

    // MAIN AUTH FORM
    return (
        <section className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">SkincareSync</div>
                <h1 className="auth-heading">
                    {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="auth-subtext">
                    {isLogin ? "Sign in to continue your skincare journey." : "Join SkincareSync and discover what your skin needs."}
                </p>

                {serverError && (
                    <div className="auth-server-error">
                        <FiAlertCircle /><span>{serverError}</span>
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
                                className={errors.name ? "input-error" : formData.name.length >= 3 ? "input-success" : ""}
                            />
                            {errors.name
                                ? <p className="field-error"><FiAlertCircle /> {errors.name}</p>
                                : formData.name.length >= 3 ? <p className="field-ok"><FiCheck /> Looks good</p>
                                : null}
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
                                autoComplete="off"
                                className={errors.password ? "input-error" : ""}
                            />
                            <button type="button" className="eye-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
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
                        {isLogin && (
                            <div style={{ marginTop: '8px', textAlign: 'right' }}>
                                <span
                                    className="auth-forgot"
                                    onClick={() => { setForgotMode(true); setForgotEmail(formData.email); }}
                                >
                                    Forgot password?
                                </span>
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
                                    autoComplete="off"
                                    className={errors.confirmPassword ? "input-error" : formData.confirmPassword && formData.password === formData.confirmPassword ? "input-success" : ""}
                                />
                                <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword
                                ? <p className="field-error"><FiAlertCircle /> {errors.confirmPassword}</p>
                                : formData.confirmPassword && formData.password === formData.confirmPassword
                                ? <p className="field-ok"><FiCheck /> Passwords match</p>
                                : null}
                        </div>
                    )}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? <span className="auth-spinner" /> : isLogin ? "Sign in" : "Create account"}
                    </button>
                </form>

                <p className="auth-toggle">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={toggleAuth}>{isLogin ? "Sign up" : "Sign in"}</span>
                </p>
            </div>
        </section>
    );
}