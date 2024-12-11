// src/utils/fetchCartProducts.js

export async function fetchCartProducts() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      if (cart.length === 0) {
        return [];
      }
  
      // Extraer uniqueIDs
      const uniqueIDs = cart.map(item => item.uniqueID);
  
      // Dividir los uniqueIDs en chunks de 10 debido a la limitación de Firestore
      const chunks = [];
      for (let i = 0; i < uniqueIDs.length; i += 10) {
        chunks.push(uniqueIDs.slice(i, i + 10));
      }
  
      const allProducts = [];
  
      // Realizar solicitudes en paralelo usando Promise.all
      await Promise.all(chunks.map(async (chunk) => {
        const response = await fetch('/api/shoppingCart/public/get/cartIds', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productIDs: chunk }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener productos del carrito.');
        }
  
        const data = await response.json();
        allProducts.push(...data.products);
      }));
  
      // Combinar los datos del carrito con los detalles de los productos
      const detailedCartItems = cart.map(cartItem => {
        const product = allProducts.find(p => p.uniqueID === cartItem.uniqueID);
        return {
          ...cartItem,
          name: product ? product.name : 'Producto no encontrado',
          url: product ? product.url : '#',
          image: product ? product.image : '',
          price: product ? product.price : 0,
        };
      });
  
      return detailedCartItems;
  
    } catch (error) {
      console.error('Error fetching cart products:', error);
      throw error;
    }
  }
  