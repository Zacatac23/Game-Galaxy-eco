import React from 'react';
import { Home, ShoppingCart } from '../icons';

const Header = ({ currentView, onNavigate, itemCount }) => {
  return (
    <header className="header-improved">
      <div className="header-container">
        <div className="logo-section">
          <button className="hamburger-menu">
            ☰
          </button>
          <button onClick={() => onNavigate('products')} className="logo-section">
            <Home size={24} />
            <h1 className="logo-title">GAME GALAXY</h1>
          </button>
        </div>
        
        <nav className="cart-section">
          <button
            onClick={() => onNavigate('cart')}
            className="cart-button"
          >
            <ShoppingCart size={20} />
            <span>Carrito</span>
            <span className="cart-count">{itemCount}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};


export default Header;