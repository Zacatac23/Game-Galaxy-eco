// ProductCard.jsx - Solo la imagen es clickeable para ir a detalles
import React from 'react';
import StarRating from './StarRating';
import PriceDisplay from './PriceDisplay';
import FavoritesButton from './FavoritesButton';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product, onViewDetails }) => {
  return (
    <div className="game-card-improved fade-in">
      {/* Solo la imagen es clickeable para ir a detalles */}
      <div className="game-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="game-image cursor-pointer"
          onClick={() => onViewDetails(product)}
          title="Ver detalles del juego"
        />
        <div className="game-overlay"></div>
        
        {/* Botón de favoritos - NO clickeable para detalles */}
        <div className="absolute top-2 right-2 z-10">
          <FavoritesButton productId={product.id} productTitle={product.title} />
        </div>
        
        {/* Badge de oferta - NO clickeable para detalles */}
        {product.hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            OFERTA
          </div>
        )}
      </div>
      
      {/* Información del juego - NO clickeable para detalles */}
      <div className="game-info">
        <h3 className="game-title">{product.title}</h3>
        
        <div className="game-rating">
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star ${index < Math.floor(product.rating) ? '' : 'empty'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm opacity-75">({product.reviews})</span>
        </div>
        
        <div className="game-price">
          ${product.price}
          {product.hasDiscount && product.originalPrice && (
            <span className="text-sm opacity-60 line-through ml-2">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        {/* Botón de agregar al carrito - NO clickeable para detalles */}
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;