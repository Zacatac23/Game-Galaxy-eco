
import FavoritesButton from './FavoritesButton';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product, onViewDetails }) => {
  
  // Función para manejar el click en la imagen
  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Image clicked!', product);
    
    if (onViewDetails && typeof onViewDetails === 'function') {
      onViewDetails(product);
    }
  };

  return (
    <div className="game-card-simple">
      {/* SOLO la imagen es clickeable */}
      <div className="image-container-simple">
        <img
          src={product.image}
          alt={product.title}
          className="product-image-clickable"
          onClick={handleImageClick}
          title="Click para ver detalles"
        />
        
        {/* Elementos que NO interfieren con el click */}
        <div className="favorites-corner">
          <FavoritesButton productId={product.id} productTitle={product.title} />
        </div>
        
        {product.hasDiscount && (
          <div className="discount-badge">
            OFERTA
          </div>
        )}
      </div>
      
      {/* Información del producto - NO clickeable */}
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star ${index < Math.floor(product.rating) ? 'filled' : 'empty'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="reviews-count">({product.reviews})</span>
        </div>
        
        <div className="product-price">
          ${product.price}
          {product.hasDiscount && product.originalPrice && (
            <span className="original-price">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;