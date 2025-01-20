'use client';
import Header from "./components/header/Header";
import Hero from "./components/hero/Hero";
import FavoriteProductsCarousel from "./components/favoriteProductsCarousel/FavoriteProductsCarousel";
import BestProducts from "./components/BestProducts/BestProducts";
import ProductExtras from "./components/productExtras/ProductExtras";
import ReviewSection from "./components/reviewSection/ReviewSection";
import InstagramSection from "./components/instagramSection/InstagramSection";
import Footer from "./components/footer/Footer";

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
