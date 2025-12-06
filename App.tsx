import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CategoryCard } from './components/CategoryCard';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { SearchModal } from './components/SearchModal';
import { ProductModal } from './components/ProductModal';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { AddProductModal } from './components/AddProductModal';
import { SellerDashboard } from './components/SellerDashboard';
import { CompanyProfile } from './components/CompanyProfile';
import { Chatbot } from './components/Chatbot';
import { Award, Truck, BadgeCheck, Phone } from './components/Icons';
import { useState, useEffect } from 'react';
import { api } from './utils/api';

const initialProducts = [
  {
    id: 2,
    name: 'Зимняя меховая одежда',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1551734412-cbc8e1904805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXIlMjB3aW50ZXIlMjBjb2F0fGVufDF8fHx8MTc2NDg1NTE4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Одежда и текстиль'
  },
  {
    id: 3,
    name: 'Аал-Луук Мас',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1583041475142-cfd72e558188?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjYXJ2ZWQlMjBib3h8ZW58MXx8fHwxNzY0ODU1MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Деревянные изделия'
  },
  {
    id: 4,
    name: 'Традиционные текстильные изделия',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1763400126795-d83e07d3449e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHRleHRpbGUlMjBlbWJyb2lkZXJ5fGVufDF8fHx8MTc2NDg1NTE4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Одежда и текстиль'
  },
  {
    id: 5,
    name: 'Серебряные серьги с узорами',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1656109801168-699967cf3ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBlYXJyaW5ncyUyMGpld2Vscnl8ZW58MXx8fHwxNzY0NzU3MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Украшения'
  },
  {
    id: 6,
    name: 'Меховая шапка-ушанка',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1722110683865-7b494bde6bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXIlMjBoYXQlMjB1c2hhbmthfGVufDF8fHx8MTc2NDg1NTE4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Одежда и текстиль'
  },
  {
    id: 7,
    name: 'Якутский нож',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1631561381314-588b8a5f1070?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBqZXdlbHJ5JTIwYm94fGVufDF8fHx8MTc2NDg1NTE4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Традиционные ремесла'
  },
  {
    id: 8,
    name: 'Плетеная корзина',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1596626417050-39c7f6ddd2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWNrZXIlMjBiYXNrZXQlMjBoYW5kbWFkZXxlbnwxfHx8fDE3NjQ4NTUxODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Традиционные ремесла'
  },
  {
    id: 9,
    name: 'Якутский нож с резной ручкой',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1588597574944-5e581eeef359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW50aW5nJTIwa25pZmUlMjBjYXJ2ZWR8ZW58MXx8fHwxNzY0ODU1MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Традиционные ремесла'
  },
  {
    id: 10,
    name: 'Браслет с национальным орнаментом',
    price: 6800,
    image: 'https://images.unsplash.com/photo-1758995115643-1e8348bfde39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFjZWxldCUyMG9ybmFtZW50JTIwamV3ZWxyeXxlbnwxfHx8fDE3NjQ4NTUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Украшения'
  },
  {
    id: 11,
    name: 'Деревянная ложка с резьбой',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1616782910751-d48be696d41c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzcG9vbiUyMGNhcnZlZHxlbnwxfHx8fDE3NjQ4NTUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Деревянные изделия'
  },
  {
    id: 12,
    name: 'Расшитая национальная рубаха',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1763514796882-7c3cb168cfb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGVtYnJvaWRlcmVkJTIwc2hpcnR8ZW58MXx8fHwxNzY0ODU1MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Одежда и текстиль'
  },
  {
    id: 13,
    name: 'Берестяная посуда',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1610701596295-4dc5d6289214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBib3dsJTIwaGFuZGNyYWZ0fGVufDF8fHx8MTc2NDg0MzAyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Традиционные ремесла'
  },
  {
    id: 14,
    name: 'Кулон из бивня мамонта',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1622675392349-82577942abce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5kYW50JTIwbmVja2xhY2UlMjBpdm9yeXxlbnwxfHx8fDE3NjQ4NTUxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Украшения'
  },
  {
    id: 15,
    name: 'Деревянная статуэтка',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1753016941650-07d98c95d81a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzdGF0dWUlMjBmaWd1cmluZXxlbnwxfHx8fDE3NjQ4NTUxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Деревянные изделия'
  },
  {
    id: 16,
    name: 'Вышитый платок',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1764305066023-2c5acfddc10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJlZCUyMHNjYXJmJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzY0ODU1MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Одежда и текстиль'
  },
];

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof initialProducts[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [isCompanyProfileOpen, setIsCompanyProfileOpen] = useState(false);
  const [allProducts, setAllProducts] = useState(initialProducts);
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

  const loadProducts = async () => {
    const response = await api.getProducts();
    if (response.success && response.products) {
      // Загружаем товары из локальной БД
      setAllProducts(response.products);
    } else {
      // Fallback на начальные товары если БД пуста
      setAllProducts(initialProducts);
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
    const response = await api.signup({ email, password, name, userType: 'seller' });
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

  const addToCart = (product: typeof initialProducts[0], quantity: number = 1) => {
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

  const handleProductClick = (product: typeof initialProducts[0]) => {
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

  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
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
    setTimeout(() => {
      document.getElementById('filtered-products')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleProfileClick = () => {
    setIsSellerDashboardOpen(true);
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? allProducts.filter(product => product.category === selectedCategory)
    : allProducts;

  // Calculate categories with actual item counts
  const categories = categoryDefinitions.map(category => ({
    ...category,
    itemCount: allProducts.filter(product => product.category === category.name).length
  }));

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
      <Hero onShopClick={scrollToProducts} onLearnClick={scrollToCategories} />

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
              onClick={scrollToCategories}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Смотреть все товары
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Категории</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Изучите наш широкий выбор традиционных якутских товаров
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id}
                name={category.name}
                itemCount={category.itemCount}
                image={category.image}
                onClick={() => handleCategoryClick(category.name)}
                isSelected={selectedCategory === category.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Filtered Products Section */}
      {selectedCategory && (
        <section id="filtered-products" className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-gray-900 mb-2">{selectedCategory}</h2>
                <p className="text-gray-600">
                  Найдено {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : filteredProducts.length < 5 ? 'товара' : 'товаров'}
                </p>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition"
              >
                Показать все
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">В этой категории пока нет товаров</p>
              </div>
            )}
          </div>
        </section>
      )}

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