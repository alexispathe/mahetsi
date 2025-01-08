import { FaSearch, FaHeart,  FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import UserMenu from "./UserMenu";


export default function Icons({isHovered, textColor, handleSearchClick, handleFavoritesClick, cartCount, handleCartClick, currentUser }) { // Recibimos currentUser
   

    return (
        <div className="flex items-center space-x-4">
            <FaSearch
                className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
                onClick={handleSearchClick}
                aria-label="Buscar"
            />
            <FaHeart
                className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
                onClick={handleFavoritesClick}
                aria-label="Favoritos"
            />
            {!currentUser ?  // Verificamos si el usuario está autenticado
                <div className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}>
                    <Link href={'/login'} >Ingresar</Link> {/* Si no está autenticado, mostramos el enlace */}
                </div>
                : <UserMenu
                    textColor={textColor}
                    currentUser={currentUser}
                    isHovered={isHovered}
                />}

            <div className="relative">
                <FaShoppingCart
                    className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
                    onClick={handleCartClick}
                    aria-label="Carrito de compras"
                />
                {cartCount > 0 && (
                    <span
                        className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center"
                        aria-label={`Tienes ${cartCount} productos en el carrito`}
                    >
                        {cartCount}
                    </span>
                )}
            </div>
        </div>
    );
}
