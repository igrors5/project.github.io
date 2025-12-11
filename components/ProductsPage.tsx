import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { ShoppingCart, User } from './Icons';
import { Product } from '../utils/localDB';
import { Footer } from './Footer';

interface ProductsPageProps {
  products: Product[];
  categories: string[];
  uluses: string[];
  selectedCategory: string | null;
  selectedUlys: string | null;
  sortBy: 'newest' | 'oldest' | 'none';
  wishlist: number[];
  cartCount: number;
  user: { name: string; email: string } | null;
  isSeller?: boolean;
  onCategoryChange: (category: string | null) => void;
  onUlysChange: (ulys: string | null) => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'none') => void;
  onResetFilters: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onProductClick: (product: Product) => void;
  onBack: () => void;
  onCartClick: () => void;
  onAuthClick: () => void;
  onProfileClick?: () => void;
  onMakeAdmin?: () => void;
  onLogout?: () => void;
  onAdminClick?: () => void;
  onCompanyListClick?: () => void;
  onAboutClick?: () => void;
}

export function ProductsPage({
  products,
  categories,
  uluses,
  selectedCategory,
  selectedUlys,
  sortBy,
  wishlist,
  cartCount,
  user,
  isSeller,
  onCategoryChange,
  onUlysChange,
  onSortChange,
  onResetFilters,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onBack,
  onCartClick,
  onAuthClick,
  onProfileClick,
  onMakeAdmin,
  onLogout,
  onAdminClick,
  onCompanyListClick,
  onAboutClick,
}: ProductsPageProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleProfileButton = () => {
    if (isSeller && onProfileClick) {
      onProfileClick();
      return;
    }
    setProfileMenuOpen(prev => !prev);
  };
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
        {/* Top bar with site name, cart and profile */}
        <div className="mb-6 bg-white shadow-sm rounded-lg px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xl font-semibold text-indigo-600">Ykt Product</div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {isSeller && onAdminClick && (
                  <button
                    onClick={onAdminClick}
                    className="px-3 py-2 text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-md transition"
                  >
                    Панель продавца
                  </button>
                )}
                {onCompanyListClick && (
                  <button
                    onClick={onCompanyListClick}
                    className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                  >
                    Продавцы
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={handleProfileButton}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user.name}</span>
                  </button>
                  {!isSeller && profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="px-4 py-3 border-b text-sm text-gray-600">{user.email}</div>
                      {onMakeAdmin && (
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            onMakeAdmin();
                          }}
                          className="w-full text-left px-4 py-2 text-amber-600 hover:bg-gray-50 transition text-sm"
                        >
                          Стать продавцом
                        </button>
                      )}
                      {onLogout && (
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition text-sm"
                        >
                          Выйти
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onCartClick();
                  }}
                  className="relative flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm">Корзина</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
              >
                Войти
              </button>
            )}
          </div>
        </div>

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
                  quantity={product.quantity}
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
      <Footer quickLinksMode="aboutOnly" onAboutClick={onAboutClick} />
    </div>
  );
}

