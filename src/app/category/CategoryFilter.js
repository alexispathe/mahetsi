'use client'

export default function CategoryFilter() {
  const categories = [
    'Lavender Soaps',
    'Honey Soaps',
    'Rose Soaps',
    'Aloe Vera Soaps',
    'Charcoal Soaps',
    'Herbal Soaps',
    'Exfoliating Soaps',
  ];

  return (
    <div className="filter-category p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Soap Category</h4>
      <ul className="category-list space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input type="checkbox" id={category} name={category} className="checkbox" />
            <label htmlFor={category} className="text-sm">{category}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
