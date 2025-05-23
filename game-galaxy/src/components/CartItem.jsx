
import { useCart } from '../hooks/useCart';
import QuantitySelector from './QuantitySelector';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{item.title}</h4>
        <p className="text-gray-600">${item.price}</p>
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