// src/app/api/sessionLogin/route.js
import { NextResponse } from 'next/server';
import { authAdmin, firestore } from '@/libs/firebaseAdmin';
import admin from 'firebase-admin';

// Asegúrate de que Firebase Admin esté inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const body = await request.json();
    const { idToken, items = [], favorites = [] } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'No ID token provided' }, { status: 400 });
    }

    // Verificar el ID token primero
    const decodedIdToken = await authAdmin.verifyIdToken(idToken);
    if (!decodedIdToken) {
      return NextResponse.json({ error: 'Invalid ID token' }, { status: 401 });
    }

    // Crear la sesión de usuario
    const expiresIn = 5 * 60 * 1000; // 5 minutos en milisegundos
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { 
      expiresIn 
    });

    // Verificar que la cookie de sesión se creó correctamente
    if (!sessionCookie) {
      throw new Error('Failed to create session cookie');
    }

    const { uid, email, name: displayName } = decodedIdToken;
    
    // Actualizar o crear documento de usuario
    const userRef = firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();

    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    if (!userDoc.exists) {
      await userRef.set({
        name: displayName || '',
        email: email || '',
        dateCreated: timestamp,
        dateModified: timestamp,
        rolID: 'gB4kyZZNT8HLbsyTBRGi',
        ownerId: uid,
      });
    } else {
      await userRef.update({ 
        dateModified: timestamp 
      });
    }

    // Función para sincronizar items (carrito o favoritos)
    const syncItems = async (items, collectionName) => {
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

    // Sincronizar carrito y favoritos
    await Promise.all([
      syncItems(items, 'carts'),
      syncItems(favorites, 'favorites')
    ]);

    // Crear y configurar la respuesta
    const response = NextResponse.json({ 
      status: 'success',
      session: sessionCookie,
      uid: uid
    });

    // Configurar la cookie de sesión
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 5 * 60, // 5 minutos en segundos
    });

    return response;

  } catch (error) {
    console.error('Error en sessionLogin:', error);
    
    // Manejo específico de errores
    if (error.code === 'auth/invalid-id-token') {
      return NextResponse.json({ 
        error: 'Token de autenticación inválido' 
      }, { 
        status: 401 
      });
    }

    if (error.code === 'auth/session-cookie-expired') {
      return NextResponse.json({ 
        error: 'La sesión ha expirado' 
      }, { 
        status: 401 
      });
    }

    // Error general
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { 
      status: 500 
    });
  }
}