import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import useStore from '../../store/useStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, isAuthenticated, user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Shirts', path: '/shop/shirts' },
    { name: 'Blazers', path: '/shop/blazers' },
    { name: 'About', path: '/about' }
  ];

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-black hover:text-gray-700 transition-colors">
              R&A Clothier
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${
                  isActiveLink(link.path)
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart size={20} />
            </button>

            {/* User Account */}
            <button
              onClick={handleAuthClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
            >
              <User size={20} />
              {isAuthenticated && (
                <span className="hidden md:block text-sm text-gray-600">
                  {user?.name || 'Account'}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 transition-colors duration-200 ${
                  isActiveLink(link.path)
                    ? 'text-black font-semibold bg-gray-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4 px-4">
              <button
                onClick={handleAuthClick}
                className="w-full text-left py-2 text-gray-700 hover:text-black"
              >
                {isAuthenticated ? 'Logout' : 'Login / Sign Up'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
