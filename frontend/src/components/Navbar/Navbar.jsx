import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeContext";

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const userEmail = localStorage.getItem('email') || 'guest';
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateCounts = () => {
            fetch(`http://localhost:3000/api/cart?userEmail=${userEmail}`)
                .then(res => res.json())
                .then(data => {
                    const total = data.cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                    setCartCount(total);
                })
                .catch(() => setCartCount(0));

            fetch(`http://localhost:3000/api/wishlist?userEmail=${userEmail}`)
                .then(res => res.json())
                .then(data => setWishlistCount(data.wishlist?.items?.length || 0))
                .catch(() => setWishlistCount(0));
        };

        updateCounts();
        const interval = setInterval(updateCounts, 3000);
        return () => clearInterval(interval);
    }, [userEmail]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-inner">

                <Link to="/" className="nav-brand">SkincareSync</Link>

                <ul className="nav-links">
                    <li><Link to="/products" className={isActive('/products') ? 'active' : ''}>Products</Link></li>
                    <li><Link to="/quiz" className={isActive('/quiz') ? 'active' : ''}>Quiz</Link></li>
                    <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link></li>
                    <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
                    <li><Link to="/faq" className={isActive('/faq') ? 'active' : ''}>FAQ</Link></li>
                    <li><Link to="/shipping" className={isActive('/shipping') ? 'active' : ''}>Shipping</Link></li>
                </ul>

                <div className="nav-icons">
                    <Link to="/search" className="nav-icon-btn"><FiSearch /></Link>

                    <Link to="/cart" className="nav-icon-btn nav-icon-badge">
                        <FiShoppingCart />
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </Link>

                    <Link to="/wishlist" className="nav-icon-btn nav-icon-badge">
                        <FiHeart />
                        {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                    </Link>

                    <Link to="/profile" className="nav-icon-btn">
                        <FiUser />
                    </Link>

                    <button onClick={toggleTheme} className="nav-icon-btn">
                        {theme === "light" ? <FiMoon /> : <FiSun />}
                    </button>
                </div>

            </div>
        </nav>
    );
}