// useProductCard.js - Hook personalizado para ProductCard
import { useCallback } from 'react';

const useProductCard = (product, onViewDetails, userRating = 0, onQuickRating) => {
  
  // Manejar click en imagen
  const handleImageClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Image clicked!', product);
    
    if (onViewDetails && typeof onViewDetails === 'function') {
      onViewDetails(product);
    }
  }, [product, onViewDetails]);

  // Manejar rating rápido
  const handleQuickRating = useCallback((rating) => {
    console.log('ProductCard - handleQuickRating called with:', rating);
    if (onQuickRating) {
      console.log('ProductCard - calling onQuickRating');
      onQuickRating(rating);
    } else {
      console.log('ProductCard - No onQuickRating function provided');
    }
  }, [onQuickRating]);

  // Verificar si tiene descuento
  const hasDiscount = product.hasDiscount;
  
  // Verificar si mostrar precio original
  const shouldShowOriginalPrice = hasDiscount && product.originalPrice;
  
  // Verificar si el usuario ya votó
  const hasUserRating = userRating > 0;

  // Debug logging
  console.log('ProductCard render:', { 
    productId: product.id, 
    userRating, 
    hasOnQuickRating: !!onQuickRating 
  });

  return {
    handleImageClick,
    handleQuickRating,
    hasDiscount,
    shouldShowOriginalPrice,
    hasUserRating
  };
};

export default useProductCard;