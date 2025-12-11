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
import { AuthPage } from './components/AuthPage';
import { CompanyPage } from './components/CompanyPage';
import { Award, Truck, BadgeCheck, Phone } from './components/Icons';
import { useState, useEffect, useMemo } from 'react';
import { api } from './utils/api';
import { Product } from './utils/localDB';

const AUTH_TOKEN_KEY = 'accessToken';
const SELLER_ROLE_KEY = 'isSeller';


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
  originalPrice?: number;
  image: string;
  quantity: number;
  discountPercent?: number;
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
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'auth' | 'seller' | 'company' | 'about'>('home');
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
  const [isCompanyProfileOpen, setIsCompanyProfileOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [isSeller, setIsSeller] = useState(false);
  const [companyPrevPage, setCompanyPrevPage] = useState<'home' | 'products' | 'seller' | 'auth'>('home');
  const [companyProfileMode, setCompanyProfileMode] = useState<'add' | 'edit'>('edit');

  // Restore seller role flag
  useEffect(() => {
    const storedSellerRole = localStorage.getItem(SELLER_ROLE_KEY);
    if (storedSellerRole === 'true') {
      setIsSeller(true);
    }
  }, []);

  // Load products from server
  useEffect(() => {
    loadProducts();
    loadPromos();
  }, []);

  // Restore session on reload
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!storedToken) return;
      setAccessToken(storedToken);
      const profile = await api.getProfile(storedToken);
      if (profile.success) {
        setUser(profile.user);
        await loadSellerProducts();
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAccessToken(null);
      }
    };
    restoreSession();
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

  const loadPromos = async () => {
    const response = await api.getPromocodes();
    if (response.success) {
      setPromos(response.promos);
    }
  };

  const goToAuthPage = () => {
    setCurrentPage('auth');
    setIsAuthModalOpen(false);
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
      localStorage.setItem(AUTH_TOKEN_KEY, response.session.access_token);
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
    setIsSeller(false);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(SELLER_ROLE_KEY);
    toast.success('Вы вышли из системы');
  };

  const handleAddProduct = async (data: {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    characteristics: string;
    quantity: number;
    ulys: string;
    stock: number;
    discountPercent: number;
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

  const handleUpdateProduct = async (productId: number, data: {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    ulys: string;
    stock: number;
    discountPercent: number;
    features: string;
  }) => {
    if (!accessToken) {
      toast.error('Необходимо войти в систему');
      return;
    }
    const response = await api.updateProduct({ id: productId, ...data }, accessToken);
    if (response.error) {
      toast.error(response.error);
      return;
    }
    toast.success('Товар обновлен');
    await loadProducts();
    await loadSellerProducts();
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!accessToken) {
      toast.error('Необходимо войти в систему');
      return;
    }

    const response = await api.deleteProduct(productId, accessToken);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    if (response.success) {
      toast.success('Товар успешно удален!');
      await loadProducts();
      await loadSellerProducts();
    }
  };

  const getDiscountedPrice = (price: number, discountPercent?: number) => {
    if (discountPercent && discountPercent > 0) {
      return Math.round(price * (1 - discountPercent / 100));
    }
    return price;
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.quantity !== undefined && product.quantity <= 0) {
      toast.error('Товар недоступен');
      return;
    }
    setCartItems(prev => {
      const existingQuantity = prev.find(item => item.id === product.id)?.quantity || 0;
      const available = product.stock ?? Infinity;
      if (existingQuantity + quantity > available) {
        toast.error('Недостаточно товара на складе');
        return prev;
      }
      const existing = prev.find(item => item.id === product.id);
      const effectivePrice = getDiscountedPrice(product.price, product.discountPercent);
      if (existing) {
        toast.success('Количество товара увеличено!');
        return prev.map(item => {
          if (item.id !== product.id) return item;
          const newQty = item.quantity + quantity;
          if (product.quantity !== undefined) {
            return { ...item, quantity: Math.min(newQty, product.quantity) };
          }
          return {
            ...item,
            quantity: newQty,
            price: effectivePrice,
            originalPrice: product.price,
            discountPercent: product.discountPercent,
          };
        });
      }
      toast.success('Товар добавлен в корзину!');
      const initialQty = product.quantity !== undefined ? Math.min(quantity, product.quantity) : quantity;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: effectivePrice,
          originalPrice: product.price,
          image: product.image,
          quantity: initialQty,
          discountPercent: product.discountPercent,
        },
      ];
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
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      toast.success(`Ваш заказ на сумму ${total.toLocaleString()} ₽ принят!`);
      setCartItems([]);
      setIsCartOpen(false);
    }, 1500);
  };

  const handleRecoveryRequest = ({
    email,
    hasNoEmail,
    comment,
  }: {
    email?: string;
    hasNoEmail: boolean;
    comment?: string;
  }) => {
    if (!email && !hasNoEmail) {
      toast.error('Укажите email или отметьте отсутствие доступа к почте');
      return;
    }

    const details = [
      email ? `email: ${email}` : null,
      hasNoEmail ? 'нет доступа к почте' : null,
      comment ? `комментарий: ${comment}` : null,
    ]
      .filter(Boolean)
      .join('; ');

    toast.info(`Запрос на восстановление отправлен (${details}). Мы свяжемся и подскажем, как восстановить доступ.`);
    setIsAuthModalOpen(false);
  };

  const handleMakeSeller = () => {
    setIsSeller(true);
    localStorage.setItem(SELLER_ROLE_KEY, 'true');
    toast.success('Режим продавца включен');
  };

  const openCompanyPage = () => {
    setCompanyPrevPage(currentPage);
    setCurrentPage('company');
  };

  const handleOpenCompanyProfile = (mode: 'add' | 'edit' = 'edit') => {
    if (!isSeller) {
      toast.error('Профиль продавца доступен только для продавцов');
      return;
    }
    setCompanyProfileMode(mode);
    setIsCompanyProfileOpen(true);
  };

  const handleExitSeller = () => {
    setIsSeller(false);
    localStorage.removeItem(SELLER_ROLE_KEY);
    if (currentPage === 'seller') {
      setCurrentPage('home');
    }
    toast.info('Режим продавца выключен');
  };

  const handleCreatePromo = async (data: { code: string; maxUses: number }) => {
    const response = await api.createPromocode(data);
    if (response.error) {
      toast.error(response.error);
      return;
    }
    toast.success('Промокод создан');
    if (response.promo) {
      setPromos((prev) => [...prev, response.promo]);
    } else {
      await loadPromos();
    }
  };

  const salesData = useMemo(
    () =>
      sellerProducts.map((p) => ({
        name: p.name,
        sales: (p.price % 7) + 3, // простая демонстрация статистики
      })),
    [sellerProducts],
  );

  const popularProducts = useMemo(() => {
    const visible = allProducts.filter(p => !p.hidden);
    return [...visible]
      .sort((a, b) => {
        const discountDiff = (b.discountPercent || 0) - (a.discountPercent || 0);
        if (discountDiff !== 0) return discountDiff;
        return (b.stock ?? 0) - (a.stock ?? 0);
      })
      .slice(0, 4);
  }, [allProducts]);


  const handleProfileClick = () => {
    setCurrentPage('seller');
  };

  const openAboutPage = () => setCurrentPage('about');

  const handleProfileFromProducts = () => {
    if (!user) {
      goToAuthPage();
      return;
    }
    if (!isSeller) {
      // Для не-продавца показываем главную с привычным меню
      setCurrentPage('home');
      return;
    }
    setCurrentPage('seller');
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
  const availableCategories = Array.from(new Set(allProducts.map(p => p.category)));
  if (!availableCategories.includes('Продукты питания')) {
    availableCategories.push('Продукты питания');
  }
  availableCategories.sort();

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

  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <AuthPage
          onBack={() => setCurrentPage('home')}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onRecoveryRequest={handleRecoveryRequest}
        />
      </div>
    );
  }

  if (currentPage === 'company') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <CompanyPage
          onBack={() => setCurrentPage(companyPrevPage)}
          onAddProfile={() => handleOpenCompanyProfile('add')}
          onEditProfile={() => handleOpenCompanyProfile('edit')}
          isSeller={isSeller}
        />
        {isSeller && (
          <CompanyProfile
            isOpen={isCompanyProfileOpen}
            onClose={() => setIsCompanyProfileOpen(false)}
            accessToken={accessToken}
            initialDataMode={companyProfileMode === 'add' ? 'empty' : 'stored'}
            forceEdit={companyProfileMode === 'add'}
          />
        )}
        <Chatbot />
      </div>
    );
  }

  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">О нас</h1>
            <p className="text-gray-700 leading-relaxed">
              Мы объединяем продавцов локальных товаров и покупателей, предоставляя простой способ найти уникальные изделия,
              а также инструменты для управления товарами, скидками и профилем продавца.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Наш сервис помогает развивать локальные бренды, поддерживает прозрачность и делает покупки удобными для
              пользователей по всей стране.
            </p>
          </div>
        </div>
        <Chatbot />
      </div>
    );
  }


  if (currentPage === 'seller') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <SellerDashboard
          isOpen
          onClose={() => setCurrentPage('home')}
          products={sellerProducts}
          onAddProduct={() => {
            setCurrentPage('home');
            setIsAddProductModalOpen(true);
          }}
          onCompanyProfile={() => {
            openCompanyPage();
            handleOpenCompanyProfile('edit');
          }}
          onDeleteProduct={handleDeleteProduct}
          salesData={salesData}
          onMakeAdmin={handleMakeSeller}
          isSeller={isSeller}
          onExitSeller={handleExitSeller}
          onUpdateProduct={handleUpdateProduct}
          promos={promos}
          onCreatePromo={handleCreatePromo}
          uluses={allUluses}
        />

        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          onSubmit={handleAddProduct}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {currentPage === 'home' && (
        <Header 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
          user={user}
          onAuthClick={goToAuthPage}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          isAdmin={isSeller}
          onAdminClick={() => setCurrentPage('seller')}
          onMakeAdmin={handleMakeSeller}
          onExitSeller={handleExitSeller}
          onCompanyListClick={openCompanyPage}
          onAboutClick={openAboutPage}
        />
      )}
      
      {currentPage === 'products' ? (
        <ProductsPage
          products={allProducts.filter(p => !p.hidden)}
          categories={availableCategories}
          uluses={allUluses}
          selectedCategory={selectedCategory}
          selectedUlys={selectedUlys}
          sortBy={sortBy}
          wishlist={wishlist}
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          user={user}
        isSeller={isSeller}
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
          onCartClick={() => setIsCartOpen(true)}
          onAuthClick={goToAuthPage}
          onProfileClick={handleProfileFromProducts}
          onMakeAdmin={handleMakeSeller}
          onLogout={handleLogout}
          onAdminClick={() => setCurrentPage('seller')}
          onExitSeller={handleExitSeller}
          onCompanyListClick={openCompanyPage}
          onAboutClick={openAboutPage}
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
            {(() => {
              // Берем товары не из категории "Традиционные ремесла" и не скрытые
              const visibleProducts = allProducts.filter(p => !p.hidden);
              const nonCraftProducts = visibleProducts.filter(product => product.category !== 'Традиционные ремесла');
              // Берем один товар из категории "Традиционные ремесла" для добавления
              const craftProduct = visibleProducts.find(product => product.category === 'Традиционные ремесла');
              // Объединяем: сначала не-ремесла, потом один ремесленный
              const recommendedProducts = [...nonCraftProducts];
              if (craftProduct && recommendedProducts.length < 4) {
                recommendedProducts.push(craftProduct);
              }
              return recommendedProducts.slice(0, 4).map((product) => (
                <ProductCard 
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  quantity={product.quantity}
                  onAddToCart={() => addToCart(product)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  isInWishlist={wishlist.includes(product.id)}
                  onCardClick={() => handleProductClick(product)}
                  sellerId={product.sellerId}
                />
              ));
            })()}
          </div>

        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Популярные товары</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Товары с лучшими скидками и наличием прямо сейчас
            </p>
          </div>
          {popularProducts.length === 0 ? (
            <div className="text-center text-gray-500">Нет товаров для показа</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    quantity={product.quantity}
                    onAddToCart={() => addToCart(product)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    isInWishlist={wishlist.includes(product.id)}
                    onCardClick={() => handleProductClick(product)}
                    sellerId={product.sellerId}
                  />
                ))}
              </div>
              <div className="text-center mt-10">
                <button 
                  onClick={handleViewAllProducts}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Смотреть все товары
                </button>
              </div>
            </>
          )}
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

          <Footer onShowToast={showToast} onAboutClick={openAboutPage} />
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
        products={allProducts.filter(p => !p.hidden)}
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
          promos={promos}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onRecoveryRequest={handleRecoveryRequest}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      <CompanyProfile
        isOpen={isCompanyProfileOpen && isSeller}
        onClose={() => setIsCompanyProfileOpen(false)}
        accessToken={accessToken}
      />

      <Chatbot />
    </div>
  );
}