import React, { useMemo } from "react";
import { useCart } from "../hooks/useCart";

const TotalPrice = () => {
  const { items } = useCart();
  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  }, [items]);

  return (
    <div className="total-price">
      <span className="total-label">Total: </span>
      <span className="total-amount">${total}</span>
    </div>
  );
};

export default TotalPrice;