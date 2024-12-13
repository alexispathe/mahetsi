'use client';
// CategoryFilter.js

export default function CategoryFilter({ categories, selectedCategories, setSelectedCategories }) {
  const toggleCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-4">Categorías de Productos</h4>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.uniqueID} className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id={category.uniqueID} 
              name={category.name} 
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={selectedCategories.includes(category.name)}
              onChange={() => toggleCategory(category.name)}
            />
            <label htmlFor={category.uniqueID} className="text-sm text-gray-700 cursor-pointer">{category.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
