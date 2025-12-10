import { projectId, publicAnonKey } from './supabase/info';
import { initDB, userDB, productDB, sessionDB, promoDB, User, Product, Promo } from './localDB';

const supabaseUrl = `https://${projectId}.supabase.co`;
const API_BASE = `${supabaseUrl}/functions/v1/make-server-65112a46`;

// Инициализация БД при первом импорте
initDB();

interface SignupData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ProductData {
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
  characteristics?: string;
  quantity?: number;
  ulys?: string;
}

// Генерация токена
function generateToken(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const api = {
  // Auth
  async signup(data: SignupData) {
    try {
      // Проверка существующего пользователя
      const existingUser = userDB.getByEmail(data.email);
      if (existingUser) {
        return { error: 'Пользователь с таким email уже существует' };
      }

      // Создание пользователя
      const user = userDB.create({
        email: data.email,
        name: data.name,
        password: data.password, // В реальном приложении должен быть хеш
      });

      return { success: true, user: { id: user.id, email: user.email, name: user.name } };
    } catch (error) {
      return { error: 'Ошибка при регистрации' };
    }
  },

  async login(data: LoginData) {
    try {
      const user = userDB.getByEmail(data.email);
      if (!user || user.password !== data.password) {
        return { error: 'Неверный email или пароль' };
      }

      const token = generateToken();
      sessionDB.create(user.id, token);

      return {
        success: true,
        session: {
          access_token: token,
          user: { id: user.id, email: user.email, name: user.name },
        },
      };
    } catch (error) {
      return { error: 'Ошибка при входе' };
    }
  },

  async logout(accessToken: string) {
    try {
      sessionDB.delete(accessToken);
      return { success: true };
    } catch (error) {
      return { error: 'Ошибка при выходе' };
    }
  },

  async getProfile(accessToken: string) {
    try {
      const session = sessionDB.getByToken(accessToken);
      if (!session) {
        return { error: 'Недействительная сессия' };
      }

      const user = userDB.getById(session.userId);
      if (!user) {
        return { error: 'Пользователь не найден' };
      }

      return {
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
      };
    } catch (error) {
      return { error: 'Ошибка при получении профиля' };
    }
  },

  // Products
  async getProducts() {
    try {
      const products = productDB.getAll();
      return { success: true, products };
    } catch (error) {
      return { error: 'Ошибка при загрузке товаров', products: [] };
    }
  },

  async addProduct(data: ProductData, accessToken: string) {
    try {
      const session = sessionDB.getByToken(accessToken);
      if (!session) {
        return { error: 'Недействительная сессия' };
      }

      const product = productDB.create({
        name: data.name,
        price: data.price,
        image: data.image || '',
        category: data.category,
        description: data.description,
        characteristics: data.characteristics,
        quantity: data.quantity ?? 0,
        ulys: data.ulys,
        sellerId: session.userId,
      });

      return { success: true, product };
    } catch (error) {
      return { error: 'Ошибка при добавлении товара' };
    }
  },

  async updateProduct(data: UpdateProductData, accessToken: string) {
    try {
      const session = sessionDB.getByToken(accessToken);
      if (!session) {
        return { error: 'Недействительная сессия' };
      }
      const product = productDB.getById(data.id);
      if (!product) {
        return { error: 'Товар не найден' };
      }
      if (product.sellerId !== session.userId) {
        return { error: 'Нет прав для редактирования' };
      }

      const updated = productDB.update(data.id, {
        name: data.name,
        price: data.price,
        image: data.image,
        category: data.category,
        description: data.description,
        ulys: data.ulys,
        stock: data.stock,
        discountPercent: data.discountPercent,
        features: data.features,
      });
      return { success: true, product: updated };
    } catch (error) {
      return { error: 'Ошибка при обновлении товара' };
    }
  },

  async getSellerProducts(accessToken: string) {
    try {
      const session = sessionDB.getByToken(accessToken);
      if (!session) {
        return { error: 'Недействительная сессия', products: [] };
      }

      const products = productDB.getBySeller(session.userId);
      return { success: true, products };
    } catch (error) {
      return { error: 'Ошибка при загрузке товаров', products: [] };
    }
  },

  async deleteProduct(productId: number, accessToken: string) {
    try {
      const session = sessionDB.getByToken(accessToken);
      if (!session) {
        return { error: 'Недействительная сессия' };
      }

      const product = productDB.getById(productId);
      if (!product) {
        return { error: 'Товар не найден' };
      }

      // Проверяем, что товар принадлежит текущему продавцу
      if (product.sellerId !== session.userId) {
        return { error: 'У вас нет прав на удаление этого товара' };
      }

      const deleted = productDB.delete(productId);
      if (deleted) {
        return { success: true };
      } else {
        return { error: 'Не удалось удалить товар' };
      }
    } catch (error) {
      return { error: 'Ошибка при удалении товара' };
    }
  },
};