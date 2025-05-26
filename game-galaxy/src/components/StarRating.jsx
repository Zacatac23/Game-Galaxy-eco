// StarRating.jsx - SOLUCIÓN DEFINITIVA CON BOTONES
import React, { useState } from 'react';
import { Star } from '../icons';

const StarRating = ({ 
  rating = 0, 
  reviews, 
  isInteractive = false, 
  onRatingChange = null,
  size = 16,
  showReviews = true 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleStarClick = (starIndex) => {
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
  };

  const displayRating = isInteractive ? (hoverRating || currentRating) : rating;

  return (
    <div className={`star-rating ${isInteractive ? 'interactive' : ''}`}>
      <div 
        className="stars" 
        style={{ display: 'flex', gap: '2px', alignItems: 'center' }}
        onMouseLeave={() => {
          if (isInteractive) {
            console.log('👋 Container mouse leave');
            setHoverRating(0);
          }
        }}
      >
        {[...Array(5)].map((_, index) => {
          const isFilled = index < Math.floor(displayRating);
          
          if (isInteractive) {
            // VERSIÓN INTERACTIVA - USA BOTONES
            return (
              <button
                key={index}
                type="button"
                className={`star-button ${isFilled ? 'filled' : 'empty'}`}
                onClick={(e) => {
                  console.log('🎯🎯🎯 BUTTON CLICKED:', index);
                  e.preventDefault();
                  e.stopPropagation();
                  handleStarClick(index);
                }}
                onMouseEnter={(e) => {
                  console.log('👆 Button hover:', index + 1);
                  e.preventDefault();
                  setHoverRating(index + 1);
                }}
                style={{
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
                }}
              >
                <Star
                  size={size}
                  className={`star ${isFilled ? 'filled' : 'empty'} clickable`}
                  style={{ pointerEvents: 'none' }}
                />
              </button>
            );
          } else {
            // VERSIÓN NO INTERACTIVA - SOLO MUESTRA
            return (
              <Star
                key={index}
                size={size}
                className={`star ${isFilled ? 'filled' : 'empty'}`}
                style={{ display: 'inline-block' }}
              />
            );
          }
        })}
      </div>
      
      {showReviews && reviews && (
        <span className="reviews-count" style={{ marginLeft: '8px' }}>
          ({reviews})
        </span>
      )}
      
      {isInteractive && (
        <span className="current-rating" style={{ marginLeft: '8px', fontWeight: 'bold', color: '#fbbf24' }}>
          {displayRating.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
};

export default StarRating;