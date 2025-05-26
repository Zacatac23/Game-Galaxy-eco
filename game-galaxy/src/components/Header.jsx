// Header.jsx - Actualizado para pasar la función de búsqueda
import React from 'react';
import { Home, ShoppingCart } from '../icons';
import SearchBar from './SearchBar';

const Header = ({ currentView, onNavigate, itemCount, onSearch }) => {
  
  const handleSearch = (searchTerm) => {
    console.log('Header - Búsqueda recibida:', searchTerm); // Debug
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <header className="game-header">
      <div className="header-content">
        {/* Logo */}
        <button onClick={() => onNavigate('products')} className="logo-btn">
          <Home size={24} />
          <span className="logo-text">GAME GALAXY</span>
        </button>

        {/* Navegación */}
        <nav className="nav-menu">
          <button
            onClick={() => onNavigate('products')}
            className={`nav-item ${currentView === 'products' ? 'active' : ''}`}
          >
            🎮 Catálogo
          </button>
          <button className="nav-item">
            🔥 Ofertas
          </button>
        </nav>

        {/* Barra de búsqueda */}
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Buscar juegos..."
        />

        {/* Carrito */}
        <button
          onClick={() => onNavigate('cart')}
          className={`cart-btn ${currentView === 'cart' ? 'active' : ''}`}
        >
          <div className="cart-icon">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="cart-count">{itemCount}</span>
            )}
          </div>
          <span>Carrito</span>
        </button>
      </div>
    </header>
  );
};

export default Header;