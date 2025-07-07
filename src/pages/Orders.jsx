//? ========= START API ===========
//? ========= START API ===========

import React, { useContext, useEffect, useState, useRef } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Orders = () => {
  const { currency, userData, isLoggedIn, backendUrl, navigate, isAuthChecked } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasShownAuthWarning = useRef(false);

  // عرض تحذير تسجيل الدخول في حالة انتهاء الجلسة أو عدم صلاحية التوكن
  const showAuthWarning = () => {
    hasShownAuthWarning.current = true;
    toast.warn(
      <div>
        جلسة تسجيل الدخول منتهية أو غير صالحة. يرجى تسجيل الدخول مرة أخرى.
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            navigate('/login');
          }}
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
        >
          تسجيل الدخول
        </button>
      </div>,
      {
        style: { background: 'orange', color: 'white' },
        autoClose: false,
      }
    );
  };

  useEffect(() => {
    // جلب الطلبات من الخادم
    const fetchOrders = async (retries = 3, delay = 1000) => {
      setIsLoading(true);
      setError(null);

      if (!isLoggedIn) {
        setIsLoading(false);
        toast.error('يرجى تسجيل الدخول لعرض طلباتك', {
          style: { background: 'red', color: 'white' },
        });
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        setError('لم يتم العثور على توكن تسجيل الدخول');
        toast.error('يرجى تسجيل الدخول مرة أخرى', {
          style: { background: 'red', color: 'white' },
        });
        navigate('/login');
        return;
      }

      try {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await axios.get(`${backendUrl}/api/orders`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 200) {
              const orders = response.data.data || [];
              setOrderData(orders);
              break;
            } else {
              throw new Error(response.data.message || 'فشل جلب الطلبات');
            }
          } catch (err) {
            console.error('Error fetching orders:', err);
            if (i === retries - 1) {
              throw err; // إرسال الخطأ للتعامل معه في الكتلة الخارجية
            }
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } catch (err) {
        console.error('Final error in fetchOrders:', err);
        setError('حدث خطأ أثناء جلب الطلبات: ' + (err.response?.data?.message || err.message || 'خطأ غير معروف'));
        toast.error('حدث خطأ أثناء جلب الطلبات', {
          style: { background: 'red', color: 'white' },
        });

        if (err.response?.status === 401 || err.response?.status === 422) {
          showAuthWarning();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthChecked) {
      const timer = setTimeout(() => {
        fetchOrders();
      }, 500);
      return () => clearTimeout(timer); // تنظيف المؤقت عند إلغاء التأثير
    }

    fetchOrders();
  }, [isLoggedIn, userData, backendUrl, navigate, isAuthChecked]);

  // عرض حالة الطلب عند النقر على زر التتبع
  const orderStatus = (status) => {
    toast.success(`حالة طلبك: ${status}`);
  };

  return (
    <div className="border-t py-20">
      <div className="text-2xl">
        <Title text1="طلباتي" text2="" />
      </div>
      <div>
        {isLoading ? (
          <div className="w-full mt-20 flex flex-col justify-center items-center">
            <p className="font-medium mt-2 text-lg sm:text-2xl">جارٍ تحميل الطلبات...</p>
          </div>
        ) : error ? (
          <div className="w-full mt-20 flex flex-col justify-center items-center">
            <p className="font-medium mt-2 text-lg sm:text-2xl text-red-500">{error}</p>
          </div>
        ) : orderData.length > 0 ? (
          orderData.map((order, index) => (
            <div
              key={index}
              className="py-4 border-t border-b flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex flex-col gap-4">
                {order.order_item && order.order_item.length > 0 ? (
                  order.order_item.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4">
                      <img
                        src={item.product_image || assets.placeholder_image}
                        alt={item.product_name}
                        className="w-28 h-28 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <div>
                          <p>السعر: {currency}{item.total_price}</p>
                          <p>الكمية: {item.quantity}</p>
                        </div>
                        <p>تاريخ الطلب: {order.order_date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>لا توجد منتجات في هذا الطلب</p>
                )}
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${order.order_status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'}`}
                  ></p>
                  <p className="text-sm md:text-base">{order.order_status}</p>
                </div>
                <button
                  onClick={() => orderStatus(order.order_status)}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  تتبع الطلب
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full mt-20 flex flex-col justify-center items-center">
            <p className="font-medium mt-2 text-lg sm:text-2xl">ليس لديك أي طلبات بعد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

//? ========= end API ===========
//? ========= end API ===========
