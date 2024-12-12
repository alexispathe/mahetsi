// src/app/login/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/libs/firebaseClient';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const idToken = await user.getIdToken();
        // Enviar al API route para crear la cookie
        const res = await fetch('/api/sessionLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        if (res.ok) {
          // Redirigir al perfil
          router.push('/profile');
        } else {
          console.error('Error al crear sesión:', await res.text());
        }
      }
    } catch (error) {
      console.error('Error con el login:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Iniciar Sesión</h1>
      <p>Autenticación con Google</p>
      <button onClick={handleGoogleLogin} disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar con Google'}
      </button>
    </div>
  );
}
