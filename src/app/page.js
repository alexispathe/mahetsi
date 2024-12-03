'use client';
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCarousel from "./components/ProductCarousel";
import ProductSection from "./components/ProductSection";
import ProductExtras from "./components/ProductExtras";
import ReviewSection from "./components/ReviewSection";
import InstagramSection from "./components/InstagramSection";
import Footer from "./components/Footer";
import './styles/home.css'
export default function HomePage() {
  return (
    <div>
      <Header cartCount={2} />
      <Hero />
      <ProductCarousel />
      <ProductSection />
      <ProductExtras />
      <ReviewSection />
      <InstagramSection />
      <Footer />
    </div>
  );
}
