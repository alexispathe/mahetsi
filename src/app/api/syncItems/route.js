import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';

// Función para sincronizar los elementos en Firestore
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

const syncFavorites = async (firestore, uid, favorites, collectionName) => {
  if (!Array.isArray(favorites) || favorites.length === 0) return;

  const batch = firestore.batch();
  const collectionRef = firestore.collection(collectionName).doc(uid).collection('items');

  for (const favorite of favorites) {
    if (favorite) {
      const favoriteRef = collectionRef.doc(favorite); // Usamos el `uniqueID` como ID del documento
      batch.set(favoriteRef, { uniqueID: favorite }, { merge: true });
    }
  }

  await batch.commit();
};

export async function POST(request) {
  try {
    const body = await request.json();

    // Validación manual de los datos de entrada
    const { items = [], favorites = [] } = body;

    if (
      !Array.isArray(items) ||
      !items.every(item => item.uniqueID)
    ) {
      return NextResponse.json({ 
        error: 'Datos de carrito inválidos' 
      }, { status: 400 });
    }

    if (
      !Array.isArray(favorites) ||
      !favorites.every(favorite => typeof favorite === 'string')
    ) {
      return NextResponse.json({ 
        error: 'Datos de favoritos inválidos' 
      }, { status: 400 });
    }

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
      syncFavorites(firestore, uid, favorites, 'favorites')
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

    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { 
      status: 500 
    });
  }
}
