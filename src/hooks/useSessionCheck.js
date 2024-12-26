// src/hooks/useSessionCheck.js
//Se encarga de verificar que la sesion exista para renderizar contenido
import { useEffect, useState } from 'react';

export default function useSessionCheck() {
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/sessionCheck', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.sessionActive) {
            setSessionActive(true);
          }
        }
      } catch (error) {
        console.error('Error verificando la sesión:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { loading, sessionActive };
}
