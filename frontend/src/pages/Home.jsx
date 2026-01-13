import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import BrandMessage from "../components/BrandMessage/BrandMessage";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import Story from "../components/Story/Story";
import Footer from "../components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BrandMessage />
      <ProductGrid />
      <Story />
      <Footer />
    </>
  );
}
