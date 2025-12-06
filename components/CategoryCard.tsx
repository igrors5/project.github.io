import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryCardProps {
  name: string;
  itemCount: number;
  image: string;
  onClick: () => void;
  isSelected?: boolean;
}

export function CategoryCard({ name, itemCount, image, onClick, isSelected }: CategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group h-64 ${
        isSelected ? 'ring-4 ring-indigo-600 scale-105' : ''
      }`}
    >
      <ImageWithFallback 
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${
        isSelected ? 'from-indigo-900/80 to-indigo-600/40' : 'from-black/70 to-transparent'
      } flex flex-col justify-end p-6`}>
        <h3 className="text-white text-2xl mb-1">{name}</h3>
        <p className="text-gray-200">{itemCount} товаров</p>
        {isSelected && (
          <div className="mt-2 inline-flex items-center text-white text-sm">
            <span className="mr-2">✓</span>
            <span>Выбрано</span>
          </div>
        )}
      </div>
    </div>
  );
}