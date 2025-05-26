// components/QuantitySelector.jsx - ACTUALIZADO
import React from 'react';
import { Plus, Minus } from '../icons';

const QuantitySelector = ({ quantity, onIncrease, onDecrease, maxQuantity = 9 }) => {
  return (
    <div className="quantity-selector">
      <button
        onClick={onDecrease}
        className="quantity-btn"
        disabled={quantity <= 1}
        title="Disminuir cantidad"
      >
        <Minus size={16} />
      </button>
      
      <span className="quantity-display">{quantity}</span>
      
      <button
        onClick={onIncrease}
        className="quantity-btn"
        disabled={quantity >= maxQuantity}
        title="Aumentar cantidad"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;
