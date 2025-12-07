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
  if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
    const initialProducts: Product[] = [
      {
        id: 2,
        name: 'Зимняя меховая одежда',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1551734412-cbc8e1904805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXIlMjB3aW50ZXIlMjBjb2F0fGVufDF8fHx8MTc2NDg1NTE4OHww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Одежда и текстиль',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Аал-Луук Мас',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1583041475142-cfd72e558188?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjYXJ2ZWQlMjBib3h8ZW58MXx8fHwxNzY0ODU1MTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Деревянные изделия',
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: 'Традиционные текстильные изделия',
        price: 6500,
        image: 'https://images.unsplash.com/photo-1763400126795-d83e07d3449e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHRleHRpbGUlMjBlbWJyb2lkZXJ5fGVufDF8fHx8MTc2NDg1NTE4OHww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Одежда и текстиль',
        createdAt: new Date().toISOString(),
      },
      {
        id: 5,
        name: 'Серебряные серьги с узорами',
        price: 5500,
        image: 'https://images.unsplash.com/photo-1656109801168-699967cf3ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBlYXJyaW5ncyUyMGpld2Vscnl8ZW58MXx8fHwxNzY0NzU3MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Украшения',
        createdAt: new Date().toISOString(),
      },
      {
        id: 6,
        name: 'Меховая шапка-ушанка',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1722110683865-7b494bde6bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXIlMjBoYXQlMjB1c2hhbmthfGVufDF8fHx8MTc2NDg1NTE4OXww&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Одежда и текстиль',
        createdAt: new Date().toISOString(),
      },
      {
        id: 7,
        name: 'Якутский нож',
        price: 4500,
        image: '/images/knife-wood-handle.svg',
        category: 'Традиционные ремесла',
        createdAt: new Date().toISOString(),
      },
      {
        id: 8,
        name: 'Плетеная корзина',
        price: 3500,
        image: '/images/basket-oval.svg',
        category: 'Традиционные ремесла',
        createdAt: new Date().toISOString(),
      },
      {
        id: 9,
        name: 'Якутский нож с резной ручкой',
        price: 15000,
        image: '/images/knife-carved-handle.svg',
        category: 'Традиционные ремесла',
        createdAt: new Date().toISOString(),
      },
      {
        id: 10,
        name: 'Браслет с национальным орнаментом',
        price: 6800,
        image: 'https://images.unsplash.com/photo-1758995115643-1e8348bfde39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFjZWxldCUyMG9ybmFtZW50JTIwamV3ZWxyeXxlbnwxfHx8fDE3NjQ4NTUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Украшения',
        createdAt: new Date().toISOString(),
      },
      {
        id: 11,
        name: 'Деревянная ложка с резьбой',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1616782910751-d48be696d41c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzcG9vbiUyMGNhcnZlZHxlbnwxfHx8fDE3NjQ4NTUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Деревянные изделия',
        createdAt: new Date().toISOString(),
      },
      {
        id: 12,
        name: 'Расшитая национальная рубаха',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1763514796882-7c3cb168cfb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGVtYnJvaWRlcmVkJTIwc2hpcnR8ZW58MXx8fHwxNzY0ODU1MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Одежда и текстиль',
        createdAt: new Date().toISOString(),
      },
      {
        id: 13,
        name: 'Берестяная посуда',
        price: 3800,
        image: '/images/birch-bark-container.svg',
        category: 'Традиционные ремесла',
        createdAt: new Date().toISOString(),
      },
      {
        id: 14,
        name: 'Кулон из бивня мамонта',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1622675392349-82577942abce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5kYW50JTIwbmVja2xhY2UlMjBpdm9yeXxlbnwxfHx8fDE3NjQ4NTUxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Украшения',
        createdAt: new Date().toISOString(),
      },
      {
        id: 15,
        name: 'Деревянная статуэтка',
        price: 9500,
        image: 'https://images.unsplash.com/photo-1753016941650-07d98c95d81a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzdGF0dWUlMjBmaWd1cmluZXxlbnwxfHx8fDE3NjQ4NTUxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Деревянные изделия',
        createdAt: new Date().toISOString(),
      },
      {
        id: 16,
        name: 'Вышитый платок',
        price: 4200,
        image: 'https://images.unsplash.com/photo-1764305066023-2c5acfddc10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJlZCUyMHNjYXJmJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzY0ODU1MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Одежда и текстиль',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(initialProducts));
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

