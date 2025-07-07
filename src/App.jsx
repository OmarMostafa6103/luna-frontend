import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShopContextProvider from './context/ShopContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Collection from './pages/Collection';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import PlaceOrder from './pages/PlaceOrder';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfilePage from './components/ProfilePage';
import Favorites from "./pages/Favorites";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <ShopContextProvider>
      <div className="min-h-screen px-8 flex flex-col bg-[#ffffff] text-gray-600 dark:bg-[#0c0e1d] dark:text-white">
        <ToastContainer />
        <Navbar />

        <main className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ShopContextProvider>
  );
};

export default App;