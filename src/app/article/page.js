import { articlesData } from "@/data/articlesData";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        Descubre Tips Naturales para Tu Vida Diaria
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articlesData.map((article) => (
          <article 
            key={article.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <Image
                src={article.image[0]}
                alt={article.featuredImageAlt}
                fill
                className="rounded-t-xl object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                {article.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <h2 className="text-xl font-bold mb-2">
                <Link 
                  href={`/article/${article.slug}`}
                  className="hover:text-green-700 transition-colors"
                >
                  {article.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4">{article.metaDescription}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>🕒 {article.readingTime}</span>
                <span>📅 {new Date(article.publishedDate).toLocaleDateString('es-ES')}</span>
              </div>
              
              <Link
                href={`/article/${article.slug}`}
                className="mt-4 inline-block w-full text-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Leer Experiencia Completa →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}