import React, { useMemo } from 'react';
import { GAMES_DATA } from '../data/gamesData';

const Recommendations = ({ currentProductId, viewedProducts }) => {
  const recommendations = useMemo(() => {
    if (viewedProducts.length === 0) return [];
    
    const viewedCategories = viewedProducts.map(id => {
      const product = GAMES_DATA.find(game => game.id === id);
      return product?.category;
    }).filter(Boolean);
    
    const mostViewedCategory = viewedCategories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    const topCategory = Object.keys(mostViewedCategory).reduce((a, b) => 
      mostViewedCategory[a] > mostViewedCategory[b] ? a : b, '');
    
    return GAMES_DATA.filter(game => 
      game.category === topCategory && 
      game.id !== currentProductId
    ).slice(0, 3);
  }, [viewedProducts, currentProductId]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Recomendaciones basadas en tu historial</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map(product => (
          <div key={product.id} className="border rounded-lg p-3">
            <img src={product.image} alt={product.title} className="w-full h-32 object-cover rounded mb-2" />
            <h4 className="font-medium text-sm">{product.title}</h4>
            <p className="text-green-600 font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;