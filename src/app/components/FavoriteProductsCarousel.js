'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';

export default function FavoriteProductsCarousel() {
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener productos ordenados por calificación (top-rated)
  const fetchTopRatedProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products/public/get/top-rated', {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error('Error al obtener productos top-rated');
      }

      const data = await res.json();
      setSortedProducts(data.products || []);  // data.products: array de productos
    } catch (error) {
      console.error('Error fetchTopRatedProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Llamamos a la función al montar el componente
  useEffect(() => {
    fetchTopRatedProducts();
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Nuestros Productos</h2>
        <p className="mb-8 text-gray-600">
          Consiente tu piel con productos naturales y con increíbles beneficios
        </p>

        {/* Carrusel de productos con Swiper */}
        <div className="relative">
          <Swiper
            // Esto forzará que Swiper se remonte si cambia drásticamente la lista
            key={sortedProducts.map((p) => p.uniqueID).join('-')}
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            navigation={{
              prevEl: '.custom-swiper-button-prev',
              nextEl: '.custom-swiper-button-next',
            }}
            breakpoints={{
              1280: { slidesPerView: 4 },
              1024: { slidesPerView: 3 },
              768: { slidesPerView: 2 },
              640: { slidesPerView: 1 },
              200: { slidesPerView: 1 },
            }}
            modules={[Navigation, A11y]}
            observer={true}
            observeParents={true}
            a11y={{
              prevSlideMessage: 'Slide anterior',
              nextSlideMessage: 'Slide siguiente',
              firstSlideMessage: 'Este es el primer slide',
              lastSlideMessage: 'Este es el último slide',
            }}
            className="product-swiper"
          >
            {loading ? (
              // Skeleton loading
              Array(5).fill(0).map((_, index) => (
                <SwiperSlide key={index} className="flex flex-col items-center p-4">
                  <div className="w-full h-72 bg-gray-200 rounded-md animate-pulse mb-4" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded-md animate-pulse mb-2" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded-md animate-pulse mb-2" />
                  <div className="w-1/3 h-4 bg-gray-200 rounded-md animate-pulse" />
                </SwiperSlide>
              ))
            ) : sortedProducts.length === 0 ? (
              <SwiperSlide>
                <p className="text-gray-600">No hay productos disponibles.</p>
              </SwiperSlide>
            ) : (
              sortedProducts.map((product) => (
                <SwiperSlide key={product.uniqueID} className="flex flex-col items-center p-4">
                  <Link
                    href={'/product/' + product.url}
                    className="flex flex-col items-center w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-300 p-4 rounded-md"
                  >
                    <Image
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      width={500}
                      height={400}
                      className="w-full h-72 object-cover rounded-md mb-4"
                      loading="lazy"
                    />

                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>
                            {i < Math.round(product.averageRating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-2">
                        ({product.numReviews})
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-center">{product.name}</h3>
                    <p className="text-xl font-bold">{`$${product.price?.toFixed(2) ?? '0.00'}`}</p>
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
