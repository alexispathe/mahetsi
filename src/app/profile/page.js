import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authAdmin } from '@/libs/firebaseAdmin';

export default async function ProfilePage() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    redirect('/login');
  }

  try {
    const decodedClaims = await authAdmin.verifySessionCookie(session, true);
    const { email, name, picture } = decodedClaims;

    return (
      <div style={{ padding: '2rem' }}>
        <h1>Perfil de {name}</h1>
        <p>Email: {email}</p>
        <img src={picture} alt="Foto de perfil" style={{ width: '100px', borderRadius: '50%' }} />
        <form action="/api/sessionLogout" method="POST">
          <button type="submit">Cerrar Sesión</button>
        </form>
      </div>
    );
  } catch (error) {
    console.error('Error verificando cookie de sesión:', error);
    redirect('/login');
  }
}
