'use client';
import '../styles/heroSection.css';
export default function HeroSection() {
  return (
    <div className="hero-section">
      <img
        src="https://mahetsipage.web.app/assets/images/instagram/NaranjaAvenaAloe0.jpeg" // Cambia esta URL por tu imagen
        alt="Outdoor adventure"
        className="hero-image"
      />
      <div className="hero-overlay">
        <div className="hero-content">
          <nav className="breadcrumb">
            <span>Home</span> / <span>Activities</span> / <span>Clothing</span>
          </nav>
          <h1 className="hero-title">Latest Arrivals (121)</h1>
          <p className="hero-description">
            Move, stretch, jump and hike in our latest waterproof arrivals. We've got you covered
            for your hike or climbing sessions, from Goretex jackets to lightweight waterproof
            pants. Discover our latest range of outdoor clothing.
          </p>
        </div>
      </div>
    </div>
  );
}
