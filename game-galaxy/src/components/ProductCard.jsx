import React from 'react';
import FavoritesButton from './FavoritesButton';
import AddToCartButton from './AddToCartButton';
import StarRating from './StarRating';
import useProductCard from '../hooks/useProductCard';

const ProductCard = ({ product, onViewDetails, userRating = 0, onQuickRating }) => {
  const { handleImageClick, handleQuickRating, hasDiscount, shouldShowOriginalPrice, hasUserRating } = useProductCard(product, onViewDetails, userRating, onQuickRating);

  return (
    <div className="game-card-simple">
      <div className="image-container-simple">
        <img src={product.image} alt={product.title} className="product-image-clickable" onClick={handleImageClick} title="Click para ver detalles" />
        <div className="favorites-corner">
          <FavoritesButton productId={product.id} productTitle={product.title} />
        </div>
        {hasDiscount && <div className="discount-badge">OFERTA</div>}
      </div>
      <div className="product-info">
        <div className="product-info-top">
          <h3 className="product-title">{product.title}</h3>
          <div className="product-ratings">
            <div className="official-rating">
              <span className="rating-label-small">Calificación:</span>
              <StarRating rating={product.rating} reviews={product.reviews} isInteractive={false} size={14} />
            </div>
            <div className="quick-rating">
              <span className="rating-label-small">Tu voto:</span>
              <StarRating rating={userRating} isInteractive={true} onRatingChange={handleQuickRating} size={16} showReviews={false} />
              {hasUserRating && <span className="user-rating-indicator">✓</span>}
            </div>
          </div>
        </div>
        <div className="product-info-bottom">
          <div className="product-price">
            ${product.price}
            {shouldShowOriginalPrice && <span className="original-price">${product.originalPrice}</span>}
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;