import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import BrandMessage from "../components/BrandMessage/BrandMessage";
import Story from "../components/Story/Story";
import CTA from "../components/CTA/CTA";
import Footer from "../components/Footer/Footer";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import "../components/ProductGrid/ProductGrid.css";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <BrandMessage />
            <section className="home-products">
                <div className="home-products-header">
                    <p className="home-products-subtext">
                        A selection of essentials loved by every skin type.
                    </p>
                </div>
                <ProductGrid limit={6} />
            </section>
            <Story />
            <CTA />
            <Footer />
        </>
    );
}