
import { useCart } from '../hooks/useCart';
import QuantitySelector from './QuantitySelector';

const CartItem = ({ item, index }) => { 
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div 
      className="cart-item fade-in"
      style={{ animationDelay: `${index * 0.1}s` }} // Usando el prop index
    >
      <img src={item.image} alt={item.title} className="cart-item-image" />
      
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.title}</h4>
        <p className="cart-item-price">${item.price}</p>
      </div>
      
      <QuantitySelector
        quantity={item.quantity}
        onIncrease={handleIncreaseQuantity}
        onDecrease={handleDecreaseQuantity}
      />
      
      <div className="text-right">
        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 text-sm mt-1"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CartItem;