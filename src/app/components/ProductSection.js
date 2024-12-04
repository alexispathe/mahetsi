'use client'
import '../styles/productSection.css' // Mantener solo si es necesario

export default function ProductSection() {
  const products = [
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Shampoo Sólido",
      price: "$150.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Jabón Artesanal Lavanda",
      price: "$100.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Jabón Artesanal Aloe Vera",
      price: "$100.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Jabón Artesanal Naranja & Café",
      price: "$100.00"
    },
    {
      image: "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      name: "Jabón Artesanal Aguacate",
      price: "$100.00"
    },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <h2 className="text-3xl font-bold mb-6 text-center">Preferidos por los Clientes</h2>

        {/* Sección de productos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Producto destacado */}
          <div className="flex flex-col items-center">
            <img 
              src={products[0].image} 
              alt={products[0].name} 
              className="w-full h-72 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-center">{products[0].name}</h3>
            <p className="text-xl font-bold text-red-600">{products[0].price}</p>
          </div>

          {/* Productos adicionales */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.slice(1, 6).map((product, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold text-center">{product.name}</h3>
                  <p className="text-xl font-bold text-red-600">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
