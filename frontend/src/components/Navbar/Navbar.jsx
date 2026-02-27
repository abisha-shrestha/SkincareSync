// import "./Navbar.css";
// import { Link } from "react-router-dom";
// import {
//   FiSearch,
//   FiShoppingCart,
//   FiHeart,
//   FiUser,
//   FiMenu
// } from "react-icons/fi";

// export default function Navbar({ onQuizOpen }) {
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
//           <button className="nav-quiz-btn" onClick={onQuizOpen}>
//             Quiz
//           </button>
//         </li>
//       </ul>

//       <div className="nav-right">
//         <Link to="/search"><FiSearch /></Link>
//         <Link to="/cart"><FiShoppingCart /></Link>
//         <Link to="/wishlist"><FiHeart /></Link>
//         <Link to="/profile"><FiUser /></Link>
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

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-left">
        SkincareSync
      </Link>

      <ul className="nav-center">
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/quiz">Quiz</Link>
        </li>
      </ul>

      <div className="nav-right">
        <Link to="/search"><FiSearch /></Link>
        <Link to="/cart"><FiShoppingCart /></Link>
        <Link to="/wishlist"><FiHeart /></Link>
        <Link to="/auth"><FiUser /></Link>
        <FiMenu className="menu-icon" />
      </div>
    </nav>
  );
}
