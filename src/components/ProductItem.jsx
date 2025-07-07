//? ========= START API ===========
//? ========= START API ===========

import React, { useContext, useState, memo } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import ModalPortal from './ModalPortal';

const ProductItem = ({ id, image, name, price, description }) => {
  const { currency, addToCart, cartData, updateQuantity, addToFavorites, removeFromFavorites, isProductFavorited } = useContext(ShopContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    Array.isArray(image) && image.length > 0 ? image[0] : image || '/path/to/placeholder-image.jpg'
  );
  const [isUpdating, setIsUpdating] = useState(false); // حالة جديدة لتتبع التحميل

  const cartItem = cartData.find((item) => item.product_id === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isFavorited = isProductFavorited(id);

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const images = Array.isArray(image) ? image : [image].filter((img) => img);

  // تحقق من السعر وتنسيقه
  const displayPrice = price && price > 0 ? `${currency} ${price}` : 'السعر غير متاح';

  // دالة لتحديث الكمية مع إدارة حالة التحميل
  const handleUpdateQuantity = async (newQuantity) => {
    setIsUpdating(true); // إظهار مؤشر التحميل
    try {
      await updateQuantity(id, newQuantity, false);
    } finally {
      setIsUpdating(false); // إخفاء مؤشر التحميل بعد اكتمال العملية
    }
  };

  // دالة لإضافة المنتج إلى السلة مع إدارة حالة التحميل
  const handleAddToCart = async () => {
    setIsUpdating(true); // إظهار مؤشر التحميل
    try {
      await addToCart(id, 1, price);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites(id);
    } else {
      addToFavorites({ product_id: id, image, name, price, description });
    }
  };

  return (
    <div className="relative border rounded-xl shadow-md hover:shadow-lg transition bg-white dark:bg-gray-800">
      <Link to={`/product/${id}`} className="block">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={images[0] || '/path/to/placeholder-image.jpg'}
            alt={name}
            className="w-full h-48 object-cover rounded-t-xl hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/path/to/placeholder-image.jpg';
              e.target.onerror = null;
            }}
            loading="lazy"
          />
          <button
            onClick={openModal}
            className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white hover:scale-105 transition-all duration-200 flex items-center justify-center"
          >
            <i className="fas fa-up-right-and-down-left-from-center text-gray-700 text-base"></i>
          </button>
        </div>
        <div className="pt-3 px-4 text-right">
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{name}</p>
          <p className={`text-sm font-semibold mt-1 ${price && price > 0 ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500'}`}>
            {displayPrice}
          </p>
        </div>
      </Link>
      <div className="flex justify-between items-center mt-3 px-4 pb-4">
        {quantityInCart > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateQuantity(quantityInCart - 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              disabled={isUpdating}
            >
              -
            </button>
            {isUpdating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-600"></div>
            ) : (
              <span className="text-sm text-gray-800 dark:text-white">{quantityInCart}</span>
            )}
            <button
              onClick={() => handleUpdateQuantity(quantityInCart + 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              disabled={isUpdating}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="text-white bg-green-700 hover:bg-green-800 px-4 py-1.5 text-sm rounded-lg transition-colors duration-200 flex items-center justify-center"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'إضافة إلى السلة'
            )}
          </button>
        )}
        <button
          onClick={handleFavorite}
          className={`text-sm p-2 rounded-full transition-colors duration-200 ${isFavorited ? 'text-pink-600 bg-pink-100' : 'text-gray-600 bg-gray-100'} hover:bg-pink-200`}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>

      {isModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]" onClick={closeModal}>
            <div
              className="bg-white rounded-xl p-6 max-w-5xl w-full relative flex flex-col md:flex-row-reverse gap-6 mx-4 md:mx-auto"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                onClick={closeModal}
                className="absolute top-2 left-2 text-gray-600 hover:text-gray-800 bg-gray-200 rounded-full p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="w-full md:w-1/2">
                <img
                  src={selectedImage}
                  alt={name}
                  className="w-full h-80 object-contain rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = '/path/to/placeholder-image.jpg';
                    e.target.onerror = null;
                  }}
                />
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        className={`w-16 h-16 object-cover rounded border-2 cursor-pointer ${selectedImage === img ? 'border-green-600' : 'border-gray-300'}`}
                        onClick={() => setSelectedImage(img)}
                        onError={(e) => {
                          e.target.src = '/path/to/placeholder-image.jpg';
                          e.target.onerror = null;
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{name}</h2>
                  <p className="text-gray-600 text-sm leading-loose mb-4">
                    {description || 'لا يوجد وصف متاح'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-lg font-bold ${price && price > 0 ? 'text-yellow-700' : 'text-gray-500'}`}>
                      {displayPrice}
                    </span>
                    {price && price > 0 && (
                      <span className="text-sm text-gray-500">شامل الضرائب</span>
                    )}
                  </div>
                  {quantityInCart > 0 ? (
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => handleUpdateQuantity(quantityInCart - 1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        disabled={isUpdating}
                      >
                        -
                      </button>
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-600"></div>
                      ) : (
                        <span className="text-sm text-gray-800 dark:text-white">{quantityInCart}</span>
                      )}
                      <button
                        onClick={() => handleUpdateQuantity(quantityInCart + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        disabled={isUpdating}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="bg-green-800 text-white py-2 px-4 w-full rounded-lg hover:bg-green-900 mb-3 flex items-center justify-center"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        'إضافة إلى السلة'
                      )}
                    </button>
                  )}
                  <button
                    className="border border-green-800 text-green-800 py-2 px-4 w-full rounded-lg hover:bg-green-50"
                  >
                    اشترِ الآن
                  </button>
                  <button
                    onClick={handleFavorite}
                    className={`mt-2 w-full py-2 px-4 rounded-lg border ${isFavorited
                      ? 'border-pink-600 text-pink-600 bg-pink-100'
                      : 'border-gray-300 text-gray-600'
                      }`}
                  >
                    {isFavorited ? '❤️ تمت الإضافة إلى المفضلة' : '🤍 إضافة إلى المفضلة'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}


    </div>
  );
};

export default memo(ProductItem);

//? ========= end API ===========
//? ========= end API ===========

