// // import "./Footer.css";

// // export default function Footer() {
// //   return (
// //     <footer className="footer">
// //       <div>
// //         <h3>SkincareSync</h3>
// //         <p>Natural skincare essentials.</p>
// //       </div>
// //       <div>
// //         <p>Shop</p>
// //         <p>Products</p>
// //         <p>Best Sellers</p>
// //       </div>
// //       <div>
// //         <p>Company</p>
// //         <p>About</p>
// //         <p>Contact</p>
// //       </div>
// //     </footer>
// //   );
// // }



// import "./Footer.css";
// import { Link } from "react-router-dom";
// import { FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

// export default function Footer() {
//     return (
//         <footer className="footer">
//             <div className="footer-inner">

//                 {/* TOP */}
//                 <div className="footer-top">
//                     <div className="footer-brand-col">
//                         <Link to="/" className="footer-brand">SkincareSync</Link>
//                         <p className="footer-tagline">
//                             Personalized skincare for every skin type.<br />
//                             Crafted for Nepal, made for you.
//                         </p>
//                         <div className="footer-socials">
//                             <a href="#" aria-label="Instagram"><FiInstagram /></a>
//                             <a href="#" aria-label="Twitter"><FiTwitter /></a>
//                             <a href="#" aria-label="Facebook"><FiFacebook /></a>
//                         </div>
//                     </div>

//                     <div className="footer-links-grid">
//                         <div className="footer-col">
//                             <p className="footer-col-title">Shop</p>
//                             <ul>
//                                 <li><Link to="/products">All Products</Link></li>
//                                 <li><Link to="/products">Hydration</Link></li>
//                                 <li><Link to="/products">Repair</Link></li>
//                                 <li><Link to="/products">Cleansers</Link></li>
//                             </ul>
//                         </div>
//                         <div className="footer-col">
//                             <p className="footer-col-title">Discover</p>
//                             <ul>
//                                 <li><Link to="/quiz">Skin Quiz</Link></li>
//                                 <li><Link to="/products">Best Sellers</Link></li>
//                                 <li><Link to="/">New Arrivals</Link></li>
//                             </ul>
//                         </div>
//                         <div className="footer-col">
//                             <p className="footer-col-title">Account</p>
//                             <ul>
//                                 <li><Link to="/profile">My Profile</Link></li>
//                                 <li><Link to="/orders">My Orders</Link></li>
//                                 <li><Link to="/wishlist">Wishlist</Link></li>
//                                 <li><Link to="/auth">Login / Sign Up</Link></li>
//                             </ul>
//                         </div>
//                         <div className="footer-col">
//                             <p className="footer-col-title">Company</p>
//                             <ul>
//                                 <li><a href="#">About Us</a></li>
//                                 <li><a href="#">Contact</a></li>
//                                 <li><a href="#">Privacy Policy</a></li>
//                                 <li><a href="#">Terms of Service</a></li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>

//                 {/* DIVIDER */}
//                 <div className="footer-divider" />

//                 {/* BOTTOM */}
//                 <div className="footer-bottom">
//                     <p>© 2026 SkincareSync. All rights reserved.</p>
//                     <p>Crafted with care | Pokhara, Nepal</p>
//                 </div>

//             </div>
//         </footer>
//     );
// }



import "./Footer.css";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">

                <div className="footer-top">

                    <div className="footer-brand-col">
                        <Link to="/" className="footer-brand">SkincareSync</Link>

                        <p className="footer-tagline">
                            Personalized skincare for every skin type.<br />
                            Crafted for Nepal, made for you.
                        </p>

                        <div className="footer-socials">
                            <a href="#"><FiInstagram /></a>
                            <a href="#"><FiTwitter /></a>
                            <a href="#"><FiFacebook /></a>
                        </div>
                    </div>

                    <div className="footer-links-grid">

                        <div className="footer-col">
                            <p className="footer-col-title">Shop</p>
                            <ul>
                                <li><Link to="/products">All Products</Link></li>
                                <li><Link to="/products">Hydration</Link></li>
                                <li><Link to="/products">Repair</Link></li>
                                <li><Link to="/products">Cleansers</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <p className="footer-col-title">Discover</p>
                            <ul>
                                <li><Link to="/quiz">Skin Quiz</Link></li>
                                <li><Link to="/products">Best Sellers</Link></li>
                                <li><Link to="/">New Arrivals</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <p className="footer-col-title">Account</p>
                            <ul>
                                <li><Link to="/profile">My Profile</Link></li>
                                <li><Link to="/orders">My Orders</Link></li>
                                <li><Link to="/wishlist">Wishlist</Link></li>
                                <li><Link to="/auth">Login / Sign Up</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <p className="footer-col-title">Company</p>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Terms of Service</Link></li>
                            </ul>
                        </div>

                    </div>
                </div>

                <div className="footer-divider" />

                <div className="footer-bottom">
                    <p>© 2026 SkincareSync. All rights reserved.</p>
                    <p>Crafted with care | Pokhara, Nepal</p>
                </div>

            </div>
        </footer>
    );
}