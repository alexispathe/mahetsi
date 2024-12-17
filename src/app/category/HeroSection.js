'use client';

import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
      <Image
        src="https://mahetsipage.web.app/assets/images/instagram/NaranjaAvenaAloe0.jpeg"
        alt="Outdoor adventure"
        layout="fill" // Utiliza "fill" para cubrir el contenedor
        objectFit="cover" // Asegura que la imagen cubra todo el contenedor
        className="w-full h-full" // Clases de Tailwind para asegurar que la imagen ocupe todo el contenedor
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center pl-10">
        <div className="max-w-2xl text-left text-white px-4">
          <nav className="text-xs sm:text-sm mb-2">
            <span>Home</span> / <span>Activities</span> / <span>Clothing</span>
          </nav>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Latest Arrivals (121)</h1>
          <p className="text-xs sm:text-sm md:text-base leading-relaxed">
            Move, stretch, jump and hike in our latest waterproof arrivals. Weve got you covered
            for your hike or climbing sessions, from Goretex jackets to lightweight waterproof
            pants. Discover our latest range of outdoor clothing.
          </p>
        </div>
      </div>
    </div>
  );
}
