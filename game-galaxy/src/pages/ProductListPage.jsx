// ProductListPage.jsx - Version con debug
import React from 'react';
import { GAMES_DATA } from '../data/gamesData';
import ProductCard from '../components/ProductCard';

const ProductListPage = ({ onViewDetails }) => {
  
  // Debug: Verificar que la función llega correctamente
  console.log('ProductListPage - onViewDetails:', onViewDetails);
  console.log('ProductListPage - GAMES_DATA:', GAMES_DATA);

  // Función wrapper para debug
  const handleViewDetailsWrapper = (product) => {
    console.log('ProductListPage - handleViewDetailsWrapper called with:', product);
    
    if (onViewDetails && typeof onViewDetails === 'function') {
      onViewDetails(product);
    } else {
      console.error('ProductListPage - onViewDetails is not a function:', onViewDetails);
    }
  };

  return (
    <div className="home-container">
      <div className="welcome-section bounce-in">
        <h2 className="welcome-title">Welcome to GAME GALAXY</h2>
        <p className="welcome-subtitle">Descubre los mejores videojuegos al mejor precio</p>
      </div>
      
      <div className="games-grid">
        {GAMES_DATA.map((product, index) => {
          console.log(`Rendering product ${index}:`, product); // Debug cada producto
          
          return (
            <div 
              key={product.id} 
              className="fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product={product}
                onViewDetails={handleViewDetailsWrapper}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListPage;