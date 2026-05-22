import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import "../components/ProductGrid/ProductGrid.css";

const BANNERS = [
    { text: "Free delivery on orders above", highlight: "Rs. 4,500" },
    { text: "New arrivals added every week -", highlight: "Shop fresh picks" },
    { text: "Take the quiz and find your", highlight: "perfect routine" },
    { text: "Clean ingredients, real results -", highlight: "Honest skincare only" }
];

export default function Products() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [skinType, setSkinType] = useState(null);
    const [bannerIndex, setBannerIndex] = useState(0);
    const userEmail = localStorage.getItem('email');
    const [scrollReady, setScrollReady] = useState(false);


    const skinFilterParam = searchParams.get('skinFilter');
    const skinTypeActive = skinFilterParam === '1';

    // Helper: update just the skinFilter param without touching other params
    const setSkinTypeActive = (active) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('skinFilter', active ? '1' : '0');
            return next;
        }, { replace: true });
    };

    // Rotate banners every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex(i => (i + 1) % BANNERS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Restore scroll position when coming back from product detail
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
            // Case 1: came from Quiz
            if (location.state?.skinType) {
                setSkinType(location.state.skinType);
                setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.set('skinFilter', '1');
                    return next;
                }, { replace: true });
                return;
            }


            if (skinFilterParam !== null) {
                if (userEmail) {
                    try {
                        const res = await fetch(`http://localhost:3000/api/profile/skin-type?userEmail=${userEmail}`);
                        const data = await res.json();
                        if (data.success && data.skinType) setSkinType(data.skinType);
                    } catch (err) { console.error(err); }
                } else {
                    const session = sessionStorage.getItem('skinType');
                    if (session) setSkinType(session);
                }
                return;
            }

            if (userEmail) {
                try {
                    const res = await fetch(`http://localhost:3000/api/profile/skin-type?userEmail=${userEmail}`);
                    const data = await res.json();
                    if (data.success && data.skinType) {
                        setSkinType(data.skinType);
                        setSearchParams(prev => {
                            const next = new URLSearchParams(prev);
                            next.set('skinFilter', '1');
                            return next;
                        }, { replace: true });
                    }
                } catch (err) { console.error(err); }
            } else {
                const session = sessionStorage.getItem('skinType');
                if (session) {
                    setSkinType(session);
                    setSearchParams(prev => {
                        const next = new URLSearchParams(prev);
                        next.set('skinFilter', '1');
                        return next;
                    }, { replace: true });
                }
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