
// import Navbar from "../components/Navbar/Navbar";
// import Hero from "../components/Hero/Hero";
// import BrandMessage from "../components/BrandMessage/BrandMessage";
// import Story from "../components/Story/Story";
// import CTA from "../components/CTA/CTA";
// import Footer from "../components/Footer/Footer";

// export default function Home() {
//   return (
//     <>
//       <Navbar />
//       <Hero />
//       <BrandMessage />
//       <Story />
//       <CTA />
//       <Footer />
//     </>
//   );
// }

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import BrandMessage from "../components/BrandMessage/BrandMessage";
import Story from "../components/Story/Story";
import CTA from "../components/CTA/CTA";
import Footer from "../components/Footer/Footer";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import "../components/ProductGrid/ProductGrid.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BrandMessage />
      <section className="home-products">
        <div className="home-products-header">
          <p
      style={{
        maxWidth: "620px",
        margin: "0 auto 50px",
        fontSize: "1.05rem",
        lineHeight: "1.7",
        color: "#6b5d52",
        textAlign: "center",
        fontWeight: 400,
        letterSpacing: "0.3px"
      }}
    >
      A selection of essentials loved by every skin type.
    </p>
        </div>

        <ProductGrid limit={6} />
      </section>
      {/* <ProductGrid limit={3} /> */}
      <Story />
      <CTA />
      <Footer />
    </>
  );
}
