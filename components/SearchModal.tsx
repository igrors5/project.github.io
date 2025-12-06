import { X, Search, ShoppingCart } from './Icons';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export function SearchModal({ isOpen, onClose, products, onAddToCart, onProductClick }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product: Product, e: React.MouseEvent) => {
    // If clicked on button, don't open product details
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onProductClick) {
      onProductClick(product);
      onClose();
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-lg"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {searchQuery === '' ? (
            <p className="text-gray-500 text-center py-8">Начните вводить для поиска товаров...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Товары не найдены</p>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                  onClick={(e) => handleProductClick(product, e)}
                >
                  <ImageWithFallback 
                    src={product.image} 
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <p className="text-indigo-600">{product.price.toLocaleString()} ₽</p>
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="self-center bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition flex-shrink-0"
                    title="Добавить в корзину"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}