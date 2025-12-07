import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { Product } from '../utils/localDB';

interface ProductsPageProps {
  products: Product[];
  categories: string[];
  uluses: string[];
  selectedCategory: string | null;
  selectedUlys: string | null;
  sortBy: 'newest' | 'oldest' | 'none';
  wishlist: number[];
  onCategoryChange: (category: string | null) => void;
  onUlysChange: (ulys: string | null) => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'none') => void;
  onResetFilters: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onProductClick: (product: Product) => void;
  onBack: () => void;
}

export function ProductsPage({
  products,
  categories,
  uluses,
  selectedCategory,
  selectedUlys,
  sortBy,
  wishlist,
  onCategoryChange,
  onUlysChange,
  onSortChange,
  onResetFilters,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onBack,
}: ProductsPageProps) {
  // Filter and sort products
  let filteredProducts = products;

  // Фильтр по категории
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
  }

  // Фильтр по улусу
  if (selectedUlys) {
    filteredProducts = filteredProducts.filter(product => product.ulys === selectedUlys);
  }

  // Сортировка
  if (sortBy === 'newest') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } else if (sortBy === 'oldest') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Вернуться на главную
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedCategory ? selectedCategory : 'Все товары'}
          </h1>
          <p className="text-gray-600">
            Найдено {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : filteredProducts.length < 5 ? 'товара' : 'товаров'}
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          categories={categories}
          uluses={uluses}
          selectedCategory={selectedCategory}
          selectedUlys={selectedUlys}
          sortBy={sortBy}
          onCategoryChange={onCategoryChange}
          onUlysChange={onUlysChange}
          onSortChange={onSortChange}
          onReset={onResetFilters}
        />

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                onAddToCart={() => onAddToCart(product)}
                onToggleWishlist={() => onToggleWishlist(product.id)}
                isInWishlist={wishlist.includes(product.id)}
                onCardClick={() => onProductClick(product)}
                sellerId={product.sellerId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">В этой категории пока нет товаров</p>
          </div>
        )}
      </div>
    </div>
  );
}

