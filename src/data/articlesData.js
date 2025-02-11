export const articlesData = [
  {
    id: 1,
    title: "7 Beneficios Científicos de la Miel que Deberías Conocer",
    slug: "beneficios-miel-natural",
    metaDescription: "Descubre los sorprendentes beneficios de la miel avalados por investigaciones científicas. Desde cuidado de la piel hasta salud digestiva.",
    description: "Análisis detallado de las propiedades terapéuticas de la miel natural respaldadas por la ciencia.",
    image: [
      "https://cdn.pixabay.com/photo/2017/05/23/16/23/soap-dispenser-2337697_640.jpg",
      "https://cdn.pixabay.com/photo/2020/04/22/17/12/soap-5079181_1280.jpg"
    ],
    category: "Salud Natural",
    author: "Dra. Laura Pérez - Nutricionista Integrativa",
    tags: ["salud", "nutrición", "remedios naturales"],
    body: `
      <section class="space-y-6">
        <div class="bg-amber-50 p-4 rounded-lg">
          <p class="font-semibold">📌 Datos Clave:</p>
          <p>"La miel contiene más de 200 sustancias bioactivas según estudio del Journal of Food Science (2023)"</p>
        </div>

        <h2 class="text-2xl font-bold">1. Poder Antioxidante 🛡️</h2>
        <img src="https://cdn.pixabay.com/photo/2018/08/02/00/17/soap-bubble-3578601_1280.jpg" 
             alt="Cuchara con miel derramándose" 
             class="rounded-xl my-4 shadow-lg" />
        
        <ul class="list-disc pl-6 space-y-2">
          <li>Contiene flavonoides y ácidos fenólicos</li>
          <li>Equivalente a 1 naranja en vitamina C por cucharada</li>
          <li>Reduce estrés oxidativo celular</li>
        </ul>

        <h2 class="text-2xl font-bold mt-8">2. Salud Digestiva 🍯</h2>
        <div class="md:flex gap-4 mt-4">
          <div class="flex-1">
            <img src="https://cdn.pixabay.com/photo/2017/05/22/07/39/soap-2333412_1280.jpg" 
                 alt="Miel con probióticos" 
                 class="rounded-lg h-48 w-full object-cover" />
          </div>
          <div class="flex-1 mt-4 md:mt-0">
            <p class="font-semibold">Beneficios comprobados:</p>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Mejora la microbiota intestinal</li>
              <li>Alivia el reflujo ácido</li>
              <li>Combate Helicobacter pylori</li>
            </ol>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg mt-6">
          <h3 class="text-lg font-semibold">💡 Uso Recomendado</h3>
          <p>"1 cucharada en ayunas con agua tibia para mejorar la digestión" - Revista de Gastroenterología</p>
        </div>
      </section>
    `,
    faq: [
      {
        question: "¿La miel engorda?",
        answer: "Contiene 64 kcal por cucharada, pero su índice glucémico es más bajo que el azúcar refinado"
      },
      {
        question: "¿Es segura para niños?",
        answer: "Recomendada a partir de 2 años según la OMS"
      }
    ],
    relatedArticles: [2],
    readingTime: "6 min",
    publishedDate: "2024-04-10",
    featuredImageAlt: "Miel orgánica en tarro de vidrio con gotas doradas",
    socialMediaPreview: {
      twitter: "¿Sabías que la miel es más que un endulzante? Descubre sus superpoderes científicos 🍯🔬",
      facebook: "7 Beneficios de la Miel que la Ciencia Confirma | Blog Natural"
    }
  },
  {
    id: 2,
    title: "10 Secretos de la Lavanda que No Conocías: De la Antigua Roma a la NASA",
    slug: "datos-curiosos-lavanda",
    metaDescription: "Descubre usos sorprendentes de la lavanda en la historia, ciencia y vida moderna. ¡Desde conservar momias hasta viajes espaciales!",
    image: [
      "https://cdn.pixabay.com/photo/2017/05/22/07/39/soap-2333412_1280.jpg",
      "https://cdn.pixabay.com/photo/2020/03/13/03/58/handmade-soap-4926841_1280.jpg"
    ],
    category: "Plantas Aromáticas",
    tags: ["historia", "aromaterapia", "datos curiosos"],
    body: `
      <section class="space-y-6">
        <div class="bg-purple-50 p-4 rounded-lg">
          <p class="font-semibold">🌿 Dato Impactante:</p>
          <p>"La NASA usa lavanda en sus estaciones espaciales para mejorar la concentración de los astronautas"</p>
        </div>

        <h2 class="text-2xl font-bold">1. Uso Histórico ⏳</h2>
        <div class="lg:flex gap-4">
          <div class="flex-1">
            <img src="https://cdn.pixabay.com/photo/2020/03/13/05/58/herbal-soap-4926997_1280.jpg" 
                 alt="Fresco romano con lavanda" 
                 class="rounded-lg h-64 w-full object-cover" />
          </div>
          <div class="flex-1 mt-4 lg:mt-0">
            <ul class="list-disc pl-6 space-y-2">
              <li>Los romanos la usaban en baños termales</li>
              <li>Conservante natural en momificaciones egipcias</li>
              <li>Moneda de cambio en la Ruta de la Seda</li>
            </ul>
          </div>
        </div>

        <h2 class="text-2xl font-bold mt-8">2. Usos Modernos Sorprendentes 🔬</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <img src="https://cdn.pixabay.com/photo/2022/02/04/08/58/organic-soap-6992355_1280.jpg" 
                 alt="Café con flores de lavanda" 
                 class="rounded-lg h-48 w-full object-cover" />
            <h3 class="text-xl font-bold mt-2">En la Cocina</h3>
            <ul class="list-disc pl-4 mt-2 space-y-1">
              <li>Infusiones relajantes</li>
              <li>Mix con sales gourmet</li>
              <li>Helados y repostería</li>
            </ul>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-md">
            <img src="https://cdn.pixabay.com/photo/2020/03/28/14/39/soap-4977314_1280.jpg" 
                 alt="Aceite esencial de lavanda" 
                 class="rounded-lg h-48 w-full object-cover" />
            <h3 class="text-xl font-bold mt-2">Tecnología</h3>
            <ul class="list-disc pl-4 mt-2 space-y-1">
              <li>Componente en chips electrónicos</li>
              <li>Fragrancia para memorias RAM</li>
              <li>Biocombustibles experimentales</li>
            </ul>
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg mt-6">
          <h3 class="text-lg font-semibold">⚠️ Curiosidad Bélica</h3>
          <p>"En la Segunda Guerra Mundial se usó para desinfectar heridas en el campo de batalla"</p>
        </div>
      </section>
    `,
    author: "Dr. Hugo Botánico - Historiador de Plantas",
    readingTime: "7 min",
    publishedDate: "2024-04-15",
    featuredImageAlt: "Campo de lavanda en Provenza al atardecer",
    socialMediaPreview: {
      twitter: "¿Sabías que la lavanda viajó al espacio? Descubre sus secretos milenarios 🌌🌿",
      facebook: "10 Datos Históricos y Científicos sobre la Lavanda que Te Sorprenderán"
    },
    faq: [
      {
        question: "¿Es segura para mascotas?",
        answer: "En dosis altas puede ser tóxica para gatos, consulta siempre a un veterinario"
      }
    ],
    relatedArticles: [1]
  }
];