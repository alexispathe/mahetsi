"use client";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  // Preguntas y respuestas
  const faqs = [
    {
      question: "¿Cómo realizar mi compra de productos naturales?",
      answer:
        "Puedes navegar en nuestra tienda en línea, añadir los productos que desees al carrito y proceder al pago. Todos nuestros productos están hechos con ingredientes naturales y cuidadosamente seleccionados.",
    },
    {
      question: "¿Cuáles son los métodos de pago disponibles?",
      answer:
        "Aceptamos pagos a través de Mercado Pago, lo que te permite utilizar tarjetas de crédito, débito y otras opciones seguras para tu conveniencia.",
    },
    {
      question: "¿Hacen envíos a todo el país?",
      answer:
        "Sí, realizamos envíos a través de SkyDropx, donde podrás elegir la paquetería que más te convenga. El costo de envío se calcula automáticamente al momento de realizar el pedido.",
    },
    {
      question: "¿Cuál es el monto para obtener envío gratis?",
      answer:
        "El envío gratis aplica para compras a partir de $999. Si tu pedido supera ese monto, podrás elegir la opción de envío gratuito en el proceso de compra.",
    },
    {
      question: "¿Cómo puedo contactarme si tengo dudas o comentarios?",
      answer:
        "Puedes escribirnos por WhatsApp para recibir asistencia personalizada y resolver cualquier duda que tengas. Nuestro equipo estará feliz de ayudarte.",
    },
    {
      question: "¿Puedo personalizar los productos?",
      answer:
        "En algunos casos, ofrecemos la posibilidad de personalizar aromas, empaques o presentaciones. Para más detalles, contáctanos antes de realizar tu compra y te asesoraremos.",
    },
    {
      question: "¿Qué hacer si mi pedido llega en mal estado?",
      answer:
        "Si tu pedido llega dañado o en mal estado, por favor contáctanos de inmediato para gestionar un reemplazo o reembolso. Documenta el daño con fotografías para agilizar el proceso.",
    },
  ];

  // Alterna la pregunta activa
  const toggleFaq = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <section className="max-w-3xl w-full mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-amber-600 mb-8">
          Preguntas Frecuentes
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 transition-all hover:shadow-lg"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </span>
                {activeIndex === index ? (
                  <FaMinus className="text-amber-600" />
                ) : (
                  <FaPlus className="text-amber-600" />
                )}
              </button>
              {/* Contenido con transición dinámica */}
              <div
                className={`mt-2 text-gray-600 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="py-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
