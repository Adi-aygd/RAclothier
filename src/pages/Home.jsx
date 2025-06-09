import React from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useStore();

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    const productToAdd = {
      ...product,
      size: product.sizes[0], // Default size
      color: product.colors[0] // Default color
    };

    addToCart(productToAdd);
    toast.success('Added to cart!');
  };

  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-24">
        <div className="container-custom text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            R&A Clothier
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Where sophistication meets style. Discover our curated collection 
            of premium menswear crafted for the modern gentleman.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/shop')}
              className="btn-primary bg-white text-black hover:bg-gray-200 text-lg px-8 py-4"
            >
              Explore Collection
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="btn-secondary border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4"
            >
              Our Heritage
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces that embody our commitment to exceptional quality and timeless style
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.originalPrice > product.price && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Sale
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-black text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The R&A Promise</h2>
            <p className="text-xl text-gray-600">Our commitment to excellence in every detail</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                Only the finest fabrics and materials make it into our collection, 
                ensuring lasting quality and comfort.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">✂️</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Expert Tailoring</h3>
              <p className="text-gray-600">
                Master craftsmen with decades of experience create each piece 
                with meticulous attention to detail.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Perfect Fit</h3>
              <p className="text-gray-600">
                Our sizing and fit are perfected through years of expertise, 
                ensuring you look and feel your best.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
