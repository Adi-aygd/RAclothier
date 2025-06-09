export const products = [
    {
      id: 1,
      name: "Premium Cotton Shirt",
      price: 89,
      originalPrice: 120,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop"
      ],
      description: "Luxurious cotton shirt with impeccable tailoring and premium finish.",
      category: "Shirts",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", code: "#FFFFFF" },
        { name: "Navy", code: "#1E3A8A" },
        { name: "Light Blue", code: "#93C5FD" }
      ],
      inStock: true,
      featured: true,
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Tailored Blazer",
      price: 299,
      originalPrice: 399,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop"
      ],
      description: "Sophisticated blazer crafted from premium wool blend for the modern professional.",
      category: "Blazers",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Charcoal", code: "#374151" },
        { name: "Navy", code: "#1E3A8A" },
        { name: "Black", code: "#000000" }
      ],
      inStock: true,
      featured: true,
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: "Classic Trousers",
      price: 149,
      originalPrice: 199,
      images: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506629905607-45c7d5d7b4f4?w=500&h=600&fit=crop"
      ],
      description: "Perfectly tailored trousers with contemporary fit and premium fabric.",
      category: "Trousers",
      sizes: ["30", "32", "34", "36", "38"],
      colors: [
        { name: "Charcoal", code: "#374151" },
        { name: "Navy", code: "#1E3A8A" },
        { name: "Khaki", code: "#92400E" }
      ],
      inStock: true,
      featured: false,
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: "Luxury Polo",
      price: 79,
      originalPrice: 99,
      images: [
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop"
      ],
      description: "Premium polo shirt made from finest pima cotton for ultimate comfort.",
      category: "Polos",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", code: "#FFFFFF" },
        { name: "Navy", code: "#1E3A8A" },
        { name: "Forest Green", code: "#065F46" }
      ],
      inStock: true,
      featured: true,
      rating: 4.6,
      reviews: 203
    }
  ];
  
  export const categories = [
    { id: 1, name: "Shirts", count: 25, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop" },
    { id: 2, name: "Blazers", count: 18, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=200&fit=crop" },
    { id: 3, name: "Trousers", count: 22, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=200&fit=crop" },
    { id: 4, name: "Polos", count: 15, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=200&fit=crop" },
    { id: 5, name: "Accessories", count: 12, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop" }
  ];
  