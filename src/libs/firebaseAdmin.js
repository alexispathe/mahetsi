// src/lib/firebaseAdmin.js
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_ADMIN_TYPE,
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
    }),
  });
}

const firestore = admin.firestore();
const authAdmin = admin.auth();
export { firestore, authAdmin };

// Verificar Token de sesión (en server)
export const verifyIdToken = async (token) => {
  return await authAdmin.verifyIdToken(token);
};

// **Nueva Función para Verificar Session Cookies**
export const verifySessionCookie = async (sessionCookie) => {
  return await authAdmin.verifySessionCookie(sessionCookie, true);
};

// Función para obtener el documento del usuario
export const getUserDocument = async (uid) => {
  const userDoc = await firestore.collection('users').doc(uid).get();
  if (!userDoc.exists) {
    throw new Error('Usuario no encontrado');
  }
  return userDoc.data();
};

// Función para obtener los permisos del rol
export const getRolePermissions = async (rolID) => {
  const roleDoc = await firestore.collection('roles').doc(rolID).get();
  if (!roleDoc.exists) {
    throw new Error('Rol no encontrado');
  }
  return roleDoc.data().permissions || [];
};

