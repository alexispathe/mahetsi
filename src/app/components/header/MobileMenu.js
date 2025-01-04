import Link from 'next/link';

export default function MobileMenu({ categories, subcategories, isMenuOpen, toggleMenu, isHovered, textColor }) {
  return (
    isMenuOpen && (
      <nav className="md:hidden bg-white shadow-lg">
        <ul className="flex flex-col space-y-4 p-4">
          {categories.map((category) => {
            const filteredSubcategories = subcategories[category.uniqueID] || [];
            return (
              <li key={category.uniqueID}>
                <Link href={`/category/${category.url}`} className="cursor-pointer hover:text-gray-700 block" aria-label={`Categoría ${category.name}`}>
                  {category.name}
                </Link>
                {filteredSubcategories.length > 0 && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {filteredSubcategories.map((subcat) => (
                      <li key={subcat.uniqueID}>
                        <Link 
                          href={`/category/${category.url}/${subcat.url}`} 
                          className="cursor-pointer hover:text-gray-700 block text-sm"
                          aria-label={`Subcategoría ${subcat.name}`}
                        >
                          {subcat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          <li><Link href="/contacto" className="cursor-pointer hover:text-gray-700">Contacto</Link></li>
        </ul>
      </nav>
    )
  );
}
