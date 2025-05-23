// AddToCartButton.jsx - Versión mejorada
import React from 'react';
import { useCart } from '../hooks/useCart';

const AddToCartButton = ({ product }) => {
  const { addToCart } = useCart();
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        addToCart(product);
      }}
      className="btn-primary"
    >
      Agregar al Carrito
    </button>
  );
};

export default AddToCartButton;