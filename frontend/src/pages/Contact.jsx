import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import toast from "react-hot-toast";
import "./InfoPages.css";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        else if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";

        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email address";

        if (!form.message.trim()) newErrors.message = "Message is required";
        else if (form.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";

        return newErrors;
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setSending(true);
        try {
            const res = await fetch("http://localhost:3000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Message sent! We'll get back to you soon.");
                setForm({ name: "", email: "", message: "" });
            } else {
                toast.error(data.message || "Failed to send message");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="info-page">
                <div className="info-container">
                    <p className="label">Contact</p>
                    <h1>We're here to help</h1>
                    <p className="info-lead">
                        Have questions, feedback, or need support? Reach out to us anytime.
                    </p>

                    <div className="contact-grid">
                        <div>
                            <h2>Email</h2>
                            <p>skincaresync111@gmail.com</p>
                        </div>
                        <div>
                            <h2>Location</h2>
                            <p>Pokhara, Nepal</p>
                        </div>
                        <div>
                            <h2>Support Hours</h2>
                            <p>Sunday – Friday<br />9:00 AM – 6:00 PM</p>
                        </div>
                    </div>

                    <section className="contact-form-section">
                        <h2>Send a Message</h2>
                        <form className="contact-form" onSubmit={handleSubmit} noValidate>

                            <div className="contact-field">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className={errors.name ? "input-error" : ""}
                                />
                                {errors.name && <p className="contact-error">{errors.name}</p>}
                            </div>

                            <div className="contact-field">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={errors.email ? "input-error" : ""}
                                />
                                {errors.email && <p className="contact-error">{errors.email}</p>}
                            </div>

                            <div className="contact-field">
                                <textarea
                                    name="message"
                                    placeholder="Your Message"
                                    rows="5"
                                    value={form.message}
                                    onChange={handleChange}
                                    className={errors.message ? "input-error" : ""}
                                />
                                {errors.message && <p className="contact-error">{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-cta"
                                disabled={sending}
                            >
                                {sending ? "Sending..." : "Send Message"}
                            </button>

                        </form>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}