import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./InfoPages.css";

export default function About() {
    return (
        <>
            <Navbar />
            <div className="info-page">
                <div className="info-container">
                    <p className="label">About Us</p>
                    <h1>Skincare that understands you</h1>
                    <p className="info-lead">
                        SkincareSync is a personalized skincare platform designed to simplify your journey to healthy skin.
                    </p>

                    <section>
                        <h2>Our Story</h2>
                        <p>Skincare shopping can feel overwhelming. With hundreds of products available online, finding what actually works for your skin is often confusing and frustrating.</p>
                        <p>SkincareSync was created to solve this problem — by combining technology with skincare knowledge to deliver recommendations tailored specifically to you.</p>
                    </section>

                    <section>
                        <h2>What We Do</h2>
                        <p>We analyze your skin type through a simple quiz and recommend products that match your needs. No more guesswork. No more wasted money.</p>
                        <p>From product discovery to checkout and tracking, everything is designed to be smooth, fast, and personalized.</p>
                    </section>

                    <section>
                        <h2>Built for Nepal</h2>
                        <p>SkincareSync is tailored for the Nepalese market with local payment integration, bilingual support, and a focus on accessibility.</p>
                    </section>

                    <section>
                        <h2>Our Vision</h2>
                        <p>To make skincare simple, personalized, and accessible for everyone — while supporting smarter beauty choices through technology.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}