// useRecommendations.jsx - Hook corregido con optimizaciones y debug
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const useRecommendations = (allGames = [], maxRecommendations = 6) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationReason, setRecommendationReason] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const lastUpdateRef = useRef(0);

  // Debug: Verificar datos de entrada
  console.log('🎯 useRecommendations - Datos entrada:', {
    allGamesCount: allGames?.length || 0,
    maxRecommendations,
    timestamp: new Date().toLocaleTimeString()
  });

  // Función para obtener favoritos actuales del usuario
  const getUserFavorites = useCallback(() => {
    try {
      const savedFavorites = localStorage.getItem('gamegalaxy_favorites');
      console.log('📦 Raw favorites from localStorage:', savedFavorites);
      
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        console.log('📦 Parsed favorites:', parsed);
        
        // Verificar si es un Map serializado o un array
        if (Array.isArray(parsed)) {
          // Si es array de arrays [key, value], crear Map
          if (parsed.length > 0 && Array.isArray(parsed[0]) && parsed[0].length === 2) {
            const favoritesMap = new Map(parsed);
            const favorites = Array.from(favoritesMap.values());
            console.log('✅ Favorites from Map:', favorites);
            return favorites;
          }
          // Si es array directo de objetos
          console.log('✅ Favorites from Array:', parsed);
          return parsed;
        }
        
        // Si es objeto, convertir a array
        if (typeof parsed === 'object' && parsed !== null) {
          const favorites = Object.values(parsed);
          console.log('✅ Favorites from Object:', favorites);
          return favorites;
        }
      }
      
      console.log('⚠️ No favorites found');
      return [];
    } catch (error) {
      console.error('❌ Error getting user favorites:', error);
      setError('Error al cargar favoritos: ' + error.message);
      return [];
    }
  }, []);

  // Función para obtener historial de likes
  const getUserHistory = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem('gamegalaxy_likes_history');
      console.log('📜 Raw history from localStorage:', savedHistory);
      
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        console.log('✅ Parsed history:', history?.length || 0, 'entries');
        return Array.isArray(history) ? history : [];
      }
      return [];
    } catch (error) {
      console.error('❌ Error getting user history:', error);
      return [];
    }
  }, []);

  // Función para obtener rango de precio - MEMOIZADA
  const getPriceRange = useMemo(() => (price) => {
    if (typeof price !== 'number' || price < 0) return 'unknown';
    if (price === 0) return 'free';
    if (price < 10) return 'budget';
    if (price < 30) return 'mid';
    if (price < 60) return 'premium';
    return 'expensive';
  }, []);

  // Función para obtener rango de rating - MEMOIZADA
  const getRatingRange = useMemo(() => (rating) => {
    if (typeof rating !== 'number' || rating < 0 || rating > 5) return 'unknown';
    if (rating < 3) return 'low';
    if (rating < 4) return 'good';
    if (rating < 4.5) return 'very-good';
    return 'excellent';
  }, []);

  // Función para crear perfil del usuario - OPTIMIZADA
  const createUserProfile = useCallback((favorites, history) => {
    console.log('👤 Creating user profile:', { 
      favoritesCount: favorites?.length || 0,
      historyCount: history?.length || 0 
    });

    if (!favorites || favorites.length === 0) {
      console.log('❌ No favorites to create profile');
      return null;
    }

    const profile = {
      favoriteGenres: {},
      favoritePriceRanges: {},
      favoriteRatingRanges: {},
      totalFavorites: favorites.length,
      likingFrequency: 0,
      preferredFeatures: [],
      dislikedGenres: {},
      averagePrice: 0,
      averageRating: 0
    };

    // Analizar géneros favoritos
    let validGenres = 0;
    favorites.forEach(game => {
      if (game?.genre) {
        profile.favoriteGenres[game.genre] = (profile.favoriteGenres[game.genre] || 0) + 1;
        validGenres++;
      }
    });

    // Analizar rangos de precio preferidos
    let totalPrice = 0;
    let validPrices = 0;
    favorites.forEach(game => {
      if (game?.price !== undefined && game?.price !== null && typeof game.price === 'number') {
        totalPrice += game.price;
        validPrices++;
        const priceRange = getPriceRange(game.price);
        profile.favoritePriceRanges[priceRange] = (profile.favoritePriceRanges[priceRange] || 0) + 1;
      }
    });
    profile.averagePrice = validPrices > 0 ? totalPrice / validPrices : 0;

    // Analizar ratings preferidos
    let totalRating = 0;
    let validRatings = 0;
    favorites.forEach(game => {
      if (game?.rating !== undefined && game?.rating !== null && typeof game.rating === 'number') {
        totalRating += game.rating;
        validRatings++;
        const ratingRange = getRatingRange(game.rating);
        profile.favoriteRatingRanges[ratingRange] = (profile.favoriteRatingRanges[ratingRange] || 0) + 1;
      }
    });
    profile.averageRating = validRatings > 0 ? totalRating / validRatings : 0;

    // Analizar frecuencia de likes basado en historial
    if (history && history.length > 0) {
      const likedActions = history.filter(action => action?.action === 'liked');
      const dislikedActions = history.filter(action => action?.action === 'unliked');
      
      profile.likingFrequency = likedActions.length / history.length;
      
      // Identificar géneros que no le gustan
      dislikedActions.forEach(action => {
        if (action?.productId && allGames) {
          const game = allGames.find(g => g?.id === action.productId);
          if (game?.genre) {
            profile.dislikedGenres[game.genre] = (profile.dislikedGenres[game.genre] || 0) + 1;
          }
        }
      });
    }

    console.log('✅ Profile created:', {
      genres: Object.keys(profile.favoriteGenres).length,
      averagePrice: profile.averagePrice,
      averageRating: profile.averageRating,
      likingFrequency: profile.likingFrequency
    });

    return profile;
  }, [allGames, getPriceRange, getRatingRange]);

  // Función para calcular similitud - ENFOCADO EN GÉNEROS COMPARTIDOS
  const calculateSimilarity = useCallback((game, userProfile, favorites) => {
    if (!game || !userProfile || !favorites) {
      return { score: -1, reasons: ['Datos insuficientes'] };
    }

    // Si ya es favorito, no recomendarlo
    if (favorites.some(fav => fav?.id === game?.id)) {
      return { score: -1, reasons: ['Ya es favorito'] };
    }

    let score = 0;
    let reasons = [];

    try {
      // *** ALGORITMO PRINCIPAL: GÉNEROS COMPARTIDOS ***
      console.log(`🔍 Analizando ${game.title} (género: ${game.genre})`);
      
      if (game.genre && userProfile.favoriteGenres[game.genre]) {
        // Encontrar juegos favoritos del mismo género
        const sameGenreFavorites = favorites.filter(fav => 
          (fav.genre || fav.category) === game.genre
        );
        
        console.log(`  📊 Favoritos del mismo género (${game.genre}):`, 
          sameGenreFavorites.map(f => f.title));
        
        if (sameGenreFavorites.length > 0) {
          // Puntuación base por tener el mismo género que juegos con like
          const genreMatchScore = (sameGenreFavorites.length / favorites.length) * 100;
          score += genreMatchScore;
          
          console.log(`  ✅ Score base por género: ${genreMatchScore}`);
          
          // Crear razón específica mencionando los juegos
          const gameNames = sameGenreFavorites
            .slice(0, 2) // Solo mencionar hasta 2 juegos
            .map(fav => fav.title)
            .join(' y ');
          
          reasons.push(`Mismo género que ${gameNames} que te gustó`);
          
          // Bonus adicional si hay múltiples juegos del mismo género
          if (sameGenreFavorites.length > 1) {
            score += 20;
            reasons.push(`Te gustan ${sameGenreFavorites.length} juegos de ${game.genre}`);
            console.log(`  🎯 Bonus por múltiples juegos del género: +20`);
          }
        } else {
          console.log(`  ❌ No se encontraron favoritos del género ${game.genre}`);
        }
      } else {
        console.log(`  ⚪ Género ${game.genre} no está en favoritos`);
        console.log(`  📋 Géneros favoritos disponibles:`, Object.keys(userProfile.favoriteGenres));
      }

      // Puntuación secundaria por rating (solo si el juego ya tiene score por género)
      if (score > 0 && game.rating !== undefined && game.rating !== null) {
        // Bonus por rating alto
        if (game.rating >= 4.5) {
          score += 15;
          reasons.push('Muy bien valorado');
          console.log(`  ⭐ Bonus por rating alto: +15`);
        } else if (game.rating >= 4.0) {
          score += 10;
          reasons.push('Bien valorado');
          console.log(`  ⭐ Bonus por buen rating: +10`);
        }
      }

      // Bonus por precio similar a favoritos del mismo género (solo si ya tiene score)
      if (score > 0 && game.price !== undefined && game.price !== null) {
        const sameGenreFavorites = favorites.filter(fav => 
          (fav.genre || fav.category) === game.genre && fav.price !== undefined && fav.price !== null
        );
        
        if (sameGenreFavorites.length > 0) {
          const avgPriceOfGenre = sameGenreFavorites.reduce((sum, fav) => sum + fav.price, 0) / sameGenreFavorites.length;
          const priceDiff = Math.abs(game.price - avgPriceOfGenre);
          
          // Si el precio es similar a otros juegos del mismo género que le gustan
          if (priceDiff <= 20) {
            score += 10;
            reasons.push('Precio similar a otros juegos que te gustan');
            console.log(`  💰 Bonus por precio similar: +10`);
          }
        }
      }

      // Bonus por popularidad (solo si ya tiene score por género)
      if (score > 0 && game.popularity && game.popularity > 85) {
        score += 8;
        reasons.push('Muy popular');
        console.log(`  🔥 Bonus por popularidad: +8`);
      }

      // Penalización por géneros que no le gustan
      if (game.genre && userProfile.dislikedGenres[game.genre]) {
        const dislikeScore = userProfile.dislikedGenres[game.genre];
        score -= dislikeScore * 15;
        reasons.push(`Has removido juegos de ${game.genre} antes`);
        console.log(`  ❌ Penalización por género no gustado: -${dislikeScore * 15}`);
      }

      console.log(`  🎯 Score final para ${game.title}: ${score}`);

    } catch (error) {
      console.error('Error calculating similarity for game:', game?.id, error);
      return { score: 0, reasons: ['Error en cálculo'] };
    }

    return { score: Math.max(0, score), reasons };
  }, [getPriceRange, getRatingRange]);

  // Función principal para generar recomendaciones - OPTIMIZADA
  const generateRecommendations = useCallback(async () => {
    console.log('🚀 Generating recommendations...');
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar que tenemos juegos
      if (!allGames || allGames.length === 0) {
        console.log('❌ No games available');
        setRecommendations([]);
        setRecommendationReason({});
        setUserProfile(null);
        return;
      }

      const favorites = getUserFavorites();
      const history = getUserHistory();
      
      console.log('📊 Data loaded:', {
        favorites: favorites?.length || 0,
        history: history?.length || 0,
        allGames: allGames?.length || 0
      });

      // Si no hay favoritos, mostrar juegos populares
      if (!favorites || favorites.length === 0) {
        console.log('ℹ️ No favorites found, showing popular games');
        
        const popularGames = allGames
          .filter(game => game?.rating && game.rating >= 4.0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, maxRecommendations);

        const reasons = {};
        popularGames.forEach(game => {
          reasons[game.id] = ['Juego popular', 'Bien valorado'];
        });

        setRecommendations(popularGames);
        setRecommendationReason(reasons);
        setUserProfile(null);
        return;
      }

      // Crear perfil del usuario
      const profile = createUserProfile(favorites, history);
      if (!profile) {
        console.log('❌ Could not create user profile');
        setRecommendations([]);
        setRecommendationReason({});
        setUserProfile(null);
        return;
      }

      setUserProfile(profile);

      // Calcular puntuaciones para todos los juegos
      console.log('⚡ Calculating similarities...');
      const gamesWithScores = allGames
        .filter(game => game && game.id) // Filtrar juegos válidos
        .map(game => {
          const similarity = calculateSimilarity(game, profile, favorites);
          
          // Debug detallado para cada juego
          console.log(`🎮 ${game.title}:`, {
            genre: game.genre,
            score: similarity.score,
            reasons: similarity.reasons,
            isFavorite: favorites.some(fav => fav.id === game.id)
          });
          
          return {
            ...game,
            recommendationScore: similarity.score,
            reasons: similarity.reasons
          };
        })
        .filter(game => game.recommendationScore > 0) // Solo juegos con score positivo
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, maxRecommendations);

      console.log('✅ Games with scores calculated:', gamesWithScores.length);
      console.log('🏆 Top recommendations:', gamesWithScores.map(g => ({
        title: g.title,
        score: g.recommendationScore,
        reasons: g.reasons
      })));

      // Crear objeto de razones de recomendación
      const reasons = {};
      gamesWithScores.forEach(game => {
        reasons[game.id] = game.reasons || [];
      });

      setRecommendations(gamesWithScores);
      setRecommendationReason(reasons);

      console.log('🎯 Recommendations generated:', {
        count: gamesWithScores.length,
        topGame: gamesWithScores[0]?.title,
        topScore: gamesWithScores[0]?.recommendationScore
      });

    } catch (error) {
      console.error('❌ Error generating recommendations:', error);
      setError('Error generando recomendaciones: ' + error.message);
      setRecommendations([]);
      setRecommendationReason({});
    } finally {
      setIsLoading(false);
    }
  }, [allGames, maxRecommendations, getUserFavorites, getUserHistory, createUserProfile, calculateSimilarity]);

  // Función para forzar actualización de recomendaciones
  const refreshRecommendations = useCallback(() => {
    console.log('🔄 Force refresh recommendations');
    generateRecommendations();
  }, [generateRecommendations]);

  // Función para obtener razón de recomendación de un juego específico
  const getRecommendationReason = useCallback((gameId) => {
    return recommendationReason[gameId] || [];
  }, [recommendationReason]);

  // Generar recomendaciones al montar y cuando cambien los datos críticos
  useEffect(() => {
    console.log('🔄 useEffect triggered - generating recommendations');
    generateRecommendations();
  }, [generateRecommendations]);

  // Escuchar cambios en favoritos - MEJORADO
  useEffect(() => {
    const handleFavoritesChanged = () => {
      const now = Date.now();
      // Debounce para evitar muchas actualizaciones seguidas
      if (now - lastUpdateRef.current > 2000) { // Aumentado a 2 segundos
        lastUpdateRef.current = now;
        console.log('🔔 Favorites changed - updating recommendations');
        generateRecommendations();
      } else {
        console.log('⏱️ Debounced favorites change');
      }
    };

    // Registrar callback
    if (!window.gamegalaxyFavoritesCallbacks) {
      window.gamegalaxyFavoritesCallbacks = new Set();
    }
    window.gamegalaxyFavoritesCallbacks.add(handleFavoritesChanged);

    // También escuchar evento personalizado
    window.addEventListener('gamegalaxy:favorites-changed', handleFavoritesChanged);

    // Escuchar cambios en localStorage (multi-tab)
    const handleStorageChange = (e) => {
      if (e.key === 'gamegalaxy_favorites' || e.key === 'gamegalaxy_likes_history') {
        console.log('💾 Storage changed:', e.key);
        handleFavoritesChanged();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.gamegalaxyFavoritesCallbacks?.delete(handleFavoritesChanged);
      window.removeEventListener('gamegalaxy:favorites-changed', handleFavoritesChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [generateRecommendations]);

  // Objeto de retorno memoizado
  const returnValue = useMemo(() => ({
    recommendations,
    isLoading,
    userProfile,
    error,
    refreshRecommendations,
    getRecommendationReason,
    hasEnoughData: getUserFavorites().length > 0,
    // Debug info
    debugInfo: {
      favoritesCount: getUserFavorites().length,
      allGamesCount: allGames?.length || 0,
      recommendationsCount: recommendations.length
    }
  }), [
    recommendations,
    isLoading,
    userProfile,
    error,
    refreshRecommendations,
    getRecommendationReason,
    getUserFavorites,
    allGames?.length
  ]);

  return returnValue;
};

export default useRecommendations;