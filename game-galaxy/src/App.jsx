// App.jsx - Actualizado con funcionalidad de búsqueda
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
  const [searchTerm, setSearchTerm] = useState(''); // Estado para búsqueda
  const viewedProductsRef = useRef([]);

  const handleViewDetails = (product) => {
    // Agregar a historial de productos vistos
    if (!viewedProductsRef.current.includes(product.id)) {
      viewedProductsRef.current.push(product.id);
    }
    setSelectedProduct(product);
    setCurrentView('details');
  };

  const handleNavigate = (view) => {
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

  // Manejar búsqueda desde el Header
  const handleSearch = (term) => {
    console.log('App - Búsqueda recibida:', term); // Debug
    setSearchTerm(term);
    // Si estamos en otra vista, volver a productos para mostrar resultados
    if (currentView !== 'products') {
      setCurrentView('products');
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <CartConsumer>
          {({ itemCount }) => (
            <Header 
              currentView={currentView} 
              onNavigate={handleNavigate}
              itemCount={itemCount}
              onSearch={handleSearch} // Pasar función de búsqueda
            />
          )}
        </CartConsumer>
        
        <main className="relative">
          {currentView === 'products' && (
            <ProductListPage 
              onViewDetails={handleViewDetails}
              searchTerm={searchTerm} // Pasar término de búsqueda
            />
          )}
          
          {currentView === 'details' && (
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