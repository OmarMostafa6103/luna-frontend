//? ========= START API ===========
//? ========= START API ===========
//? ========= START API ===========

import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Togglemode from './Tooglemode';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import FavoritesMenu from "./FavoritesMenu";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingItems, setLoadingItems] = useState({});
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [showFavoritesMenu, setShowFavoritesMenu] = useState(false);
  const { products, setShowSearch, getCartCount, isLoggedIn, userData, logout, navigate, currency, cartData, cartTotalPrice, showCart, removeFromCart } = useContext(ShopContext);
  const profileModalRef = useRef(null);
  const profileIconRef = useRef(null);
  const searchModalRef = useRef(null);
  const cartModalRef = useRef(null);

  useEffect(() => {
    if (cartModalVisible || searchModalVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [cartModalVisible, searchModalVisible]);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setProfileModalVisible((prev) => !prev);
  };

  const handleSearchClick = (e) => {
    e.stopPropagation();
    setSearchModalVisible((prev) => !prev);
    setShowSearch(true);
  };

  const handleCartClick = async (e) => {
    e.stopPropagation();
    setIsLoadingCart(true);
    try {
      await showCart();
      setCartModalVisible((prev) => !prev);
    } catch (error) {
      toast.error('فشل في تحميل السلة، حاول مرة أخرى!', {
        style: { background: 'red', color: 'white' },
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleCloseSearch = () => {
    setSearchModalVisible(false);
    setShowSearch(false);
    setSearchTerm('');
  };

  const handleCloseCart = () => {
    setCartModalVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target)
      ) {
        setProfileModalVisible(false);
      }
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target)
      ) {
        setSearchModalVisible(false);
        setShowSearch(false);
        setSearchTerm('');
      }
      if (
        cartModalRef.current &&
        !cartModalRef.current.contains(event.target)
      ) {
        setCartModalVisible(false);
      }
    };

    if (profileModalVisible || searchModalVisible || cartModalVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileModalVisible, searchModalVisible, cartModalVisible, setShowSearch]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (productId) => {
    setSearchModalVisible(false);
    setSearchTerm('');
    setShowSearch(false);
    navigate(`/product/${productId}`);
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
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
      if (quantity > availableQuantity) {
        toast.error(`لا يمكن تحديد أكثر من ${availableQuantity} وحدة من هذا المنتج!`, {
          style: { background: 'red', color: 'white' },
        });
        return;
      }

      if (quantity <= 0) {
        quantity = 0;
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${backendUrl}/api/cart?_method=PUT`,
        {
          items: [{ item_id: itemId, quantity }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === 200) {
        await showCart(); // سيقوم بتحديث cartTotalPrice
        toast.success('تم تحديث الكمية بنجاح!', {
          style: { background: 'green', color: 'white' },
        });
      } else {
        throw new Error(response.data.message || 'فشل في تحديث الكمية');
      }
    } catch (error) {
      toast.error(error.message || 'فشل في تحديث الكمية', {
        style: { background: 'red', color: 'white' },
      });
    } finally {
      setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const shippingFees = 100.00;

  return (
    <div id="homepage" className="flex items-center justify-between py-5 lg:py-9 font-medium">
      <Link to="/">
        <h1 className="text-2xl font-bold">
          Luna<span className="text-sm">Helthy</span>
        </h1>
      </Link>
      <ul className="hidden lg:flex md:hidden gap-5 text-sm">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-black dark:bg-white hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-black dark:bg-white hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-black dark:bg-white hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-black dark:bg-white hidden" />
        </NavLink>
        <NavLink to="/orders" className="flex flex-col items-center gap-1">
          <p>ORDERS</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-black dark:bg-white hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-3 md:gap-5 lg:gap-6">
        <div className="relative">
          <img
            onClick={handleSearchClick}
            src={assets.search_icon}
            alt="Search Icon"
            className="w-7 cursor-pointer"
          />
          {searchModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                ref={searchModalRef}
                className="relative w-11/12 max-w-lg bg-white dark:bg-[#1a2338] text-gray-600 dark:text-white rounded-xl shadow-2xl p-6"
              >
                <button
                  onClick={handleCloseSearch}
                  className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-4">
                  Search
                </h2>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 mb-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 outline-none text-sm"
                  />
                  <img
                    src={assets.search_icon}
                    alt="Search Icon"
                    className="w-5 h-5 ml-2"
                  />
                </div>
                {searchTerm && (
                  <div className="mt-2 max-h-72 overflow-y-auto custom-scrollbar rounded-lg pr-2">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => handleProductClick(product._id)}
                          className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-all duration-200"
                        >
                          <img
                            src={product.image[0] || assets.default_image}
                            alt={product.name}
                            className="w-14 h-14 rounded-md object-cover shadow-sm"
                            onError={(e) => (e.target.src = assets.default_image)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-300">
                              {product.price} {currency}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No results found
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <img
            onClick={handleCartClick}
            src={assets.cart_icon}
            alt="Cart Icon"
            className="w-7 min-w-5 cursor-pointer"
          />
          <p className="absolute right-[-5px] bottom-[-7px] bg-white text-black w-5 text-center rounded-full text-[12px]">
            {isLoadingCart ? '...' : getCartCount()}
          </p>

          {cartModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-start">
              <div
                ref={cartModalRef}
                className="relative w-full max-w-md h-full bg-white dark:bg-[#1a2338] text-gray-600 dark:text-white shadow-2xl p-4 sm:p-6 transform transition-transform duration-300 translate-x-0 z-50"
              >
                <div className="flex items-center justify-end mb-4 relative">
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white flex-1 text-right">
                    Your Cart
                  </h2>
                </div>
                <hr className="border-gray-200 dark:border-gray-600 mb-4" />
                <button
                  onClick={handleCloseCart}
                  className="absolute top-2 sm:right-[-50px] sm:left-auto left-2 right-auto text-black hover:text-gray-600 transition-colors duration-200 bg-white rounded-full p-2 shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="mt-2 h-[calc(100vh-120px)] flex flex-col justify-start">
                  {isLoadingCart ? (
                    <p className="text-lg text-gray-500 dark:text-gray-400 text-center">
                      جارٍ تحميل السلة...
                    </p>
                  ) : cartData.length > 0 ? (
                    <>
                      <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-4">
                        {cartData.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 py-4 border-b border-gray-200 dark:border-gray-600 relative"
                          >
                            <img
                              src={item.image || assets.default_image}
                              alt={item.product_name || 'Product'}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
                              onError={(e) => (e.target.src = assets.default_image)}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {item.product_name || 'Unnamed Product'}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.item_id, item.quantity - 1)}
                                    className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white"
                                    disabled={loadingItems[item.item_id]}
                                  >
                                    -
                                  </button>
                                  <span className="text-sm text-gray-800 dark:text-white min-w-[2rem] flex items-center justify-center">
                                    {loadingItems[item.item_id] ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600"></div>
                                    ) : (
                                      item.quantity
                                    )}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.item_id, item.quantity + 1)}
                                    className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white"
                                    disabled={loadingItems[item.item_id]}
                                  >
                                    +
                                  </button>
                                </div>
                                <p className="text-sm font-semibold text-yellow-500 dark:text-yellow-400 text-right">
                                  {(item.price || 0).toFixed(2)} EGP
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.item_id)}
                                className="absolute top-4 right-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                                disabled={loadingItems[item.item_id]}
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
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1zm-5 4h12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-20 left-0 right-0 bg-white dark:bg-[#1a2338] pt-4 pb-2 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white">
                          <p>Subtotal:</p>
                          <p>{cartTotalPrice.toFixed(2)} EGP</p> {/* استخدام cartTotalPrice */}
                        </div>
                        {shippingFees > 0 && (
                          <div className="flex justify-between text-sm font-medium text-gray-800 dark:text-white mt-1">
                            <p>Shipping Fees:</p>
                            <p>{shippingFees.toFixed(2)} EGP</p>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-semibold text-gray-800 dark:text-white mt-2">
                          <p>Total:</p>
                          <p>{(cartTotalPrice + shippingFees).toFixed(2)} EGP</p> {/* استخدام cartTotalPrice */}
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 px-4 sm:px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleCloseCart();
                              navigate('/cart');
                            }}
                            className="w-[30%] bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                          >
                            View Cart
                          </button>
                          <button
                            onClick={() => {
                              handleCloseCart();
                              navigate('/place-order');
                            }}
                            className="w-[70%] bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                            disabled={cartData.length === 0}
                          >
                            Proceed to Checkout
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-lg text-gray-500 dark:text-gray-400 text-center">
                      السلة فارغة
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFavoritesMenu((prev) => !prev)}
            className="w-7 h-7 flex items-center justify-center text-pink-600 hover:text-pink-800 text-2xl focus:outline-none"
            title="المفضلة"
          >
            ❤️
          </button>
          {showFavoritesMenu && (
            <FavoritesMenu onClose={() => setShowFavoritesMenu(false)} />
          )}
        </div>

        <Togglemode />

        {isLoggedIn ? (
          <div className="relative">
            <img
              ref={profileIconRef}
              src={userData?.avatar || assets.profile_icon}
              alt="Profile Icon"
              className="w-8 h-8 rounded-full cursor-pointer hidden md:block lg:block border-2 border-transparent hover:border-green-500 transition duration-200"
              onClick={handleProfileClick}
              style={{ zIndex: 30 }}
            />
            {profileModalVisible && (
              <div
                ref={profileModalRef}
                className="absolute right-0 top-12 w-64 bg-white dark:bg-[#1a2338] text-gray-600 dark:text-white rounded-xl shadow-2xl p-6 z-50 transform transition-all duration-300 animate-profile-modal"
                style={{ zIndex: 50 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={userData?.avatar || assets.profile_icon}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full border-2 border-green-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {userData?.firstName || 'Guest'} {userData?.lastName || ''}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {userData?.email || 'No email provided'}
                    </p>
                  </div>
                </div>
                <hr className="border-gray-200 dark:border-gray-600 mb-4" />
                <div className="flex flex-col gap-2">

                  <Link
                    to="/profile"
                    onClick={() => setProfileModalVisible(false)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105 text-center"
                  >
                    View Profile
                  </Link>

                  <button
                    onClick={() => {
                      setProfileModalVisible(false);
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 transform hover:scale-105"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setProfileModalVisible(false);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="text-md border-2 hidden text-white md:block lg:block hover:bg-green-300 hover:text-black border-gray-600 px-4 py-2 rounded-md bg-green-500">
              Sign Up
            </button>
          </Link>
        )}

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt="Menu Icon"
          className="w-5 cursor-pointer lg:hidden md:block"
        />
      </div>

      {visible && (
        <div
          className="fixed inset-0 bg-white dark:bg-[#1a2338] z-50 flex flex-col text-gray-600 dark:text-gray-300 transition-all duration-300"
        >
          <div className="flex flex-col h-full">
            <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 border-b border-gray-200 dark:border-gray-600">
              <img src={assets.dropdown_icon} alt="Back Icon" className="h-4 rotate-180" />
              <p>Back</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavLink onClick={() => setVisible(false)} className="py-6 pl-6 border-b border-gray-200 dark:border-gray-600 block" to="/">
                Home
              </NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-6 pl-6 border-b border-gray-200 dark:border-gray-600 block" to="/collection">
                Collection
              </NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-6 pl-6 border-b border-gray-200 dark:border-gray-600 block" to="/about">
                About
              </NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-6 pl-6 border-b border-gray-200 dark:border-gray-600 block" to="/contact">
                Contact
              </NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-6 pl-6 border-b border-gray-600 dark:border-grey-600 block" to="/orders">
                Orders
              </NavLink>
              <NavLink onClick={() => setVisible(false)} className="py-6 pl-6 border-b border-gray-200 dark:border-gray-600 block" to="/profile">
                Profile
              </NavLink>
              {isLoggedIn ? (
                <div className="py-6 pl-6 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-md">Welcome, {userData?.firstName || 'Guest'}</p>
                  <button
                    onClick={() => {
                      logout();
                      setVisible(false);
                    }}
                    className="text-md border-2 hover:bg-red-600 hover:text-white border-gray-600 px-4 py-2 rounded-md bg-red-500 mt-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link className="py-6 pl-6 border-b border-gray-200 dark:border-gray-600 block" to="/login">
                  <button className="text-md border-2 hover:bg-green-300 hover:text-black border-gray-600 px-4 py-2 rounded-md bg-green-500">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

//? ========= end API ===========
//? ========= end API ===========
//? ========= end API ===========









