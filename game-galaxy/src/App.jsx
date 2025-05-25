// App.jsx - Version con debug
import React, { useState, useRef } from 'react';
import { CartProvider } from './context/CartContext';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

// Cart Consumer Component
const CartConsumer = ({ children }) => {
  const cartContext = useCart();
  return children(cartContext);
};

const App = () => {
  const [currentView, setCurrentView] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const viewedProductsRef = useRef([]);

  // Debug: función handleViewDetails con logs
  const handleViewDetails = (product) => {
    console.log('=== App.jsx - handleViewDetails called ===');
    console.log('Product received:', product);
    console.log('Current view:', currentView);
    
    // Agregar a historial de productos vistos
    if (!viewedProductsRef.current.includes(product.id)) {
      viewedProductsRef.current.push(product.id);
      console.log('Added to viewed products:', viewedProductsRef.current);
    }
    
    setSelectedProduct(product);
    setCurrentView('details');
    
    console.log('Selected product set to:', product);
    console.log('View changed to: details');
    console.log('=== End handleViewDetails ===');
  };

  const handleNavigate = (view) => {
    console.log('Navigate to:', view);
    setCurrentView(view);
    if (view !== 'details') {
      setSelectedProduct(null);
    }
  };

  const handleBackToProducts = () => {
    console.log('Back to products');
    setCurrentView('products');
    setSelectedProduct(null);
  };

  // Debug: log current state
  console.log('=== App.jsx Render ===');
  console.log('Current view:', currentView);
  console.log('Selected product:', selectedProduct);
  console.log('handleViewDetails function:', handleViewDetails);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <CartConsumer>
          {({ itemCount }) => (
            <Header 
              currentView={currentView} 
              onNavigate={handleNavigate}
              itemCount={itemCount}
            />
          )}
        </CartConsumer>
        
        <main className="relative">
          {currentView === 'products' && (
            <ProductListPage onViewDetails={handleViewDetails} />
          )}
          
          {currentView === 'details' && selectedProduct && (
            <ProductDetailPage 
              product={selectedProduct}
              onBack={handleBackToProducts}
              viewedProducts={viewedProductsRef.current}
            />
          )}
          
          {currentView === 'cart' && <CartPage />}
        </main>
      </div>
    </CartProvider>
  );
};

export default App;