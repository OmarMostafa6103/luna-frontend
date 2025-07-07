import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Title from './Title';
import ProductItem from './ProductItem';
import { backendUrl } from '../App';

// قسم لعرض أحدث المجموعات
const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب أحدث المنتجات
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/products/latest?per_page=10`);
        const result = await response.json();

        let products = [];
        if (result.status === 200) {
          if (Array.isArray(result.data)) {
            products = result.data;
          } else if (result.data && Array.isArray(result.data.comments)) {
            products = result.data.comments;
          } else {
            throw new Error('البيانات غير صالحة');
          }
          // تصفية المنتجات الصالحة فقط
          const validProducts = products.filter(
            (item) => item && item.product_id && item.product_name && item.product_image && typeof item.product_price === 'number'
          );
          setLatestProducts(validProducts);
        } else {
          setError('فشل جلب المنتجات: ' + (result.message || 'خطأ غير معروف'));
        }
      } catch (error) {
        setError('خطأ أثناء جلب المنتجات: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <Link
          to="/collection"
          className="inline-block mt-4 px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
        >
          استكشف المجموعة الكاملة
        </Link>
      </div>
    );
  }

  return (
    <div className="my-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8 text-2xl sm:text-3xl">
        <Title text1={'أحدث'} text2={'المجموعات'} />
        <p className="w-full sm:w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
          اكتشف أحدث الحلويات المصنوعة يدويًا، مثالية لكل لحظة حلوة.
        </p>
      </div>

      {latestProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          <p>لا توجد منتجات متاحة حاليًا.</p>
          <Link
            to="/collection"
            className="inline-block mt-4 px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
          >
            استكشف المجموعة الكاملة
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-8">
          {latestProducts.slice(0, 10).map((item) => (
            console.log(item),
            <div
              key={item.product_id}
              className="cursor-pointer rounded-md bg-white dark:bg-gray-800  shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-300"
            >
              <ProductItem
                key={item.product_id}
                id={item.product_id}
                image={[
                  item.product_image,
                  item.product_image1,
                  item.product_image2,
                  item.product_image3
                ].filter(Boolean)} // هذا يحذف القيم الفارغة إن وجدت
                name={item.product_name}
                price={item.product_price}
                description={item.product_description || 'لا يوجد وصف متاح'}
              />

            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          to="/collection"
          className="inline-block px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
        >
          استكشف المجموعة الكاملة
        </Link>
      </div>

      <div className="clear-both h-0"></div>
    </div>
  );
};

export default LatestCollection;