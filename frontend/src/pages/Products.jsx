import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import "../components/ProductGrid/ProductGrid.css";

export default function Products() {
  return (
    <>
      <Navbar />

      <section className="products-page">
        <div className="products-header">
          <p className="label">Our Collection</p>
          <h1>Your Skin, Your Essentials</h1>
          <p className="products-subtext">
            Thoughtfully formulated skincare tailored to different skin profiles.
          </p>
        </div>

        <ProductGrid />
      </section>

      <Footer />
    </>
  );
}