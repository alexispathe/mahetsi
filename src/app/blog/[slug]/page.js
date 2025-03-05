// src/app/blog/[slug]/page.js
import { articlesData } from "@/data/articlesData";
import { notFound } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articlesData.find(a => a.slug === slug);
  return {
    title: `${article.title} | Blog Natural`,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      images: article.image.map(img => ({ url: img })),
      type: 'article',
      publishedTime: article.publishedDate,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: [article.image[0]],
    }
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  
  const article = articlesData.find(a => a.slug === slug);

  if (!article) notFound();

  return (
    <article className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Encabezado */}
        <header className="mb-12">
          <div className="relative h-80 mb-8 rounded-2xl overflow-hidden shadow-lg border border-green-50">
            <Image
              src={article.image[0]}
              alt={article.featuredImageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="100vw"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {article.title}
            <div className="mt-2 w-20 h-1.5 bg-green-400 rounded-full" />
          </h1>
          
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="text-green-600">✍️</span> {article.author}
            </span>
            <time 
              dateTime={article.publishedDate}
              className="text-sm flex items-center gap-1.5"
            >
              <span className="text-green-600">📅</span> {new Date(article.publishedDate).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>
        </header>

        {/* Contenido */}
        <section 
          className="prose lg:prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        {/* FAQ */}
        {article.faq && (
          <section className="mt-12 bg-green-50 p-8 rounded-2xl shadow-md border border-green-100">
            <h2 className="text-2xl font-bold mb-6 text-green-800">
              Preguntas Frecuentes
              <div className="mt-1 w-16 h-1 bg-green-400 rounded-full" />
            </h2>
            <div className="space-y-5">
              {article.faq.map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-green-50">
                  <p className="font-semibold text-green-700">❓ {item.question}</p>
                  <p className="mt-2 text-gray-600">💡 {item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Artículos Relacionados */}
        {article.relatedArticles && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-green-800">
              Más Tips que Te Podrían Gustar
              <div className="mt-1 w-24 h-1 bg-green-400 rounded-full" />
            </h2>
            <div className="grid gap-5">
              {articlesData
                .filter(a => article.relatedArticles.includes(a.id))
                .map((related) => (
                  <Link
                    key={related.id}
                    href={`/article/${related.slug}`}
                    className="group flex gap-5 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-green-50"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={related.image[0]}
                        alt={related.featuredImageAlt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-green-700 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {related.metaDescription}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Schema Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": article.title,
              "description": article.metaDescription,
              "author": {
                "@type": "Person",
                "name": article.author
              },
              "datePublished": article.publishedDate,
              "image": article.image[0],
              "publisher": {
                "@type": "Organization",
                "name": "Blog Natural",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://tublog.com/logo.png"
                }
              }
            })
          }}
        />
      </div>
    </article>
  );
}
