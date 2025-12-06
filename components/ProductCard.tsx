import { ShoppingCart, Heart } from './Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
  onCardClick?: () => void;
}

export function ProductCard({ 
  name, 
  price, 
  image, 
  category, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist,
  onCardClick 
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

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden h-64">
        <ImageWithFallback 
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
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
      </div>
      
      <div className="p-4">
        <h3 className="text-gray-800 mb-2">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 text-2xl">{price.toLocaleString()} ₽</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>В корзину</span>
          </button>
        </div>
      </div>
    </div>
  );
}