import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import "../components/ProductGrid/ProductGrid.css";

const BANNERS = [
    {text: "Free delivery on orders above", highlight: "Rs. 4,500" },
    {text: "New arrivals added every week -", highlight: "Shop fresh picks" },
    {text: "Take the quiz and find your", highlight: "perfect routine" },
    {text: "Clean ingredients, real results -", highlight: "Honest skincare only" }
];

export default function Products() {
    const location = useLocation();
    const [skinType, setSkinType] = useState(null);
    const [skinTypeActive, setSkinTypeActive] = useState(false);
    const [bannerIndex, setBannerIndex] = useState(0);
    const userEmail = localStorage.getItem('email');
    const [scrollReady, setScrollReady] = useState(false);
    

    // Rotate banners every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex(i => (i + 1) % BANNERS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const savedScroll = sessionStorage.getItem('productsScrollY');
        if (savedScroll) {
            setTimeout(() => {
                window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
                sessionStorage.removeItem('productsScrollY');
                setScrollReady(true); 
            }, 150);
        } else {
            setScrollReady(true); 
        }
    }, []);

    useEffect(() => {
        const loadSkinType = async () => {
            if (location.state?.skinType) {
                setSkinType(location.state.skinType);
                setSkinTypeActive(true);
                return;
            }
            if (userEmail) {
                try {
                    const res = await fetch(`http://localhost:3000/api/profile/skin-type?userEmail=${userEmail}`);
                    const data = await res.json();
                    if (data.success && data.skinType) {
                        setSkinType(data.skinType);
                        setSkinTypeActive(true);
                    }
                } catch (err) { console.error(err); }
            } else {
                const session = sessionStorage.getItem('skinType');
                if (session) { setSkinType(session); setSkinTypeActive(true); }
            }
        };
        loadSkinType();
    }, []);

    const skinTypeLabels = {
        dry: 'Dry Skin', oily: 'Oily Skin', combination: 'Combination Skin',
        normal: 'Normal Skin', sensitive: 'Sensitive Skin'
    };

    const banner = BANNERS[bannerIndex];

    return (
        <>
            <Navbar />

            {/* Promotional banner */}
            <div className="promo-banner">
                <span className="promo-banner-inner">
                    <span className="promo-emoji">{banner.emoji}</span>
                    {banner.text} <strong>{banner.highlight}</strong>
                </span>
            </div>

            <section className="products-page" style={{ opacity: scrollReady ? 1 : 0, transition: 'opacity 0.15s ease' }}>
                <div className="products-header">
                    <p className="label">Our Collection</p>
                    <h1>Your Skin, Your Essentials</h1>
                    <p className="products-subtext">
                        Thoughtfully formulated skincare tailored to different skin profiles.
                    </p>
                </div>

                {skinType && (
                    <div className={`skin-type-banner ${skinTypeActive ? 'active' : 'inactive'}`}>
                        {skinTypeActive ? (
                            <>
                                <span className="skin-type-banner-text">
                                    Showing products for your skin type:
                                    <strong> {skinTypeLabels[skinType]}</strong>
                                </span>
                                <button className="skin-type-clear-btn" onClick={() => setSkinTypeActive(false)}>
                                    Show all products
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="skin-type-banner-text">Showing all products</span>
                                <button className="skin-type-clear-btn" onClick={() => setSkinTypeActive(true)}>
                                    Filter for {skinTypeLabels[skinType]}
                                </button>
                            </>
                        )}
                    </div>
                )}

                <ProductGrid skinTypeFilter={skinTypeActive ? skinType : null} />
            </section>
            <Footer />
        </>
    );
}