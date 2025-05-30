// useStarRating.js - Hook personalizado para StarRating
import { useState, useCallback } from 'react';

const useStarRating = (rating = 0, isInteractive = false, onRatingChange = null) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  // Manejar click en estrella
  const handleStarClick = useCallback((starIndex) => {
    console.log('🌟🌟🌟 STAR CLICKED:', starIndex, 'isInteractive:', isInteractive);
    
    if (!isInteractive) {
      console.log('❌ Not interactive, ignoring click');
      return;
    }
    
    const newRating = starIndex + 1;
    console.log('✅ Setting new rating:', newRating);
    setCurrentRating(newRating);
    
    if (onRatingChange) {
      console.log('📞 Calling onRatingChange with:', newRating);
      onRatingChange(newRating);
    } else {
      console.log('⚠️ No onRatingChange function provided');
    }
  }, [isInteractive, onRatingChange]);

  // Manejar hover en estrella
  const handleStarHover = useCallback((starIndex) => {
    if (isInteractive) {
      console.log('👆 Button hover:', starIndex + 1);
      setHoverRating(starIndex + 1);
    }
  }, [isInteractive]);

  // Manejar salida del hover del contenedor
  const handleContainerLeave = useCallback(() => {
    if (isInteractive) {
      console.log('👋 Container mouse leave');
      setHoverRating(0);
    }
  }, [isInteractive]);

  // Obtener rating a mostrar
  const displayRating = isInteractive ? (hoverRating || currentRating) : rating;

  // Verificar si estrella está llena
  const isStarFilled = useCallback((index) => {
    return index < Math.floor(displayRating);
  }, [displayRating]);

  // Obtener clases CSS del contenedor
  const getContainerClasses = useCallback(() => {
    return `star-rating ${isInteractive ? 'interactive' : ''}`;
  }, [isInteractive]);

  // Obtener clases CSS de estrella
  const getStarClasses = useCallback((index) => {
    const isFilled = isStarFilled(index);
    return `star ${isFilled ? 'filled' : 'empty'} ${isInteractive ? 'clickable' : ''}`;
  }, [isStarFilled, isInteractive]);

  // Obtener clases CSS de botón
  const getButtonClasses = useCallback((index) => {
    const isFilled = isStarFilled(index);
    return `star-button ${isFilled ? 'filled' : 'empty'}`;
  }, [isStarFilled]);

  // Obtener estilos del botón
  const getButtonStyles = useCallback((index) => ({
    background: 'none',
    border: 'none',
    padding: '2px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
    transition: 'all 0.2s ease',
    transform: hoverRating > index ? 'scale(1.2)' : 'scale(1)',
    outline: 'none'
  }), [hoverRating]);

  return {
    displayRating,
    hoverRating,
    handleStarClick,
    handleStarHover,
    handleContainerLeave,
    isStarFilled,
    getContainerClasses,
    getStarClasses,
    getButtonClasses,
    getButtonStyles
  };
};

export default useStarRating;