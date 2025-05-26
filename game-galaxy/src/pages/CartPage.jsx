// CartPage.jsx - Corregido
import React, { useState } from 'react';
import { ShoppingCart } from '../icons';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import ErrorMessage from '../components/ErrorMessage';

const CartPage = () => {
  const { items, cartTotal, clearCart, removeFromCart } = useCart(); // Agregado removeFromCart
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
            <CartItem 
              key={item.id} 
              item={item} 
              index={index} // Pasado como prop al CartItem
            />
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