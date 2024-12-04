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
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Soap Category</h4>
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id={category} 
              name={category} 
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">{category}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
