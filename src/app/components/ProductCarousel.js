'use client';

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/a11y";
// Importa Tailwind CSS en tu archivo global o en el componente
import '../styles/ProductCarousel.css'; // Mantén solo si es necesario

export default function ProductCarousel() {
  const swiperRef = useRef(null);

  const products = [
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Jabón Manzana Canela",
      rating: 4.8,
      reviews: 189,
      price: "$100.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Bálsamo Lavanda Betabel",
      rating: 4.5,
      reviews: 1567,
      price: "$115.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Bálsamo Patitas y Nariz",
      rating: 4.5,
      reviews: 1567,
      price: "$120.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Shampoo Sólido Lavanda Aloe",
      rating: 4.5,
      reviews: 1567,
      price: "$150.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Jabón Natural de Menta",
      rating: 4.7,
      reviews: 200,
      price: "$90.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Jabón",
      rating: 4.7,
      reviews: 200,
      price: "$90.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Natural de Menta",
      rating: 4.7,
      reviews: 200,
      price: "$90.00"
    }
  ];

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.navigation) {
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4 text-center">Nuestros Productos</h2>
        <p className="mb-8 text-center text-gray-600">
          Consiente tu piel con productos naturales y con increíbles beneficios
        </p>

        {/* Carrusel de productos con Swiper */}
        <div className="relative">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, A11y]}
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            navigation={{
              prevEl: ".custom-swiper-button-prev",
              nextEl: ".custom-swiper-button-next",
            }}
            breakpoints={{
              1280: { // Pantallas grandes
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 2,
              },
              640: {
                slidesPerView: 1,
              },
              200: {
                slidesPerView: 1,
              },
            }}
            a11y={{
              prevSlideMessage: 'Slide anterior',
              nextSlideMessage: 'Slide siguiente',
              firstSlideMessage: 'Este es el primer slide',
              lastSlideMessage: 'Este es el último slide',
            }}
            className="product-swiper"
          >
            {products.map((product, index) => (
              <SwiperSlide key={index} className="flex flex-col items-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  loading="lazy"
                />
                <h3 className="text-lg font-semibold mb-2 text-center">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < Math.floor(product.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">({product.reviews})</span>
                </div>
                <p className="text-xl font-bold">{product.price}</p>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Botones de navegación personalizados */}
          <button
            className="custom-swiper-button-prev absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition z-20"
            aria-label="Slide anterior"
          >
            <FaChevronLeft className="text-xl text-gray-800" />
          </button>
          <button
            className="custom-swiper-button-next absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition z-20"
            aria-label="Slide siguiente"
          >
            <FaChevronRight className="text-xl text-gray-800" />
          </button>
        </div>
      </div>
    </section>
  );
}
