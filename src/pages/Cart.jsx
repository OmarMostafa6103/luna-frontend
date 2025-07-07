//? ========= START API ===========
//? ========= START API ===========

// import React, { useContext, useEffect, useState, useRef } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import { assets } from '../assets/assets';
// import { toast } from 'react-toastify';
// import { backendUrl } from '../App';

// const placeholderImage = '/path/to/placeholder-image.jpg';

// const Cart = () => {
//   const { products, currency, cartData, updateQuantity, navigate, showCart, isLoggedIn, getCartAmount, delivery_fee, removeFromCart } = useContext(ShopContext);
//   const [localCartData, setLocalCartData] = useState([]);
//   const [loadingItems, setLoadingItems] = useState({});
//   const hasFetchedCart = useRef(false);

//   useEffect(() => {
//     if (!hasFetchedCart.current) {
//       hasFetchedCart.current = true;
//       showCart();
//     }
//   }, []);

//   useEffect(() => {
//     const updatedCartData = cartData.map(item => {
//       const cleanedPrice = typeof item.price === 'string'
//         ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
//         : parseFloat(item.price) || 0;
//       return {
//         ...item,
//         price: cleanedPrice,
//       };
//     });
//     setLocalCartData(updatedCartData);
//     setLoadingItems({});
//   }, [cartData]);

//   const getImageUrl = (imageUrl, productId) => {
//     if (!imageUrl || typeof imageUrl !== 'string') {
//       return placeholderImage;
//     }
//     if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
//       return imageUrl;
//     }
//     return `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
//   };

//   const handleQuantityChange = async (itemId, newQuantity) => {
//     if (loadingItems[itemId]) return;
//     setLoadingItems((prev) => ({ ...prev, [itemId]: true }));

//     try {
//       const cartItem = cartData.find((item) => item.item_id === itemId);
//       if (!cartItem) {
//         throw new Error('العنصر غير موجود في السلة');
//       }
//       const product = products.find((p) => p.product_id === cartItem.product_id);
//       if (!product) {
//         throw new Error('المنتج غير موجود');
//       }

//       const availableQuantity = product.quantity || 0;
//       if (newQuantity > availableQuantity) {
//         toast.error(`لا يمكن تحديد أكثر من ${availableQuantity} وحدة من هذا المنتج!`, {
//           style: { background: 'red', color: 'white' },
//         });
//         return;
//       }

//       await updateQuantity(itemId, newQuantity, true);
//     } catch (error) {
//       toast.error(error.message || 'فشل في تحديث الكمية', {
//         style: { background: 'red', color: 'white' },
//       });
//     } finally {
//       setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const cartAmount = getCartAmount();
//   const shippingFees = delivery_fee;

//   return (
//     <div className="border-t pt-14">
//       <div className="text-2xl mb-3">
//         <Title text1="YOUR" text2="CART" />
//       </div>
//       <div>
//         {localCartData.length > 0 ? (
//           localCartData.map((item) => {
//             const productData = products.find((product) => product.product_id === item.product_id);
//             const price = parseFloat(item.price) || parseFloat(productData?.price) || 0;

//             return (
//               <div
//                 className="py-4 border-t border-b grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
//                 key={item.item_id}
//               >
//                 <div className="flex items-start gap-6">
//                   <img
//                     src={
//                       getImageUrl(item.image, item.product_id) ||
//                       getImageUrl(productData?.image?.[0], item.product_id) ||
//                       placeholderImage
//                     }
//                     alt={productData?.name || item.product_name}
//                     className="w-16 sm:w-20"
//                     onError={(e) => {
//                       e.target.src = placeholderImage;
//                       e.target.onerror = null;
//                     }}
//                   />
//                   <div>
//                     <p className="text-xs sm:text-lg font-medium">{productData?.name || item.product_name}</p>
//                     <div className="flex items-center gap-5 mt-2">
//                       <p className="text-sm font-semibold text-yellow-500 dark:text-yellow-400">
//                         {currency}
//                         {price.toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => {
//                       if (item.quantity > 0) {
//                         handleQuantityChange(item.item_id, item.quantity - 1);
//                       }
//                     }}
//                     className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//                     disabled={loadingItems[item.item_id] || item.quantity <= 0}
//                   >
//                     -
//                   </button>
//                   <span className="text-lg text-gray-800 dark:text-white min-w-[2rem] flex items-center justify-center">
//                     {loadingItems[item.item_id] ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
//                     ) : (
//                       item.quantity
//                     )}
//                   </span>
//                   <button
//                     onClick={() => {
//                       handleQuantityChange(item.item_id, item.quantity + 1);
//                     }}
//                     className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//                     disabled={loadingItems[item.item_id]}
//                   >
//                     +
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => removeFromCart(item.item_id)}
//                   className="w-5 mr-4 sm:w-10 cursor-pointer"
//                   disabled={loadingItems[item.item_id]}
//                 >
//                   <img
//                     src={assets.bin_icon}
//                     alt="delete"
//                     className="w-full h-full"
//                   />
//                 </button>

