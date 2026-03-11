import { useState } from "react";
import { useNavigate } from "react-router-dom";  // ADD THIS
import "./ProductGrid.css";

export default function ProductGrid({ limit }) {
  const navigate = useNavigate();  // ADD THIS

  const allProducts = [
    { id: 1, name: "Hydrating Essence", price: 4000, category: "Hydration" },
    { id: 2, name: "Restorative Serum", price: 5200, category: "Repair" },
    { id: 3, name: "Night Recovery Cream", price: 7000, category: "Repair" },
    { id: 4, name: "Purifying Cleanser", price: 3500, category: "Cleanser" },
    { id: 5, name: "Balancing Toner", price: 3500, category: "Toner" },
    { id: 6, name: "Daily Glow Moisturizer", price: 4500, category: "Hydration" }
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((product) => product.category === activeCategory);

  const displayedProducts = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  // ADD THIS FUNCTION
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      {!limit && (
        <div className="products-filters">
          {["All", "Hydration", "Repair", "Cleanser", "Toner"].map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="products-grid">
        {displayedProducts.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product.id)} // ADD THIS
            style={{ cursor: 'pointer' }} // ADD THIS
          >
            <div className="product-image" />
            <h3>{product.name}</h3>
            <p className="product-price">
              Rs. {product.price.toLocaleString()}
            </p>
            <button className="btn btn-soft">
              View Details
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
