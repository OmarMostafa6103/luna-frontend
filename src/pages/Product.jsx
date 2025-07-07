//? ========= START API ===========
//? ========= START API ===========



import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import RelatedProduct from '../components/RelatedProduct';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart, cartData, updateQuantity } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const productSectionRef = useRef(null);

  const cartItem = cartData.find((item) => item.product_id === productId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const fetchProductData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/products/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch product');
      }

      const product = response.data.data;
      const formattedProduct = {
        _id: product.product_slugs || product.id || '',
        product_id: product.product_id || productId,
        name: product.product_name || 'Unnamed Product',
        description: product.product_description || '',
        image: [
          product.product_image,
          product.product_image1,
          product.product_image2,
          product.product_image3,
        ].filter((img) => img),
        price: parseFloat(product.product_price) || 0,
        quantity: parseInt(product.product_quantity) || 0,
        category: product.category?.category_name || 'Unknown',
        category_id: product.category?.categor_id || product.category?.category_id || product.category_id || null,
      };

      setProductData(formattedProduct);
      setSelectedImage(formattedProduct.image[0] || '/path/to/placeholder-image.jpg');
    } catch (error) {
      setError(error.response?.data?.message || 'فشل في جلب بيانات المنتج');
      toast.error(error.response?.data?.message || 'فشل في جلب بيانات المنتج', {
        style: { background: 'red', color: 'white' },
      });
      setProductData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (productData) {
      if (quantityInCart + 1 > productData.quantity) {
        toast.error(`لا يمكن تحديد أكثر من ${productData.quantity} وحدة في السلة!`, {
          style: { background: 'red', color: 'white' },
        });
        return;
      }
      addToCart(productData.product_id, 1, productData.price, productData.quantity);
    } else {
      toast.error('لا يمكن إضافة المنتج إلى السلة: البيانات غير متاحة', {
        style: { background: 'red', color: 'white' },
      });
    }
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity > productData.quantity) {
      toast.error(`لا يمكن تحديد أكثر من ${productData.quantity} وحدة في السلة!`, {
        style: { background: 'red', color: 'white' },
      });
      return;
    }
    updateQuantity(productId, newQuantity, false);
  };

  const scrollToProductSection = () => {
    if (productSectionRef.current) {
      const topPosition = productSectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 pt-10">
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={fetchProductData}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!productData && !isLoading) {
    return (
      <div className="text-center text-gray-500 pt-10">
        <p className="text-lg mb-4">المنتج غير موجود أو حدث خطأ في تحميل البيانات.</p>
        <button
          onClick={fetchProductData}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex flex-col gap-2 w-full sm:w-[20%]">
            {Array.isArray(productData.image) && productData.image.length > 1 ? (
              productData.image.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${productData.name} thumbnail ${idx + 1}`}
                  className={`w-full h-20 object-cover rounded cursor-pointer ${selectedImage === img ? 'border-2 border-green-600' : 'border border-gray-300'}`}
                  onClick={() => setSelectedImage(img)}
                  onError={(e) => {
                    e.target.src = '/path/to/placeholder-image.jpg';
                    e.target.onerror = null;
                  }}
                />
              ))
            ) : (
              <img
                src={productData.image || '/path/to/placeholder-image.jpg'}
                alt={`${productData.name} thumbnail`}
                className="w-full h-20 object-cover rounded border border-gray-300"
                onError={(e) => {
                  e.target.src = '/path/to/placeholder-image.jpg';
                  e.target.onerror = null;
                }}
              />
            )}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              src={selectedImage}
              alt={productData.name}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.target.src = '/path/to/placeholder-image.jpg';
                e.target.onerror = null;
              }}
            />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-3" alt="star" />
            <img src={assets.star_icon} className="w-3" alt="star" />
            <img src={assets.star_icon} className="w-3" alt="star" />
            <img src={assets.star_icon} className="w-3" alt="star" />
            <img src={assets.star_dull_icon} className="w-3" alt="dull star" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency} {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => handleUpdateQuantity(quantityInCart - 1)}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                -
              </button>
              <span className="text-lg text-gray-800 dark:text-white">{quantityInCart}</span>
              <button
                onClick={() => handleUpdateQuantity(quantityInCart + 1)}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-8 py-3 text-sm active:bg-gray-700 text-white bg-red-600 hover:bg-red-500 mt-8"
            >
              إضافة إلى السلة
            </button>
          )}
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm mt-5 flex flex-col gap-1">
            <p>منتج أصلي 100%.</p>
            <p>الدفع عند الاستلام متاح لهذا المنتج.</p>
            <p>سياسة إرجاع واستبدال سهلة خلال 7 أيام فقط.</p>
          </div>
        </div>
      </div>
      <div className="mt-20" ref={productSectionRef}>
        <div className="flex">
          <b className="border px-5 py-3 text-sm">الوصف</b>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm">
          <p>{productData.description || 'لا يوجد وصف متاح'}</p>
        </div>
      </div>
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
        scrollToProduct={scrollToProductSection}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
//? ========= end API ===========
//? ========= end API ===========
