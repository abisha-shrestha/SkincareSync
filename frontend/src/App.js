import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail"; // ADD THIS
import Auth from "./pages/Auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} /> 
      <Route path="/cart" element={<div>Cart Page</div>} />
      <Route path="/wishlist" element={<div>Wishlist Page</div>} />
      <Route path="/profile" element={<div>Profile Page</div>} />
      <Route path="/search" element={<div>Search Page</div>} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
