'use client';

export default function CategoryFilter({ selectedCategories, setSelectedCategories }) {
  const categories = [
    'Full Zip Hoodie',
    'Mens Sherpa Hoodie',
    'Womens Essentials Hoodie',
    // Agrega más categorías según sea necesario
  ];

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Categorías de Productos</h4>
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id={category} 
              name={category} 
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">{category}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
