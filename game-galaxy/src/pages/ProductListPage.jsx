import React from 'react';
import { GAMES_DATA } from '../data/gamesData';
import ProductCard from '../components/ProductCard';

const ProductListPage = ({ onViewDetails }) => {
  return (
    <div className="home-container">
      <div className="welcome-section bounce-in">
        <h2 className="welcome-title">Welcome to GAME GALAXY</h2>
        <p className="welcome-subtitle">¡Tu universo gamer comienza aquí! Sumérgete en una galaxia de emociones, desafíos y aventuras sin límites. En GAME GAXY, encontrarás los mejores videojuegos para todas las plataformas, desde clásicos legendarios hasta los últimos lanzamientos. Ya seas fanático de la acción, la estrategia, el rol o los deportes, aquí hay un juego esperándote.
Explora, juega y conquista. Donde los gamers encuentran su destino.</p>
      </div>
      
      <div className="games-grid">
        {GAMES_DATA.map((product, index) => (
          <div 
            key={product.id} 
            className="fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard
              product={product}
              onViewDetails={onViewDetails}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;