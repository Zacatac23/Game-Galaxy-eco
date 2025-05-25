import { Home, ShoppingCart } from '../icons';

const Header = ({ currentView, onNavigate, itemCount }) => {
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