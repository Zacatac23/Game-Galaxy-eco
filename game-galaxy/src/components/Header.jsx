import React from 'react';
import { Home, ShoppingCart } from '../icons';
import SearchBar from './SearchBar';
import useHeader from '../hooks/useHeader';

const Header = ({ currentView, onNavigate, itemCount, onSearch }) => {
  const { handleSearch, handleNavigation, getNavItemClass, getCartButtonClass, shouldShowCartCount } = useHeader(onSearch, onNavigate);

  return (
    <header className="game-header">
      <div className="header-content">
        <button onClick={() => handleNavigation('products')} className="logo-btn">
          <Home size={24} />
          <span className="logo-text">GAME GALAXY</span>
        </button>
        <nav className="nav-menu">
          <button onClick={() => handleNavigation('products')} className={getNavItemClass('products', currentView)}>
            🎮 Catálogo
          </button>
        </nav>
        <SearchBar onSearch={handleSearch} placeholder="Buscar juegos..." />
        <button onClick={() => handleNavigation('cart')} className={getCartButtonClass(currentView)}>
          <div className="cart-icon">
            <ShoppingCart size={20} />
            {shouldShowCartCount(itemCount) && <span className="cart-count">{itemCount}</span>}
          </div>
          <span>Carrito</span>
        </button>
      </div>
    </header>
  );
};

export default Header;