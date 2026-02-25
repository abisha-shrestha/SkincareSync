import "../components/ProductGrid/ProductGrid.css";

const products = [
  {
    id: 1,
    name: "Hydrating Essence",
    price: 4000,
    category: "Hydration"
  },
  {
    id: 2,
    name: "Restorative Serum",
    price: 5200,
    category: "Repair"
  },
  {
    id: 3,
    name: "Night Recovery Cream",
    price: 7000,
    category: "Repair"
  },
  {
    id: 4,
    name: "Purifying Cleanser",
    price: 3500,
    category: "Cleanser"
  },
  {
    id: 5,
    name: "Balancing Toner",
    price: 3500,
    category: "Toner"
  },
  {
    id: 6,
    name: "Daily Glow Moisturizer",
    price: 4500,
    category: "Hydration"
  }
];

export default function Products() {
  return (
    <section className="products-page">
      
      <div className="products-header">
        <p className="label">Our Collection</p>
        <h1>Botanical Essentials</h1>
        <p className="products-subtext">
          Thoughtfully formulated skincare tailored to different skin profiles.
        </p>
      </div>

      <div className="products-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Hydration</button>
        <button className="filter-btn">Repair</button>
        <button className="filter-btn">Cleanser</button>
        <button className="filter-btn">Toner</button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
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

    </section>
  );
}
