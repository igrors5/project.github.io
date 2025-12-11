import { ShoppingCart, Search, Menu, X, User } from './Icons';
import { useState } from 'react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchClick: () => void;
  user: { name: string; email: string } | null;
  onAuthClick: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  onMakeAdmin?: () => void;
  isSeller?: boolean;
  onCompanyListClick?: () => void;
  onExitSeller?: () => void;
  onAboutClick?: () => void;
}

export function Header({ cartCount, onCartClick, onSearchClick, user, onAuthClick, onProfileClick, onLogout, isAdmin, onAdminClick, onMakeAdmin, isSeller, onCompanyListClick, onExitSeller, onAboutClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl text-indigo-600 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Ykt Product</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#products" onClick={(e) => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-700 hover:text-indigo-600 transition">Товары</a>
            <button
              onClick={onAboutClick}
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              О нас
            </button>
            {onCompanyListClick && (
              <button
                onClick={onCompanyListClick}
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Продавцы
              </button>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={onSearchClick}
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={onCartClick}
              className="relative text-gray-700 hover:text-indigo-600 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user.name}</span>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg py-2 min-w-[200px] z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    {onProfileClick && isSeller && (
                      <button
                        onClick={() => {
                          onProfileClick();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Мои товары
                      </button>
                    )}
                    {isAdmin && onAdminClick && (
                      <button
                        onClick={() => {
                          onAdminClick();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Панель продавца
                      </button>
                    )}
                    {isSeller && onExitSeller && (
                      <button
                        onClick={() => {
                          onExitSeller();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Выйти из роли продавца
                      </button>
                    )}
                    {!isAdmin && onMakeAdmin && (
                      <button
                        onClick={() => {
                          onMakeAdmin();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-amber-600 hover:bg-gray-100 transition text-sm"
                      >
                        Стать продавцом
                      </button>
                    )}
                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                      >
                        Выйти
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAuthClick();
                }}
                className="text-gray-700 hover:text-indigo-600 transition px-3 py-2"
              >
                Войти
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#products" onClick={(e) => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-indigo-600 transition">Товары</a>
              <button
                onClick={() => {
                  onAboutClick?.();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-indigo-600 transition"
              >
                О нас
              </button>
              {onCompanyListClick && (
                <button
                  onClick={() => {
                    onCompanyListClick();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-indigo-600 transition"
                >
                  Продавцы
                </button>
              )}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <button 
                  onClick={() => { onSearchClick(); setMobileMenuOpen(false); }}
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { onCartClick(); setMobileMenuOpen(false); }}
                  className="relative text-gray-700 hover:text-indigo-600 transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                {user ? (
                  <div className="flex flex-col gap-2 w-full">
                    {isSeller && onProfileClick && (
                      <button
                        onClick={() => {
                          onProfileClick();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                      >
                        <User className="w-5 h-5" />
                        <span>Мои товары</span>
                      </button>
                    )}
                    {isSeller && onExitSeller && (
                      <button
                        onClick={() => {
                          onExitSeller();
                          setMobileMenuOpen(false);
                        }}
                        className="text-left text-gray-700 hover:text-indigo-600 transition"
                      >
                        Выйти из роли продавца
                      </button>
                    )}
                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-gray-700 hover:text-indigo-600 transition flex items-center gap-2"
                      >
                        <span>Выйти</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAuthClick();
                    }}
                    className="text-gray-700 hover:text-indigo-600 transition px-3 py-2"
                  >
                    Войти
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}