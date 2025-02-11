import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Sección Hero */}
      <section className="relative flex items-center justify-center h-[50vh] bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h1 className="text-4xl font-bold mb-4">Acerca de Mahets&#39;i & Boh&#39;o</h1>
          <p className="text-lg">
            Descubre nuestra historia, valores y el equipo apasionado que hace todo posible.
          </p>
        </div>
      </section>

      {/* Sección Historia y Misión */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Nuestra Historia</h2>
            <p className="mb-4 leading-relaxed">
              Mahets&#39;i & Boh&#39;o nació con la visión de transformar la experiencia de nuestros clientes, 
              ofreciendo productos y servicios únicos que mezclan tradición y modernidad. A lo largo 
              de los años, hemos evolucionado gracias a la confianza de quienes han creído en nuestra 
              propuesta y la dedicación de cada integrante del equipo.
            </p>
            <p className="leading-relaxed">
              Hoy en día, seguimos creciendo e innovando, manteniendo siempre la esencia que nos vio 
              nacer y la pasión por brindar calidad en cada detalle.
            </p>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Misión y Visión</h2>
            <p className="mb-4 leading-relaxed">
              <strong>Misión:</strong> Ser la opción preferida de nuestros clientes a través de 
              experiencias inolvidables que combinan la rica herencia cultural con la creatividad y 
              la innovación, siempre cuidando la calidad y sostenibilidad de nuestros procesos.
            </p>
            <p className="leading-relaxed">
              <strong>Visión:</strong> Convertirnos en referentes nacionales e internacionales, 
              reconocidos por nuestro compromiso con la excelencia, la responsabilidad social y el 
              crecimiento conjunto con nuestras comunidades.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Valores */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Respeto</h3>
              <p>
                Nos guiamos por el respeto hacia las personas, la diversidad cultural y el medio 
                ambiente.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Compromiso</h3>
              <p>
                Trabajamos con dedicación para superar las expectativas y mantener la confianza de 
                nuestros clientes.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Integridad</h3>
              <p>
                Actuamos con honestidad y transparencia, fomentando relaciones basadas en la verdad 
                y la justicia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Equipo */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Conoce a Nuestro Equipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ejemplo de tarjeta de integrante */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="w-32 h-32 relative mb-4">
              <Image
                src="/images/team-member.jpg" 
                alt="Miembro del equipo"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="text-lg font-semibold">Juan Pérez</h3>
            <p className="text-sm text-indigo-600 mb-2">Fundador & CEO</p>
            <p className="text-center text-gray-600 text-sm">
              Apasionado de la innovación y el liderazgo, con años de experiencia impulsando el 
              crecimiento de Mahets&#39;i & Boh&#39;o.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="w-32 h-32 relative mb-4">
              <Image
                src="/images/team-member.jpg" 
                alt="Miembro del equipo"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="text-lg font-semibold">María García</h3>
            <p className="text-sm text-indigo-600 mb-2">Directora de Proyectos</p>
            <p className="text-center text-gray-600 text-sm">
              Experta en gestión de equipos y procesos, encargada de coordinar y optimizar el 
              desarrollo de cada iniciativa.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="w-32 h-32 relative mb-4">
              <Image
                src="/images/team-member.jpg" 
                alt="Miembro del equipo"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="text-lg font-semibold">Carlos Ramírez</h3>
            <p className="text-sm text-indigo-600 mb-2">Diseñador Creativo</p>
            <p className="text-center text-gray-600 text-sm">
              Responsable de la imagen y la experiencia visual, asegurando que cada detalle refleje 
              la esencia de Mahets&#39;i & Boh&#39;o.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Llamado a la Acción */}
      <section className="py-12 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">¿Listo para conocer más?</h2>
          <p className="mb-6">
            Únete a nosotros en este viaje, descubre todo lo que ofrecemos y forma parte de nuestra 
            comunidad.
          </p>
          <button className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors">
            Contáctanos
          </button>
        </div>
      </section>
    </main>
  );
}
