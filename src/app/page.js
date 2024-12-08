'use client';
import Header from "./components/Header";
import Hero from "./components/Hero";
import FavoriteProductsCarousel from "./components/FavoriteProductsCarousel";
import BestProducts from "./components/BestProducts";
import ProductExtras from "./components/ProductExtras";
import ReviewSection from "./components/ReviewSection";
import InstagramSection from "./components/InstagramSection";
import Footer from "./components/Footer";
export default function HomePage() {
  return (
    <div>
      <Header cartCount={2} textColor={'text-white'} />
      <Hero />
      <FavoriteProductsCarousel />
      <BestProducts />
      <ProductExtras />
      <ReviewSection />
      <InstagramSection />
      <Footer />
    </div>
  );
}
