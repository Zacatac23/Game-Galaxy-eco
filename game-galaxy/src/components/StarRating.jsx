import React from 'react';
import { Star } from '../icons';

const StarRating = ({ rating, reviews }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={16}
      className={index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
    />
  ));
  
  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="text-sm text-gray-600 ml-1">({reviews})</span>
    </div>
  );
};

export default StarRating;