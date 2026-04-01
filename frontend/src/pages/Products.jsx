import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import "../components/ProductGrid/ProductGrid.css";

export default function Products() {
    const location = useLocation();
    const [skinType, setSkinType] = useState(null);
    const [skinTypeActive, setSkinTypeActive] = useState(false);
    const userEmail = localStorage.getItem('email');

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
                } catch (err) {
                    console.error(err);
                }
            } else {
                const session = sessionStorage.getItem('skinType');
                if (session) {
                    setSkinType(session);
                    setSkinTypeActive(true);
                }
            }
        };
        loadSkinType();
    }, []);

    const skinTypeLabels = {
        dry: 'Dry Skin',
        oily: 'Oily Skin',
        combination: 'Combination Skin',
        normal: 'Normal Skin',
        sensitive: 'Sensitive Skin'
    };

    const handleClearSkinType = () => setSkinTypeActive(false);
    const handleRestoreSkinType = () => { if (skinType) setSkinTypeActive(true); };

    return (
        <>
            <Navbar />
            <section className="products-page">
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
                                <button className="skin-type-clear-btn" onClick={handleClearSkinType}>
                                    Show all products
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="skin-type-banner-text">
                                    Showing all products
                                </span>
                                <button className="skin-type-clear-btn" onClick={handleRestoreSkinType}>
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