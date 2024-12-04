'use client'
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css"; // Estilos de Swiper
import '../styles/ProductCarousel.css'

export default function ProductCarousel() {
  const swiperRef = useRef(null); // Usamos useRef para acceder a la instancia de Swiper

  const products = [
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg", // Cambia la ruta de la imagen
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
        name: "Jabón ",
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

  return (
    <section className="py-10">
      <div className="mx-auto px-6" style={{width: '90%'}}>
        <h2 className="text-3xl font-bold  mb-6">Nuestros Productos</h2>
        <p className=" mb-10">Consiente tu piel con productos Naturales y con increíbles beneficios</p>

        {/* Carrusel de productos con Swiper */}
        <div className="relative">
          <Swiper
            ref={swiperRef} // Referencia para la instancia de Swiper
            spaceBetween={30} // Espacio entre los slides
            slidesPerView={3} // Número de slides visibles
            loop={true} // Permite el bucle infinito
            navigation={{
              prevEl: ".swiper-button-prev", // Enlazamos el botón de retroceder
              nextEl: ".swiper-button-next", // Enlazamos el botón de avanzar
            }}
            breakpoints={{
              1024: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 2,
              },
              480: {
                slidesPerView: 1,
              },
            }}
          >
            {products.map((product, index) => (
              <SwiperSlide key={index} className="flex flex-col items-center justify-center p-4">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">{"★".repeat(Math.floor(product.rating))}</span>
                  <span className="text-gray-500 text-sm ml-2">({product.reviews})</span>
                </div>
                <p className="text-xl font-bold">{product.price}</p>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Botones de navegación */}
          <FaChevronLeft
            className="swiper-button-prev absolute top-1/2 left-2 transform -translate-y-1/2 text-2xl text-black cursor-pointer z-10"
          />
          <FaChevronRight
            className="swiper-button-next absolute top-1/2 right-2 transform -translate-y-1/2 text-2xl text-black cursor-pointer z-10"
          />
        </div>
      </div>
    </section>
  );
}
