import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { SearchModal } from './components/SearchModal';
import { ProductModal } from './components/ProductModal';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { AddProductModal } from './components/AddProductModal';
import { SellerDashboard } from './components/SellerDashboard';
import { CompanyProfile } from './components/CompanyProfile';
import { ProductsPage } from './components/ProductsPage';
import { Chatbot } from './components/Chatbot';
import { Award, Truck, BadgeCheck, Phone } from './components/Icons';
import { useState, useEffect } from 'react';
import { api } from './utils/api';
import { Product } from './utils/localDB';

const categoryDefinitions = [
  {
    id: 1,
    name: 'Традиционные ремесла',
    image: 'https://images.unsplash.com/photo-1596626417050-39c7f6ddd2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWNrZXIlMjBiYXNrZXQlMjBoYW5kbWFkZXxlbnwxfHx8fDE3NjQ4NTUxODl8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 2,
    name: 'Украшения',
    image: 'https://images.unsplash.com/photo-1656109801168-699967cf3ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBlYXJyaW5ncyUyMGpld2Vscnl8ZW58MXx8fHwxNzY0NzU3MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 3,
    name: 'Одежда и текстиль',
    image: 'https://images.unsplash.com/photo-1763400126795-d83e07d3449e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHRleHRpbGUlMjBlbWJyb2lkZXJ5fGVufDF8fHx8MTc2NDg1NTE4OHww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 4,
    name: 'Деревянные изделия',
    image: 'https://images.unsplash.com/photo-1583041475142-cfd72e558188?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjYXJ2ZWQlMjBib3h8ZW58MXx8fHwxNzY0ODU1MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

const features = [
  {
    id: 1,
    icon: Award,
    title: 'Аутентичные товары',
    description: 'Все товары изготовлены местными мастерами'
  },
  {
    id: 2,
    icon: Truck,
    title: 'Доставка по всей республике',
    description: 'безопасная доставка'
  },
  {
    id: 3,
    icon: BadgeCheck,
    title: 'Гарантия качества',
    description: 'Проверка каждого изделия'
  },
  {
    id: 4,
    icon: Phone,
    title: 'Поддержка 24/7',
    description: 'Всегда готовы помочь'
  },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface User {
  id: string;
  email: string;
  name: string;
}

let toastIdCounter = 0;

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'products'>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedUlys, setSelectedUlys] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'none'>('none');
  const [email, setEmail] = useState('');
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [isCompanyProfileOpen, setIsCompanyProfileOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);

  // Load products from server
  useEffect(() => {
    loadProducts();
  }, []);

  // Load seller products when user is logged in
  useEffect(() => {
    if (user && accessToken) {
      loadSellerProducts();
    }
  }, [user, accessToken]);

  // Читаем параметр категории из URL при загрузке страницы
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategory(decodedCategory);
      setCurrentPage('products');
    }
  }, []);

  const loadProducts = async () => {
    const response = await api.getProducts();
    if (response.success && response.products) {
      // Загружаем товары из локальной БД
      setAllProducts(response.products);
    } else {
      // Fallback на пустой массив если БД пуста
      setAllProducts([]);
    }
  };

  const loadSellerProducts = async () => {
    if (!accessToken) return;
    const response = await api.getSellerProducts(accessToken);
    if (response.success) {
      setSellerProducts(response.products);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = toastIdCounter++;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    if (response.error) {
      toast.error(response.error);
      return;
    }

    if (response.session?.access_token) {
      setAccessToken(response.session.access_token);
      const profileData = await api.getProfile(response.session.access_token);
      if (profileData.success) {
        setUser(profileData.user);
        toast.success(`Добро пожаловать, ${profileData.user.name}!`);
        setIsAuthModalOpen(false);
      }
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    const response = await api.signup({ email, password, name });
    if (response.error) {
      toast.error(response.error);
      return;
    }

    if (response.success) {
      toast.success('Регистрация успешна! Теперь войдите в систему');
      // Auto login after signup
      handleLogin(email, password);
    }
  };

  const handleLogout = async () => {
    if (accessToken) {
      await api.logout(accessToken);
    }
    setUser(null);
    setAccessToken(null);
    toast.success('Вы вышли из системы');
  };

  const handleAddProduct = async (data: {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    ulys: string;
  }) => {
    if (!accessToken) {
      toast.error('Необходимо войти в систему');
      return;
    }

    const response = await api.addProduct(data, accessToken);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    if (response.success) {
      toast.success('Товар успешно добавлен!');
      setIsAddProductModalOpen(false);
      await loadProducts();
      await loadSellerProducts();
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.success('Количество товара увеличено!');
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success('Товар добавлен в корзину!');
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success('Товар удален из корзины');
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      if (prev.includes(id)) {
        toast.success('Удалено из избранного');
        return prev.filter(item => item !== id);
      }
      toast.success('Добавлено в избранное!');
      return [...prev, id];
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Спасибо за подписку!');
      setEmail('');
    } else {
      toast.error('Пожалуйста, введите email');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleModalAddToCart = (quantity: number) => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
    }
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewAllProducts = () => {
    setSelectedCategory(null);
    setCurrentPage('products');
    // Обновляем URL без перезагрузки страницы
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    window.history.pushState({}, '', url.toString());
  };

  const handleCheckout = () => {
    toast.info('Функция оформления заказа будет доступна в ближайшее время!');
    setTimeout(() => {
      toast.success(`Ваш заказ на сумму ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} ₽ принят!`);
      setCartItems([]);
      setIsCartOpen(false);
    }, 1500);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage('products');
    // Обновляем URL без перезагрузки страницы
    const url = new URL(window.location.href);
    url.searchParams.set('category', encodeURIComponent(categoryName));
    window.history.pushState({}, '', url.toString());
  };

  const handleProfileClick = () => {
    setIsSellerDashboardOpen(true);
  };


  // Полный список улусов (из AddProductModal)
  const allUluses = [
    'Абыйский улус - Абый улууһа (административный центр п. Белая Гора)',
    'Алданский район - Алдан улууһа (административный центр г. Алдан)',
    'Аллаиховский улус - Аллайыаха улууhа (административный центр п. Чокурдах)',
    'Амгинский улус - Амма улууһа (административный центр с. Амга)',
    'Анабарский национальный (долгано-эвенкийский) улус - Анаабыр улууhа (административный центр с. Саскылах)',
    'Булунский улус - Булуҥ улууһа (административный центр п. Тикси)',
    'Верхневилюйский улус – Үөһээ Бүлүү улууһа (административный центр с. Верхневилюйск)',
    'Верхнеколымский улус - Үөһээ Халыма улууһа (административный центр п. Зырянка)',
    'Верхоянский улус - Үөһээ Дьааҥы улууһа (административный центр п. Батагай)',
    'Вилюйский улус - Бүлүү улууһа (административный центр г. Вилюйск)',
    'Горный улус - Горнай улууhа (административный центр с. Бердигестях)',
    'Жиганский национальный эвенкийский улус - Эдьигээн улууһа (административный центр с. Жиганск)',
    'Кобяйский улус - Кэбээйи улууһа (административный центр п. Сангар)',
    'Ленский район - Ленскэй улууһа (административный центр г. Ленск)',
    'Мегино-Кангаласский улус - Мэҥэ Хаҥалас улууһа (административный центр п. Нижний Бестях)',
    'Мирнинский район - Мирнэй улууһа (административный центр г. Мирный)',
    'Момский район - Муома улууһа (административный центр с. Хонуу)',
    'Намский улус - Нам улууһа (административный центр с. Намцы)',
    'Нерюнгринский район - Нүөрүҥгүрү улууhа (административный центр г. Нерюнгри)',
    'Нижнеколымский улус - Аллараа Халыма улууhа (административный центр п. Черский)',
    'Нюрбинский улус - Ньурба улууһа (административный центр г. Нюрба)',
    'Оймяконский улус - Өймөкөөн улууhа (административный центр п. Усть-Нера)',
    'Оленёкский национальный эвенкийский улус - Өлөөн улууһа (административный центр с. Оленек)',
    'Олёкминский улус - Өлүөхүмэ улууһа (административный центр г. Олекминск)',
    'Среднеколымский улус - Орто Халыма улууhа (административный центр г. Среднеколымск)',
    'Сунтарский улус - Сунтаар улууһа (административный центр с. Сунтар)',
    'Таттинский улус - Таатта улууһа (административный центр с. Ытык-Кюель)',
    'Томпонский район - Томпо улууhа (административный центр п. Хандыга)',
    'Усть-Алданский улус - Уус-Алдан улууһа (административный центр с. Борогонцы)',
    'Усть-Майский улус - Уус-Маайа улууhа (административный центр п. Усть-Мая)',
    'Усть-Янский улус - Усуйаана улууһа (административный центр п. Депутатский)',
    'Хангаласский улус - Хаҥалас улууhа (административный центр г. Покровск)',
    'Чурапчинский улус - Чурапчы улууhа (административный центр с. Чурапча)',
    'Эвено-Бытантайский национальный улус - Эбээн-Бытантай улууhа (административный центр с. Батагай-Алыта)',
  ];


  // Получаем уникальные категории
  const availableCategories = Array.from(new Set(allProducts.map(p => p.category))).sort();

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedUlys(null);
    setSortBy('none');
  };

  // Filter and sort products for ProductsPage
  let filteredProducts = allProducts;
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
  }
  if (selectedUlys) {
    filteredProducts = filteredProducts.filter(product => product.ulys === selectedUlys);
  }
  if (sortBy === 'newest') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } else if (sortBy === 'oldest') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateA - dateB;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Header 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        user={user}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />
      
      {currentPage === 'products' ? (
        <ProductsPage
          products={allProducts}
          categories={availableCategories}
          uluses={allUluses}
          selectedCategory={selectedCategory}
          selectedUlys={selectedUlys}
          sortBy={sortBy}
          wishlist={wishlist}
          onCategoryChange={setSelectedCategory}
          onUlysChange={setSelectedUlys}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          onProductClick={handleProductClick}
          onBack={() => {
            setCurrentPage('home');
            setSelectedCategory(null);
            setSelectedUlys(null);
            setSortBy('none');
            window.history.pushState({}, '', window.location.pathname);
          }}
        />
      ) : (
        <>
          <Hero onShopClick={scrollToProducts} onLearnClick={handleViewAllProducts} />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Рекомендуемые товары</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Откройте для себя нашу тщательно подобранную коллекцию традиционных якутских изделий ручной работы
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                onAddToCart={() => addToCart(product)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                isInWishlist={wishlist.includes(product.id)}
                onCardClick={() => handleProductClick(product)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={handleViewAllProducts}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Смотреть все товары
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">Подпишитесь на нашу рассылку</h2>
          <p className="text-indigo-100 mb-8">
            Получайте последние новости о новых товарах и специальных предложениях
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button 
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Подписаться
            </button>
          </form>
        </div>
      </section>

          <Footer onShowToast={showToast} />
        </>
      )}
      
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={allProducts}
        onAddToCart={addToCart}
        onProductClick={handleProductClick}
      />

      {selectedProduct && (
        <ProductModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onAddToCart={handleModalAddToCart}
          onToggleWishlist={() => toggleWishlist(selectedProduct.id)}
          isInWishlist={wishlist.includes(selectedProduct.id)}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      <SellerDashboard
        isOpen={isSellerDashboardOpen}
        onClose={() => setIsSellerDashboardOpen(false)}
        products={sellerProducts}
        onAddProduct={() => {
          setIsSellerDashboardOpen(false);
          setIsAddProductModalOpen(true);
        }}
        onCompanyProfile={() => {
          setIsSellerDashboardOpen(false);
          setIsCompanyProfileOpen(true);
        }}
      />

      <CompanyProfile
        isOpen={isCompanyProfileOpen}
        onClose={() => setIsCompanyProfileOpen(false)}
        accessToken={accessToken}
      />

      <Chatbot />
    </div>
  );
}