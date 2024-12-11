// src/components/TypeFilter.js
'use client';

export default function TypeFilter({ types, selectedTypes, setSelectedTypes }) {
  const toggleType = (typeID) => {
    if (selectedTypes.includes(typeID)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeID));
    } else {
      setSelectedTypes([...selectedTypes, typeID]);
    }
  };

  return (
    <div>
      <ul className="space-y-2">
        {types.map(type => (
          <li key={type.uniqueID} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`type-${type.uniqueID}`}
              onChange={() => toggleType(type.uniqueID)}
              checked={selectedTypes.includes(type.uniqueID)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={`type-${type.uniqueID}`} className="text-sm text-gray-700 cursor-pointer">{type.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
