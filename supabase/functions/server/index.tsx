// Deno types declaration for TypeScript
declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  };
}

// @ts-ignore - Deno npm: imports are valid in Deno runtime
import { Hono } from "npm:hono";
// @ts-ignore - Deno npm: imports are valid in Deno runtime
import { cors } from "npm:hono/cors";
// @ts-ignore - Deno npm: imports are valid in Deno runtime
import { logger } from "npm:hono/logger";
// @ts-ignore - Deno npm: imports are valid in Deno runtime
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-65112a46/health", (c) => {
  return c.json({ status: "ok" });
});

// User Registration
app.post("/make-server-65112a46/signup", async (c) => {
  try {
    const { email, password, name, userType } = await c.req.json();

    if (!email || !password || !name || !userType) {
      return c.json({ error: 'Все поля обязательны для заполнения' }, 400);
    }

    if (name.length < 2 || name.length > 50) {
      return c.json({ error: 'Имя должно быть от 2 до 50 символов' }, 400);
    }

    if (!['buyer', 'seller'].includes(userType)) {
      return c.json({ error: 'Неверный тип пользователя' }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, userType },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      return c.json({ error: `Ошибка регистрации: ${authError.message}` }, 400);
    }

    // Store user data in KV store
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      userType,
      createdAt: new Date().toISOString(),
    });

    return c.json({
      success: true,
      user: {
        id: authData.user.id,
        email,
        name,
        userType,
      },
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500);
  }
});

// User Login
app.post("/make-server-65112a46/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email и пароль обязательны' }, 400);
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return c.json({ error: `Ошибка входа: ${error.message}` }, 400);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);

    return c.json({
      success: true,
      session: data.session,
      user: userData || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        userType: data.user.user_metadata?.userType,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500);
  }
});

// User Logout
app.post("/make-server-65112a46/logout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Не авторизован' }, 401);
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      console.error('Logout error:', error);
    }

    return c.json({
      success: true,
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return c.json({ success: true }); // Return success anyway
  }
});

// Get user profile
app.get("/make-server-65112a46/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Не авторизован' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Не авторизован' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);

    return c.json({
      success: true,
      user: userData || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        userType: user.user_metadata?.userType,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Ошибка получения профиля' }, 500);
  }
});

// Add new product (sellers only)
app.post("/make-server-65112a46/products", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Не авторизован' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Не авторизован' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);

    if (!userData || userData.userType !== 'seller') {
      return c.json({ error: 'Доступ запрещен. Только производители могут добавлять товары.' }, 403);
    }

    const { name, price, image, category, description } = await c.req.json();

    if (!name || !price || !category) {
      return c.json({ error: 'Название, цена и категория обязательны' }, 400);
    }

    // Generate unique product ID
    const productId = Date.now();

    const product = {
      id: productId,
      name,
      price: Number(price),
      image: image || '',
      category,
      description: description || '',
      sellerId: user.id,
      sellerName: userData.name,
      createdAt: new Date().toISOString(),
    };

    // Store product
    await kv.set(`product:${productId}`, product);

    // Add to seller's products list
    const sellerProducts = await kv.get(`seller:${user.id}:products`) || [];
    sellerProducts.push(productId);
    await kv.set(`seller:${user.id}:products`, sellerProducts);

    // Add to category products list
    const categoryProducts = await kv.get(`category:${category}:products`) || [];
    categoryProducts.push(productId);
    await kv.set(`category:${category}:products`, categoryProducts);

    return c.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return c.json({ error: 'Ошибка добавления товара' }, 500);
  }
});

// Get all products
app.get("/make-server-65112a46/products", async (c) => {
  try {
    const productKeys = await kv.getByPrefix('product:');
    const products = productKeys
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Ошибка получения товаров' }, 500);
  }
});

// Get seller's products
app.get("/make-server-65112a46/seller/products", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Не авторизован' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Не авторизован' }, 401);
    }

    const productIds = await kv.get(`seller:${user.id}:products`) || [];
    const products: any[] = [];

    for (const id of productIds) {
      const product = await kv.get(`product:${id}`);
      if (product) {
        products.push(product);
      }
    }

    return c.json({
      success: true,
      products: products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return c.json({ error: 'Ошибка получения товаров продавца' }, 500);
  }
});

Deno.serve(app.fetch);