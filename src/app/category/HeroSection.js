'use client';

export default function HeroSection() {
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
      <img
        src="https://mahetsipage.web.app/assets/images/instagram/NaranjaAvenaAloe0.jpeg" // Cambia esta URL por tu imagen
        alt="Outdoor adventure"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="max-w-2xl text-left text-white px-4">
          <nav className="text-sm mb-2">
            <span>Home</span> / <span>Activities</span> / <span>Clothing</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Latest Arrivals (121)</h1>
          <p className="text-sm sm:text-base leading-relaxed">
            Move, stretch, jump and hike in our latest waterproof arrivals. We've got you covered
            for your hike or climbing sessions, from Goretex jackets to lightweight waterproof
            pants. Discover our latest range of outdoor clothing.
          </p>
        </div>
      </div>
    </div>
  );
}
