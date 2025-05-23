import React from 'react';
import { ArrowLeft } from '../icons';
import StarRating from '../components/StarRating';
import PriceDisplay from '../components/PriceDisplay';
import FavoritesButton from '../components/FavoritesButton';
import AddToCartButton from '../components/AddToCartButton';
import Recommendations from '../components/Recommendations';

const ProductDetailPage = ({ product, onBack, viewedProducts }) => {
  if (!product) return null;

  return (
    <div className="game-detail-container fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-red-400 hover:text-red-300 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Volver a productos</span>
      </button>
      
      <div className="game-detail-grid">
        <div className="bounce-in">
          <img
            src={product.image}
            alt={product.title}
            className="game-detail-image"
          />
        </div>
        
        <div className="game-detail-info fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between mb-4">
            <h1 className="game-detail-title">{product.title}</h1>
            <FavoritesButton productId={product.id} productTitle={product.title} />
          </div>
          
          <div className="game-rating mb-4">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star text-xl ${index < Math.floor(product.rating) ? '' : 'empty'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 opacity-75">({product.reviews} reseñas)</span>
          </div>
          
          <div className="game-price mb-6">
            ${product.price}
            {product.hasDiscount && product.originalPrice && (
              <span className="text-lg opacity-60 line-through ml-3">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <p className="game-detail-description">{product.description}</p>
          
          <div className="mb-6">
            <span className="inline-block bg-red-600 bg-opacity-20 text-red-300 px-4 py-2 rounded-full text-sm border border-red-600 border-opacity-30">
              {product.category}
            </span>
          </div>
          
          <AddToCartButton product={product} />
        </div>
      </div>
      
      <Recommendations currentProductId={product.id} viewedProducts={viewedProducts} />
    </div>
  );
};

export default ProductDetailPage;