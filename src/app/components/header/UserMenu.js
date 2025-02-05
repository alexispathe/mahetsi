import { useState, useEffect, useRef } from 'react';
import { FaUser, FaSignOutAlt, FaUserFriends } from 'react-icons/fa';
import useLogout from '@/hooks/useLogout';

export default function UserMenu({ currentUser, isHovered, textColor }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleLogout } = useLogout();
  const menuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const redirectProfile = () => {
    window.location.href = '/profile/user';
  };

  return (
    <div className="relative">
      {/* Icono de usuario */}
      <FaUser
        onClick={toggleMenu}
        className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
        aria-label="Perfil de usuario"
      />
      
      {/* Menú desplegable */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-10 right-0 w-48 bg-white shadow-lg rounded-lg p-4 mt-2 z-10 border border-gray-200">
          {/* Información del usuario */}
          <div className="flex flex-col items-center">
            {/* Inicial del usuario */}
            <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white mb-2">
              <span className="text-xl">{currentUser?.email[0].toUpperCase()}</span>
            </div>
            {/* Correo del usuario */}
            <p className="text-sm font-semibold">{currentUser?.email}</p>
          </div>
          
          {/* Separador */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Opciones */}
          <div className="text-sm">
            <button 
              onClick={redirectProfile} 
              className="w-full text-left flex items-center hover:bg-gray-100 py-2 px-3 rounded-md mb-2 transition duration-200 ease-in-out transform hover:scale-105"
            >
              <FaUserFriends className="mr-2 text-sm" />
              Perfil
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center hover:bg-gray-100 py-2 px-3 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
            >
              <FaSignOutAlt className="mr-2 text-sm" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
