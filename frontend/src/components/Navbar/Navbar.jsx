// import "./Navbar.css";
// import { Link } from "react-router-dom";
// import {
//   FiSearch,
//   FiShoppingCart,
//   FiHeart,
//   FiUser,
//   FiMenu
// } from "react-icons/fi";
// import { useState, useEffect } from "react";  // ADD for cart count


// export default function Navbar() {
//   const [cartCount, setCartCount] = useState(0);  // ADD cart counter
//   const userEmail = localStorage.getItem('email') || 'guest';


//   // ADD: Fetch cart count
//   useEffect(() => {
//   const updateCartCount = () => {
//     fetch(`http://localhost:3000/api/cart?userEmail=${userEmail}`)
//       .then(res => res.json())
//       .then(data => {
//         const totalItems = data.cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
//         setCartCount(totalItems);
//       })
//       .catch(() => setCartCount(0));
//   };


//   updateCartCount();  // Initial load
//   const interval = setInterval(updateCartCount, 1000);  // Update every 2s

//   return () => clearInterval(interval);  // Cleanup
// }, [userEmail]);



//   return (
//     <nav className="navbar">
//       <Link to="/" className="nav-left">
//         SkincareSync
//       </Link>


//       <ul className="nav-center">
//         <li>
//           <Link to="/products">Products</Link>
//         </li>
//         <li>
//           <Link to="/quiz">Quiz</Link>
//         </li>
//       </ul>


//       <div className="nav-right">
//         <Link to="/search"><FiSearch /></Link>
      
//         {/* Cart with counter */}
//         <Link to="/cart" className="cart-link">
//           <FiShoppingCart />
//           {cartCount > 0 && (
//             <span className="cart-badge">{cartCount}</span>
//           )}
//         </Link>
      
//         <Link to="/wishlist"><FiHeart /></Link>
//         <Link to="/auth"><FiUser /></Link>
//         <FiMenu className="menu-icon" />
//       </div>
//     </nav>
//   );
// }


import "./Navbar.css";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu
} from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const userEmail = localStorage.getItem('email') || 'guest';

  useEffect(() => {
    const updateCounts = () => {
      // Cart count
      fetch(`http://localhost:3000/api/cart?userEmail=${userEmail}`)
        .then(res => res.json())
        .then(data => {
          const total = data.cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
          setCartCount(total);
        })
        .catch(() => setCartCount(0));

      // Wishlist count
      fetch(`http://localhost:3000/api/wishlist?userEmail=${userEmail}`)
        .then(res => res.json())
        .then(data => {
          setWishlistCount(data.wishlist?.items?.length || 0);
        })
        .catch(() => setWishlistCount(0));
    };

    updateCounts();
    const interval = setInterval(updateCounts, 1000);
    return () => clearInterval(interval);
  }, [userEmail]);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-left">
        SkincareSync
      </Link>

      <ul className="nav-center">
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/quiz">Quiz</Link></li>
      </ul>

      <div className="nav-right">
        <Link to="/search"><FiSearch /></Link>

        <Link to="/cart" className="cart-link">
          <FiShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <Link to="/wishlist" className="cart-link">
          <FiHeart />
          {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
        </Link>

        <Link to="/auth"><FiUser /></Link>
        <FiMenu className="menu-icon" />
      </div>
    </nav>
  );
}