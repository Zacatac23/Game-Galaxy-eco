import useFavoritesManager from '../hook/useFavoritesManager';

const FavoritesManager = ({ onViewProduct }) => {
  const { favorites, history, stats, view, clearHistory, formatDate, changeView } = useFavoritesManager();

  return (
    <div className="favorites-manager">
      <div className="favorites-header">
        <h2>Gestión de Favoritos</h2>
        <div className="view-tabs">
          <button className={view === 'favorites' ? 'active' : ''} onClick={() => changeView('favorites')}>
            <span className="tab-emoji">❤️</span>Favoritos ({favorites.length})
          </button>
          <button className={view === 'history' ? 'active' : ''} onClick={() => changeView('history')}>
            <span className="tab-emoji">📅</span>Historial ({history.length})
          </button>
          <button className={view === 'stats' ? 'active' : ''} onClick={() => changeView('stats')}>
            <span className="tab-emoji">📊</span>Estadísticas
          </button>
        </div>
      </div>

      {view === 'favorites' && (
        <div className="favorites-list">
          {favorites.length === 0 ? (
            <div className="empty-state">
              <span className="empty-emoji">💔</span>
              <p>No tienes favoritos aún</p>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map(fav => (
                <div key={fav.id} className="favorite-card">
                  {fav.image && <img src={fav.image} alt={fav.title} className="favorite-image" onClick={() => onViewProduct && onViewProduct(fav)} />}
                  <div className="favorite-info">
                    <h4>{fav.title}</h4>
                    {fav.price && <p className="price">${fav.price}</p>}
                    <p className="added-date">Agregado: {formatDate(fav.addedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesManager;