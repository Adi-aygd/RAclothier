  # RAclothier - Technical Architecture Report

  ## Project Overview
  **RAclothier** is a full-stack e-commerce application built with modern web technologies, featuring a React frontend and Node.js backend with Firebase cloud services.

  ---

  ## 🎯 Frontend Architecture

  ### Technology Stack
  - **Framework**: React 19.1.0 (Latest)
  - **Build Tool**: Vite 6.3.5
  - **Language**: JavaScript (ES6+)
  - **Styling**: Tailwind CSS 3.4.17 + PostCSS
  - **Port**: 6969 (Development)

  ### Key Frontend Libraries
  - **UI Components**: Mantine UI (v8.1.2)
    - Core components, forms, modals, carousels
    - Date pickers and form validation
  - **State Management**: Zustand 5.0.5
  - **Routing**: React Router DOM 7.6.2
  - **HTTP Client**: Axios 1.9.0
  - **Form Handling**: React Hook Form 7.57.0 + Yup validation
  - **Animations**: Framer Motion 12.16.0
  - **Icons**: Tabler Icons, Lucide React, React Icons
  - **Notifications**: React Hot Toast 2.5.2

  ### Frontend Features
  - Responsive design with Tailwind CSS
  - Component-based architecture
  - Form validation and error handling
  - Toast notifications
  - Carousel/slider components
  - Date handling utilities
  - Modern React patterns (hooks, functional components)

  ---

  ## 🚀 Backend Architecture

  ### Technology Stack
  - **Runtime**: Node.js
  - **Framework**: Express.js 4.18.2
  - **Port**: 5173 (Default)
  - **Architecture**: RESTful API

  ### Backend Dependencies
  - **Core**: Express.js, CORS, Helmet
  - **Authentication**: bcryptjs, jsonwebtoken
  - **Security**: Helmet, express-rate-limit
  - **File Handling**: Multer
  - **Logging**: Morgan
  - **Environment**: dotenv

  ### API Endpoints
  ```
  /api/auth          - Authentication routes
  /api/categories    - Product categories
  /api/products      - Product management
  /api/admin         - Admin functionality
  /api/health        - Health check
  ```

  ### Security Features
  - **Rate Limiting**: 100 requests per 15 minutes
  - **CORS**: Cross-origin resource sharing enabled
  - **Helmet**: Security headers
  - **JWT**: JSON Web Token authentication
  - **Input Validation**: Request validation middleware

  ---

  ## ☁️ Cloud Infrastructure

  ### Firebase Services
  - **Project ID**: wanderlust-b43f0
  - **Authentication**: Firebase Admin SDK
  - **Database**: Firestore (NoSQL)
  - **Storage**: Firebase Storage
  - **Service Account**: Firebase Admin SDK integration

  ### Firebase Configuration
  ```javascript
  // Services available
  - Firebase Auth (admin.auth())
  - Firestore Database (admin.firestore())
  - Firebase Storage (admin.storage())
  - Storage Bucket (${project_id}.appspot.com)
  ```

  ### Cloud Features
  - **Real-time Database**: Firestore
  - **File Storage**: Firebase Storage
  - **User Authentication**: Firebase Auth
  - **Scalable Infrastructure**: Google Cloud Platform
  - **Security Rules**: Firebase Security Rules

  ---

  ## 💾 Data Storage

  ### Primary Database
  - **Firestore**: NoSQL document database
  - **Collections**: Products, Categories, Users, Orders
  - **Real-time**: Live data synchronization
  - **Offline Support**: Offline data persistence

  ### File Storage
  - **Firebase Storage**: Cloud file storage
  - **Upload Path**: ./uploads (Local)
  - **Max File Size**: 5MB (5,242,880 bytes)
  - **Supported Formats**: Images, documents

  ### Local Storage
  - **Session Management**: JWT tokens
  - **User Preferences**: Browser localStorage
  - **Cart Data**: Client-side state management

  ---

  ## 🔐 Authentication & Security

  ### Authentication Flow
  1. **User Registration**: Firebase Auth + bcryptjs
  2. **Login**: JWT token generation
  3. **Session Management**: JWT with 7-day expiry
  4. **Admin Access**: Secret key authentication

  ### Security Measures
  - **Password Hashing**: bcryptjs
  - **JWT Tokens**: Secure session management
  - **Rate Limiting**: API abuse prevention
  - **CORS Protection**: Cross-origin security
  - **Input Sanitization**: Request validation

  ---

  ## 📱 Application Features

  ### E-commerce Capabilities
  - Product catalog with categories
  - Shopping cart functionality
  - User authentication system
  - Admin panel for management
  - File upload capabilities
  - Order management system

  ### User Experience
  - Responsive design
  - Toast notifications
  - Form validation
  - Image carousels
  - Search and filtering
  - Pagination support

  ---

  ## 🛠️ Development & Deployment

  ### Development Tools
  - **ESLint**: Code quality and consistency
  - **Prettier**: Code formatting
  - **PostCSS**: CSS processing
  - **Nodemon**: Backend auto-reload

  ### Build Process
  - **Frontend**: Vite build system
  - **Backend**: Node.js runtime
  - **Assets**: Optimized bundling
  - **Environment**: Configuration management

  ### Environment Variables
  ```bash
  # Server Configuration
  PORT=5173
  NODE_ENV=development

  # Firebase Configuration
  FIREBASE_PROJECT_ID=wanderlust-b43f0
  FIREBASE_WEB_API_KEY=your_firebase_web_api_key

  # Security
  ADMIN_SECRET=your-super-secret-admin-key-123
  JWT_SECRET=your_jwt_secret_key_here
  JWT_EXPIRES_IN=7d

  # File Upload
  MAX_FILE_SIZE=5242880
  UPLOAD_PATH=./uploads

  # Rate Limiting
  RATE_LIMIT_WINDOW_MS=900000
  RATE_LIMIT_MAX_REQUESTS=100
  ```

  ---

  ## 📊 Performance & Scalability

  ### Frontend Optimization
  - Vite build optimization
  - Code splitting and lazy loading
  - Optimized image handling
  - Responsive design patterns

  ### Backend Performance
  - Rate limiting for API protection
  - Efficient database queries
  - File upload optimization
  - Caching strategies

  ### Cloud Scalability
  - Firebase auto-scaling
  - Load balancing capabilities
  - Global CDN distribution
  - Real-time synchronization

  ---

  ## 🔧 Maintenance & Monitoring

  ### Health Checks
  - API health endpoint (/api/health)
  - Firebase connection monitoring
  - Server status monitoring
  - Error logging and handling

  ### Logging
  - Morgan HTTP request logging
  - Custom logging middleware
  - Error tracking and reporting
  - Performance monitoring

  ---

  ## 🚀 Future Enhancements

  ### Potential Improvements
  - **Caching**: Redis integration
  - **Search**: Elasticsearch implementation
  - **Payments**: Stripe/PayPal integration
  - **Analytics**: Google Analytics integration
  - **Testing**: Jest/Testing Library setup
  - **CI/CD**: GitHub Actions deployment

  ---

  ## 📋 Summary

  **RAclothier** is a modern, scalable e-commerce platform built with:
  - **Frontend**: React + Vite + Tailwind CSS
  - **Backend**: Node.js + Express.js
  - **Database**: Firebase Firestore
  - **Storage**: Firebase Storage
  - **Authentication**: Firebase Auth + JWT
  - **Cloud**: Google Cloud Platform (Firebase)

  The architecture follows modern web development best practices with a focus on security, scalability, and user experience. The Firebase integration provides a robust, scalable backend infrastructure while the React frontend delivers a responsive and interactive user interface.

  ---

  *Report generated on: $(Get-Date)*
  *Project Version: 1.0.0*
