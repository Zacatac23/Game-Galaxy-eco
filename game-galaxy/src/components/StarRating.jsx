import React from 'react';
import { Star } from '../icons';
import useStarRating from '../hooks/useStarRating';

const StarRating = ({ rating = 0, reviews, isInteractive = false, onRatingChange = null, size = 16, showReviews = true }) => {
  const { displayRating, handleStarClick, handleStarHover, handleContainerLeave, isStarFilled, getContainerClasses, getStarClasses, getButtonClasses, getButtonStyles } = useStarRating(rating, isInteractive, onRatingChange);

  return (
    <div className={getContainerClasses()}>
      <div className="stars" style={{ display: 'flex', gap: '2px', alignItems: 'center' }} onMouseLeave={handleContainerLeave}>
        {[...Array(5)].map((_, index) => {
          if (isInteractive) {
            return (
              <button key={index} type="button" className={getButtonClasses(index)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleStarClick(index); }} onMouseEnter={(e) => { e.preventDefault(); handleStarHover(index); }} style={getButtonStyles(index)}>
                <Star size={size} className={getStarClasses(index)} style={{ pointerEvents: 'none' }} />
              </button>
            );
          } else {
            return <Star key={index} size={size} className={getStarClasses(index)} style={{ display: 'inline-block' }} />;
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