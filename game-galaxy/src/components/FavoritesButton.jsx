import React, { useRef, useState } from 'react';
import { Heart } from '../icons';

const FavoritesButton = ({ productId, productTitle }) => {
  const favoritesRef = useRef(new Set());
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    if (favoritesRef.current.has(productId)) {
      favoritesRef.current.delete(productId);
      setIsFavorite(false);
    } else {
      favoritesRef.current.add(productId);
      setIsFavorite(true);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-colors ${
        isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-400'
      }`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
};

export default FavoritesButton;