import { ShoppingCart, Heart } from './Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  quantity?: number;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
  onCardClick?: () => void;
  sellerId?: string;
  stock?: number;
  discountPercent?: number;
  features?: string;
}

export function ProductCard({ 
  name, 
  price, 
  image, 
  category, 
  quantity,
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist,
  onCardClick,
  sellerId: _sellerId,
  stock,
  discountPercent = 0,
  features,
}: ProductCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onCardClick) {
      onCardClick();
    }
  };

  const hasDiscount = !!discountPercent && discountPercent > 0;
  const discountedPrice = hasDiscount ? Math.round(price * (1 - discountPercent / 100)) : price;
  const outOfStock =
    (stock !== undefined && stock <= 0) ||
    (quantity !== undefined && quantity <= 0);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden h-64 bg-gray-200 flex items-center justify-center">
        {image ? (
          <ImageWithFallback 
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200"></div>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-indigo-50 transition"
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>
        <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
          {category}
        </div>
        {hasDiscount && (
          <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
            -{discountPercent}% скидка
          </div>
        )}
        {outOfStock && (
          <div className="absolute bottom-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
            Нет в наличии
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-gray-800 mb-2">{name}</h3>
        {features && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{features}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-indigo-600 text-2xl">{discountedPrice.toLocaleString()} ₽</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">{price.toLocaleString()} ₽</span>
            )}
            {stock !== undefined && (
              <span className="text-xs text-gray-500">Остаток: {stock}</span>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            disabled={outOfStock}
            className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 ${outOfStock ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{outOfStock ? 'Нет в наличии' : 'В корзину'}</span>
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {quantity !== undefined ? `В наличии: ${quantity}` : 'Количество не указано'}
        </div>
      </div>
    </div>
  );
}