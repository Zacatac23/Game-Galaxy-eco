

const PriceDisplay = ({ price, originalPrice, hasDiscount }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-green-600">${price}</span>
      {hasDiscount && originalPrice && (
        <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
      )}
    </div>
  );
};

export default PriceDisplay;
