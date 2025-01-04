import Link from 'next/link';

export default function Navigation({ categories, subcategories, isHovered, textColor, isLoading }) {
  return (
    <nav className="hidden md:flex space-x-6">
      {isLoading ? (
        <div className="flex gap-6">
          <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      ) : (
        categories.map((category) => {
          const filteredSubcategories = subcategories[category.uniqueID] || [];
          return (
            <div key={category.uniqueID} className="group relative">
              <Link
                href={`/category/${category.url}`}
                className={`cursor-pointer ${isHovered ? "text-black" : textColor}`}
                aria-label={`Categoría ${category.name}`}
              >
                {category.name}
              </Link>
              {filteredSubcategories.length > 0 && (
                <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg p-4">
                  <ul>
                    {filteredSubcategories.map((subcat) => (
                      <li key={subcat.uniqueID}>
                        <Link 
                          href={`/category/${category.url}/${subcat.url}`} 
                          className="py-1 hover:text-gray-700 block"
                          aria-label={`Subcategoría ${subcat.name}`}
                        >
                          {subcat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}
      <Link href="/contacto" className={`cursor-pointer ${isHovered ? "text-black" : textColor}`}>
        Contacto
      </Link>
    </nav>
  );
}
