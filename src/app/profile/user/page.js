// src/app/profile/user/page.js

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authAdmin, getUserDocument, getRolePermissions } from '@/libs/firebaseAdmin';
import { orders } from '../../category/data';
import OrdersTable from './OrderTable';
import AdminButton from './AdminButton';
import Header from '@/app/components/Header';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    redirect('/login');
  }

  try {
    const decodedClaims = await authAdmin.verifySessionCookie(session, true);
    const { email, name, picture, uid } = decodedClaims;

    // Obtener el documento del usuario
    const userData = await getUserDocument(uid);
    const rolID = userData.rolID;

    if (!rolID) {
      redirect('/login');
    }

    // Obtener los permisos del rol
    const permissions = await getRolePermissions(rolID);

    // Verificar si el usuario tiene permisos 'create' o 'update'
    const hasAdminAccess = permissions.includes('create') || permissions.includes('update');

    const userOrders = orders.filter(order => order.ownerId === uid);

    return (
      <>
        <Header textColor='black' position={"relative"} />
        <div className="container mx-auto p-4">
          {/* Perfil del Usuario */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={picture}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6 object-cover"
              />
              <div>
                <h1 className="text-2xl font-semibold mb-2">Perfil de {name}</h1>
                <p className="text-gray-600">Email: {email}</p>
              </div>
            </div>
            <form action="/api/sessionLogout" method="POST" className="mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Cerrar Sesión
              </button>
            </form>
            {/* Botón del Panel de Administrador */}
            {hasAdminAccess && <AdminButton />}
          </div>

          {/* Órdenes del Usuario */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mis Compras</h2>
            <OrdersTable orders={userOrders} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error verificando cookie de sesión:', error);
    redirect('/login');
  }
}
