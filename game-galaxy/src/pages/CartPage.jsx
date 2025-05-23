// CartPage.jsx - Versión mejorada
import React, { useState } from 'react';
import { ShoppingCart } from '../icons';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import ErrorMessage from '../components/ErrorMessage';

const CartPage = () => {
  const { items, cartTotal, clearCart } = useCart();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const hasError = cartTotal > 999.99;

  const handlePurchase = () => {
    if (!hasError && items.length > 0) {
      setShowPurchaseModal(true);
      setTimeout(() => {
        setShowPurchaseModal(false);
        clearCart();
      }, 3000);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="text-center py-12 fade-in">
          <ShoppingCart size={80} className="mx-auto text-gray-400 mb-6" />
          <h2 className="cart-title">Tu carrito está vacío</h2>
          <p className="text-gray-400 text-lg">Agrega algunos juegos increíbles a tu carrito</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cart-container fade-in">
        <h2 className="cart-title">Tu Carrito</h2>
        
        {hasError && (
          <ErrorMessage message="El total del carrito no puede exceder $999.99" />
        )}
        
        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="cart-item fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="cart-item-info">
                <h4 className="cart-item-name">{item.title}</h4>
                <p className="cart-item-price">${item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-total bounce-in">
          <p className="cart-total-text">Total de la compra:</p>
          <p className="cart-total-amount">${cartTotal.toFixed(2)}</p>
          
          <button
            onClick={handlePurchase}
            disabled={hasError}
            className={`btn-primary ${hasError ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {hasError ? 'Error en el total' : 'Realizar Compra'}
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">¡Compra Exitosa!</h3>
            <p className="modal-message">Tu pedido ha sido procesado correctamente</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;