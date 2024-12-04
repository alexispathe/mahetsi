'use client'
import { FaStar } from "react-icons/fa"; // Usamos React Icons para las estrellas
// Eliminamos el import del CSS personalizado
// import '../styles/reviewSection.css'

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Juan Lopez",
      location: "Querétaro",
      review: "Lo ame!!, el jabón artesanal de lavanda es increíble, la hidratación es espectacular y sin duda el aroma me sorprendió. Consistencia esperada y cremosidad precisa. Increible precio.",
      rating: 4.5,
    },
    {
      name: "Sofia Rodriguez",
      location: "Quintana Roo",
      review: "Siempre busco productos que cuiden mi piel y mi bolsillo, y este es uno de ellos los ingredientes naturales lo hacen unico y competitivo con los demás productos en el mercado, el aroma es inigualable y no se compará con ningun otro.",
      rating: 4.0,
    },
    {
      name: "Julian",
      location: "Oaxaca",
      review: "La pagina web me parece perfecta super intuitiva y con los colores que te llevan a imaginar lo fresco, limpio y cremosos que son sus productos. Los productos son realmente sorprendentes.",
      rating: 4.5,
    },
  ];

  const averageRating = 4.5; // Promedio de las calificaciones

  // Función para renderizar estrellas, permitiendo medias estrellas
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => {
      if (i < Math.floor(rating)) {
        return <FaStar key={i} className="text-yellow-500" />;
      } else if (i < rating) {
        return <FaStar key={i} className="text-yellow-500 half-star" />;
      } else {
        return <FaStar key={i} className="text-gray-300" />;
      }
    });
  };

  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Comentarios sobre nosotros</h2>

        {/* Comentarios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="p-6 bg-white rounded-md shadow-lg">
              {/* Puedes ajustar el contenido según lo que desees mostrar */}
              <p className="text-gray-600 text-sm mb-4">{review.name}</p>
              <p className="text-gray-600 text-sm mb-4">{review.review}</p>
              <div className="flex justify-center mb-2">
                {/* Estrellas de rating */}
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-gray-500">{review.name}, {review.location}</p>
            </div>
          ))}
        </div>

        {/* Promedio de comentarios */}
        <div className="average-rating mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Conoce más comentarios</h3>
          <p className="text-xl font-semibold text-gray-800 mb-4">{averageRating} / 5</p>
          {/* Estrellas del promedio */}
          <div className="flex justify-center mb-4">
            {renderStars(averageRating)}
          </div>
          {/* Botón "Ver más comentarios" */}
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">
            Visita 4,215 Más comentarios
          </button>
        </div>
      </div>
    </section>
  );
}
