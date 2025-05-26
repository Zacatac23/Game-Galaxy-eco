import React, { useState, useMemo, useEffect } from 'react';
import { GAMES_DATA } from '../data/gamesData';
import ProductCard from '../components/ProductCard';

const ProductListPage = ({ onViewDetails, searchTerm }) => {
  const [productRatings, setProductRatings] = useState({});
  
  console.log('ProductListPage - Props recibidas:', { searchTerm });

  // Filtrar juegos basado en búsqueda
  const filteredGames = useMemo(() => {
    console.log('ProductListPage - Calculando filtros para:', searchTerm);
    
    if (!searchTerm || !searchTerm.trim()) {
      console.log('ProductListPage - No hay búsqueda, mostrando todos');
      return GAMES_DATA;
    }

    const term = searchTerm.toLowerCase().trim();
    console.log('ProductListPage - Filtrando por término:', term);
    
    const filtered = GAMES_DATA.filter(game => {
      const matchTitle = game.title?.toLowerCase().includes(term);
      const matchCategory = game.category?.toLowerCase().includes(term);
      const matchDescription = game.description?.toLowerCase().includes(term);
      
      return matchTitle || matchCategory || matchDescription;
    });

    console.log('ProductListPage - Resultados filtrados:', filtered.length, filtered);
    return filtered;
  }, [searchTerm]);

  // Función para manejar rating desde la lista
  const handleQuickRating = (productId, rating) => {
    setProductRatings(prev => ({
      ...prev,
      [productId]: rating
    }));
    
    console.log(`Rating rápido: Producto ${productId} calificado con ${rating} estrellas`);
    // Aquí puedes hacer la llamada a la API
    // submitQuickRating(productId, rating);
  };

  // Debug cuando cambie searchTerm
  useEffect(() => {
    console.log('ProductListPage - searchTerm cambió a:', searchTerm);
  }, [searchTerm]);

  return (
    <div className="home-container">
      <div className="welcome-section bounce-in">
        <h2 className="welcome-title">Welcome to GAME GALAXY</h2>
        <p className="welcome-subtitle">Descubre los mejores videojuegos al mejor precio</p>
      </div>

      {/* Información de búsqueda */}
      {searchTerm && searchTerm.trim() && (
        <div className="search-results-info">
          <div className="search-info">
            <span className="search-term">Buscando: "{searchTerm}"</span>
            <span className="search-count">
              {filteredGames.length} de {GAMES_DATA.length} juegos
            </span>
          </div>
          
          {filteredGames.length === 0 && (
            <div className="no-results">
              <p>No se encontraron juegos que coincidan con tu búsqueda.</p>
              <p>Intenta con términos como "Halo", "Cyberpunk", "RPG", "FPS".</p>
            </div>
          )}
        </div>
      )}
      
      <div className="games-grid">
        {filteredGames.map((product, index) => (
          <div 
            key={product.id} 
            className="fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard
              product={product}
              onViewDetails={onViewDetails}
              userRating={productRatings[product.id] || 0}
              onQuickRating={(rating) => handleQuickRating(product.id, rating)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;