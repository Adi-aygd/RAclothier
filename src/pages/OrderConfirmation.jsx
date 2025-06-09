import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Package size={40} className="text-blue-500 mb-3" />
                <h3 className="font-semibold mb-2">Order Number</h3>
                <p className="text-gray-600">#RNA{Math.floor(Math.random() * 100000)}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Truck size={40} className="text-green-500 mb-3" />
                <h3 className="font-semibold mb-2">Estimated Delivery</h3>
                <p className="text-gray-600">3-5 Business Days</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Mail size={40} className="text-purple-500 mb-3" />
                <h3 className="font-semibold mb-2">Confirmation Email</h3>
                <p className="text-gray-600">Sent to your email</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/shop')}
              className="btn-primary"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
