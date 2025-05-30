// FavoritesHistory.jsx - Componente compacto para mostrar solo el historial (sin filtros)
import React from 'react';
import useHistoryManager from '../hooks/useHistoryManager';
import '../style/FavoritesHistory.css';

const FavoritesHistory = ({ history = [], formatDate, onClearHistory, getHistoryByAction }) => {
  const {
    filteredHistory,
    filteredStats,
    getActionIcon,
    getActionText,
    isEmpty
  } = useHistoryManager(history, getHistoryByAction);

  const handleClearHistory = () => {
    if (window.confirm('¿Limpiar todo el historial?')) onClearHistory?.();
  };

  return (
    <div className="favorites-history">
      <div className="history-header">
        <h2><span className="icon">📊</span>Historial de Favoritos</h2>
        <div className="quick-stats">
          <div className="stat-item"><span>{filteredStats.total}</span>Total</div>
          <div className="stat-item likes"><span>{filteredStats.likes}</span>Likes</div>
          <div className="stat-item unlikes"><span>{filteredStats.unlikes}</span>Unlikes</div>
        </div>
      </div>

      <div className="history-controls">
        <button onClick={handleClearHistory} className="clear-btn">🗑️ Limpiar Historial</button>
      </div>

      <div className="history-list">
        {isEmpty ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No hay registros en el historial</p></div>
        ) : (
          <div className="history-items">
            {filteredHistory.map((entry, index) => (
              <div key={entry.id || index} className={`history-item ${entry.action}`}>
                <span className="item-icon">{getActionIcon(entry.action)}</span>
                <div className="item-content">
                  <span className="action-text">{getActionText(entry.action)}</span>
                  <span className="product-title">{entry.productTitle || `#${entry.productId}`}</span>
                  <span className="timestamp">{formatDate ? formatDate(entry.timestamp) : entry.timestamp}</span>
                </div>
                {entry.productImage && <img src={entry.productImage} alt={entry.productTitle} className="item-image" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesHistory;