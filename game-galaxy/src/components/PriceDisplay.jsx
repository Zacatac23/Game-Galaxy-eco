import React from 'react';

const PriceDisplay = ({ price, originalPrice, hasDiscount }) => {
  return (
    <div className="price-display">
      <span className="current-price">${price}</span>
      {hasDiscount && originalPrice && (
        <span className="original-price">${originalPrice}</span>
      )}
    </div>
  );
};

export default PriceDisplay;