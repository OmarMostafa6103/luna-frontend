import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

// قسم لعرض المنتجات التي تمت زيارتها مؤخرًا
const VisitedProducts = () => {
  const { isLoggedIn } = useContext(ShopContext);
  const [visitedProducts, setVisitedProducts] = useState([]);
  const [shouldRender, setShouldRender] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);

  // جلب المنتجات المشاهدة
  useEffect(() => {
    if (!isLoggedIn) {
      setShouldRender(false);
      setLoading(false);
      return;
    }

    const fetchVisitedProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setShouldRender(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${backendUrl}/api/visited-products`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (response.data.status !== 200) {
          throw new Error(response.data.message || 'فشل جلب المنتجات المشاهدة');
        }

        const products = response.data.data || [];
        if (products.length === 0) {
          setShouldRender(false);
          setLoading(false);
          return;
        }

        const formattedProducts = products.map((product) => ({
          _id: product.product_id,
          product_id: product.product_id,
          name: product.product_name,
          description: product.product_description,
          image: product.product_image,
          price: parseFloat(product.product_price),
          quantity: parseInt(product.product_quantity),
          category: product.category?.category_name,
          category_id: product.category?.category_id,
        }));

        setVisitedProducts(formattedProducts);
        setShouldRender(true);
      } catch (error) {
        console.error('خطأ في جلب المنتجات المشاهدة:', error.response?.data || error.message);
        if (error.response?.status === 401 || error.response?.status === 422) {
          toast.error('جلسة تسجيل الدخول منتهية، يرجى تسجيل الدخول مرة أخرى', {
            style: { background: 'red', color: 'white' },
          });
          setShouldRender(false);
        } else {
          toast.error('فشل جلب المنتجات المشاهدة: ' + (error.message || 'خطأ غير معروف'), {
            style: { background: 'red', color: 'white' },
          });
        }
        setShouldRender(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitedProducts();
  }, [isLoggedIn]);

  // التحكم في التمرير اللانهائي
  const handleScroll = () => {
    if (scrollRef.current && !isScrolling.current) {
      const now = Date.now();
      // تجنب معالجة أحداث التمرير المتكررة (debounce)
      if (now - lastScrollTime.current < 200) return;
      lastScrollTime.current = now;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const itemWidth = window.innerWidth >= 1280 ? 220 + 24 : window.innerWidth >= 1024 ? 200 + 24 : window.innerWidth >= 768 ? 180 + 24 : window.innerWidth >= 400 ? 160 + 24 : 160 + 24;
      const totalWidth = visitedProducts.length * itemWidth;

      if (totalWidth === 0) return;

      // إعادة ضبط التمرير للحلقة اللانهائية فقط عند الضرورة
      if (scrollLeft <= 0) {
        scrollRef.current.scrollLeft = totalWidth - clientWidth;
      } else if (scrollLeft >= scrollWidth - clientWidth) {
        scrollRef.current.scrollLeft = clientWidth;
      }
    }
  };

  // التمرير يسارًا أو يمينًا
  const scroll = (direction) => {
    if (scrollRef.current) {
      isScrolling.current = true;
      const { clientWidth } = scrollRef.current;
      const itemWidth = window.innerWidth >= 1280 ? 220 + 24 : window.innerWidth >= 1024 ? 200 + 24 : window.innerWidth >= 768 ? 180 + 24 : window.innerWidth >= 400 ? 160 + 24 : 160 + 24;
      const visibleItems = window.innerWidth >= 1280 ? 5 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : window.innerWidth >= 400 ? 2 : 1;
      const scrollStep = window.innerWidth < 768 ? itemWidth : visibleItems * itemWidth;

      // التمرير لليمين أو اليسار
      if (direction === 'right') {
        scrollRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
      } else if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      }

      // إعادة ضبط التمرير للتثبيت على العنصر الأقرب
      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollLeft } = scrollRef.current;
          const nearestItem = Math.round(scrollLeft / itemWidth) * itemWidth;
          scrollRef.current.scrollTo({ left: nearestItem, behavior: 'smooth' });
        }
        isScrolling.current = false;
      }, 500); // تقليل التأخير لاستجابة أسرع
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!shouldRender) {
    return null;
  }

  return (
    <div id="visited-products" className="my-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8 text-2xl sm:text-3xl">
        <Title text1={'المشاهدة'} text2={'مؤخرًا'} />
        <p className="w-full sm:w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
          استكشف المنتجات التي شاهدتها مؤخرًا.
        </p>
      </div>

      <div className="relative max-w-[1440px] mx-auto">
        {/* زر التمرير لليسار */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 sm:p-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 z-20 border border-gray-200 dark:border-gray-600 opacity-80 hover:opacity-100"
          aria-label="المنتج السابق"
        >
          <i className="fa-solid fa-arrow-left text-base sm:text-lg"></i>
        </button>

        {/* قائمة المنتجات */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide space-x-6 px-4 py-4 rounded-xl snap-x snap-proximity touch-pan-x bg-gray-50 dark:bg-gray-900"
          style={{ touchAction: 'pan-x', WebkitOverflowScrolling: 'touch' }}
        >
          {visitedProducts.map((item, index) => (
            console.log(item),

            <div
              key={`${item.product_id}-${index}`}
              className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] cursor-pointer rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 transform hover:scale-105 transition-all duration-300 flex-shrink-0 snap-start bg-white dark:bg-gray-800"
            >
              <ProductItem
                id={item.product_id}
                name={item.name}
                image={[
                  item.image, // = product_image
                  item.product_image1,
                  item.product_image2,
                  item.product_image3
                ].filter(Boolean)}
                price={item.price}
                description={item.description || 'لا يوجد وصف متاح'}
              />
            </div>
          ))}
        </div>

        {/* زر التمرير لليمين */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 sm:p-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 z-20 border border-gray-200 dark:border-gray-600 opacity-80 hover:opacity-100"
          aria-label="المنتج التالي"
        >
          <i className="fa-solid fa-arrow-right text-base sm:text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default VisitedProducts;











