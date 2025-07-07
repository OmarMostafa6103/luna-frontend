import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const FavoritesMenu = ({ onClose }) => {
  const { favorites, removeFromFavorites } = useContext(ShopContext);
  // اعرض فقط آخر 4 منتجات (الأحدث أولاً)
  const latestFavorites = [...favorites].slice(-4).reverse();

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
          المفضلة
          {favorites.length > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-pink-600 text-white rounded-full">
              {favorites.length}
            </span>
          )}
        </span>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">✕</button>
      </div>
      {favorites.length === 0 ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-300">لا توجد منتجات مفضلة بعد.</div>
      ) : (
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
          {latestFavorites.map((item) => (
            <div key={item.product_id} className="flex items-center gap-3 p-3">
              <img
                src={Array.isArray(item.image) ? item.image[0] : item.image || "/path/to/placeholder-image.jpg"}
                alt={item.name}
                className="w-16 h-16 rounded object-cover border shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">{item.price} EGP</p>
              </div>
              <button
                onClick={() => removeFromFavorites(item.product_id)}
                className="w-8 h-8 flex items-center justify-center text-pink-600 hover:text-red-700 bg-pink-100 hover:bg-pink-200 rounded-full text-lg"
                title="إزالة من المفضلة"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link to="/favorites" className="text-green-700 font-semibold hover:underline" onClick={onClose}>
          عرض كل المفضلة
        </Link>
      </div>
    </div>
  );
};

export default FavoritesMenu; 