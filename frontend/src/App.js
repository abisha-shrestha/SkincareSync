import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Products from "./pages/Products";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<div>Cart Page</div>} />
      <Route path="/wishlist" element={<div>Wishlist Page</div>} />
      <Route path="/profile" element={<div>Profile Page</div>} />
      <Route path="/search" element={<div>Search Page</div>} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  );
}

export default App;
