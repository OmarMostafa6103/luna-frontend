//? ========= START API ===========
//? ========= START API ===========

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from "lodash";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  // const currency = ' EGP ';
  // const delivery_fee = 100;
  // const [products, setProducts] = useState([]);
  // const [search, setSearch] = useState('');
  // const [showSearch, setShowSearch] = useState(false);
  // const [cartData, setCartData] = useState([]);
  // const [cartItems, setCartItems] = useState({});
  // const [cartTotalPrice, setCartTotalPrice] = useState(0); // حالة جديدة لتخزين total_price
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userData, setUserData] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1);
  // const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  // const [isAuthChecked, setIsAuthChecked] = useState(false);
  // const navigate = useNavigate();
  // const hasFetchedProducts = useRef(false);
  // const hasFetchedCart = useRef(false);
  // const lastFetchedPage = useRef(null);
  // const hasShownToast = useRef(false);
  // const hasShownAuthWarning = useRef(false);
  // const [nextPageUrl, setNextPageUrl] = useState(null);

  const currency = " EGP ";
  const delivery_fee = 100;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null); // ✅ هذا هو السطر المفقود
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const navigate = useNavigate();
  const hasFetchedProducts = useRef(false);
  const lastFetchedPage = useRef(null);
  const hasShownToast = useRef(false);
  const hasShownAuthWarning = useRef(false);
  const isFetching = useRef(false);
  const hasFetchedCart = useRef(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUserData = localStorage.getItem("userData");
      if (storedToken && storedUserData) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(storedUserData));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
      setIsAuthChecked(true);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      if (!hasFetchedProducts.current) {
        await fetchProducts(1, 25, false);
        hasFetchedProducts.current = true;
      }
    };
    fetchInitialProducts();
  }, []);

  // جزء عمل تسجيل دخول مرا اخري

  // const showAuthWarning = () => {
  //     if (hasShownAuthWarning.current) return;
  //     hasShownAuthWarning.current = true;
  //     toast.warn(
  //         <div>
  //             انتهت الجلسة أو غير صالحة. يرجى تسجيل الدخول مرة أخرى.
  //             <button
  //                 onClick={() => {
  //                     logout();
  //                     navigate('/login');
  //                 }}
  //                 className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
  //             >
  //                 تسجيل الدخول
  //             </button>
  //         </div>,
  //         {
  //             style: { background: 'orange', color: 'white' },
  //             autoClose: false,
  //         }
  //     );
  // };

  // const fetchProducts = async (page = 1, limit = 25, append = false, customProducts = null, fullUrl = null) => {
  //     // ✅ أولاً: إذا تم تمرير fullUrl، استخرج رقم الصفحة منه
  //     if (fullUrl) {
  //         const parsedPage = Number(new URL(fullUrl).searchParams.get("page"));
  //         if (!isNaN(parsedPage)) {
  //             page = parsedPage;
  //         }
  //     }

  //     // ✅ تحقق من الحالات التي يجب تجاهل التحميل فيها
  //     if (isLoadingProducts || (lastFetchedPage.current === page && !append && !fullUrl)) {
  //         console.log("⛔ تم تجاهل التحميل: قيد التحميل أو نفس الصفحة");
  //         setIsLoadingProducts(false);
  //         return;
  //     }

  //     if (!fullUrl && (page > lastPage || page < 1)) {
  //         setIsLoadingProducts(false);
  //         return;
  //     }

  //     lastFetchedPage.current = page;
  //     setIsLoadingProducts(true);

  //     try {
  //         const token = localStorage.getItem('token');
  //         const url = fullUrl || `${backendUrl}/api/products?page=${page}&limit=${limit}`;

  //         const response = await axios.get(url, {
  //             headers: token ? { Authorization: `Bearer ${token}` } : {},
  //         });

  //         if (response.data.status !== 200) {
  //             throw new Error(response.data.message || 'فشل في جلب المنتجات');
  //         }

  //         const rawData = response.data.data || {};
  //         const data = rawData.products || [];
  //         const pagination = rawData.Pagination || {};

  //         console.log("🧪 pagination object:", pagination);

  //         if (data.length === 0 && append) {
  //             console.log("ℹ️ لا مزيد من المنتجات");
  //             return;
  //         }

  //         const formattedProducts = data.map((product) => ({
  //             _id: product.product_slugs || product.id || '',
  //             product_id: product.product_id || '',
  //             name: product.product_name || 'منتج غير مسمى',
  //             description: product.product_description || '',
  //             image: [product.product_image, product.product_image1, product.product_image2, product.product_image3].filter((img) => img),
  //             price: parseFloat(product.product_price || product.price) || 0,
  //             quantity: parseInt(product.product_quantity) || 0,
  //             category: product.category?.category_name || 'غير معروف',
  //             category_id: product.category?.categor_id || product.category?.category_id || product.category_id || null,
  //         }));

  //         if (append) {
  //             setProducts((prev) => [...prev, ...formattedProducts]);
  //         } else {
  //             setProducts(formattedProducts);
  //         }

  //         const currentPageFromApi = pagination.current_page || page;
  //         const lastPageFromApi = pagination.last_page || Math.ceil((pagination.total || 0) / (pagination.per_page || limit));
  //         const nextPageUrlFromApi = pagination.next_page_url || null;
  //         const prevPageUrlFromApi = pagination.prev_page_url || null;

  //         console.log("✅ nextPageUrl extracted:", nextPageUrlFromApi);
  //         console.log(`📦 Loaded page ${currentPageFromApi}, nextPageUrl: ${nextPageUrlFromApi || 'null'}, lastPage: ${lastPageFromApi}`);

  //         setCurrentPage(currentPageFromApi);
  //         setLastPage(lastPageFromApi);
  //         setNextPageUrl(nextPageUrlFromApi);
  //         setPrevPageUrl(prevPageUrlFromApi);
  //     } catch (error) {
  //         console.error('Fetch error:', error.message);
  //         toast.error('فشل في جلب المنتجات: ' + (error.message || 'خطأ غير معروف'), {
  //             style: { background: 'red', color: 'white' },
  //         });
  //         if (!append) setProducts([]);
  //     } finally {
  //         console.log("🧹 Resetting isLoadingProducts to false");
  //         setIsLoadingProducts(false);
  //     }
  // };

  // const fetchProducts = async (page = 1, limit = 25, append = false, customProducts = null, fullUrl = null) => {
  //     // ✅ استخراج رقم الصفحة من رابط مباشر إن وُجد
  //     if (fullUrl) {
  //         const parsedPage = Number(new URL(fullUrl).searchParams.get("page"));
  //         if (!isNaN(parsedPage)) {
  //             page = parsedPage;
  //         }
  //     }

  //     // ✅ تجنب التحميل المكرر أو التحميل أثناء العملية
  //     if (isLoadingProducts || (lastFetchedPage.current === page && !append && !fullUrl)) {
  //         console.log("⛔ تم تجاهل التحميل: قيد التحميل أو نفس الصفحة");
  //         setIsLoadingProducts(false);
  //         return;
  //     }

  //     if (!fullUrl && (page > lastPage || page < 1)) {
  //         setIsLoadingProducts(false);
  //         return;
  //     }

  //     lastFetchedPage.current = page;
  //     setIsLoadingProducts(true);

  //     try {
  //         const token = localStorage.getItem('token');
  //         const url = fullUrl || `${backendUrl}/api/products?page=${page}&limit=${limit}`;

  //         const response = await axios.get(url, {
  //             headers: token ? { Authorization: `Bearer ${token}` } : {},
  //         });

  //         if (response.data.status !== 200) {
  //             throw new Error(response.data.message || 'فشل في جلب المنتجات');
  //         }

  //         const rawData = response.data.data || {};
  //         const data = rawData.products || [];
  //         const pagination = rawData.Pagination || {};

  //         console.log("🧪 pagination object:", pagination);

  //         if (data.length === 0 && append) {
  //             console.log("ℹ️ لا مزيد من المنتجات");
  //             return;
  //         }

  //         const formattedProducts = data.map((product) => ({
  //             _id: product.product_slugs || product.id || '',
  //             product_id: product.product_id || '',
  //             name: product.product_name || 'منتج غير مسمى',
  //             description: product.product_description || '',
  //             image: [product.product_image, product.product_image1, product.product_image2, product.product_image3].filter((img) => img),
  //             price: parseFloat(product.product_price || product.price) || 0,
  //             quantity: parseInt(product.product_quantity) || 0,
  //             category: product.category?.category_name || 'غير معروف',
  //             category_id: product.category?.categor_id || product.category?.category_id || product.category_id || null,
  //         }));

  //         const currentPageFromApi = pagination.current_page || page;
  //         const total = pagination.total || 0;
  //         const perPage = pagination.per_page || limit;
  //         const lastPageFromApi = pagination.last_page || Math.ceil(total / perPage);

  //         let nextPageUrlFromApi = pagination.next_page_url || null;
  //         const prevPageUrlFromApi = pagination.prev_page_url || null;

  //         // ✅ الحساب السليم لعدد المنتجات الحالي لتجنب قطع التحميل مبكرًا
  //         const existingCount = append ? products.length : 0;
  //         const currentProductCount = existingCount + formattedProducts.length;

  //         if (currentProductCount >= total) {
  //             nextPageUrlFromApi = null;
  //         }

  //         if (append) {
  //             setProducts((prev) => [...prev, ...formattedProducts]);
  //         } else {
  //             setProducts(formattedProducts);
  //         }

  //         setCurrentPage(currentPageFromApi);
  //         setLastPage(lastPageFromApi);
  //         setNextPageUrl(nextPageUrlFromApi);
  //         setPrevPageUrl(prevPageUrlFromApi);

  //         console.log("✅ nextPageUrl extracted:", nextPageUrlFromApi);
  //         console.log(`📦 Loaded page ${currentPageFromApi}, total products: ${currentProductCount}/${total}, lastPage: ${lastPageFromApi}`);
  //     } catch (error) {
  //         console.error('Fetch error:', error.message);
  //         toast.error('فشل في جلب المنتجات: ' + (error.message || 'خطأ غير معروف'), {
  //             style: { background: 'red', color: 'white' },
  //         });
  //         if (!append) setProducts([]);
  //     } finally {
  //         console.log("🧹 Resetting isLoadingProducts to false");
  //         setIsLoadingProducts(false);
  //     }
  // };

  const fetchProducts = async (
    page = 1,
    limit = 25,
    append = false,
    customProducts = null,
    fullUrl = null,
    categoryId = null
  ) => {
    console.log("🚀 fetchProducts called with", {
      page,
      fullUrl,
      append,
      categoryId,
    });

    // استخراج رقم الصفحة من fullUrl إن وُجد
    if (fullUrl) {
      const parsedPage = Number(new URL(fullUrl).searchParams.get("page"));
      if (!isNaN(parsedPage)) {
        page = parsedPage;
      }
    }

    // التحقق من حالات التكرار أو التحميل الجاري
    if (
      isLoadingProducts ||
      (lastFetchedPage.current === page && !append && !fullUrl)
    ) {
      console.log("⛔ تم تجاهل التحميل: قيد التحميل أو نفس الصفحة", { page });
      setIsLoadingProducts(false);
      return;
    }

    if (!fullUrl && (page > lastPage || page < 1)) {
      console.log("⛔ تم تجاهل التحميل: رقم الصفحة غير صالح", { page });
      setIsLoadingProducts(false);
      return;
    }

    lastFetchedPage.current = page;
    setIsLoadingProducts(true);

    try {
      const token = localStorage.getItem("token");
      let url =
        fullUrl || `${backendUrl}/api/products?page=${page}&limit=${limit}`;
      // إذا كان nextPageUrl موجود ولا يحتوي على limit=25، أضفها يدوياً
      if (fullUrl && !fullUrl.includes("limit=")) {
        url += (url.includes("?") ? "&" : "?") + `limit=${limit}`;
      }
      if (categoryId && !fullUrl) {
        url += `&category_id=${categoryId}`;
      }

      // أوقف التحميل إذا كان nextPageUrl = null أو currentPage >= lastPage
      if (fullUrl && (!nextPageUrl || currentPage >= lastPage)) {
        setIsLoadingProducts(false);
        return;
      }

      console.log("🌐 Fetching from:", url);

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.status !== 200) {
        throw new Error(response.data.message || "فشل في جلب المنتجات");
      }

      const data = Array.isArray(response.data.data)
        ? response.data.data
        : (response.data.data?.products || []);
      const pagination = response.data.data?.Pagination || {};

      console.log("🧪 pagination object:", pagination);
      console.log("📦 Raw products length:", data.length);

      if (data.length === 0 && append) {
        console.log("ℹ️ لا مزيد من المنتجات");
        return;
      }

      const formattedProducts = data.map((product) => ({
        _id: product.product_slugs || product.id || "",
        product_id: product.product_id || "",
        name: product.product_name || "منتج غير مسمى",
        description: product.product_description || "",
        image: [
          product.product_image,
          product.product_image1,
          product.product_image2,
          product.product_image3,
        ].filter((img) => img),
        price: parseFloat(product.product_price || product.price) || 0,
        quantity: parseInt(product.product_quantity) || 0,
        category: product.category?.category_name || "غير معروف",
        category_id:
          product.category?.categor_id ||
          product.category?.category_id ||
          product.category_id ||
          null,
      }));

      console.log(
        "📥 formattedProducts (append =",
        append,
        "):",
        formattedProducts.length
      );

      const currentPageFromApi = pagination.current_page || page;
      const total = pagination.total || 0;
      const perPage = pagination.per_page || limit;
      const lastPageFromApi =
        pagination.last_page || Math.ceil(total / perPage);

      let nextPageUrlFromApi = pagination.next_page_url || null;
      const prevPageUrlFromApi = pagination.prev_page_url || null;

      const existingCount = append ? products.length : 0;
      const currentProductCount = existingCount + formattedProducts.length;

      if (currentProductCount >= total) {
        console.log("✅ جميع المنتجات تم تحميلها");
        nextPageUrlFromApi = null;
      }

      if (append) {
        setProducts((prev) => {
          // دمج المنتجات بدون تكرار حسب product_id
          const all = [...prev, ...formattedProducts];
          const unique = [];
          const seen = new Set();
          for (const prod of all) {
            if (!seen.has(prod.product_id)) {
              unique.push(prod);
              seen.add(prod.product_id);
            }
          }
          return unique;
        });
      } else {
        setProducts(formattedProducts);
      }

      // تحديث الصفحات فقط من Pagination
      setCurrentPage(currentPageFromApi);
      setLastPage(lastPageFromApi);
      setNextPageUrl(nextPageUrlFromApi);
      setPrevPageUrl(prevPageUrlFromApi);

      console.log("✅ nextPageUrl extracted:", nextPageUrlFromApi);
      console.log(
        `📦 Loaded page ${currentPageFromApi}, total products: ${currentProductCount}/${total}, lastPage: ${lastPageFromApi}`
      );
    } catch (error) {
      console.error("❌ Fetch error:", error.message);
      toast.error(
        "فشل في جلب المنتجات: " + (error.message || "خطأ غير معروف"),
        {
          style: { background: "red", color: "white" },
        }
      );
      if (!append) setProducts([]);
    } finally {
      console.log("🧹 Resetting isLoadingProducts to false");
      setIsLoadingProducts(false);
    }
  };

  const showCart = async (retries = 3) => {
    if (!isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      if (localCart.length === 0) {
        setCartData([]);
        setCartItems({});
        setCartTotalPrice(0); // إعادة تعيين total_price للسلة المحلية
      } else {
        const updatedLocalCart = localCart.map((item) => {
          const product = products.find(
            (p) => p.product_id === item.product_id
          );
          const price =
            typeof item.price === "string"
              ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
              : parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          return {
            ...item,
            price: price,
            quantity: quantity,
            image:
              item.image ||
              product?.image?.[0] ||
              "/path/to/placeholder-image.jpg",
          };
        });
        setCartData(updatedLocalCart);
        const newCartItems = {};
        let totalPrice = 0;
        updatedLocalCart.forEach((item) => {
          newCartItems[item.product_id] = item.quantity;
          totalPrice += item.price * item.quantity;
        });
        setCartItems(newCartItems);
        // تحديث total_price للسلة المحلية
        setCartTotalPrice(totalPrice);
      }
      return;
    }

    const token = localStorage.getItem("token");
    console.log("🪪 Token used for cart request:", token);
    if (!token) {
      setCartData([]);
      setCartItems({});
      setCartTotalPrice(0); // إعادة تعيين total_price
      return;
    }

    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(`${backendUrl}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data.status === 200) {
          let updatedCartData = response.data.data.items || [];
          updatedCartData = Array.isArray(updatedCartData)
            ? updatedCartData
            : updatedCartData
            ? [updatedCartData]
            : [];

          updatedCartData = updatedCartData.map((item) => {
            const product = products.find(
              (p) => p.product_id === item.product_id
            );
            const price =
              typeof item.price === "string"
                ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
                : parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return {
              product_id: item.product_id,
              quantity: quantity,
              product_name: item.product_name,
              price: price,
              image:
                item.image ||
                product?.image?.[0] ||
                "/path/to/placeholder-image.jpg",
              item_id: item.item_id,
            };
          });

          setCartData(updatedCartData);
          const newCartItems = {};
          updatedCartData.forEach((item) => {
            newCartItems[item.product_id] = item.quantity;
          });
          setCartItems(newCartItems);
          // تخزين total_price من الاستجابة
          const totalPrice = parseFloat(response.data.data.total_price) || 0;
          setCartTotalPrice(totalPrice);
          break;
        } else {
          throw new Error(response.data.message || "فشل في جلب بيانات السلة");
        }
      } catch (error) {
        console.error(
          "Error fetching cart, attempt",
          i + 1,
          ":",
          error.message
        );
        if (i === retries - 1) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 422
          ) {
            // فقط إعادة تعيين السلة بدون أي رسالة أو إعادة توجيه
            setCartData([]);
            setCartItems({});
            setCartTotalPrice(0);
            return;
          } else {
            toast.error(
              "فشل في جلب بيانات السلة: " + (error.message || "خطأ غير معروف"),
              {
                style: { background: "red", color: "white" },
              }
            );
          }
          setCartData([]);
          setCartItems({});
          setCartTotalPrice(0);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  };

  useEffect(() => {
    if (isAuthChecked) {
      showCart();
    }
  }, [isAuthChecked]);

  const addToCart = useCallback(
    async (itemId, quantity = 1, price, availableQuantity) => {
      if (!itemId || isNaN(price)) {
        toast.error("معلومات المنتج غير صالحة!", {
          style: { background: "red", color: "white" },
        });
        return;
      }

      const product = products.find((p) => p.product_id === itemId);
      if (!product) {
        toast.error("المنتج غير موجود!", {
          style: { background: "red", color: "white" },
        });
        return;
      }

      const available =
        availableQuantity !== undefined
          ? availableQuantity
          : product.quantity || 0;
      if (available === 0) {
        toast.error("هذا المنتج غير متوفر حاليًا!", {
          style: { background: "red", color: "white" },
        });
        return;
      }

      const currentCartQuantity = cartItems[itemId] || 0;
      const newTotalQuantity = currentCartQuantity + quantity;

      if (newTotalQuantity > available) {
        toast.error(`لا يمكن إضافة أكثر من ${available} وحدة من هذا المنتج!`, {
          style: { background: "red", color: "white" },
        });
        return;
      }

      const effectiveQuantity = Math.max(1, quantity);

      if (!isLoggedIn) {
        const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
        const existingItem = localCart.find(
          (item) => item.product_id === itemId
        );

        let updatedCart;
        if (existingItem) {
          updatedCart = localCart.map((item) =>
            item.product_id === itemId
              ? { ...item, quantity: item.quantity + effectiveQuantity }
              : item
          );
        } else {
          updatedCart = [
            ...localCart,
            {
              product_id: itemId,
              quantity: effectiveQuantity,
              product_name: product?.name || "غير معروف",
              price: price || product?.price || 0,
              image: product?.image?.[0] || "/path/to/placeholder-image.jpg",
            },
          ];
        }

        localStorage.setItem("localCart", JSON.stringify(updatedCart));
        setCartData(updatedCart);
        setCartItems((prev) => {
          const newCartItems = { ...prev };
          newCartItems[itemId] =
            (newCartItems[itemId] || 0) + effectiveQuantity;
          return newCartItems;
        });

        // تحديث total_price للسلة المحلية
        let totalPrice = 0;
        updatedCart.forEach((item) => {
          totalPrice += item.price * item.quantity;
        });
        setCartTotalPrice(totalPrice);

        if (!hasShownToast.current) {
          hasShownToast.current = true;
          toast.info(
            "تمت إضافة المنتج إلى السلة. قم بتسجيل الدخول لحفظ سلتك!",
            {
              style: { background: "blue", color: "white" },
            }
          );
        } else {
          toast.success("تمت إضافة المنتج إلى السلة!", {
            style: { background: "green", color: "white" },
          });
        }
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("يرجى تسجيل الدخول لإضافة المنتج إلى السلة!", {
          style: { background: "red", color: "white" },
        });
        return;
      }

      try {
        const response = await axios.post(
          `${backendUrl}/api/cart`,
          { product_id: itemId, quantity: effectiveQuantity, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.status === 200) {
          toast.success("تمت إضافة المنتج إلى السلة بنجاح!", {
            style: { background: "green", color: "white" },
          });
          await showCart(); // سيقوم بتحديث cartTotalPrice
        } else {
          toast.error(
            response.data.message || "فشل في إضافة المنتج إلى السلة",
            {
              style: { background: "red", color: "white" },
            }
          );
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 422) {
          // إزالة بيانات المستخدم وإعادة التوجيه عند انتهاء الجلسة أو عدم الصلاحية
          setIsLoggedIn(false);
          setUserData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setCartData([]);
          setCartItems({});
          setCartTotalPrice(0); // إعادة تعيين total_price
          localStorage.removeItem("localCart");
          hasShownToast.current = false;
          hasFetchedProducts.current = false;
          lastFetchedPage.current = null;
          hasFetchedCart.current = false;
          hasShownAuthWarning.current = false;
          await fetchProducts(1, 25, false);
          navigate("/login");
        } else {
          toast.error(
            error.response?.data?.message || "فشل في إضافة المنتج إلى السلة",
            {
              style: { background: "red", color: "white" },
            }
          );
        }
      }
    },
    [isLoggedIn, products, cartItems]
  );

  const getCartCount = () => {
    let totalCount = 0;
    for (const item of cartData) {
      try {
        if (item.quantity > 0) {
          totalCount += item.quantity;
        }
      } catch (error) {}
    }
    return totalCount;
  };

  const updateQuantity = async (id, quantity, isItemId = true) => {
    if (quantity < 0) {
      return;
    }

    const product = products.find(
      (p) =>
        p.product_id ===
        (isItemId
          ? cartData.find((item) => item.item_id === id)?.product_id
          : id)
    );
    if (!product) {
      toast.error("المنتج غير موجود!", {
        style: { background: "red", color: "white" },
      });
      return;
    }

    const availableQuantity = product.quantity || 0;
    if (quantity > availableQuantity) {
      toast.error(
        `لا يمكن تحديد أكثر من ${availableQuantity} وحدة من هذا المنتج!`,
        {
          style: { background: "red", color: "white" },
        }
      );
      return;
    }

    if (!isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      let updatedCart;
      if (quantity <= 0) {
        updatedCart = localCart.filter((item) => item.product_id !== id);
      } else {
        updatedCart = localCart.map((item) =>
          item.product_id === id ? { ...item, quantity } : item
        );
        if (!updatedCart.some((item) => item.product_id === id)) {
          updatedCart.push({
            product_id: id,
            quantity,
            product_name: product?.name || "غير معروف",
            price: product?.price || 0,
            image: product?.image?.[0] || "/path/to/placeholder-image.jpg",
          });
        }
      }
      localStorage.setItem("localCart", JSON.stringify(updatedCart));
      setCartData(updatedCart);
      setCartItems((prev) => {
        const newCartItems = { ...prev };
        if (quantity <= 0) {
          delete newCartItems[id];
        } else {
          newCartItems[id] = quantity;
        }
        return newCartItems;
      });

      // تحديث total_price للسلة المحلية
      let totalPrice = 0;
      updatedCart.forEach((item) => {
        totalPrice += item.price * item.quantity;
      });
      setCartTotalPrice(totalPrice);

      toast.success("تم تحديث الكمية بنجاح!", {
        style: { background: "green", color: "white" },
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يرجى تسجيل الدخول لتحديث السلة!", {
        style: { background: "red", color: "white" },
      });
      return;
    }

    try {
      let itemId = id;
      if (!isItemId) {
        const cartItem = cartData.find((item) => item.product_id === id);
        if (!cartItem && quantity > 0) {
          await addToCart(id, Math.max(1, quantity), product.price);
          return;
        } else if (!cartItem) {
          return;
        }
        itemId = cartItem.item_id;
      }

      const response = await axios.put(
        `${backendUrl}/api/cart?_method=PUT`,
        { items: [{ item_id: itemId, quantity }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 200) {
        toast.success("تم تحديث الكمية بنجاح!", {
          style: { background: "green", color: "white" },
        });
        await showCart(); // سيقوم بتحديث cartTotalPrice
      } else {
        throw new Error(response.data.message || "فشل في تحديث الكمية");
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        // إزالة بيانات المستخدم وإعادة التوجيه عند انتهاء الجلسة أو عدم الصلاحية
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setCartData([]);
        setCartItems({});
        setCartTotalPrice(0); // إعادة تعيين total_price
        localStorage.removeItem("localCart");
        hasShownToast.current = false;
        hasFetchedProducts.current = false;
        lastFetchedPage.current = null;
        hasFetchedCart.current = false;
        hasShownAuthWarning.current = false;
        await fetchProducts(1, 25, false);
        navigate("/login");
      } else {
        toast.error(
          "فشل في تحديث الكمية: " +
            (error.response?.data?.message || "خطأ غير معروف"),
          {
            style: { background: "red", color: "white" },
          }
        );
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
      const updatedCart = localCart.filter(
        (item) => item.product_id !== itemId
      ); // تصحيح: استخدام product_id بدلاً من item_id
      localStorage.setItem("localCart", JSON.stringify(updatedCart));
      setCartData(updatedCart);
      setCartItems((prev) => {
        const newCartItems = { ...prev };
        delete newCartItems[itemId];
        return newCartItems;
      });

      // تحديث total_price للسلة المحلية
      let totalPrice = 0;
      updatedCart.forEach((item) => {
        totalPrice += item.price * item.quantity;
      });
      setCartTotalPrice(totalPrice);

      toast.success("تم حذف المنتج بنجاح!", {
        style: { background: "green", color: "white" },
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يرجى تسجيل الدخول لتحديث السلة!", {
        style: { background: "red", color: "white" },
      });
      return;
    }

    try {
      const payload = {
        items: [{ item_id: itemId, quantity: 0 }],
      };

      const response = await axios.put(
        `${backendUrl}/api/cart?_method=PUT`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 200) {
        await showCart(); // سيقوم بتحديث cartTotalPrice
        toast.success("تم حذف المنتج بنجاح!", {
          style: { background: "green", color: "white" },
        });
      } else {
        throw new Error(response.data.message || "فشل في حذف المنتج");
      }
    } catch (error) {
      toast.error(
        "فشل في حذف المنتج: " +
          (error.response?.data?.message || "خطأ غير معروف"),
        {
          style: { background: "red", color: "white" },
        }
      );
    }
  };

  const getCartAmount = () => {
    return cartTotalPrice; // إرجاع cartTotalPrice بدلاً من الحساب اليدوي
  };

  const resetCart = () => {
    setCartData([]);
    setCartItems({});
    setCartTotalPrice(0); // إعادة تعيين total_price
    localStorage.removeItem("localCart");
  };

  const login = async (user, token) => {
    setIsLoggedIn(true);
    setUserData(user);
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(user));

    const localCart = JSON.parse(localStorage.getItem("localCart") || "[]");
    if (localCart.length > 0) {
      for (const item of localCart) {
        try {
          await axios.post(
            `${backendUrl}/api/cart`,
            {
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 422
          ) {
            showAuthWarning();
          } else {
            toast.error(
              `فشل في مزامنة المنتج ${item.product_name}: ${
                error.response?.data?.message || "خطأ غير معروف"
              }`,
              {
                style: { background: "red", color: "white" },
              }
            );
          }
        }
      }
      localStorage.removeItem("localCart");
      hasShownToast.current = false;
      toast.success("تمت مزامنة السلة المحلية بنجاح!", {
        style: { background: "green", color: "white" },
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    await showCart(); // سيقوم بتحديث cartTotalPrice
    lastFetchedPage.current = null;
    hasFetchedProducts.current = false;
    await fetchProducts(1, 25, false);
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 200) {
          toast.success("تم تسجيل الخروج بنجاح!", {
            style: { background: "green", color: "white" },
          });
        } else {
          toast.error(response.data.message || "فشل في تسجيل الخروج", {
            style: { background: "red", color: "white" },
          });
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 422) {
          // إزالة بيانات المستخدم وإعادة التوجيه عند انتهاء الجلسة أو عدم الصلاحية
          setIsLoggedIn(false);
          setUserData(null);
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setCartData([]);
          setCartItems({});
          setCartTotalPrice(0); // إعادة تعيين total_price
          localStorage.removeItem("localCart");
          hasShownToast.current = false;
          hasFetchedProducts.current = false;
          lastFetchedPage.current = null;
          hasFetchedCart.current = false;
          hasShownAuthWarning.current = false;
          await fetchProducts(1, 25, false);
          navigate("/login");
        } else {
          toast.error(error.response?.data?.message || "فشل في تسجيل الخروج", {
            style: { background: "red", color: "white" },
          });
        }
      }
    }

    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setCartData([]);
    setCartItems({});
    setCartTotalPrice(0); // إعادة تعيين total_price
    localStorage.removeItem("localCart");
    hasShownToast.current = false;
    hasFetchedProducts.current = false;
    lastFetchedPage.current = null;
    hasFetchedCart.current = false;
    hasShownAuthWarning.current = false;
    await fetchProducts(1, 25, false);
    navigate("/login");
  };

  const addToFavorites = (product) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.product_id === product.product_id)) return prev;
      const updated = [...prev, product];
      localStorage.setItem("favorites", JSON.stringify(updated));
      toast.success("تمت إضافة المنتج إلى المفضلة!", {
        style: { background: "green", color: "white" },
        icon: "❤️"
      });
      return updated;
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.product_id !== productId);
      localStorage.setItem("favorites", JSON.stringify(updated));
      toast.error("تمت إزالة المنتج من المفضلة!", {
        style: { background: "#dc2626", color: "white" },
        icon: "💔"
      });
      return updated;
    });
  };

  const isProductFavorited = (productId) => {
    return favorites.some((item) => item.product_id === productId);
  };

  const value = {
    products,
    setProducts,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartData,
    setCartData,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    removeFromCart,
    getCartAmount,
    cartTotalPrice, // إضافة cartTotalPrice إلى القيم الممررة
    navigate,
    resetCart,
    isLoggedIn,
    userData,
    login,
    logout,
    fetchProducts,
    currentPage,
    lastPage,
    setLastPage,
    isLoadingProducts,
    setIsLoadingProducts,
    showCart,
    backendUrl,
    nextPageUrl,
    setNextPageUrl,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isProductFavorited,
  };

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (
        nearBottom &&
        nextPageUrl &&
        !isLoadingProducts &&
        !isFetching.current
      ) {
        isFetching.current = true;
        fetchProducts(null, 25, true, null, nextPageUrl).finally(() => {
          isFetching.current = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPageUrl, isLoadingProducts, fetchProducts]);

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;

//? ========= end API ===========
//? ========= end API ===========

//! ================test =====================
//! ================test =====================
//! ================test =====================
//! ================test =====================
//! ================test =====================
