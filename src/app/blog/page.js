// src/app/blog/page.js
import { articlesData } from "@/data/articlesData";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-800">
          Descubre Tips Naturales para Tu Vida Diaria
          <div className="mt-2 w-24 h-1.5 bg-amber-400 rounded-full mx-auto" />
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesData.map((article) => (
            <article 
              key={article.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-amber-50"
            >
              <div className="relative h-48">
                <Image
                  src={article.image[0]}
                  alt={article.featuredImageAlt}
                  fill
                  className="rounded-t-2xl object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-xl font-bold mb-3">
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="hover:text-amber-700 transition-colors"
                  >
                    {article.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{article.metaDescription}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span className="text-amber-600">🕒</span> {article.readingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-amber-600">📅</span> {new Date(article.publishedDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-2 inline-block w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-6 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Leer Experiencia Completa →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}