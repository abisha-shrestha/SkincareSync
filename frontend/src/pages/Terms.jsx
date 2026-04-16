import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./InfoPages.css";

export default function Terms() {
    return (
        <>
            <Navbar />
            <div className="info-page">
                <div className="info-container">
                    <p className="label">Terms of Service</p>
                    <h1>Terms & Conditions</h1>
                    <p className="info-lead">
                        Please read these terms carefully before using SkincareSync.
                    </p>

                    <section>
                        <h2>Acceptance of Terms</h2>
                        <p>By accessing or using SkincareSync, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
                    </section>

                    <section>
                        <h2>User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use of your account.</p>
                    </section>

                    <section>
                        <h2>Orders & Payments</h2>
                        <p>All orders are subject to product availability. Prices are listed in Nepalese Rupees (NPR). Payments are processed through secure third-party providers.</p>
                    </section>

                    <section>
                        <h2>Shipping & Returns</h2>
                        <p>We aim to deliver within the estimated timeframe provided at checkout. If a product arrives damaged or incorrect, contact support within 48 hours of delivery.</p>
                    </section>

                    <section>
                        <h2>Limitation of Liability</h2>
                        <p>SkincareSync is not liable for any indirect or consequential damages arising from use of our platform. Skincare results may vary by individual.</p>
                    </section>

                    <section>
                        <h2>Changes to Terms</h2>
                        <p>We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}