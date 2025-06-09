import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, size, color, newQuantity);
  };

  const handleRemoveItem = (productId, size, color, productName) => {
    removeFromCart(productId, size, color);
    toast.success(`${productName} removed from cart`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Discover our premium collection and find your perfect style.</p>
          <Link to="/shop" className="btn-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  const tax = cartTotal * 0.1;
  const shipping = cartTotal > 200 ? 0 : 25;
  const total = cartTotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Cart Items ({cart.length})</h2>
              
              <div className="space-y-6">
                {cart.map((item, ) => (
                  <div key={`${item.id}-${item.size}-${item.color.name}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={item.images[0]} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Size: {item.size}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-600 text-sm">Color:</span>
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color.code }}
                        />
                        <span className="text-gray-600 text-sm">{item.color.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">${item.price} each</p>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id, item.size, item.color, item.name)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary mb-3"
              >
                Proceed to Checkout
              </button>
              
              <Link to="/shop" className="block w-full text-center btn-secondary">
                Continue Shopping
              </Link>

              {/* Free Shipping Notice */}
              {cartTotal < 200 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Add ${(200 - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
