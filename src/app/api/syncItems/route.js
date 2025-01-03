import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import { z } from 'zod';

// Definir el esquema de validación usando Zod
const syncItemsSchema = z.object({
  items: z.array(z.object({
    uniqueID: z.string(),
    qty: z.number(),
    size: z.string()
  })).optional(),
  favorites: z.array(z.object({
    uniqueID: z.string(),
    qty: z.number(),
    size: z.string()
  })).optional(),
});

const syncItems = async (firestore, uid, items, collectionName) => {
  if (!Array.isArray(items) || items.length === 0) return;
  
  const batch = firestore.batch();
  const collectionRef = firestore.collection(collectionName).doc(uid).collection('items');
  
  for (const item of items) {
    if (item && item.uniqueID) {
      const itemRef = collectionRef.doc(item.uniqueID);
      batch.set(itemRef, item, { merge: true });
    }
  }
  
  await batch.commit();
};

export async function POST(request) {
  try {
    const body = await request.json();
    const parsedBody = syncItemsSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ 
        error: 'Datos de entrada inválidos', 
        details: parsedBody.error.errors 
      }, { status: 400 });
    }

    const { items = [], favorites = [] } = parsedBody.data;

    // Verificar la sesión del usuario a través de la cookie
    const sessionCookie = request.cookies.get('session')?.value || '';
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    // Sincronizar carrito y favoritos
    await Promise.all([
      syncItems(firestore, uid, items, 'carts'),
      syncItems(firestore, uid, favorites, 'favorites')
    ]);

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Error en syncItems:', error);
    
    if (error.code === 'auth/invalid-session-cookie') {
      return NextResponse.json({ 
        error: 'Cookie de sesión inválida' 
      }, { 
        status: 401 
      });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Datos de entrada inválidos',
        details: error.errors
      }, { 
        status: 400 
      });
    }

    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { 
      status: 500 
    });
  }
}
