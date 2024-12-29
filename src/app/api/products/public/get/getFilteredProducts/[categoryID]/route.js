// src/app/api/products/public/get/getFilteredProducts/[categoryID]/route.js
//Devuelve los productos para el filtro
import { NextResponse } from 'next/server';
import { firestore } from '../../../../../../../libs/firebaseAdmin';

export async function GET(request, context) {
  try {
    const {params} = context;
    const { categoryID } = await params; // Este es el ID de categoría que viene de la URL dinámica
     // Construir la consulta base
     let query = firestore.collection('products');

     // Si se proporciona un categoryID, filtramos por esa categoría
     if (categoryID) {
       query = query.where('categoryID', '==', categoryID);
     }
 
     const productsSnapshot = await query.get();
 
     const products = productsSnapshot.docs.map(doc => {
       const data = doc.data();
       return {
         uniqueID: doc.id,
         name: data.name,
         price: data.price,
         categoryID: data.categoryID,
         brandID: data.brandID,
         typeID: data.typeID,
         size: data.size,
         images: data.images || [],
         url: data.url || '',
         subcategoryID: data.subcategoryID,
         averageRating: data.averageRating,
         numReviews: data.numReviews
       };
     });
 
     return NextResponse.json(
       { products },
       { status: 200 }
     );
 
   } catch (error) {
     console.error('Error al obtener los productos:', error);
     return NextResponse.json(
       { message: 'Error interno del servidor.' },
       { status: 500 }
     );
   }
 }
 