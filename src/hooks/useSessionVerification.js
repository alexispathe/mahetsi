// src/app/profile/admin/dashboard/hooks/useSessionVerification.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useSessionVerification = (requiredPermissions = ['create', 'update']) => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifySession = async () => {
    try {
      const res = await fetch('/api/verify-session', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al verificar la sesión.');
      }

      const data = await res.json();
      const userPermissions = data.user.permissions;

      const hasPermissions = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (hasPermissions) {
        setIsVerified(true);
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Error en la verificación de sesión y permisos:', err);
      setError(err.message);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isVerified, loading, error };
};

export default useSessionVerification;