//               </div>
//             );
//           })
//         ) : (
//           <div className="w-full mt-20 flex flex-col justify-center items-center">
//             <p className="font-medium mt-2 text-lg sm:text-2xl">Your cart is empty</p>
//           </div>
//         )}
//       </div>
//       <div className="flex justify-end my-20">
//         <div className="w-full sm:w-[450px]">
//           <div className="bg-white dark:bg-[#1a2338] pt-4 pb-2 px-4 sm:px-6 border border-gray-200 dark:border-gray-600 rounded-lg">
//             <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white">
//               <p>Subtotal:</p>
//               <p>{cartAmount.toFixed(2)} EGP</p>
//             </div>
//             {shippingFees > 0 && (
//               <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white mt-1">
//                 <p>Shipping Fees:</p>
//                 <p>{shippingFees.toFixed(2)} EGP</p>
//               </div>
//             )}
//             <div className="flex justify-between text-base font-semibold text-gray-800 dark:text-white mt-2">
//               <p>Total:</p>
//               <p>{(cartAmount + shippingFees).toFixed(2)} EGP</p>
//             </div>
//           </div>
//           <div className="w-full text-center">
//             <button
//               onClick={() => {
//                 navigate('/place-order');
//               }}
//               className="text-md my-8 px-10 bg-red-600 text-white py-3"
//               disabled={localCartData.length === 0}
//             >
//               PROCEED TO CHECKOUT
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

//? ========= end API ===========
//? ========= end API ===========










import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const placeholderImage = '/path/to/placeholder-image.jpg';

const Cart = () => {
  const { products, currency, cartData, updateQuantity, navigate, showCart, isLoggedIn, cartTotalPrice, delivery_fee, removeFromCart } = useContext(ShopContext);
  const [localCartData, setLocalCartData] = useState([]);
  const [loadingItems, setLoadingItems] = useState({});
  const hasFetchedCart = useRef(false);

  useEffect(() => {
    if (!hasFetchedCart.current) {
      hasFetchedCart.current = true;
      showCart();
    }
  }, []);

  useEffect(() => {
    const updatedCartData = cartData.map(item => {
      const cleanedPrice = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
        : parseFloat(item.price) || 0;
      return {
        ...item,
        price: cleanedPrice,
      };
    });
    setLocalCartData(updatedCartData);
    setLoadingItems({});
  }, [cartData]);

  const getImageUrl = (imageUrl, productId) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return placeholderImage;
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (loadingItems[itemId]) return;
    setLoadingItems((prev) => ({ ...prev, [itemId]: true }));

    try {
      const cartItem = cartData.find((item) => item.item_id === itemId);
      if (!cartItem) {
        throw new Error('العنصر غير موجود في السلة');
      }
      const product = products.find((p) => p.product_id === cartItem.product_id);
      if (!product) {
        throw new Error('المنتج غير موجود');
      }

      const availableQuantity = product.quantity || 0;
      if (newQuantity > availableQuantity) {
        toast.error(`لا يمكن تحديد أكثر من ${availableQuantity} وحدة من هذا المنتج!`, {
          style: { background: 'red', color: 'white' },
        });
        return;
      }

      await updateQuantity(itemId, newQuantity, true);
    } catch (error) {
      toast.error(error.message || 'فشل في تحديث الكمية', {
        style: { background: 'red', color: 'white' },
      });
    } finally {
      setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const shippingFees = delivery_fee;

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>
      <div>
        {localCartData.length > 0 ? (
          localCartData.map((item) => {
            const productData = products.find((product) => product.product_id === item.product_id);
            const price = parseFloat(item.price) || parseFloat(productData?.price) || 0;

            return (
              <div
                className="py-4 border-t border-b grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                key={item.item_id}
              >
                <div className="flex items-start gap-6">
                  <img
                    src={
                      getImageUrl(item.image, item.product_id) ||
                      getImageUrl(productData?.image?.[0], item.product_id) ||
                      placeholderImage
                    }
                    alt={productData?.name || item.product_name}
                    className="w-16 sm:w-20"
                    onError={(e) => {
                      e.target.src = placeholderImage;
                      e.target.onerror = null;
                    }}
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">{productData?.name || item.product_name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <p className="text-sm font-semibold text-yellow-500 dark:text-yellow-400">
                        {currency}
                        {price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (item.quantity > 0) {
                        handleQuantityChange(item.item_id, item.quantity - 1);
                      }
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    disabled={loadingItems[item.item_id] || item.quantity <= 0}
                  >
                    -
                  </button>
                  <span className="text-lg text-gray-800 dark:text-white min-w-[2rem] flex items-center justify-center">
                    {loadingItems[item.item_id] ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
                    ) : (
                      item.quantity
                    )}
                  </span>
                  <button
                    onClick={() => {
                      handleQuantityChange(item.item_id, item.quantity + 1);
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    disabled={loadingItems[item.item_id]}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.item_id)}
                  className="w-5 mr-4 sm:w-10 cursor-pointer"
                  disabled={loadingItems[item.item_id]}
                >
                  <img
                    src={assets.bin_icon}
                    alt="delete"
                    className="w-full h-full"
                  />
                </button>
              </div>
            );
          })
        ) : (
          <div className="w-full mt-20 flex flex-col justify-center items-center">
            <p className="font-medium mt-2 text-lg sm:text-2xl">Your cart is empty</p>
          </div>
        )}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <div className="bg-white dark:bg-[#1a2338] pt-4 pb-2 px-4 sm:px-6 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white">
              <p>Subtotal:</p>
              <p>{cartTotalPrice.toFixed(2)} EGP</p>
            </div>
            {shippingFees > 0 && (
              <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white mt-1">
                <p>Shipping Fees:</p>
                <p>{shippingFees.toFixed(2)} EGP</p>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-gray-800 dark:text-white mt-2">
              <p>Total:</p>
              <p>{(cartTotalPrice + shippingFees).toFixed(2)} EGP</p>
            </div>
          </div>
          <div className="w-full text-center">
            <button
              onClick={() => {
                navigate('/place-order');
              }}
              className="text-md my-8 px-10 bg-red-600 text-white py-3"
              disabled={localCartData.length === 0}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;