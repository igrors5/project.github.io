// Локальная база данных на основе localStorage

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // В реальном приложении должен быть хеш
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  characteristics?: string;
  quantity?: number;
  hidden?: boolean;
  sellerId?: string;
  ulys?: string; // Якутский улус
  createdAt?: string;
}

const DB_KEYS = {
  USERS: 'marketplace_users',
  PRODUCTS: 'marketplace_products',
  SESSIONS: 'marketplace_sessions',
};

// Инициализация базы данных с начальными данными
export function initDB() {
  // Инициализация пользователей
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
  }

  // Инициализация товаров с начальными данными
  const existingProducts = localStorage.getItem(DB_KEYS.PRODUCTS);
    const initialProducts: Product[] = [
      {
        id: 1,
        name: 'Якутский нож',
        price: 4500,
        image: '/images/knife.jpg',
        category: 'Традиционные ремесла',
        quantity: 10,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Национальная одежда',
        price: 12000,
        image: '/images/clothing.jpg',
        category: 'Одежда и текстиль',
        quantity: 8,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Хомус',
        price: 5500,
        image: '/images/khomus.jpg',
        category: 'Традиционные ремесла',
        quantity: 15,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: 'Унты',
        price: 8000,
        image: '/images/untы.jpg',
        category: 'Одежда и текстиль',
        quantity: 6,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 5,
        name: 'Чорон',
        price: 5000,
        image: '/images/choron.jpg',
        category: 'Деревянные изделия',
        quantity: 12,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 6,
        name: 'Алысы',
        price: 3500,
        image: '/images/alysы.jpg',
        category: 'Традиционные ремесла',
        quantity: 20,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 7,
        name: 'Харысхал',
        price: 6800,
        image: '/images/kharыskhal.jpg',
        category: 'Украшения',
        quantity: 9,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 8,
        name: 'Илин-кэлин',
        price: 9500,
        image: '/images/ilin-kelin.jpg',
        category: 'Одежда и текстиль',
        quantity: 7,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 9,
        name: 'Бэсэх',
        price: 2500,
        image: '/images/beseh.jpg',
        category: 'Украшения',
        quantity: 18,
        hidden: false,
        createdAt: new Date().toISOString(),
      },
    ];
    
    if (!existingProducts) {
      // Если БД пуста, устанавливаем начальные товары
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    } else {
      // Если БД не пуста, обновляем начальные товары, сохраняя товары продавцов
      try {
        const currentProducts: Product[] = JSON.parse(existingProducts);
        const sellerProducts = currentProducts.filter(p => p.sellerId);
        // Объединяем начальные товары с товарами продавцов
        const allProducts = [...initialProducts, ...sellerProducts];
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(allProducts));
      } catch (e) {
        // Если ошибка парсинга, просто устанавливаем начальные товары
        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      }
    }

  // Инициализация сессий
  if (!localStorage.getItem(DB_KEYS.SESSIONS)) {
    localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify([]));
  }
}

// Работа с пользователями
export const userDB = {
  getAll(): User[] {
    const data = localStorage.getItem(DB_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getById(id: string): User | null {
    const users = this.getAll();
    return users.find(u => u.id === id) || null;
  },

  getByEmail(email: string): User | null {
    const users = this.getAll();
    return users.find(u => u.email === email) || null;
  },

  create(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getAll();
    const newUser: User = {
      ...user,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  update(id: string, updates: Partial<User>): User | null {
    const users = this.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return users[index];
  },

  delete(id: string): boolean {
    const users = this.getAll();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(filtered));
    return filtered.length < users.length;
  },
};

// Работа с товарами
export const productDB = {
  getAll(): Product[] {
    const data = localStorage.getItem(DB_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  getById(id: number): Product | null {
    const products = this.getAll();
    return products.find(p => p.id === id) || null;
  },

  getBySeller(sellerId: string): Product[] {
    const products = this.getAll();
    return products.filter(p => p.sellerId === sellerId);
  },

  getByCategory(category: string): Product[] {
    const products = this.getAll();
    return products.filter(p => p.category === category);
  },

  create(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getAll();
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    const newProduct: Product = {
      ...product,
      id: maxId + 1,
      quantity: product.quantity ?? 0,
      hidden: product.hidden ?? false,
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  update(id: number, updates: Partial<Product>): Product | null {
    const products = this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    return products[index];
  },

  delete(id: number): boolean {
    const products = this.getAll();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(filtered));
    return filtered.length < products.length;
  },
};

// Работа с сессиями
export const sessionDB = {
  create(userId: string, token: string): void {
    const sessions = this.getAll();
    sessions.push({ userId, token, createdAt: new Date().toISOString() });
    localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  getAll(): Array<{ userId: string; token: string; createdAt: string }> {
    const data = localStorage.getItem(DB_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  getByToken(token: string): { userId: string; token: string; createdAt: string } | null {
    const sessions = this.getAll();
    return sessions.find(s => s.token === token) || null;
  },

  delete(token: string): void {
    const sessions = this.getAll();
    const filtered = sessions.filter(s => s.token !== token);
    localStorage.setItem(DB_KEYS.SESSIONS, JSON.stringify(filtered));
  },
};

