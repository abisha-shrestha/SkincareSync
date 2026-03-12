import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail"; // ADD THIS
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";  // ADD
import Wishlist from "./pages/Wishlist";  // ADD




function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} /> 
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/profile" element={<div>Profile Page</div>} />
      <Route path="/search" element={<div>Search Page</div>} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/auth" element={<Auth />} />
      {/* <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} /> */}
    </Routes>
  );
}

export default App;
