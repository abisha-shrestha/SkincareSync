import "./ProductGrid.css";

export default function ProductGrid() {
  return (
    <section className="products">
      <h2>Botanical Essentials</h2>

      <div className="grid">
        <div className="card">Hydrating Essence<br/>Rs. 4,000</div>
        <div className="card">Restorative Serum<br/>Rs. 5,200</div>
        <div className="card empty"></div>
        <div className="card">Night Recovery<br/>Rs. 7,000</div>
        <div className="card">Purifying Cleanser<br/>Rs. 3,500</div>
        <div className="card">Balancing Toner<br/>Rs. 3,500</div>
      </div>

      <button className="view-all">View All Products</button>
    </section>
  );
}
