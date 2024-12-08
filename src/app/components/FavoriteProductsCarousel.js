'use client';

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from 'next/link'; // Importa el componente Link
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/a11y";

import { products as productsData, reviews as reviewsData } from '../category/data'; // Asegúrate de importar los datos correctamente

export default function FavoriteProductsCarousel() {
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  
  // Función para calcular el promedio de calificación
  const calculateAverageRating = (productId) => {
    const productReviews = reviewsData.filter(review => review.product_id === productId);
    const totalReviews = productReviews.length;
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalReviews ? totalRating / totalReviews : 0;
  };

  useEffect(() => {
    // Simular un retraso en la carga de los productos
    const timer = setTimeout(() => {
      const updatedProducts = productsData.map(product => {
        const averageRating = calculateAverageRating(product.uniqueID);
        return {
          ...product,
          averageRating,
          numReviews: reviewsData.filter(review => review.product_id === product.uniqueID).length,
        };
      });

      updatedProducts.sort((a, b) => b.averageRating - a.averageRating);
      setSortedProducts(updatedProducts);
      setLoading(false); // Cambiar el estado a false cuando los productos se carguen
    }, 1500); // 1.5 segundos de retraso para simular carga

    return () => clearTimeout(timer); // Limpiar el temporizador
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
            key={sortedProducts.map(p => p.uniqueID).join('-')}  // Forzar el remount de Swiper al cambiar el orden
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            navigation={{
              prevEl: ".custom-swiper-button-prev",
              nextEl: ".custom-swiper-button-next",
            }}
            breakpoints={{
              1280: { slidesPerView: 4 },
              1024: { slidesPerView: 3 },
              768: { slidesPerView: 2 },
              640: { slidesPerView: 1 },
              200: { slidesPerView: 1 },
            }}
            modules={[Navigation, A11y]}
            observer={true}  // Habilitar para observar cambios en el Swiper
            observeParents={true}  // Habilitar para observar cambios en los padres del Swiper
            a11y={{
              prevSlideMessage: 'Slide anterior',
              nextSlideMessage: 'Slide siguiente',
              firstSlideMessage: 'Este es el primer slide',
              lastSlideMessage: 'Este es el último slide',
            }}
            className="product-swiper"
          >
            {loading ? (
              // Skeleton de productos
              Array(5).fill(0).map((_, index) => (
                <SwiperSlide key={index} className="flex flex-col items-center p-4">
                  <div className="w-full h-72 bg-gray-200 rounded-md animate-pulse mb-4"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="w-1/3 h-4 bg-gray-200 rounded-md animate-pulse"></div>
                </SwiperSlide>
              ))
            ) : (
              sortedProducts.map((product) => (
                <SwiperSlide key={product.uniqueID} className="flex flex-col items-center p-4">
                  <Link 
                    href={"/product/"+product.url} 
                    className="flex flex-col items-center w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-300 p-4 rounded-md"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-72 object-cover rounded-md mb-4"
                      loading="lazy"
                    />
                    <h3 className="text-lg font-semibold mb-2 text-center">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>
                            {i < Math.floor(product.averageRating) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-2">({product.numReviews})</span>
                    </div>
                    <p className="text-xl font-bold">{`$${product.price.toFixed(2)}`}</p>
                  </Link>
                </SwiperSlide>
              ))
            )}
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
