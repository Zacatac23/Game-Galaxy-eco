import React from 'react';
import { Plus, Minus } from '../icons';

const QuantitySelector = ({ quantity, onIncrease, onDecrease, maxQuantity = 9 }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        disabled={quantity <= 1}
      >
        <Minus size={16} />
      </button>
      
      <span className="w-8 text-center font-medium">{quantity}</span>
      
      <button
        onClick={onIncrease}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        disabled={quantity >= maxQuantity}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector; // This was missing!