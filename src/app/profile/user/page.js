import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authAdmin, getUserDocument, getRolePermissions } from '@/libs/firebaseAdmin';
import { orders } from '../../category/data';
import OrdersTable from './OrderTable';
import AdminButton from './AdminButton';
import Header from '@/app/components/Header';
import LogoutButton from './LogoutButton'; 
import Image from 'next/image';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  // Si no hay sesión, redirige antes de hacer nada más
  if (!session) {
    redirect('/login');
  }

  // Verificamos la cookie de sesión sin try/catch,
  // en caso de error, redirigimos de inmediato
  const decodedClaims = await authAdmin.verifySessionCookie(session, true).catch(() => {
    redirect('/login');
  });

  // Si por alguna razón decodedClaims no existe, redirige
  if (!decodedClaims) {
    redirect('/login');
  }

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
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center">
            {picture && (
              <Image
                src={picture}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6 object-cover"
                width={96}
                height={96}
              />
            )}
            <div>
              <h1 className="text-2xl font-semibold mb-2">Perfil de {name}</h1>
              <p className="text-gray-600">Email: {email}</p>
            </div>
          </div>
          <div className="mt-4">
            <LogoutButton />
          </div>
          {hasAdminAccess && <AdminButton />}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mis Compras</h2>
          <OrdersTable orders={userOrders} />
        </div>
      </div>
    </>
  );
}
