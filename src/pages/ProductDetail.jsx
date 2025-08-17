import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { productsAPI } from '../utils/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import placeholder from '../assets/product_placeholder.jpg';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useStore();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const isInitialLoad = useRef(true);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
          return;
        }
        const response = await productsAPI.getById(id);
        const productData = response.result;

        if (productData) {
          setProduct(productData);
          // Set default size and color if available
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product) {
        const response = await productsAPI.getAll({ categoryId: product.categoryId, limit: 4 });
        const relatedProducts = response.result.products.filter(p => p.id !== id);
        setRelatedProducts(relatedProducts);
      }
    };
    fetchRelatedProducts();
  }, [product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }

    if (product?.sizes && !selectedSize) {
      toast.error('Please select size');
      return;
    }
    if (product?.colors && !selectedColor) {
      toast.error('Please select color');
      return;
    }

    const productToAdd = {
      ...product,
      ...(selectedSize && { size: selectedSize }),
      ...(selectedColor && { color: selectedColor }),
      quantity: quantity,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }

    toast.success(`${quantity} item(s) added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Loading product...
          </h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={product?.images?.[selectedImage] || placeholder}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-4">
              {product?.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image || placeholder}
                    alt={`${product?.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              )) || (
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={placeholder}
                    alt="No image available"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
                {product?.name}
              </h1>
              {/* <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-gray-300"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  No reviews yet
                </span>
              </div> */}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
              रू {product?.price}
              </span>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">
                Size: {selectedSize}
              </h3>
              <div className="flex gap-3">
                {product?.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product?.stock, quantity + 1))
                    }
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {/*  show stock availability. if stock is 0, show out of stock if stock < 10, show low stock  if <0 show nothing.*/}
                {product?.stock < 10 && product?.stock > 0 && (
                  <span className="text-sm bg-orange-600 text-white px-3 py-2 rounded-full">
                    Low Stock
                  </span>
                )}
                {product?.stock >= 10 && (
                  <span className="text-sm bg-green-500 text-white px-3 py-2 rounded-full">
                    In Stock
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product?.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 text-lg py-4 rounded-lg transition-all ${
                  product?.stock < 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                <ShoppingBag size={20} />
                {product?.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-4 border rounded-lg transition-all ${
                  isLiked
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Product Description */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 text-lg">
                Product Description
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  {product?.description}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* This section would need to be populated with related products from API */}
        <div className="mt-20 w-full text-center">
          <h2 className="text-3xl font-bold mb-12">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
