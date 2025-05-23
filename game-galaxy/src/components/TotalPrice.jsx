import { useMemo } from "react";
import { useCart } from "../context/CartContext";

const TotalPrice = () => {
  const { cart } = useCart();
  const total = useMemo(() => {
    return cart.reduce((acc, p) => acc + p.price * p.quantity, 0).toFixed(2);
  }, [cart]);

  return <p>Total: ${total}</p>;
};

export default TotalPrice;
