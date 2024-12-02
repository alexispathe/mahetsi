'use client'
import { FaStar } from "react-icons/fa"; // Usamos React Icons para las estrellas

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

  return (
    <section className="reviews-container py-10 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Comentarios sobre nosotros</h2>

        {/* Comentarios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="review-card p-6 bg-white rounded-md shadow-lg">
              <h3 className="font-semibold text-lg text-gray-800">{review.review.split(" ")[0]}</h3>
              <p className="text-gray-600 text-sm mb-4">{review.review}</p>
              <div className="flex justify-center mb-2">
                {/* Estrellas de rating */}
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-yellow-500 ${i < review.rating ? "filled" : "empty"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">{review.name}, {review.location}</p>
            </div>
          ))}
        </div>

        {/* Promedio de comentarios */}
        <div className="average-rating mt-8">
          <h3 className="text-xl font-bold text-gray-800">Conoce más comentarios</h3>
          <p className="text-xl font-semibold text-gray-800">{averageRating} / 5</p>
          {/* Estrellas del promedio */}
          <div className="flex justify-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-yellow-500 ${i < averageRating ? "filled" : "empty"}`}
              />
            ))}
          </div>
          {/* Botón "Ver más comentarios" */}
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
            Visita 4,215 Más comentarios
          </button>
        </div>
      </div>
    </section>
  );
}
