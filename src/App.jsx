import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Dashboard from './pages/dashboard/index';
import useAuth from './hooks/useAuth';
import './App.css';
import { Navigate } from 'react-router-dom';
import useStore from './store/useStore';

function App() {
  // Initialize authentication state
  useAuth();

  const { isAuthenticated, isLoading, initializeCart } = useStore();

  // Initialize cart from localStorage on app mount
  useEffect(() => {
    initializeCart();
  }, [initializeCart]);
  if (isLoading) {
    return (
      <div className="App">
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/products/:category" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
