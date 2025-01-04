import { FaSearch, FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";

export default function Icons({ isHovered, textColor, handleSearchClick, handleFavoritesClick, cartCount, handleCartClick }) {
  const redirectProfile =()=> {
    window.location.href ='/profile/user'
  }
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
            <FaUser
                className={`cursor-pointer text-lg ${isHovered ? "text-black" : textColor} hover:text-gray-700`}
                onClick={redirectProfile}
                aria-label="Perfil de usuario"
            />
        </div>
    );
}
